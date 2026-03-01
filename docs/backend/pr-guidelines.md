# PR Guidelines

## Overview

These are conventions for maintaining consistent quality in Pull Requests.
By including the required information in the PR description, we aim to improve review efficiency and clarify the intent of changes.

## Required Sections in PR Description

The PR Description must include the following 3 sections.

### 1. Current State

Briefly describe the state before the change.

### 2. Problem

Describe the problems that would occur if this change is not made.
Clarify "why this change is necessary."

### 3. Implementation

Describe what was changed and how.
List technical changes as bullet points.

## 1 PR, 1 Concern

Each PR should contain only one concern.

```
# ✅ Good: One concern
- PR: "Add item creation API"
  - domain/item.ts, usecase/item.ts, repository/item.ts, http/item.ts

# ❌ Bad: Multiple concerns mixed together
- PR: "Add item creation API + refactoring + test fixes"
```

Mixing multiple changes causes the following problems:

- Review burden increases
- Identifying the cause of bugs becomes difficult
- Reverting becomes harder

## Impact Scope

When a change affects other modules or features, document the impact scope.

## PR Template

Use the template defined in `.github/pull_request_template.md` (GitHub automatically applies it when creating a PR).

## Related Documents

- [Server Architecture](./server-architecture.md) - Overall architecture
- [UseCase Implementation Rules](./usecase-rules.md) - UseCase implementation conventions
- [Code Review Skill](../../.agent/skills/code-review/SKILL.md) - Run with `/code-review`
