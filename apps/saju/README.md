# Saju App

## Purpose
`saju`는 생년월일시를 입력하면 사주 팔자와 오행 분포를 보여주는 교육용 앱이다.
현재 코드는 `src/`, 문서는 `harness/`, 테스트는 `tests/` 아래에 있다.

## Structure
- `harness/`: app-level harness 문서
- `src/constants.py`: 상수와 템플릿 (성별 상수 추가)
- `src/saju.py`: 사주 계산 로직
- `src/app.py`: UI 진입점 (성별 입력 포함)
- `tests/test_saju.py`: 핵심 계산 테스트
- `tests/test_app.py`: UI 출력 구조 테스트 (성별 회귀 추가)

## Install
의존성은 현재 앱 폴더 안의 `.vendor/`에 넣는 방식을 사용한다.

```bash
python3 -m pip install --target /Users/inwon/Desktop/h/apps/saju/.vendor gradio korean-lunar-calendar
```

## Run Tests

```bash
PYTHONPATH=/Users/inwon/Desktop/h/apps/saju/.vendor:/Users/inwon/Desktop/h \
python3 -m unittest discover -s /Users/inwon/Desktop/h/apps/saju/tests -p 'test_*.py'
```

## Run App

```bash
PYTHONPATH=/Users/inwon/Desktop/h/apps/saju/.vendor:/Users/inwon/Desktop/h \
python3 /Users/inwon/Desktop/h/apps/saju/src/app.py
```

## Read Order
- app 설명: `harness/docs/index.md`
- 기능 계약: `harness/specs/product-spec.md`
- 실행 상태: `harness/plans/tracker.md`

## Current Limits
- `gradio`가 설치된 환경에서는 `app.py`를 실행하여 실제 브라우저에서 UI를 확인할 수 있다.
  (버전 6 이상에서는 CSS 인자를 `launch()`에 전달해야 하므로 `app.build_interface`
  내부에서는 처리하지 않는다.)
- `apps/saju/.vendor/` 경로는 실행 시 `PYTHONPATH`에 포함해야 한다.
- 절입조정, 서머타임 같은 전통 만세력 세부 범위는 제외했다.
