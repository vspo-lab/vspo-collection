---
name: twada-tdd
description: Use the t_wada-based test-driven development strategy to make small, safe progress via Red-Green-Refactor. Use when you want to lock down specs test-first during new feature implementation, bug fixes, or refactoring.
---

# Trigger Conditions

- When implementing a new feature
- When starting a bug fix with a regression-prevention test
- When safely refactoring existing code

# Execution Checklist

1. Review `docs/web-frontend/twada-tdd.md` and narrow the scope to a single behavior.
2. Write a failing test first (Red).
3. Add only the minimal implementation to make the test pass (Green).
4. Refactor to remove duplication and improve naming.
5. Re-run tests after each cycle and move on to the next behavior.

# Reference Documents

- `docs/web-frontend/twada-tdd.md` - t_wada-based TDD strategy (adapted for this project)
- `docs/web-frontend/unit-testing.md` - Vitest usage, table-driven tests
- `docs/web-frontend/api-testing.md` - API integration tests
