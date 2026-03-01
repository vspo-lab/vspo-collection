---
name: ui-testing
description: Used when implementing UI tests with Testing Library priority queries and table-driven style, verifying from a user perspective with minimal mocking.
---

# Trigger Conditions

- When adding behavior tests for React components or screens
- When you want to verify the UI from a user perspective rather than implementation details

# Execution Checklist

1. Review `docs/testing/ui-testing.md`
2. Prefer `getByRole` for element selection
3. Enumerate state/props variations using `it.each`
4. Pin only network boundaries with minimal stubs

# Reference Documents

- `docs/testing/ui-testing.md`
- `docs/web-frontend/twada-tdd.md`
