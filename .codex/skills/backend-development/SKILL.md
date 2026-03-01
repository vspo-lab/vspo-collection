---
name: Backend Development
description: Backend development with Hono API + Clean Architecture + DDD. Factory pattern DI, companion object pattern.
---

# Trigger Conditions

- When creating or editing backend service files
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

- `docs/domain/` - Domain specifications
