# Cleanup Workflow

## 1. Purpose
이 문서는 실행 루프에서 남는 garbage process와 garbage code를 정리하는 기준을 정의한다.
목표는 다음 시도가 이전 시도의 찌꺼기에 오염되지 않게 하는 것이다.

## 2. Garbage Process
- 종료되지 않은 개발 서버
- 중단된 테스트 실행 프로세스
- 실패한 실행 뒤 남은 백그라운드 프로세스
- 다음 검증에 영향을 줄 수 있는 임시 실행 상태

## 3. Garbage Code
- 실패한 시도에서 남은 임시 코드
- 더 이상 참조되지 않는 실험용 파일
- handoff 전 제거되지 않은 디버그 코드
- 현재 task brief 범위 밖의 잔여 변경

## 4. When to Clean
- handoff 전에 정리한다.
- rollback 전에 정리한다.
- 완료 표시 전에 마지막으로 다시 확인한다.

## 5. Default Check
- 기본 cleanup 검사는 `python3 harness/scripts/cleanup_check.py apps/<app-name>`를 사용한다.
- 이 검사는 garbage process, debug code, 임시 파일 후보를 보고한다.
- 자동 삭제나 자동 종료는 하지 않는다.
- 프로세스 조회가 막힌 환경에서는 `--skip-processes`로 코드와 파일 정리부터 진행한다.

## 6. Autonomous Cleanup
- 기본 자율 cleanup은 `python3 harness/scripts/cleanup_agent.py apps/<app-name>`를 사용한다.
- git repo가 있으면 cleanup agent 실행 전에 git checkpoint를 먼저 만든다.
- cleanup agent는 파일을 바꾸기 전에 snapshot을 먼저 남긴다.
- cleanup agent는 안전한 범위의 debug code, temp file, stray process만 정리한다.
- 잘못 정리했으면 `python3 harness/scripts/cleanup_restore.py <snapshot_dir>`로 복구한다.
- cleanup 범위가 snapshot보다 크면 git restore를 사용한다.

## 7. Rule
- 다음 시도에 필요 없는 프로세스는 종료한다.
- 현재 작업 범위와 무관한 임시 코드는 남기지 않는다.
- 보존이 필요한 실험 결과는 삭제하지 말고 문서에 남긴다.
- 정리하지 못한 항목은 숨기지 말고 기록한다.
- cleanup check가 실패하면 handoff 전에 먼저 원인을 정리한다.
- cleanup은 가능한 한 사람이 아니라 agent가 실행한다.

## 8. Record
- 무엇을 정리했는지
- 남겨 둔 항목이 있으면 그 이유
- 다음 단계에 영향이 있는지
- snapshot 경로가 있으면 함께 남긴다.
