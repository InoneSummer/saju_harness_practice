# Governance

## 1. Purpose
이 문서는 저장소 공통 문서와 앱별 문서의 경계를 정의한다.
변경은 작고 분명해야 하며, 이유를 설명할 수 있어야 한다.

## 2. Document Boundary
- repository-level 문서는 모든 앱에 공통으로 적용되는 규칙만 다룬다.
- app-level 문서는 도메인, 기능, UI, 엣지 케이스를 다룬다.
- 공통 규칙으로 올릴 수 없는 내용은 app-level에 둔다.

## 3. Ownership
- PM은 범위, 완료 기준, 문서 정합성을 관리한다.
- Coder는 구현 문맥에서 필요한 문서 변경을 제안할 수 있다.
- Designer는 화면 구조와 표현 규칙 변경을 제안할 수 있다.
- Security Reviewer와 Tester는 기준 위반을 발견하면 문서 수정을 요청할 수 있다.

## 4. Change Rules
- 문서 변경은 문제와 이유가 분명할 때만 한다.
- 한 번의 변경에는 한 가지 목적만 담는다.
- repository-level 문서를 바꾸면 관련 app 문서도 함께 점검한다.
- app-level 문서를 바꿀 때는 repository-level 규칙을 낮추지 않는다.

## 5. Review Rule
- 문서와 구현이 다르면 먼저 문서가 맞는지 확인한다.
- 문서가 더 이상 맞지 않으면 범위를 줄이거나 문서를 고친다.
- 같은 이유로 수정이 반복되면 공통 규칙으로 올릴지 검토한다.
