# t_wada-Style TDD Strategy

This document defines the minimal rules for practicing t_wada-based TDD in this template.

## Purpose

- Grow change-resilient code in small steps
- Add a regression-prevention test before fixing any bug
- Draw out design decisions at test-writing time, not after implementation

## Core Principles

- Run Red-Green-Refactor in short cycles
- Verify only one behavior per test
- Create a test list first and fix the implementation order
- In the Green step, add only the minimal implementation; defer generalization
- Refactor only when tests are passing

## Implementation Patterns

### Start with a Fake Implementation

- First reach Green with a fake implementation such as returning a constant
- Add the next case, confirm the fake breaks, then grow the real implementation

### Generalize via Triangulation

- Use two or more concrete examples to converge on a shared implementation
- Avoid abstracting too early

### Choose the Obvious Implementation

- When the implementation is sufficiently clear, write the real implementation directly
- However, never break the test-first rule

## Application Order in This Template

1. Domain models
2. Use cases
3. Hono endpoints
4. Critical frontend use cases

Use the table-driven tests from `docs/web-frontend/unit-testing.md` as the base pattern.

## How to Progress Through One Story

1. Pick the next item from the test list
2. Write a failing test (Red)
3. Make it pass with the minimal implementation (Green)
4. Remove duplication and improve naming (Refactor)
5. Add the next case for triangulation if needed

## Bug Fix Flow

1. Add a failing test that reproduces the bug first
2. Apply the minimal fix to make only that test pass
3. Add nearby cases to reduce regression risk

## Operational Checklist

- Are test names readable sentences that describe the specification?
- Is test data duplication organized with `it.each`?
- Are external dependencies mocked at the boundary while the domain is verified with real objects?
- Does the refactoring preserve existing behavior?

## References

- https://speakerdeck.com/twada/growing-reliable-code-php-conference-fukuoka-2025
