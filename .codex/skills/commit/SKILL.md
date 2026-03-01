---
name: Commit
description: Create a conventional commit following project commit conventions.
user_invocable: true
---

# Overview

Create a Git commit following the project's conventional commit format.

# Workflow

## Step 1: Pre-commit Check

Run quality checks before committing:

```bash
./scripts/post-edit-check.sh
```

If any check fails, fix the issue before proceeding.

## Step 2: Review Changes

```bash
git status
git diff --staged
git diff
```

- Identify all changed files and understand what each change does.
- Stage only the files relevant to the current change (`git add <file>...`). Never use `git add -A` or `git add .`.

## Step 3: Draft Commit Message

Follow the format defined in `docs/common/commit-conventions.md`:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

Rules:
- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- **scope**: `web`, `errors`, `logger`, `docs`, `domain`, `usecase`, `infra`
- **subject**: imperative, lowercase, ≤50 chars, no trailing punctuation
- **body** (optional): rationale and context, wrapped at 72 chars
- **footer** (optional): `Closes #123`, `Refs #456`, `BREAKING CHANGE`
- Do NOT add `Co-authored-by` trailers

## Step 4: Commit

```bash
git commit -m "<message>"
```

## Step 5: Verify

```bash
git log --oneline -3
```

# Reference

- `docs/common/commit-conventions.md`
