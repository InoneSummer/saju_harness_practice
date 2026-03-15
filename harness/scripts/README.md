# Harness Scripts

## 1. Purpose
이 폴더는 repository-level harness에서 공통으로 쓰는 스크립트를 둔다.
문서 구조 확인, 상태 점검, 반복 검사 같은 자동화를 여기에 모은다.

## 2. Scope
- 문서 경로 확인
- tracker와 ongoing plan 상태 점검
- 반복 검증에 필요한 공통 검사
- cleanup 후보 자동 검사

## 3. Rule
- 스크립트는 문서를 우회하지 않는다.
- 자동화는 반복 작업만 줄이고, 판단 자체를 대체하지 않는다.
- 앱별 전용 스크립트는 각 앱 폴더에 둔다.

## 4. Current Script
- `cleanup_check.py`: garbage process, debug code, 임시 파일 후보를 검사한다.
- `cleanup_agent.py`: snapshot을 남긴 뒤 안전한 cleanup을 자율적으로 실행한다.
- `cleanup_restore.py`: cleanup snapshot에서 파일을 복구한다.
- `git_checkpoint.py`: 현재 브랜치를 움직이지 않고 git checkpoint를 만든다.
- `git_restore.py`: checkpoint로 working tree를 복구한다.

## 5. Use
- handoff 전에는 `python3 harness/scripts/cleanup_check.py apps/<app-name>`를 먼저 실행한다.
- 이 스크립트는 자동 삭제를 하지 않고, 후보를 보고한다.
- 종료 코드는 `0=APPROVED`, `1=CHANGES_REQUESTED`, `2=BLOCKED`로 해석한다.
- 프로세스 조회가 막힌 환경에서는 `--skip-processes`로 코드와 파일 후보만 먼저 검사한다.
- 자율 cleanup은 `python3 harness/scripts/cleanup_agent.py apps/<app-name>`를 사용한다.
- 잘못 정리했으면 `python3 harness/scripts/cleanup_restore.py <snapshot_dir>`로 복구한다.
- git checkpoint는 `python3 harness/scripts/git_checkpoint.py <name>`를 사용한다.
- git restore는 `python3 harness/scripts/git_restore.py <name>`를 사용한다.
