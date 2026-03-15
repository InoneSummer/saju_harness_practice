# Repository Agent Guide

## Purpose
이 문서는 Codex 같은 에이전트가 이 저장소에서 작업을 시작할 때 읽는 루트 진입점이다.

## Read Order
1. `harness/core/docs/index.md`
2. `harness/core/workflows/pipeline.md`
3. 작업할 앱의 `apps/<app-name>/harness/docs/index.md`
4. 작업할 앱의 `apps/<app-name>/harness/plans/tracker.md`

## Current App
- 기본 작업 대상은 `apps/saju/`다.

## Working Rule
- repository-level 규칙은 `harness/core/`를 따른다.
- app-level 규칙은 해당 앱의 `harness/` 문서를 따른다.
- 상태 변경이 있으면 `tracker.md`와 ongoing plan을 갱신한다.
- handoff 전에는 cleanup agent를 실행한다.
- risky cleanup이나 큰 변경 전에는 git checkpoint를 먼저 만든다.

## Current Entry
- `apps/saju/README.md`: 사람 기준 실행 안내
- `apps/saju/harness/docs/index.md`: app-level 문서 진입점
- `apps/saju/harness/plans/tracker.md`: 현재 phase 상태
