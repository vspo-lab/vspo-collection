# API Testing Implementation Policy

## Purpose

- Prevent breaking HTTP endpoint contracts (status/header/body)
- Detect divergence between OpenAPI and implementation early

## Scope

- Routes in `services/web/src/presentation/**`
- Authentication, validation, response formatting

## Implementation Rules

1. Hit the Hono app directly using `testClient` or `app.request()`
2. Always include failure contracts for 4xx/5xx, not just 200-series
3. Cover input variations comprehensively using table-driven testing
4. Use OpenAPI `/doc` as the input source for contract tests

## Mocking Policy

- Default: Do not mock (pass through route -> UseCase -> Repository with real implementations)
- Exception: Replace only external API calls at the boundary

## Contract Testing

- API cases: Vitest + Hono testClient
- OpenAPI contracts: Validate `/doc` with Schemathesis or similar tools

## Execution Commands

- API unit/integration: `pnpm --filter api test:run`
- API integration (separate config): `pnpm --filter api test:integration`

## References (Primary Sources)

- Hono Testing Helper: https://hono.dev/docs/helpers/testing
- Hono `app.request()`: https://hono.dev/docs/api/hono#request
- Playwright API Testing: https://playwright.dev/docs/api-testing
- Schemathesis CLI: https://schemathesis.readthedocs.io/en/stable/reference/cli/
