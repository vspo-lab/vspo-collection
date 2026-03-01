---
name: Documentation Update
description: Update docs/ to reflect code changes. Keep docs/ up to date at all times.
---

# Trigger Conditions

- After implementing a new feature or making architectural changes
- After modifying existing specs or conventions
- When the user requests a docs update

# Rules

- `docs/` is the Single Source of Truth for all technical documentation
- Always update the relevant docs/ files alongside code changes
- When introducing new concepts or patterns, create the corresponding docs/ file
- SKILL.md files in skills are pointers to docs/ only. Do not write details in skills

# docs Structure

- `docs/domain/` - Domain specs (overview, entities, use cases, glossary)
- `docs/plan/` - Feature specs (Spec-Driven Development, per-feature specs and checklists)
- `docs/testing/` - Testing strategy (Unit/Integration/API/UI/VRT/E2E)
- `docs/web-frontend/` - Frontend (architecture, hooks, CSS, a11y, testing, error handling, TypeScript)
- `docs/backend/` - Backend (server architecture, domain modeling, API design, UseCase implementation rules, function documentation conventions, PR guidelines, datetime handling)
- `docs/design/` - Design system (tokens, colors, typography, UI patterns, principles, a11y)
- `docs/infra/` - Infrastructure (CI/CD, multi-cloud)
- `docs/security/` - Security (lint, scanning)
