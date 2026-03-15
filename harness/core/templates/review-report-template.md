# Review Report Template

## Purpose
단계 간 handoff에 필요한 짧은 검토 결과를 남기는 템플릿이다.

## Template
```md
# <Stage Report>

## Verdict
- APPROVED | CHANGES_REQUESTED | BLOCKED | SKIPPED

## Reason
- 

## Scope
- 

## Checked
- 

## Passed
- 

## Cleanup
- cleaned:
- remaining:

## Open Risks
- none

## Next Owner
- 
```

## Rule
- 길게 쓰지 않는다.
- 판정 값은 정해진 네 가지 중 하나만 쓴다.
- `APPROVED`는 다음 단계 진행 가능을 뜻한다.
- `CHANGES_REQUESTED`는 수정 후 같은 작업을 다시 확인해야 함을 뜻한다.
- `BLOCKED`는 외부 의존성이나 문서 미정리로 진행 불가함을 뜻한다.
- `SKIPPED`는 optional 단계가 이번 작업에 필요 없음을 뜻한다.
- 확인한 것과 남은 위험을 분리해서 적는다.
- 다음 단계가 바로 이어받을 수 있게 쓴다.
