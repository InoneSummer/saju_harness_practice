# Repository Architecture

## 1. Purpose
이 문서는 저장소의 최상위 구조와 폴더별 책임을 정의한다.
세부 구현 규칙은 각 하위 문서에서 다룬다.

## 2. Top-Level Structure
- `harness/`: 저장소 공통 하네스
- `apps/`: 앱별 작업 공간
- `README.md`: 저장소 소개
- `AGENTS.md`, `CLAUDE.md`: 에이전트 진입점

## 3. Harness Core
`harness/core/`는 모든 앱이 공유하는 규칙을 둔다.

- `docs/`: 공통 원칙 문서
- `roles/`: 역할 정의
- `workflows/`: handoff, rollback, checkpoint 흐름
- `platforms/`: Codex, Claude Code 같은 플랫폼 가이드
- `templates/`: 반복 문서 템플릿
- `schemas/`: 추후 machine-readable schema 자리

`harness/scripts/`는 저장소 공통 검사와 자동화 스크립트를 둔다.
`harness/runtime/`는 cleanup snapshot 같은 runtime artifact를 둔다.
git ref 기반 checkpoint는 `.git/refs/harness-checkpoints/` 아래에 둔다.

## 4. Application Space
각 앱은 `apps/<app-name>/` 아래에 독립적으로 둔다.

- `harness/docs/`: 앱 전용 원칙 문서
- `harness/specs/`: 기능 명세
- `harness/references/`: 참고 자료
- `harness/plans/`: 로드맵과 진행 상태
- `src/`: 구현 코드
- `tests/`: 검증 코드

## 5. Boundary Rule
- repository-level 문서는 공통 규칙만 다룬다.
- app-level 문서는 도메인과 기능 세부사항을 다룬다.
- 코드와 테스트는 앱 폴더 밖으로 퍼지지 않는다.
- 공통화할 가치가 확인되기 전에는 app-level에 둔다.

## 6. Growth Rule
- 새 앱은 `apps/<app-name>/` 구조를 그대로 따라 시작한다.
- 공통으로 반복되는 규칙만 `harness/core/`로 올린다.
- 구조가 커져도 최상위 폴더 수는 적게 유지한다.
