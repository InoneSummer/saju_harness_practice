# Codex Platform Guide

## 1. Purpose
이 문서는 Codex가 이 저장소에서 어떤 문서를 먼저 읽고 작업을 시작해야 하는지 정의한다.
플랫폼 사용법 전체가 아니라 repository-level 진입 규칙만 다룬다.

## 2. Entry Point
- 먼저 루트 `AGENTS.md`를 읽는다.
- 그 다음 `harness/core/docs/index.md`를 읽는다.
- 작업할 앱이 정해지면 `apps/<app-name>/harness/docs/index.md`로 내려간다.

## 3. Default Reading Order
1. `AGENTS.md`
2. `harness/core/docs/index.md`
3. `harness/core/workflows/pipeline.md`
4. `apps/<app-name>/harness/docs/index.md`

## 4. Working Rule
- 공통 규칙은 repository-level 문서를 따른다.
- 도메인 규칙은 app-level 문서를 따른다.
- 문서와 구현이 어긋나면 먼저 문서 기준을 확인한다.
- 상태 변경이 있으면 tracker와 ongoing plan에 반영한다.
