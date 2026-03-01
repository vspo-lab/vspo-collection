---
name: integration-testing
description: Used when building integration tests with a real DB and real app wiring, verifying without internal mocks and limiting mocking to external boundaries only.
---

# Trigger Conditions

- When verifying the coordination between UseCases and Repositories
- When adding or updating integration tests that involve a DB

# Execution Checklist

1. Review `docs/testing/integration-testing.md`
2. Define scenarios as tables assuming a real DB
3. Replace only external dependencies at the boundary
4. Confirm reproducibility with `test:integration`

# Reference Documents

- `docs/testing/integration-testing.md`
- `docs/web-frontend/twada-tdd.md`
