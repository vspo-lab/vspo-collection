# Integration Testing Implementation Policy

## Purpose

- Guarantee the behavior of multi-module collaboration including UseCase, Repository, and DB
- Detect boundary inconsistencies (persistence, transactions, transformations) that are invisible in unit tests

## Scope

- `services/web/src/usecase/**`
- `services/web/src/infra/repository/**`
- Application flows that include DB

## Implementation Rules

1. Use real implementations for app internals (UseCase/Repository/DB)
2. Mock only at external service boundaries
3. Enumerate business scenarios using table-driven testing
4. Keep each test independent; do not depend on data from previous cases

## Data Management

- Run migrate/seed before tests
- Create required data per test; avoid unnecessary shared state
- Use `compose.test.yaml` for reproducibility in CI

## Mocking Policy

- Default: Do not mock (especially use real DB)
- Exception: Only uncontrollable external boundaries such as payment, email, and external SaaS

## File Placement

- `services/web/src/test/integration/**/*.test.ts`
- Match the `include` in `services/web/src/vitest.integration.config.ts`

## Execution Commands

- All: `pnpm test:integration`
- API only: `pnpm --filter api test:integration`

## References (Primary Sources)

- Playwright Test Isolation: https://playwright.dev/docs/browser-contexts
- Next.js Testing (test type organization): https://nextjs.org/docs/app/guides/testing
- t_wada policy: `docs/web-frontend/twada-tdd.md`
