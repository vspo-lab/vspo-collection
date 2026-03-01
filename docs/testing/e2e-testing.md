# E2E Testing Implementation Policy

## Purpose

- Guarantee major user flows through production-equivalent execution paths
- Detect inconsistencies spanning screens, APIs, authentication, and DB at the final stage

## Scope

- Login, main creation flows, update/delete flows, permission controls
- Failure cases (insufficient permissions, validation failures, network errors)

## Implementation Rules

1. Use Playwright's Locator and Web-first assertions
2. Keep tests mutually independent (no shared state)
3. Reuse authentication via `storageState` to avoid duplicating login operations
4. Prepare test data via API to minimize UI operation prerequisites

## Mocking Policy

- Default: Do not mock (use real implementations for app internal paths)
- Exception: Fix only external dependencies (third-party APIs) using `page.route()`

## Test Case Granularity

Verify one observation point per test case.
When a test fails, you should be able to immediately identify "what broke."

### Good: One test, one observation point

```typescript
test("A new item can be created", async ({ page }) => {
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill("Test item");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Created successfully")).toBeVisible();
});

test("An error is displayed when the name is empty", async ({ page }) => {
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Name is required")).toBeVisible();
});
```

### Bad: Multiple observation points in one test

```typescript
// ❌ When it fails, it's unclear which observation point broke
test("Entire item creation flow", async ({ page }) => {
  // Check creation success
  await expect(page.getByText("Created successfully")).toBeVisible();
  // Also check validation error
  await expect(page.getByText("Name is required")).toBeVisible();
  // Also check it appears in the list
  await expect(page.getByText("Test item")).toBeVisible();
});
```

## Operational Practices to Reduce Failures

- Do not use retries as a stopgap; resolve the root cause (insufficient waiting, data races)
- Write test names as business scenarios (e.g., "A new order can be created")
- Maintain a focused set of key scenarios; supplement coverage with Unit/Integration/API tests

## Recommended File Structure

- `services/web/e2e/auth.setup.ts`
- `services/web/e2e/*.spec.ts`
- `services/web/playwright.config.ts`

## References (Primary Sources)

- Playwright Best Practices: https://playwright.dev/docs/best-practices
- Playwright Isolation: https://playwright.dev/docs/browser-contexts
- Playwright Authentication: https://playwright.dev/docs/auth
- Playwright API Testing: https://playwright.dev/docs/api-testing
