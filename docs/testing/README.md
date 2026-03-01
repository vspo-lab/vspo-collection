# Testing Strategy Overview

This directory is the Single Source of Truth for implementation policies per test type.

## Common Principles

- Run `Red-Green-Refactor` in short cycles based on the t_wada approach
- Use table-driven testing (`it.each` / `test.each`) as the standard pattern
- Default is "do not mock." Pass through internal dependencies with real implementations
- As an exception, mock only boundaries we cannot control, such as external SaaS, payment, and email
- Verify behavior visible to the consumer, not implementation details

## Test Types and Responsibilities

| Type | Purpose | Primary Tools | Policy |
| --- | --- | --- | --- |
| Unit | Verify localized behavior of functions/domain | Vitest | Fast, pure, minimal side effects |
| Integration | Verify multi-module collaboration | Vitest + real DB | Pass through Repository/UseCase/DB |
| API | Endpoint contract and I/O guarantee | Hono testClient + OpenAPI | Hit routes with real implementations |
| UI | Verify components from the user's perspective | Vitest + Testing Library | Role-based selection, real DOM preferred |
| VRT | Detect visual regressions | Storybook + Playwright | Stabilize snapshots |
| E2E | Guarantee entire user flows | Playwright | Verify paths in production-equivalent environment |

## Coverage Policy

| Target Package | Minimum Coverage | CI Enforced |
| --- | --- | --- |
| `services/web/src/domain/**` | 60% | Yes |
| `packages/**` | 60% | Yes |
| `services/web/shared/lib/**` | 50% | No (recommended) |

- PRs where coverage falls below the threshold will fail in CI
- Thresholds are raised incrementally (initial settings are conservative)
- Do not write meaningless tests just for coverage. Reach it naturally through tests that verify behavior

## Document List

- [unit-testing.md](./unit-testing.md)
- [integration-testing.md](./integration-testing.md)
- [api-testing.md](./api-testing.md)
- [ui-testing.md](./ui-testing.md)
- [vrt-testing.md](./vrt-testing.md)
- [e2e-testing.md](./e2e-testing.md)
