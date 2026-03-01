---
name: Backend Development
description: Backend development with Hono API + Clean Architecture + DDD. Factory pattern DI, companion object pattern.
---

# Trigger Conditions

- When creating or editing files under `services/transcriptor/`
- When creating new domain models, use cases, or repositories
- When adding or modifying API endpoints

# Execution Checklist

1. Verify that UseCases follow sequential top-to-bottom execution
2. Verify there are no UseCase-to-UseCase calls
3. Write JSDoc (pre-conditions, post-conditions) for public Domain/UseCase functions
4. Define new domain models with Zod Schema + companion object pattern
5. Return errors using the Result type (try-catch is prohibited)
6. Create repositories using the `from({ tx })` pattern

# Reference Documents

- `docs/backend/server-architecture.md` - Clean Architecture + DDD (Domain/UseCase/Infra layers)
- `docs/backend/usecase-rules.md` - UseCase implementation rules (sequential execution, prohibitions, idempotency)
- `docs/backend/domain-modeling.md` - Domain model design (aggregates, Zod Schema First, companion objects)
- `docs/backend/function-documentation.md` - Function documentation conventions (JSDoc, pre-conditions, post-conditions)
- `docs/backend/api-design.md` - REST API design principles (resource-oriented URLs, CRUD naming conventions)
- `docs/backend/pr-guidelines.md` - PR guidelines (required: current state, problem, implementation details)
- `docs/backend/datetime-handling.md` - UTC/JST datetime handling
