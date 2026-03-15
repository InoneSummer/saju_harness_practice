# P1 Constants

## Goal
- `saju` 앱의 상수와 템플릿을 한 파일에 정리한다.

## Primary Output
- `apps/saju/src/constants.py`

## In Scope
- 천간 목록
- 지지 목록
- 천간 오행 매핑
- 지지 오행 매핑
- 시간 선택 목록
- 오행 이름과 표시용 텍스트
- 해석 템플릿

## Out of Scope
- 사주 계산 로직
- UI 이벤트 처리
- 테스트 구현

## Done When
- `constants.py`에 사주 계산과 표시에서 필요한 상수가 정의된다.
- 오행 매핑과 시간 선택 값이 spec과 reliability 문서 기준과 맞는다.
- 해석 템플릿이 분기 누락 없이 정의된다.

## Inputs
- `apps/saju/harness/docs/product-sense.md`
- `apps/saju/harness/docs/architecture.md`
- `apps/saju/harness/specs/product-spec.md`
- `apps/saju/harness/docs/reliability.md`

## Expected Output
- 구현자가 바로 import해서 사용할 수 있는 상수 모듈

## Current Owner
- PM

## Current Step
- phase 1 constants complete

## Current State
- `constants.py`를 구현했고 문법 검증과 무결성 점검을 마쳤다.

## Verification
- verdict: APPROVED
- attempts: 0

## Failure Record
- root_cause: none

## Next Owner
- PM

## Next Step
- 다음 작업용 task brief를 만들고 core logic 구현으로 넘어간다.

## Issues
- none

## Completion
- final_output: `apps/saju/src/constants.py`
- residual_risk: none
