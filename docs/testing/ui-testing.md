# UI Testing Implementation Policy

## Purpose

- Verify components from the perspective of "how the user uses them"
- Create tests that are resilient to DOM structure changes

## Scope

- `services/web/shared/components/**`
- Container/Presentational boundaries in `services/web/features/**`

## Implementation Rules

1. Prefer Role/Label/Text for element selection
2. Simulate events using `user-event` equivalent operations
3. Verify props/state variations using table-driven testing
4. Verify visible results, not implementation details (class names, internal state)

## Mocking Policy

- Default: Do not mock (use real implementations for child components where possible)
- Exception: Fix only network boundary responses (using MSW, etc.)
- Purpose: Verify UI logic, not external SaaS availability

## Query Priority

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByTestId` (last resort)

## Execution Commands

- `pnpm --filter web vitest run`

## References (Primary Sources)

- Testing Library Guiding Principles: https://testing-library.com/docs/guiding-principles
- Testing Library Query Priority: https://testing-library.com/docs/queries/about/#priority
- Next.js Testing (Vitest + Testing Library): https://nextjs.org/docs/app/guides/testing/vitest
