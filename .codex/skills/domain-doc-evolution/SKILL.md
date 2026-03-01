---
name: Domain Spec Evolution
description: Update docs/domain in response to feature additions or spec changes, preserving a history of specification decisions.
user_invocable: true
---

# Overview

A skill for continuously evolving domain specifications during implementation.
Keeps `docs/domain` consistent as code changes are made.

# Execution Steps

## Step 1: Identify Changes

- Identify the target feature and its impact scope (entities / use cases / terminology)
- Check for contradictions with existing `docs/domain/*.md`

## Step 2: Update docs/domain

Update only the necessary files with minimal diffs.

- `overview.md`: Update only if the purpose or scope changes
- `entities.md`: Reflect changes in attributes, rules, and relationships
- `usecases.md`: Add/modify use cases, update priorities
- `glossary.md`: Add new terms, consolidate synonyms
- `decisions.md`: Append specification decisions

## Step 3: Record Decision Rationale

When a specification decision is made, always record the following in `decisions.md`:

1. Decision
2. Rationale
3. Alternatives considered
4. Impact scope

# Reference Documents

- `docs/domain/README.md`
- `docs/backend/domain-modeling.md`
- `docs/web-frontend/typescript.md`
