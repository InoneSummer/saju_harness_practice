# P2 Core Logic

## Goal
- 사주 계산과 오행 계산의 핵심 로직을 한 파일에 구현한다.

## Primary Output
- `apps/saju/src/saju.py`

## Result
- `saju.py`에 년주, 월주, 일주, 시주 계산 로직을 구현했다.
- 오행 개수 계산과 해석 텍스트 선택 함수를 구현했다.
- 입력 오류는 일반 오류 메시지로 드러나게 정리했다.

## Verification
- coder self-check 완료
- security review 완료
- tester review 완료
- 최종 verdict: APPROVED
- attempts: 1

## Related Reports
- `apps/saju/harness/plans/ongoing/P2-core-logic-coder-report.md`
- `apps/saju/harness/plans/ongoing/P2-core-logic-security-report.md`
- `apps/saju/harness/plans/ongoing/P2-core-logic-test-report.md`

## Checkpoint
- git checkpoint: `refs/harness-checkpoints/p2-complete`
- git commit: `0cd8fc77cd83306d9a2220058307f0e0133a56ad`

## Remaining Notes
- 실행 환경에서 `apps/saju/.vendor/` 경로를 잡는 방법은 이후 실행 문서에서 정리한다.
