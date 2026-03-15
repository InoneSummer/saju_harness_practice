# Pipeline Workflow

## 1. Purpose
이 문서는 저장소 공통 작업 흐름의 기본 순서를 정의한다.
세부 역할 규칙은 roles 문서에서 따로 다룬다.

## 2. Default Order
기본 흐름은 아래 순서를 따른다.

1. PM
2. Coder
3. Security Reviewer
4. Tester
5. PM

## 3. Optional Stages
- Designer는 UI, 정보 구조, 사용자 흐름이 바뀌는 작업에서만 사용한다.
- Designer가 들어가면 순서는 `PM -> Designer -> Coder`가 된다.
- optional 단계가 필요 없으면 보고서에 `SKIPPED`로 남긴다.

## 4. Handoff Rule
- 앞 단계가 끝나기 전에는 다음 단계로 넘어가지 않는다.
- 각 단계는 자기 역할의 기준으로만 판단한다.
- 각 단계는 짧은 handoff 보고서와 판정 값을 남긴다.
- 각 단계는 handoff 전에 cleanup 상태를 확인한다.
- risky cleanup이나 큰 구현 변경 전에는 git checkpoint를 먼저 만든다.
- 기본 cleanup 실행은 `python3 harness/scripts/cleanup_agent.py apps/<app-name>`로 남긴다.
- cleanup agent를 바로 실행하기 어렵거나 위험을 먼저 보고 싶으면 `cleanup_check.py`를 선행한다.
- 프로세스 조회가 막힌 환경에서는 `--skip-processes` 사용 여부를 handoff에 함께 남긴다.
- 판정 값은 `APPROVED`, `CHANGES_REQUESTED`, `BLOCKED`, `SKIPPED`만 사용한다.
- 다음 단계는 `APPROVED` 또는 `SKIPPED`일 때만 진행한다.
- `CHANGES_REQUESTED` 또는 `BLOCKED`가 나오면 현재 작업의 시도 횟수를 기록하고 갱신한다.

## 5. Output Rule
- PM은 범위와 완료 기준을 남긴다.
- Designer는 화면 구조와 표현 기준을 남긴다.
- Coder는 구현 결과와 짧은 셀프 체크 결과를 남긴다.
- Security Reviewer는 보안 판단 결과를 남긴다.
- Tester는 검증 결과와 판정 값을 남긴다.

## 6. Completion Rule
- 마지막 PM 검토까지 끝나야 한 사이클이 완료된다.
- 마지막 PM 판정이 `APPROVED`일 때만 완료로 표시한다.
- 보류나 축소가 필요하면 다음 사이클로 넘긴다.
