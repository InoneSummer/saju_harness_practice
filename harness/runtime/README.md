# Harness Runtime

## 1. Purpose
이 폴더는 repository-level harness가 실행 중에 남기는 runtime artifact를 둔다.
문서나 소스코드가 아니라, 자동화 실행의 부가 산출물을 저장한다.

## 2. Scope
- cleanup snapshot
- rollback에 필요한 임시 복구 파일

## 3. Rule
- runtime artifact는 source of truth가 아니다.
- 자동화가 파일을 바꾸기 전에는 가능한 한 snapshot을 먼저 남긴다.
- 오래된 artifact는 별도 정리 규칙으로 관리한다.
