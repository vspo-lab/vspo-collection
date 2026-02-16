---
name: refactor
description: Refactor code while preserving behavior and architecture boundaries.
allowed-tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(git show:*), Bash(pnpm build:*), Bash(pnpm biome:*), Bash(pnpm knip:*), Bash(pnpm type-check:*), Bash(pnpm test:*), Bash(./scripts/post-edit-check.sh:*)
---

# /refactor Command

Refactor code to improve maintainability and simplicity without changing external behavior.

## Principles

### Common

- Keep method names primitive and single-purpose. Avoid compound action names like `fetchAndSave`.
- Avoid unnecessary sharing and wrappers. If direct usage is enough, do not add extra layers.
- Keep the codebase as small as possible while preserving clarity and correctness.
- Add meaningful comments where intent is not obvious. Do not add trivial comments.
- Respect Clean Architecture + DDD dependency direction: `Infra -> UseCase -> Domain`.

### UseCase

- Keep UseCases simple and orchestration-focused.
- Concentrate business logic in the Domain layer.

### Domain and Repository

- Repositories are responsible for persistence at aggregate boundaries.
- Treat objects with the same lifecycle as one aggregate.
- Perform create, update, delete, and get operations at aggregate level.

## Execution Steps

1. Identify target scope and current behavior.
2. Refactor with behavior preservation as the first priority.
3. Remove redundant wrappers and unnecessary abstractions.
4. Re-check layer boundaries and dependency direction.
5. Add or update meaningful comments only where needed.
6. Run validation commands (`type-check`, `build`, tests, or `post-edit-check`) and report results.

