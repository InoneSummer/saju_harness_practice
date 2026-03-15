#!/usr/bin/env python3
"""Check for garbage code and garbage process candidates before handoff."""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

IGNORE_DIRS = {
    ".git",
    ".hg",
    ".svn",
    ".venv",
    "venv",
    "node_modules",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".vendor",
}

TEMP_FILE_NAMES = {".DS_Store"}
TEMP_FILE_SUFFIXES = {".tmp", ".temp", ".bak", ".orig", ".rej", ".log"}
CODE_SUFFIXES = {".py", ".js", ".jsx", ".ts", ".tsx"}
DEBUG_PATTERNS = (
    "print(",
    "breakpoint(",
    "pdb.set_trace(",
    "import pdb",
    "console.log(",
    "debugger;",
)
PROCESS_KEYWORDS = (
    "gradio",
    "uvicorn",
    "streamlit",
    "flask",
    "http.server",
    "pytest",
    "unittest",
)


def _should_skip(path: Path) -> bool:
    return any(part in IGNORE_DIRS for part in path.parts)


def _scan_temp_files(root: Path) -> list[str]:
    findings: list[str] = []
    for path in root.rglob("*"):
        if _should_skip(path):
            continue
        if path.is_file() and (
            path.name in TEMP_FILE_NAMES or path.suffix.lower() in TEMP_FILE_SUFFIXES
        ):
            findings.append(str(path.relative_to(root)))
    return sorted(findings)


def _scan_debug_code(root: Path) -> list[str]:
    findings: list[str] = []
    for path in root.rglob("*"):
        if _should_skip(path) or not path.is_file() or path.suffix not in CODE_SUFFIXES:
            continue
        try:
            content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for line_number, line in enumerate(content.splitlines(), start=1):
            stripped = line.strip()
            if stripped.startswith("#") or stripped.startswith("//"):
                continue
            if any(pattern in line for pattern in DEBUG_PATTERNS):
                findings.append(f"{path.relative_to(root)}:{line_number}: {stripped}")
    return findings


def _scan_processes(root: Path) -> tuple[list[str], str | None]:
    try:
        result = subprocess.run(
            ["ps", "-ax", "-o", "pid=,command="],
            check=True,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError:
        return [], "ps command is not available."
    except PermissionError:
        return [], "process scan is not permitted in this environment."
    except subprocess.CalledProcessError:
        return [], "process scan failed."

    findings: list[str] = []
    root_text = str(root)
    current_pid = os.getpid()

    for raw_line in result.stdout.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        pid_text, _, command = line.partition(" ")
        try:
            pid = int(pid_text)
        except ValueError:
            continue
        if pid == current_pid:
            continue
        if root_text not in command:
            continue
        if not any(keyword in command for keyword in PROCESS_KEYWORDS):
            continue
        findings.append(f"{pid}: {command}")

    return findings, None


def _print_section(title: str, rows: list[str]) -> None:
    print(f"[{title}]")
    if not rows:
        print("- none")
        return
    for row in rows:
        print(f"- {row}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check for garbage process and garbage code candidates."
    )
    parser.add_argument(
        "path",
        nargs="?",
        default=".",
        help="Target app or workspace path to scan.",
    )
    parser.add_argument(
        "--skip-processes",
        action="store_true",
        help="Skip process scan when the environment does not allow it.",
    )
    args = parser.parse_args()

    root = Path(args.path).resolve()
    if not root.exists():
        print(f"target does not exist: {root}", file=sys.stderr)
        return 2

    temp_files = _scan_temp_files(root)
    debug_code = _scan_debug_code(root)
    process_note: str | None = None
    if args.skip_processes:
        processes = []
        process_note = "process scan skipped by flag."
    else:
        processes, process_note = _scan_processes(root)

    print(f"cleanup check target: {root}")
    _print_section("garbage_process_candidates", processes)
    _print_section("garbage_code_candidates", debug_code)
    _print_section("temp_file_candidates", temp_files)
    if process_note:
        print(f"process scan note: {process_note}")

    if process_note and not args.skip_processes:
        print("cleanup verdict: BLOCKED")
        return 2

    if processes or debug_code or temp_files:
        print("cleanup verdict: CHANGES_REQUESTED")
        return 1

    print("cleanup verdict: APPROVED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
