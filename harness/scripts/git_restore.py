#!/usr/bin/env python3
"""Restore the working tree from a git-backed harness checkpoint."""

from __future__ import annotations

import argparse
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from git_checkpoint import create_checkpoint


def _run_git(repo_root: Path, args: list[str]) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo_root), *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def _resolve_ref(repo_root: Path, checkpoint: str) -> str:
    candidates = [checkpoint, f"refs/harness-checkpoints/{checkpoint}"]
    for candidate in candidates:
        result = subprocess.run(
            ["git", "-C", str(repo_root), "rev-parse", "--verify", candidate],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            return candidate
    raise ValueError(f"checkpoint not found: {checkpoint}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Restore the working tree from a harness git checkpoint."
    )
    parser.add_argument("checkpoint", help="Checkpoint name or full ref.")
    parser.add_argument(
        "--path",
        default=".",
        help="Repository path. Defaults to current directory.",
    )
    parser.add_argument(
        "--no-safety-checkpoint",
        action="store_true",
        help="Skip the automatic pre-restore checkpoint.",
    )
    args = parser.parse_args()

    repo_root = Path(args.path).resolve()
    try:
        top_level = Path(_run_git(repo_root, ["rev-parse", "--show-toplevel"]))
    except subprocess.CalledProcessError:
        print("git restore requires a git repository.", file=sys.stderr)
        return 2

    try:
        checkpoint_ref = _resolve_ref(top_level, args.checkpoint)
    except ValueError as error:
        print(str(error), file=sys.stderr)
        return 2

    if not args.no_safety_checkpoint:
        safety_name = datetime.now(timezone.utc).strftime("pre-restore-%Y%m%dT%H%M%SZ")
        safety_ref, safety_commit = create_checkpoint(top_level, safety_name)
        print(f"safety checkpoint ref: {safety_ref}")
        print(f"safety checkpoint commit: {safety_commit}")

    try:
        _run_git(top_level, ["checkout", checkpoint_ref, "--", "."])
        _run_git(top_level, ["clean", "-fd"])
    except subprocess.CalledProcessError as error:
        print(error.stderr.strip() or "git restore failed.", file=sys.stderr)
        return 1

    resolved = _run_git(top_level, ["rev-parse", checkpoint_ref])
    print(f"restored from: {checkpoint_ref}")
    print(f"restored commit: {resolved}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
