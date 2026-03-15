#!/usr/bin/env python3
"""Restore files from a cleanup snapshot."""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: cleanup_restore.py <snapshot_dir>", file=sys.stderr)
        return 2

    snapshot_dir = Path(sys.argv[1]).resolve()
    manifest_path = snapshot_dir / "manifest.json"
    if not manifest_path.exists():
        print(f"manifest not found: {manifest_path}", file=sys.stderr)
        return 2

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    target_root = Path(manifest["target_root"])
    backup_root = snapshot_dir / "files"

    if not backup_root.exists():
        print("no file backup found in snapshot", file=sys.stderr)
        return 2

    restored = 0
    for backup_path in backup_root.rglob("*"):
        if not backup_path.is_file():
            continue
        relative_path = backup_path.relative_to(backup_root)
        target_path = target_root / relative_path
        target_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(backup_path, target_path)
        restored += 1

    print(f"restored files: {restored}")
    print(f"snapshot: {snapshot_dir}")
    if manifest.get("terminated_processes"):
        print("note: terminated processes are not automatically restored.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
