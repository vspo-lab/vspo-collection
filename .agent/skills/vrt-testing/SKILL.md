---
name: vrt-testing
description: Used when implementing VRT with Storybook + Playwright to detect UI regressions via snapshot diffs. Pin non-deterministic elements and operate with minimal mocking.
---

# Trigger Conditions

- When you want to verify visual regressions in the UI
- When adding or updating VRT for Storybook stories

# Execution Checklist

1. Review `docs/testing/vrt-testing.md`
2. Add VRT cases per story
3. Pin time, animations, and viewport
4. Update snapshots with an explanation of intent

# Reference Documents

- `docs/testing/vrt-testing.md`
- `docs/design/design-review.md`
