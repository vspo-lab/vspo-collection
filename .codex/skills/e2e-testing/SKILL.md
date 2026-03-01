---
name: e2e-testing
description: Used when building E2E tests with Playwright to guarantee key user flows through production-equivalent paths. Avoid internal mocks; limit mocking to external boundaries only.
---

# Trigger Conditions

- When you want to guarantee regression coverage for key user flows
- When adding scenarios that span screens, APIs, and authentication before a release

# Execution Checklist

1. Review `docs/testing/e2e-testing.md`
2. Split cases by business scenario
3. Reuse authentication state via `storageState`
4. Pin only external dependencies using `page.route()`

# Reference Documents

- `docs/testing/e2e-testing.md`
- `docs/web-frontend/twada-tdd.md`
