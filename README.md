# Repository Overview

## Purpose
이 저장소는 harness engineering 방식으로 작은 앱을 설계, 구현, 검증하는 교육용 저장소다.
현재 첫 앱은 `apps/saju/` 아래에 있다.

## Structure
- `harness/core/`: repository-level 규칙
- `harness/scripts/`: cleanup, rollback, checkpoint 스크립트
- `harness/runtime/`: cleanup snapshot 같은 runtime artifact
- `apps/`: 앱별 작업 공간
- `saju/`: 기존 초안 자료 보관 폴더

## Start Here
- 사람 기준 안내: `apps/saju/README.md`
- Codex 기준 진입점: `AGENTS.md`
- Claude Code 기준 진입점: `CLAUDE.md`
- repository-level 문서 인덱스: `harness/core/docs/index.md`

## Current App
- `apps/saju/`: 사주 팔자와 오행 분포를 보여주는 교육용 앱

## Rule
- 공통 규칙은 `harness/core/`를 먼저 따른다.
- 앱별 규칙은 각 `apps/<app-name>/harness/` 아래에서 찾는다.
