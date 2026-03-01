# Unit Testing Implementation Policy

## Purpose

- Guarantee the behavior of pure functions, domain models, and small use cases at high speed
- Keep specification granularity small and run the shortest TDD feedback loop

## Scope

- Pure logic in `packages/*`
- Domain logic in `services/transcriptor/src/domain/**`
- Utilities in `services/web/shared/lib/**`

## Implementation Rules

1. Follow the one-test-one-behavior principle
2. Use table-driven testing with `it.each` / `test.each` as the standard
3. Advance `Red -> Green -> Refactor` one case at a time
4. Verify input/output contracts, not implementation details (private functions, internal state)

## Mocking Policy

- Default: Do not mock
- Allowed: Fix only non-deterministic elements such as time, random numbers, and external communication with minimal mocking
- Prohibited: Coupling to implementation details through excessive mocking of internal modules

## Basic Table-Driven Pattern

```ts
import { describe, expect, it } from "vitest";

describe("normalizeText", () => {
  const cases = [
    { name: "trim only", input: "  foo  ", expected: "foo" },
    { name: "collapse spaces", input: "foo   bar", expected: "foo bar" },
  ];

  it.each(cases)("$name", ({ input, expected }) => {
    expect(normalizeText(input)).toBe(expected);
  });
});
```

## Execution Commands

- All: `pnpm test:unit`
- API only: `pnpm --filter api test:run`
- Web only: `pnpm --filter web vitest run`

## References (Primary Sources)

- Vitest `test.each`: https://vitest.dev/api/#test-each
- Vitest Mocking (caution against excessive mocking): https://vitest.dev/guide/mocking.html
- t_wada policy: `docs/web-frontend/twada-tdd.md`
