---
name: review
description: Perform code reviews. Use for requests like "review this" or "code review."
metadata:
  short-description: Code review skill
---

# /review Command

Review code diffs or specified files based on project conventions, and provide issues with proposed fixes.

## Usage

- `/review` - Review unstaged changes from `git diff`
- `/review --staged` - Review staged changes
- `/review <file>` - Review a specific file
- `/review <commit>` - Review the diff of a specific commit

## Procedure

1. **Identify the target**: Run `git diff` / `git diff --staged` / `git show` / file reads based on arguments.
2. **Check conventions**: Read relevant documents under `docs/` and understand the latest conventions.
3. **Run checks by category**: Apply the review criteria below in order.
4. **Report results**: For each issue, provide severity, file location, and a proposed fix.

---

## Review Criteria

### 1. Layering and Dependency Direction (Clean Architecture)

**Reference**: `docs/backend/server-architecture.md`

Allow only one-way dependencies from outer to inner layers: `Infra -> UseCase -> Domain`

| Check | Violation Example |
|---|---|
| Does the Domain layer avoid importing external packages (Cloudflare SDK, DB clients, etc.)? | Importing Hono or D1 inside `domain/` |
| Does the UseCase layer avoid directly depending on Infra concrete implementations? | Calling Cloudflare Workers APIs directly inside UseCases |
| Is business logic (branching/calculations) kept out of the Infra layer? | Performing status decisions inside a Repository |
| Are DTOs hidden from the Domain layer? | Using DTO types as UseCase input/output |

### 2. Result-based Error Handling

**Reference**: `docs/web-frontend/error-handling.md`

| Check | Violation Example |
|---|---|
| Is the `Result` type used for error handling (`try-catch` is prohibited)? | `try { ... } catch (e) { ... }` |
| Is `wrap` used for async library calls? | Calling `await fetch(...)` directly |
| Is `import { wrap, Ok, Err, AppError } from "@vspo/errors"` used? | Defining a custom error type |
| Do error messages clearly state what failed and why? | Ambiguous messages like `"invalid input"` |

### 3. Zod Schema First / TypeScript

**Reference**: `docs/web-frontend/typescript.md`

| Check | Violation Example |
|---|---|
| Are Zod schemas treated as the source of truth for types? | Defining types with handwritten `interface` or `type` |
| Are types derived with `z.infer<typeof schema>`? | Duplicated schema and type definitions |
| Are `any` / `as` casts avoided? | `value as unknown as SomeType` |
| Are Branded Types used to ensure identifier type safety? | Using raw `string` values as IDs |

### 4. Domain Modeling

**Reference**: `docs/backend/domain-modeling.md`

| Check | Violation Example |
|---|---|
| Are domain rules encapsulated within domain objects? | Domain decision logic inside UseCases |
| Are invariants validated in constructors? | Creating objects without validation |
| Does naming align with domain terminology? | Names that diverge from the ubiquitous language |
| Are value-object concepts avoided as raw primitives? | Passing domain IDs as plain `string` |

### 5. Frontend Structure (Container / Presentational)

**Reference**: `docs/web-frontend/architecture.md`

| Check | Violation Example |
|---|---|
| Does the code follow a feature-based module structure? | Placing non-shared cross-feature code in `shared/` |
| Are Container and Presentational responsibilities separated? | Calling APIs inside Presentational components |
| Are Next.js App Router file conventions followed? | Putting business logic directly under `app/` |
| Are Server Component / Client Component boundaries appropriate? | Unnecessary `"use client"` usage |

### 6. Naming Conventions

**Reference**: `docs/backend/domain-modeling.md`, `docs/backend/server-architecture.md`

| Check | Violation Example |
|---|---|
| Do method names avoid repeating layer names? | `TranscriptRepository.getTranscript` -> `TranscriptRepository.get` |
| Is naming consistent across directories? | Using different names for the same concept |
| Do file and variable names follow project naming conventions? | Mixing camelCase and kebab-case |

### 7. Test Quality

**Reference**: `docs/web-frontend/unit-testing.md`

| Check | Violation Example |
|---|---|
| Are tests added for new code? | New function without tests |
| Is Vitest used? | Using Jest or other test frameworks |
| Are tests independent from internal implementation details? | Testing private methods directly |
| Is Arrange / Act / Assert clearly separated? | Mixed setup, execution, and assertions |
| Is mock/stub usage minimal? | Tests that mock every dependency |

### 8. Security

**Reference**: `docs/security/lint.md`

| Check | Violation Example |
|---|---|
| Is user input validated? | Processing unvalidated input directly |
| Are XSS / injection mitigations in place? | Careless use of `dangerouslySetInnerHTML` |
| Is sensitive information (API keys, tokens, etc.) not hardcoded? | Writing values that should be in `.env` directly in source |
| Are there no OWASP Top 10 vulnerabilities? | Missing SQL injection / CSRF protections |

---

## Output Format

Report each issue in the following format. Skip criteria with no issues.

```
## Review Results

### [Severity: High] Issue Summary

**File**: `path/to/file.ts:line`
**Category**: Layering and Dependency Direction

**Issue**: Specific description of the problem

**Proposed Fix**:
```ts
// code after the fix
```

**Reference**: `docs/backend/server-architecture.md` > dependency rules
```

### Severity Scale

| Severity | Criteria |
|---|---|
| **High** | Architecture violations, lack of type safety, data integrity risk, security issues |
| **Medium** | Missing tests, naming convention violations, Result type not used |
| **Low** | Code style issues, improvement suggestions, readability improvements |

## Reference Documents

- `docs/backend/server-architecture.md` - Layering and dependency conventions
- `docs/backend/domain-modeling.md` - Domain modeling and naming
- `docs/web-frontend/error-handling.md` - Result-based error handling
- `docs/web-frontend/typescript.md` - TypeScript / Zod Schema First
- `docs/web-frontend/architecture.md` - Frontend architecture
- `docs/web-frontend/unit-testing.md` - Testing strategy
- `docs/security/lint.md` - Security linting
- `docs/backend/datetime-handling.md` - Date and time handling (UTC/JST)
