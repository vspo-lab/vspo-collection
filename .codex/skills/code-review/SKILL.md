---
name: Code Review
description: PR/code review based on architecture rules. Detects violations of UseCase implementation rules, Result type, and JSDoc conventions.
user_invocable: true
---

# Trigger Conditions

- When a user requests a code review
- When reviewing PR diffs

# Review Checklist

## Architecture Violations

1. Is a UseCase calling another UseCase?
2. Is a UseCase directly accessing environment variables?
3. Is a UseCase directly manipulating PubSub/message queues?
4. Does the UseCase follow sequential top-to-bottom execution?
5. Are there multiple conditional branches inside a loop?

## Code Conventions

6. Is try-catch being used? (Result type is required)
7. Are interfaces being defined directly? (Zod Schema First)
8. Do public Domain/UseCase functions have JSDoc (pre-conditions, post-conditions)?
9. Does the UseCase function document idempotency (`@idempotent`)?

## Testing

10. Are domain function additions or changes accompanied by tests?

# Output Format

Output each finding in the following format:

- `Violation Location`: file path + line number
- `Violated Rule`: relevant document in docs/ + section name
- `Violation Details`: one sentence describing the specific issue
- `Suggested Fix`: fix approach with minimal changes

If a rule source cannot be cited, separate it as an "Improvement Suggestion" rather than stating it as a definitive violation.

# Reference Documents

- `docs/backend/usecase-rules.md` - UseCase implementation rules
- `docs/backend/function-documentation.md` - Function documentation conventions
- `docs/backend/server-architecture.md` - Overall architecture
- `docs/backend/domain-modeling.md` - Domain model design
- `docs/backend/pr-guidelines.md` - PR guidelines
- `docs/security/lint.md` - Lint / Quality Check
