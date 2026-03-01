# VRT (Visual Regression Testing) Implementation Policy

## Purpose

- Detect visual regressions in the UI through diff comparison
- Enable determination of whether design changes are intentional at the component level

## Scope

- `services/web/vrt/storybook.spec.ts`
- Storybook stories (design system, major UI)

## Implementation Rules

1. Treat each Storybook story as one VRT case
2. Compare diffs using Playwright's `toHaveScreenshot()`
3. Eliminate non-determinism by fixing viewport, fonts, time, and animations
4. Run snapshot updates only in "spec change PRs"

## Mocking Policy

- Default: Do not mock
- Exception: Use MSW to return fixed responses only when a story has external API dependencies
- Purpose: Stabilize regression detection for layout, colors, and typography

## Operational Rules

- When updating baselines, describe the "intent of the diff" in the PR
- When changes are significant, check the impact on UI/E2E as well, not just VRT

## Execution Commands

- `pnpm --filter web vrt`
- Update: `pnpm --filter web vrt:update`

## References (Primary Sources)

- Playwright Visual Comparisons: https://playwright.dev/docs/test-snapshots
- Storybook Visual Testing: https://storybook.js.org/docs/writing-tests/visual-testing
