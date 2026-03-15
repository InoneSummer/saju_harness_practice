# Ongoing Plans

## Purpose
이 폴더는 현재 진행 중인 작업 문서를 둔다.
활성 작업은 가능한 한 1개만 유지한다.

## File Rule
- 파일 이름은 작업 목적이 바로 보이게 적는다.
- 한 문서는 한 작업만 다룬다.
- 내용은 core `ongoing-plan-template.md` 구조를 따른다.

## Required Fields
- goal
- scope
- current owner
- current step
- current state
- verdict
- attempts
- root_cause
- next owner
- next step

## Use
- 작업 시작 시 문서를 만든다.
- `CHANGES_REQUESTED`나 `BLOCKED`가 나오면 attempts를 올린다.
- 같은 원인이 반복되면 root_cause를 유지해 누적한다.
- 작업이 끝나면 `completed/`로 옮긴다.
