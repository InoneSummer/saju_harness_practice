# Saju Architecture

## 1. Purpose
이 문서는 `saju` 앱의 폴더 구조와 모듈 책임을 정의한다.
이 앱은 구현 코드와 harness 문서를 분리해서 관리한다.

## 2. App Structure
- `apps/saju/harness/`: app-level harness 문서
- `apps/saju/src/`: 앱 구현 코드
- `apps/saju/tests/`: 앱 검증 코드
- `apps/saju/README.md`: 앱 실행 안내

## 3. Harness Structure
- `docs/`: product, architecture, security, reliability, design 같은 기준 문서
- `specs/`: 기능 명세
- `references/`: 실패 사례와 참고 기록
- `plans/`: roadmap, tracker, ongoing, completed

## 4. Source Structure
- `src/app.py`: UI 진입점
- `src/saju.py`: 사주 계산 로직
- `src/constants.py`: 상수와 템플릿
- `tests/test_saju.py`: 계산과 동작 검증

## 5. Boundary Rule
- app-level harness 문서는 구현 기준을 정의한다.
- 구현 코드는 `src/` 아래에만 둔다.
- 테스트 코드는 `tests/` 아래에만 둔다.
- 사용자 입력 데이터는 함수 인자와 반환값 안에서만 흐르게 한다.

## 6. Design Rule
- 한 파일은 한 책임에 가깝게 유지한다.
- 초보자가 읽기 어려운 구조가 되면 모듈을 다시 나눈다.
- app 구조와 harness 구조가 서로 어긋나면 먼저 어떤 쪽이 맞는지 확인한다.
