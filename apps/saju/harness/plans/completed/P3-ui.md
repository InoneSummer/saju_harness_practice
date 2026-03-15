# P3 UI

## Goal
- `saju` 앱의 입력, 결과, 오류, 안내 흐름을 한 파일에 구현한다.

## Primary Output
- `apps/saju/src/app.py`

## Result
- Gradio Blocks 기반 UI 진입점을 구현했다.
- 입력, 분석 버튼, 오류 영역, 결과 영역, 푸터 안내를 연결했다.
- 결과 순서를 팔자, 오행, 해석으로 고정했다.

## Verification
- coder self-check 완료
- security review 완료
- tester review 완료
- 최종 verdict: APPROVED
- attempts: 1

## Related Reports
- `apps/saju/harness/plans/ongoing/P3-ui-coder-report.md`
- `apps/saju/harness/plans/ongoing/P3-ui-security-report.md`
- `apps/saju/harness/plans/ongoing/P3-ui-test-report.md`

## Checkpoint
- git checkpoint: `refs/harness-checkpoints/p3-complete`
- git commit: `ab339d8f272b82cbf3bd4b7a7570af517fb4116a`

## Remaining Notes
- 현재 환경에는 `gradio`가 없어 실제 브라우저 렌더링과 launch 흐름은 이후 단계에서 확인해야 한다.
