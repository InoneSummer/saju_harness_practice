# Saju Agent Workflow

## 1. Purpose
이 문서는 `saju` 앱 작업에 repository-level pipeline을 어떻게 적용할지 정의한다.
공통 workflow를 따르되, 이 앱에서 어떤 문서를 먼저 읽고 무엇을 남길지 더 구체적으로 적는다.

## 2. Default Flow
기본 흐름은 아래 순서를 따른다.

1. PM
2. Coder
3. Security Reviewer
4. Tester
5. PM

Designer는 UI, 정보 구조, 사용자 흐름이 바뀌는 작업에서만 optional 단계로 넣는다.

## 3. Role Entry
- PM: `product-sense.md`, `architecture.md`, `plans/`
- Designer: `design.md`, `frontend.md`
- Coder: `architecture.md`, `frontend.md`, `specs/product-spec.md`
- Security Reviewer: `security.md`
- Tester: `reliability.md`, `references/failure-cases.md`

## 4. Required Records
- task brief
- tracker
- ongoing plan
- stage handoff report

모든 기록은 `apps/saju/harness/plans/` 아래 구조를 따른다.

## 5. Handoff Rule
- 각 단계는 verdict를 남긴다.
- verdict는 `APPROVED`, `CHANGES_REQUESTED`, `BLOCKED`, `SKIPPED`만 사용한다.
- `CHANGES_REQUESTED`나 `BLOCKED`가 나오면 시도 횟수를 올린다.
- handoff 전에는 cleanup 상태를 함께 남긴다.
- risky cleanup이나 큰 구현 변경 전에는 `python3 harness/scripts/git_checkpoint.py <name>`를 먼저 실행한다.
- 기본 cleanup 실행은 `python3 harness/scripts/cleanup_agent.py apps/saju`를 사용한다.
- 프로세스 조회가 막힌 환경에서는 `python3 harness/scripts/cleanup_agent.py --skip-processes apps/saju`를 사용하고 그 사실을 기록한다.

## 6. App-Specific Rule
- 사주 도메인 규칙은 `specs/product-spec.md`와 `reliability.md`를 우선 참조한다.
- 입력 데이터 보호는 `security.md`를 기준으로 판단한다.
- 제외한 범위는 억지로 구현하지 않고 문서에 남긴다.

## 7. Rollback Rule
- 같은 `root_cause`가 반복되면 ongoing plan에 누적 기록한다.
- 시도 횟수가 5에 도달하면 rollback loop를 검토한다.
- git checkpoint가 있으면 `python3 harness/scripts/git_restore.py <name>`를 rollback 후보로 검토한다.
- rollback 후에는 더 작은 task brief로 다시 시작한다.
