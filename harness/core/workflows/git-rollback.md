# Git Rollback Workflow

## 1. Purpose
이 문서는 git을 사용하는 저장소에서 작업 단위 rollback을 수행하는 기본 흐름을 정의한다.
cleanup snapshot보다 넓은 범위를 되돌려야 할 때 이 흐름을 사용한다.

## 2. Default Tools
- `python3 harness/scripts/git_checkpoint.py <name>`
- `python3 harness/scripts/git_restore.py <name>`

## 3. Checkpoint Rule
- risky cleanup이나 큰 구현 변경 전에는 git checkpoint를 먼저 만든다.
- checkpoint는 현재 브랜치를 움직이지 않고 `refs/harness-checkpoints/` 아래에 남긴다.
- git repo지만 아직 `HEAD`가 없어도 checkpoint를 만들 수 있어야 한다.

## 4. Restore Rule
- rollback이 필요하면 target checkpoint로 working tree를 복구한다.
- restore 전에는 기본적으로 safety checkpoint를 하나 더 남긴다.
- restore는 working tree와 untracked file을 함께 정리한다.

## 5. Use
- 같은 `root_cause`가 반복되면 rollback 후보 checkpoint를 먼저 찾는다.
- cleanup agent로 복구할 수 없는 범위면 git rollback으로 올린다.
- restore 결과는 handoff 문서에 checkpoint 이름과 이유를 남긴다.

## 6. Record
- checkpoint 이름
- rollback 이유
- restore 전 safety checkpoint 이름
- restore 후 다음 단계
