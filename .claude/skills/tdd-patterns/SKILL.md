---
name: tdd-patterns
description: TDD and refactoring patterns based on t-wada practices. Activate on test file edits or `/tdd`.
allowed-tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(go test:*), Bash(make test:*), Bash(make lint:*), Bash(pnpm test:*), Bash(pnpm type-check:*), Bash(pnpm build:*), Bash(docker compose:*)
---

# TDD Pattern Guidelines

Apply this skill when editing `**/*_test.go` files or when `/tdd` is explicitly requested.

## Common Testing Rules

- Use table-driven tests by default.
- Include normal, error, and boundary-value cases.

## Unit Tests by Layer

- Mock external inputs/outputs.
- Verify internal logic in isolation.
- Always include normal, error, and boundary-value cases.

## Integration Tests

- Emulate external inputs/outputs locally.
- Verify workflows and APIs in a connected state.
- Include normal, error, and boundary-value cases.

## t-wada Method

- Follow `Red -> Green -> Refactor`.
- Keep feedback cycles short and deterministic.

## Extract Pattern (Improve Existing Code)

Extract a pure function from hard-to-test existing code:

1. Identify the logic to test.
2. Parameterize external dependencies (I/O, time, random).
3. Extract a pure function.
4. Add unit tests.
5. Call the extracted function from the original code.

```go
// Before: hard to test
func ProcessOrder(orderID string) error {
    order := db.GetOrder(orderID)
    if time.Now().After(order.Deadline) {
        return errors.New("deadline exceeded")
    }
    // ...
}

// After: extract pure function
func IsDeadlineExceeded(deadline, now time.Time) bool {
    return now.After(deadline)
}
```

## Sprout Pattern (New Code)

For new code, write tests first:

1. **Red** - Write a failing test first.
2. **Green** - Implement the minimum code to pass.
3. **Refactor** - Improve code while keeping tests green.

## Table-Driven Test Template

```go
func TestXxx(t *testing.T) {
    t.Parallel()

    type fields struct {
        // dependencies under test
    }
    type args struct {
        // method arguments
    }
    type want struct {
        Got Xxx
        Err error
    }

    tests := []struct {
        name   string
        fields fields
        args   args
        want   want
    }{
        {
            name: "success case",
            // ...
        },
        {
            name: "error case",
            // ...
        },
    }

    for _, tt := range tests {
        tt := tt
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel()

            if diff := cmp.Diff(tt.want, got); diff != "" {
                t.Fatalf("mismatch (-want +got):\n%s", diff)
            }
        })
    }
}
```

## Diff Assertions

- Normal values: compare with `cmp.Diff(want, got)`.
- Errors only: use `cmpopts.AnyError`.
- Field-level ignore: use `cmpopts.IgnoreFields()`.

## Mocks

- Use `gomock` for interface mocking.
- Generate mocks under `internal/mock/`.
- Define setup per test case with a dedicated setup function.

## Priority Order (t-wada)

1. Version control: keep changes traceable in git.
2. Automation: maintain runnable quality gates such as `make lint && make test`.
3. Testing: raise coverage incrementally with useful tests.

## Reference

- `docs/common/RELIABLE_CODE_DESIGN.md`
