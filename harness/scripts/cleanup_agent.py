#!/usr/bin/env python3
"""Autonomous cleanup agent with snapshot-based rollback."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import signal
import sys
from datetime import datetime, timezone
from pathlib import Path

import cleanup_check


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _snapshot_root(target: Path) -> Path:
    app_name = target.name
    return (
        _repo_root()
        / "harness"
        / "runtime"
        / "cleanup_snapshots"
        / app_name
    )


def _snapshot_dir(target: Path) -> Path:
    snapshot_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    root = _snapshot_root(target) / snapshot_id
    root.mkdir(parents=True, exist_ok=False)
    return root


def _write_manifest(snapshot_dir: Path, manifest: dict) -> None:
    manifest_path = snapshot_dir / "manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=True, indent=2) + "\n",
        encoding="utf-8",
    )


def _backup_file(snapshot_dir: Path, target_root: Path, file_path: Path) -> str:
    relative_path = file_path.relative_to(target_root)
    backup_path = snapshot_dir / "files" / relative_path
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(file_path, backup_path)
    return str(relative_path)


def _remove_debug_lines(target_root: Path) -> tuple[list[dict], list[str]]:
    changes: list[dict] = []
    remaining: list[str] = []

    for path in target_root.rglob("*"):
        if cleanup_check._should_skip(path):  # noqa: SLF001
            continue
        if not path.is_file() or path.suffix not in cleanup_check.CODE_SUFFIXES:
            continue
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            continue

        new_lines: list[str] = []
        removed_lines: list[dict] = []
        for line_number, line in enumerate(lines, start=1):
            stripped = line.strip()
            if stripped.startswith("#") or stripped.startswith("//"):
                new_lines.append(line)
                continue
            if any(pattern in line for pattern in cleanup_check.DEBUG_PATTERNS):
                removed_lines.append({"line": line_number, "content": stripped})
                continue
            new_lines.append(line)

        if removed_lines:
            changes.append(
                {
                    "path": path,
                    "relative_path": str(path.relative_to(target_root)),
                    "content": "\n".join(new_lines) + ("\n" if lines else ""),
                    "removed_lines": removed_lines,
                }
            )

    return changes, remaining


def _terminate_processes(target_root: Path) -> tuple[list[dict], str | None]:
    findings, note = cleanup_check._scan_processes(target_root)  # noqa: SLF001
    if note:
        return [], note

    terminated: list[dict] = []
    for item in findings:
        pid_text, _, command = item.partition(": ")
        try:
            pid = int(pid_text)
            os.kill(pid, signal.SIGTERM)
        except (ValueError, ProcessLookupError, PermissionError):
            continue
        terminated.append({"pid": pid, "command": command})
    return terminated, None


def _move_temp_files(
    snapshot_dir: Path, target_root: Path, relative_names: list[str]
) -> list[dict]:
    moved: list[dict] = []
    for relative_name in relative_names:
        source = target_root / relative_name
        if not source.exists():
            continue
        destination = snapshot_dir / "files" / relative_name
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(source), str(destination))
        moved.append(
            {
                "path": relative_name,
                "action": "moved_to_snapshot",
            }
        )
    return moved


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run autonomous cleanup with snapshot-based rollback."
    )
    parser.add_argument("path", help="Target app or workspace path to clean.")
    parser.add_argument(
        "--skip-processes",
        action="store_true",
        help="Skip process cleanup when process listing is unavailable.",
    )
    args = parser.parse_args()

    target_root = Path(args.path).resolve()
    if not target_root.exists():
        print(f"target does not exist: {target_root}", file=sys.stderr)
        return 2

    manifest = {
        "target_root": str(target_root),
        "snapshot_id": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "temp_files": [],
        "debug_code": [],
        "terminated_processes": [],
        "notes": [],
    }

    debug_changes, debug_remaining = _remove_debug_lines(target_root)
    for change in debug_changes:
        change["path"] = Path(change["path"])

    temp_candidates = cleanup_check._scan_temp_files(target_root)  # noqa: SLF001

    if debug_remaining:
        manifest["notes"].append(
            "some debug code candidates could not be safely removed."
        )

    if args.skip_processes:
        manifest["notes"].append("process cleanup skipped by flag.")
        process_note = "process cleanup skipped by flag."
    else:
        terminated, process_note = _terminate_processes(target_root)
        manifest["terminated_processes"] = terminated
        if process_note:
            manifest["notes"].append(process_note)

    needs_snapshot = bool(temp_candidates or debug_changes or manifest["terminated_processes"])

    if needs_snapshot:
        snapshot_dir = _snapshot_dir(target_root)
        manifest["snapshot_id"] = snapshot_dir.name
        manifest["temp_files"] = _move_temp_files(snapshot_dir, target_root, temp_candidates)

        for change in debug_changes:
            file_path = Path(change["path"])
            backup_relative = _backup_file(snapshot_dir, target_root, file_path)
            file_path.write_text(change["content"], encoding="utf-8")
            manifest["debug_code"].append(
                {
                    "path": backup_relative,
                    "removed_lines": change["removed_lines"],
                }
            )

        _write_manifest(snapshot_dir, manifest)

    if not (
        manifest["temp_files"] or manifest["debug_code"] or manifest["terminated_processes"]
    ):
        print(f"cleanup target: {target_root}")
        print("cleanup action: no changes needed")
        for note in manifest["notes"]:
            print(f"note: {note}")
        if process_note and not args.skip_processes:
            print("cleanup verdict: BLOCKED")
            return 2
        if debug_remaining:
            print("cleanup verdict: CHANGES_REQUESTED")
            return 1
        print("cleanup verdict: APPROVED")
        return 0

    print(f"cleanup target: {target_root}")
    print(f"cleanup snapshot: {snapshot_dir}")
    print(f"temp files cleaned: {len(manifest['temp_files'])}")
    print(f"debug lines removed: {len(manifest['debug_code'])}")
    print(f"processes terminated: {len(manifest['terminated_processes'])}")
    for note in manifest["notes"]:
        print(f"note: {note}")

    if process_note and not args.skip_processes:
        print("cleanup verdict: BLOCKED")
        return 2

    if debug_remaining:
        print("cleanup verdict: CHANGES_REQUESTED")
        return 1

    print("cleanup verdict: APPROVED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
