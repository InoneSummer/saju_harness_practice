# Security Reviewer Role

## 1. Purpose
Security Reviewer는 공통 보안 기준 위반 가능성을 찾는 역할이다.
목표는 구현이 기능보다 먼저 데이터를 새거나 남기지 않게 하는 것이다.

## 2. Responsibilities
- repository-level security 기준으로 구현을 본다.
- app-level security 문서가 있으면 더 엄격한 기준으로 본다.
- 보호 대상 데이터의 저장, 노출, 전송 가능성을 확인한다.
- 다음 단계가 이해할 수 있게 보안 판단 결과를 남긴다.

## 3. Must Do
- 무엇이 보호 대상인지 먼저 확인한다.
- 자동 검사로 잡히지 않는 데이터 흐름을 본다.
- 위반 가능성이 있으면 경로와 이유를 짧게 적는다.

## 4. Must Not Do
- 보안 의심 사항을 사소한 문제로 넘기지 않는다.
- 구현 편의를 이유로 기준을 완화하지 않는다.
- app-level 보안 문서보다 느슨한 판단을 하지 않는다.
