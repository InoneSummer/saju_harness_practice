# Saju Harness Index

## 1. Purpose
이 문서는 `saju` 앱의 app-level harness 진입점이다.
공통 규칙은 repository-level 문서를 따르고, 사주 앱의 세부 규칙은 여기서부터 내려간다.

## 2. Read Order
1. `harness/core/docs/index.md`
2. `product-sense.md`
3. `architecture.md`
4. `security.md`
5. `reliability.md`
6. `design.md`
7. `frontend.md`
8. `agents.md`

## 3. Related Paths
- 기능 명세: `apps/saju/harness/specs/product-spec.md`
- 참고 자료: `apps/saju/harness/references/`
- 계획과 상태: `apps/saju/harness/plans/`
- 구현 코드: `apps/saju/src/`
- 테스트 코드: `apps/saju/tests/`

## 4. Rule
- app-level 문서는 사주 앱의 도메인과 기능 세부만 다룬다.
- repository-level 규칙보다 느슨한 기준을 두지 않는다.
- 문서가 커지면 더 작은 app-level 문서로 나눈다.
