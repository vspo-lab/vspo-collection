# Commit Conventions

## Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

## type (Required)

| type | Purpose |
|------|------|
| `feat` | Feature additions or changes that provide user value |
| `fix` | Bug fixes |
| `docs` | Documentation-only changes |
| `style` | Formatting changes with no behavior impact |
| `refactor` | Refactoring without behavior changes |
| `perf` | Performance-focused improvements |
| `test` | Test additions or modifications |
| `build` | Build config or dependency changes |
| `ci` | CI config or script changes |
| `chore` | Miscellaneous work not covered above |

## scope (Recommended)

Use scope to indicate the changed context:

- `web` - voice collection web app
- `errors` - shared error handling package
- `dayjs` - shared date-time utilities package
- `logger` - shared logging package
- `docs` - documentation
- `domain` - domain layer
- `usecase` - use case layer
- `infra` - infrastructure layer

## subject (Required)

- Aim for 50 characters or fewer.
- Start with lowercase and avoid trailing punctuation.
- Use imperative/present tense (for example, `add`, `fix`, `update`).

## body (Optional)

- Briefly describe rationale, context, and alternatives.
- Wrap lines around 72 characters.
- Include spec changes or side effects when relevant.

## footer (Optional)

- Issue links: `Closes #123`, `Refs #456`
- BREAKING CHANGE declaration

## BREAKING CHANGE

- Add `!` right after `type`, or declare it in the footer.
- Example: `build!: bump node to 22`

## Examples

```text
feat(web): add category filter to clip browser

Allow users to filter voice clips by category.

Refs #42
```

```text
fix(errors): handle undefined error code in Result.unwrap

Prevents runtime crash when error code is not set.
```

## Pre-commit Check

Run the following before committing:

```bash
./scripts/post-edit-check.sh
```
