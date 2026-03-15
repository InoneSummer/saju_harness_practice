# Saju Roadmap

## 1. Purpose
이 문서는 `saju` 앱을 어떤 순서로 구현할지 정리한 roadmap이다.
각 단계는 가능한 한 작은 산출물 단위로 나누고, 완료 기준은 검증 가능해야 한다.

## 2. Phase 1: Constants
- 목표: 상수와 템플릿 정의
- 주요 산출물: `src/constants.py`
- 완료 기준: 오행 매핑, 시간 선택, 해석 템플릿이 문서와 맞게 정의된다.

## 3. Phase 2: Core Logic
- 목표: 사주 계산과 오행 계산 구현
- 주요 산출물: `src/saju.py`
- 완료 기준: 핵심 계산 결과가 기준 규칙과 맞고, 실패 입력이 드러난다.

## 4. Phase 3: UI
- 목표: 입력, 결과, 오류, 안내 흐름 구현
- 주요 산출물: `src/app.py`
- 완료 기준: 입력부터 결과까지의 흐름이 design과 frontend 문서에 맞게 동작한다.

## 5. Phase 4: Tests and Finish
- 목표: 테스트 보강과 실행 안내 정리
- 주요 산출물: `tests/test_saju.py`, `README.md`
- 완료 기준: 핵심 테스트가 통과하고, 실행 방법이 문서에 정리된다.

## 6. Rule
- 한 phase 안에서도 작업은 task brief 단위로 더 쪼갠다.
- 한 작업은 하나의 주요 산출물을 기준으로 잡는다.
- `CHANGES_REQUESTED`나 `BLOCKED`가 반복되면 시도 횟수를 기록한다.
- 같은 `root_cause`가 5회 반복되면 rollback loop를 검토한다.
