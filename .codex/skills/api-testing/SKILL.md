---
name: api-testing
description: Used when building API tests with Hono testClient and OpenAPI contract validation, guaranteeing endpoint contracts with minimal mocking.
---

# Trigger Conditions

- When adding or modifying tests for API endpoints
- When you want to pin the input/output contract of a route

# Execution Checklist

1. Review `docs/testing/api-testing.md`
2. Enumerate success and error cases in a table
3. Hit routes directly using `testClient` or `app.request()`
4. Update `/doc`-based contract check targets

# Reference Documents

- `docs/testing/api-testing.md`
- `docs/web-frontend/twada-tdd.md`
