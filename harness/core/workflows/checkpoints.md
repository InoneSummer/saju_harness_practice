# Checkpoints

## 1. Purpose
이 문서는 작업 상태를 작고 명확하게 남기는 공통 기준을 정의한다.
목표는 중단 후에도 다음 사람이 바로 이어서 작업할 수 있게 하는 것이다.

## 2. Where to Record
- 앱 전체 진행 상태는 `apps/<app-name>/harness/plans/tracker.md`에 남긴다.
- 현재 진행 중인 작업 상태는 `apps/<app-name>/harness/plans/ongoing/` 아래 문서에 남긴다.
- 완료된 작업 기록은 `apps/<app-name>/harness/plans/completed/` 아래로 옮겨 남긴다.

## 3. What to Record
- 현재 작업의 목적
- 현재 단계
- 마지막으로 확인된 상태
- 현재 판정 값
- 시도 횟수
- 다음 담당자
- 다음에 해야 할 한 가지 일
- 보류나 실패가 있으면 그 이유

## 4. Rule
- 체크포인트는 짧게 쓴다.
- 현재 상태와 다음 행동이 바로 보여야 한다.
- 상태가 바뀌면 최신 내용으로 갱신한다.
- 시도 횟수와 판정 값은 고정 필드로 남긴다.
- 큰 작업은 더 작은 체크포인트로 나눈다.

## 5. Minimum Structure
1. 작업 이름
2. 현재 단계
3. 현재 상태
4. 현재 판정 값
5. 시도 횟수
6. 다음 담당자
7. 다음 단계
8. 이슈

## 6. Use
- 작업 시작 시 `tracker.md`와 `ongoing/` 문서를 함께 만든다.
- 의미 있는 변경 후 `ongoing/` 문서를 갱신한다.
- 단계가 바뀌면 `tracker.md`를 갱신한다.
- `CHANGES_REQUESTED` 또는 `BLOCKED`가 나오면 시도 횟수를 올린다.
- 작업 완료 시 `ongoing/` 문서를 `completed/`로 옮기고 마지막 상태를 남긴다.
