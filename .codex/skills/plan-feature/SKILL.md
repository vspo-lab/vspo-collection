---
name: Feature Spec Authoring
description: Generate structured spec documents in docs/plan/<feature>/ from ambiguous requirements.
user_invocable: true
---

# Overview

A skill for authoring feature development specs.
It gathers ambiguous requirements through interviews and generates spec documents aligned with Clean Architecture layers in `docs/plan/<feature>/`.

# Procedure

## Step 1: Requirements Gathering

Collect all of the following in a single round of questions.

1. Feature name (English kebab-case, e.g., `user-profile`)
2. Purpose and background (why it is being built)
3. Target users and usage scenarios
4. In Scope / Out of Scope
5. Affected entities (new or changes to existing)
6. Key use cases (1-5)
7. API endpoints (expected)
8. Frontend screen layout (expected)
9. Open questions

## Step 2: Spec Document Generation

Based on the answers, create the following files in `docs/plan/<feature>/`.
Refer to the spec file overview in `docs/plan/README.md` for the items to include in each file.

- `00_OVERVIEW.md` - Feature overview, purpose, scope
- `01_DOMAIN_MODEL.md` - Entity changes, business rules
- `02_DATA_ACCESS.md` - Repository and DB changes
- `03_USECASE.md` - UseCase layer changes
- `04_API_INTERFACE.md` - API endpoint specs
- `05_FRONTEND.md` - Frontend UI specs

For backend-only or frontend-only features, omit unnecessary files.
Mark undecided sections as `TBD`.

## Step 3: Spec Review Summary

After generation, present the following.

1. List of generated files
2. Summary of confirmed decisions
3. Open questions and issues to resolve next
4. Guidance on updating `docs/domain/` if needed

# Rules

- Consolidate all specs in `docs/plan/<feature>/` (do not scatter them elsewhere)
- Entity definitions follow Zod Schema First (per `docs/backend/domain-modeling.md`)
- Advise recording important decisions in `docs/domain/decisions.md` as well

# Reference Documents

- `docs/plan/README.md`
- `docs/domain/README.md`
- `docs/backend/server-architecture.md`
- `docs/backend/domain-modeling.md`
- `docs/backend/api-design.md`
- `docs/web-frontend/architecture.md`
