#!/usr/bin/env python3
"""Create a git-backed checkpoint without moving the current branch."""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path


def _run_git(repo_root: Path, args: list[str], env: dict[str, str] | None = None) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo_root), *args],
        check=True,
        capture_output=True,
        text=True,
        env=env,
    )
    return result.stdout.strip()


def _sanitize_name(name: str) -> str:
    sanitized = re.sub(r"[^a-zA-Z0-9._-]+", "-", name.strip()).strip("-")
    if not sanitized:
        raise ValueError("checkpoint name is empty after sanitization.")
    return sanitized


def _has_head(repo_root: Path) -> bool:
    result = subprocess.run(
        ["git", "-C", str(repo_root), "rev-parse", "--verify", "HEAD"],
        capture_output=True,
        text=True,
    )
    return result.returncode == 0


def _checkpoint_env(index_path: str) -> dict[str, str]:
    env = os.environ.copy()
    env["GIT_INDEX_FILE"] = index_path
    env.setdefault("GIT_AUTHOR_NAME", "Harness Agent")
    env.setdefault("GIT_AUTHOR_EMAIL", "harness@example.local")
    env.setdefault("GIT_COMMITTER_NAME", env["GIT_AUTHOR_NAME"])
    env.setdefault("GIT_COMMITTER_EMAIL", env["GIT_AUTHOR_EMAIL"])
    return env


def create_checkpoint(repo_root: Path, name: str, message: str | None = None) -> tuple[str, str]:
    checkpoint_name = _sanitize_name(name)
    checkpoint_ref = f"refs/harness-checkpoints/{checkpoint_name}"

    handle = tempfile.NamedTemporaryFile(prefix="harness-index-", delete=False)
    index_path = handle.name
    handle.close()
    os.unlink(index_path)

    env = _checkpoint_env(index_path)

    try:
        _run_git(repo_root, ["add", "-A", "--", "."], env=env)
        tree = _run_git(repo_root, ["write-tree"], env=env)

        commit_args = ["commit-tree", tree]
        if _has_head(repo_root):
            parent = _run_git(repo_root, ["rev-parse", "HEAD"])
            commit_args.extend(["-p", parent])
        commit_message = message or f"harness checkpoint: {checkpoint_name}"
        commit_args.extend(["-m", commit_message])
        commit = _run_git(repo_root, commit_args, env=env)
        _run_git(repo_root, ["update-ref", checkpoint_ref, commit])
    finally:
        try:
            os.unlink(index_path)
        except FileNotFoundError:
            pass

    return checkpoint_ref, commit


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Create a git-backed harness checkpoint."
    )
    parser.add_argument("name", help="Checkpoint name.")
    parser.add_argument(
        "--path",
        default=".",
        help="Repository path. Defaults to current directory.",
    )
    parser.add_argument(
        "--message",
        default=None,
        help="Optional checkpoint commit message.",
    )
    args = parser.parse_args()

    repo_root = Path(args.path).resolve()
    try:
        top_level = _run_git(repo_root, ["rev-parse", "--show-toplevel"])
    except subprocess.CalledProcessError:
        print("git checkpoint requires a git repository.", file=sys.stderr)
        return 2

    checkpoint_ref, commit = create_checkpoint(
        Path(top_level),
        args.name,
        args.message,
    )
    print(f"checkpoint ref: {checkpoint_ref}")
    print(f"checkpoint commit: {commit}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
