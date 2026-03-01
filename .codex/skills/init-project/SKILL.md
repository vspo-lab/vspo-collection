---
name: Project Initialization
description: Bootstrap a new project from the template. Interactively define domain specs and write them to docs/domain/.
user_invocable: true
---

# Overview

A skill that initializes the template repository as a new project.
If `/domain-spec-kickoff` is available, prefer that command. In environments where it is not supported, use this skill for equivalent initialization.

# Procedure

## Step 1: Gather Requirements

Collect all of the following in a single round of questions.

1. Project name (display name / identifier)
2. Project overview (what is being built)
3. Target users
4. Key entities (3-5)
5. MVP use cases (3-5)
6. Glossary (ubiquitous language)
7. In Scope / Out of Scope
8. Open questions and decision deadlines

## Step 2: Generate Domain Documents

Based on the answers, update the following files.

- `docs/domain/overview.md`
- `docs/domain/entities.md`
- `docs/domain/usecases.md`
- `docs/domain/glossary.md`
- `docs/domain/decisions.md`

## Step 3: Output Replacement Guide

Provide guidance on replacing `@vspo` with the project identifier in the following locations.

- `package.json` (root + packages/* + services/*)
- `infrastructure/terraform/`
- `renovate.json` / `renovate/default.json`
- `compose.test.yaml`
- `.github/workflows/`

# Reference Documents

- `docs/domain/README.md`
- `docs/backend/domain-modeling.md`
- `docs/web-frontend/typescript.md`
