# Codex Agent Guide

## Language Rule (Highest Priority)

- Write all documentation and code comments in English.

## Repository Snapshot

`vspo-search` currently consists of:

```text
services/
└── transcriptor/      # Cloudflare Worker + Container (yt-dlp wrapper)

packages/
├── dayjs/
├── errors/
└── logger/
```

Primary service entry points:
- `services/transcriptor/src/index.ts`
- `services/transcriptor/src/workflow/transcript-workflow.ts`

## Working Rules

- Keep dependency direction aligned with Clean Architecture: `Infra -> UseCase -> Domain`.
- Use `@vspo/errors` Result-based handling and prefer `wrap` for fallible async calls.
- Prefer schema-first TypeScript patterns.
- Keep implementations simple and remove unused code when touched.

## Reference Docs

- `docs/domain/transcript-search.md`
- `docs/domain/transcript-search-ui.md`
- `docs/backend/server-architecture.md`
- `docs/backend/domain-modeling.md`
- `docs/backend/datetime-handling.md`
- `docs/web-frontend/error-handling.md`
- `docs/web-frontend/typescript.md`
- `docs/security/lint.md`

## Commands

```bash
# Setup
pnpm install

# Local development (transcriptor)
pnpm --filter @vspo/transcriptor dev

# Quality checks
pnpm build
pnpm biome
pnpm knip
pnpm type-check

# Full post-edit check
./scripts/post-edit-check.sh
```

## Notes

- `./scripts/post-edit-check.sh` currently includes `pnpm security-scan`.
- Security scan uses Docker-based tools (Trivy, gitleaks, Semgrep).
- Use commit format: `<type>(<scope>): <subject>`.
