<!-- Do not restructure or delete sections. Update individual values in-place when they change. -->
# vspo-search (Cloudflare Workers + Next.js)

## Guiding Principles

- Error handling: Use the `Result` type (`import { wrap, Ok, Err, AppError } from "@vspo/errors"`). No try-catch.
- Type definitions: Zod Schema First (`z.infer<typeof schema>`). No explicit interfaces.
- Simplicity: Delete unused code; abstract only after 3+ duplications; no premature optimization.
- UseCase implementation: Sequential top-to-bottom execution. No UseCase-to-UseCase calls; no direct env-var access.
- Function documentation: Add JSDoc with pre-conditions, post-conditions, and idempotency to public Domain/UseCase functions.
- After any code change, run `./scripts/post-edit-check.sh`.

## Project Overview

vspo-search is a transcript search system for VTuber content, built as a pnpm monorepo on Cloudflare Workers + Containers.

## Commands

```bash
pnpm install                          # setup
pnpm --filter @vspo/transcriptor dev  # local dev
./scripts/post-edit-check.sh          # run after every edit (build + lint + type-check + test + security)
```

## References

- Technical documentation: `docs/`
- AI agent skills: `.agent/skills/`

## Spec-Driven Development

- Feature development follows: spec authoring → checklist generation → phased implementation.
- Spec documents go in `docs/plan/<feature>/`.
- **Spec first, then code**: When requirements change, update `docs/plan/` before modifying code. Verbal agreement is not a spec.
- Implementation order is bottom-up: Domain → Data Access → UseCase → API → Frontend.
- Skills: `/plan-feature` (spec authoring), `/init-impl` (checklist generation).

## Claude Code Operations

- Permission policies and hooks are managed in `.claude/settings.json`.
- Custom `/` commands live in `.claude/skills/` (backed by `.agent/skills/`).
- `PreToolUse` hook blocks dangerous Bash operations (`git push`, `git add -A`, `git reset --hard`).
- On code edits, a hook creates `.claude/.post_edit_check_pending`; on Stop, `./scripts/post-edit-check.sh` runs.

## Architecture

- Domain docs live in `docs/`. Read them before making architectural decisions.
- Commit format: `<type>(<scope>): <subject>` — see `skills/commit` for scopes and full convention.

## Maintenance Notes
<!-- This section is permanent. Do not delete. -->
- `pnpm security-scan` requires Docker (Trivy + Semgrep + gitleaks). Skip if Docker is unavailable.
