# Unit Testing Guide

This document covers the research findings and recommendations for optimal unit testing tools for the project.

## Quick Start

```bash
# Run tests
pnpm test

# Single run (for CI)
pnpm test:run

# With coverage
pnpm test:coverage
```

## Current State Analysis

### Project Status
- **Test files**: 23 files (354 tests)
- **Test framework**: Vitest v4.0.16
- **Test configuration file**: `vitest.config.ts`

### Key Components Under Test

```
services/server/
├── domain/           # Domain models and business logic (highest priority)
│   ├── user/         # User aggregate
│   ├── task/         # Task aggregate
│   ├── report/       # Report aggregate
│   └── billing/      # Subscription aggregate
├── usecase/          # Application use cases
├── pkg/              # Utility functions
└── infra/repository/ # Repository layer
```

### Technology Stack
- **Runtime**: Node.js (ES Modules)
- **Language**: TypeScript 5.8.3
- **Framework**: Hono
- **ORM**: Drizzle ORM
- **Error handling**: Result type (`@vspo/errors`)

---

## Test Framework Comparison

### 1. Vitest -- **Recommended**

| Criteria | Rating |
|----------|--------|
| ESM support | Excellent - Native |
| TypeScript support | Excellent - Zero config |
| Performance | Excellent - 10-20x faster than Jest (watch mode) |
| Hono integration | Excellent - Official support |
| Ease of configuration | Excellent - Zero config |
| Ecosystem | Good - Mature |

**Features:**
- Vite-based for fast startup and HMR
- Jest-compatible API (easy migration)
- Vitest 3.0 released January 2025 (7M+ weekly downloads)
- Test filtering by line number

**References:**
- [Vitest](https://vitest.dev/)
- [Vitest 3.0 Release Notes](https://vitest.dev/blog/vitest-3)
- [Migration Guide](https://vitest.dev/guide/migration.html)

---

### 2. Jest

| Criteria | Rating |
|----------|--------|
| ESM support | Fair - Experimental (complex configuration) |
| TypeScript support | Fair - Requires ts-jest |
| Performance | Fair - Slower than Vitest |
| Hono integration | Good - Possible |
| Ease of configuration | Fair - Extra config needed for ESM/TS |
| Ecosystem | Excellent - Most mature |

**Features:**
- Long-standing de facto standard
- Jest 30 released June 2025 (ESM improvements)
- Recommended if React Native is a must

**References:**
- [Jest](https://jestjs.io/)
- [Jest vs Vitest Comparison (Medium)](https://medium.com/@ruverd/jest-vs-vitest-which-test-runner-should-you-use-in-2025-5c85e4f2bda9)

---

### 3. Bun Test

| Criteria | Rating |
|----------|--------|
| ESM support | Excellent - Native |
| TypeScript support | Excellent - No transpilation needed |
| Performance | Excellent - Fastest (sync tests) |
| Hono integration | Good - Possible |
| Ease of configuration | Excellent - Zero config |
| Ecosystem | Fair - Still developing |

**Features:**
- 2x faster than Node.js (sync tests)
- Performance drops for async tests due to single-threaded nature
- Requires adopting the Bun runtime entirely

**References:**
- [Bun Test Runner](https://bun.sh/docs/cli/test)
- [Node vs Bun Test Runner](https://dev.to/boscodomingo/node-test-runner-vs-bun-test-runner-with-typescript-and-esm-44ih)

---

### 4. Node.js Native Test Runner

| Criteria | Rating |
|----------|--------|
| ESM support | Good - Supported |
| TypeScript support | Poor - Requires loader (tsx) |
| Performance | Good |
| Hono integration | Good - Possible |
| Ease of configuration | Fair - TypeScript config required |
| Ecosystem | Fair - Still developing |

**Features:**
- Zero dependencies (built into Node.js)
- No snapshot testing or timer mock support
- Best for simple projects

**References:**
- [Node.js Test Runner](https://nodejs.org/api/test.html)
- [Better Stack Comparison](https://betterstack.com/community/guides/testing/best-node-testing-libraries/)

---

## Recommendation: Vitest

### Selection Rationale

1. **Native ESM support**: The project uses `"type": "module"`
2. **TypeScript zero config**: No need for additional setup like ts-jest
3. **Official Hono support**: Test helpers and client provided
4. **Fast feedback**: Fast test execution in CI and during development
5. **Jest-compatible API**: Low learning curve

### Performance Comparison

| Benchmark | Vitest | Jest |
|-----------|--------|------|
| Cold start | 4x faster | Baseline |
| Watch mode | 10-20x faster | Baseline |
| Memory usage | 30% reduction | Baseline |

*Reference: [Vitest vs Jest (Better Stack)](https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/)*

---

## Installation Steps

### 1. Install Dependencies

```bash
# Run in the services/server directory
pnpm add -D vitest @vitest/coverage-v8
```

### 2. Create Vitest Configuration File

`services/server/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['domain/**', 'usecase/**', 'pkg/**'],
    },
  },
  resolve: {
    alias: {
      '@': '/services/server',
    },
  },
})
```

### 3. Add Scripts to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 4. TypeScript Configuration (Optional)

Add Vitest types to `services/server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

---

## Testing Strategy

### Table-driven Tests (Go-style)

This project adopts **Go-style table-driven tests**.

#### Basic Pattern

```typescript
import { describe, expect, it } from "vitest";

describe("functionName", () => {
  const testCases = [
    {
      name: "case 1 description",
      input: { /* input values */ },
      expected: { /* expected values */ },
    },
    {
      name: "case 2 description",
      input: { /* input values */ },
      expected: { /* expected values */ },
    },
  ];

  it.each(testCases)("$name", ({ input, expected }) => {
    const result = targetFunction(input);
    expect(result).toMatchObject(expected);
  });
});
```

#### Practical Example: User.new

```typescript
describe("User.new", () => {
  const testCases = [
    {
      name: "basic user creation",
      input: { name: "Taro Yamada", email: "yamada@example.com" },
      expected: {
        name: "Taro Yamada",
        email: "yamada@example.com",
        emailVerified: false,
        image: null,
      },
    },
    {
      name: "user creation with image",
      input: {
        name: "Hanako Sato",
        email: "sato@example.com",
        image: "https://example.com/avatar.png",
      },
      expected: {
        name: "Hanako Sato",
        email: "sato@example.com",
        image: "https://example.com/avatar.png",
      },
    },
  ];

  it.each(testCases)("$name", ({ input, expected }) => {
    const user = User.new(input);
    expect(user).toMatchObject(expected);
  });
});
```

#### Type Guard Tests

```typescript
describe("UserProfile.isAdmin", () => {
  const testCases = [
    {
      name: "returns true for admin profile",
      profile: adminProfile,
      expected: true,
    },
    {
      name: "returns false for regular user profile",
      profile: userProfile,
      expected: false,
    },
  ];

  it.each(testCases)("$name", ({ profile, expected }) => {
    expect(UserProfile.isAdmin(profile)).toBe(expected);
  });
});
```

### Benefits of Table-driven Tests

1. **Coverage**: Manage input patterns in a list, preventing omissions
2. **Readability**: Test cases are organized as data
3. **Maintainability**: Adding new cases is easy (just append to the array)
4. **Debugging**: `$name` makes it clear which case failed

### Domain Model Tests (Highest Priority)

The domain layer contains pure functions and deterministic logic, making it testable without mocks.

### Use Case Tests

Require mocking of repositories and transaction managers.

```typescript
// usecase/user.test.ts
import { describe, expect, it, vi } from "vitest";
import { createUser } from "./user";

describe("createUser", () => {
  const testCases = [
    {
      name: "successfully creates a user",
      mockReturn: { isOk: () => true },
      input: { name: "Test", email: "test@example.com" },
      expectedOk: true,
    },
    {
      name: "fails on repository error",
      mockReturn: { isOk: () => false, error: "DB_ERROR" },
      input: { name: "Test", email: "test@example.com" },
      expectedOk: false,
    },
  ];

  it.each(testCases)("$name", async ({ mockReturn, input, expectedOk }) => {
    const mockRepo = {
      save: vi.fn().mockResolvedValue(mockReturn),
    };

    const result = await createUser(mockRepo, input);

    expect(result.isOk()).toBe(expectedOk);
    expect(mockRepo.save).toHaveBeenCalledOnce();
  });
});
```

### Hono Endpoint Tests

Integration tests using Hono's `app.request()`.

```typescript
// infra/http/user.test.ts
import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("GET /api/users/:id", () => {
  const testCases = [
    {
      name: "retrieves an existing user",
      path: "/api/users/123",
      expectedStatus: 200,
    },
    {
      name: "returns 404 for non-existent user",
      path: "/api/users/999",
      expectedStatus: 404,
    },
  ];

  it.each(testCases)("$name", async ({ path, expectedStatus }) => {
    const res = await app.request(path);
    expect(res.status).toBe(expectedStatus);
  });
});
```

*Reference: [Hono Testing Guide](https://hono.dev/docs/guides/testing)*

---

## Database Testing Strategy

### Option 1: Repository Mocks (Recommended)

```typescript
const mockUserRepo = {
  findById: vi.fn(),
  save: vi.fn(),
}
```

**Pros**: Fast, no external dependencies, ideal for unit tests

### Option 2: PGlite (In-memory Postgres)

```typescript
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'

const client = new PGlite()
const db = drizzle(client)
```

**Pros**: Can test actual SQL
**Note**: Full compatibility is not guaranteed since the project uses MySQL

*Reference: [Drizzle + PGlite Testing](https://github.com/rphlmr/drizzle-vitest-pg)*

### Option 3: Testcontainers

```typescript
import { MySQLContainer } from '@testcontainers/mysql'

const container = await new MySQLContainer().start()
```

**Pros**: Production-equivalent MySQL environment
**Cons**: Requires Docker, slower test execution

---

## Proposed Directory Structure

```
services/server/
├── domain/
│   ├── user/
│   │   ├── user.ts
│   │   └── user.test.ts      # Co-location
│   └── task/
│       ├── task.ts
│       └── task.test.ts
├── usecase/
│   ├── user.ts
│   └── user.test.ts
├── vitest.config.ts
└── vitest.setup.ts            # Global setup
```

**Co-location approach**: Test files are placed in the same directory as source files

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm --filter server test:run
      - run: pnpm --filter server test:coverage
```

---

## References

### Official Documentation
- [Vitest](https://vitest.dev/)
- [Hono Testing Guide](https://hono.dev/docs/guides/testing)
- [Hono Testing Helper](https://hono.dev/docs/helpers/testing)

### Comparison Articles
- [Jest vs Vitest: Which Test Runner Should You Use in 2025?](https://medium.com/@ruverd/jest-vs-vitest-which-test-runner-should-you-use-in-2025-5c85e4f2bda9)
- [Vitest vs Jest | Better Stack](https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/)
- [Best Node.js Testing Libraries | Better Stack](https://betterstack.com/community/guides/testing/best-node-testing-libraries/)

### Drizzle ORM Testing
- [Drizzle + Vitest + PGlite Example](https://github.com/rphlmr/drizzle-vitest-pg)
- [NestJS + Drizzle Unit Tests](https://wanago.io/2024/09/23/api-nestjs-drizzle-orm-unit-tests/)

---

## Summary

| Aspect | Recommendation |
|--------|----------------|
| Framework | **Vitest** |
| Priority test target | Domain models (`domain/`) |
| Test placement | Co-location (same directory) |
| DB testing | Repository mocks |
| Coverage | v8 provider |

---

## Test Implementation Guide

### Layer-based Test Structure

Current tests are divided into the following layers:

```
services/server/
├── domain/                    # Domain model tests (172 tests)
│   ├── user/
│   │   ├── user.test.ts       # User aggregate
│   │   └── user-profile.test.ts
│   ├── task/
│   │   ├── task.test.ts
│   │   ├── task-status.test.ts
│   │   └── step.test.ts
│   ├── report/
│   │   ├── report.test.ts
│   │   └── report-item.test.ts
│   ├── billing/
│   │   └── subscription.test.ts
│   ├── highlight/
│   │   └── highlight.test.ts
│   ├── survey/
│   │   └── survey.test.ts
│   └── focused-topic.test.ts
├── usecase/                   # Use case tests (36 tests)
│   ├── user.test.ts
│   ├── highlight.test.ts
│   ├── survey.test.ts
│   └── focusedTopic.test.ts
├── pkg/                       # Utility tests (49 tests)
│   ├── date.test.ts
│   ├── uuid.test.ts
│   └── textNormalizer.test.ts
├── infra/
│   └── stripe/                # Infra layer tests (22 tests)
│       ├── stripe-service.test.ts
│       └── price-mapping.test.ts
└── test/
    └── integration/           # Integration tests (run separately)
        └── routes/

packages/errors/               # Error handling tests (75 tests)
├── result.test.ts
├── error.test.ts
└── code.test.ts
```

### Mock Patterns for UseCase Layer Tests

UseCase layer tests mock the Repository and TxManager.

#### 1. TxManager Mock

```typescript
import type { TxManager } from "../infra/repository/txManager";

const mockTxManager: TxManager = {
  runTx: vi.fn(async (operation) => operation({} as never)),
};
```

`runTx` executes a callback within a transaction. The mock invokes the callback immediately.

#### 2. Repository Mock

```typescript
import type { UserRepository } from "../infra/repository/user";

// Mock function type definitions
let getByIdMock: ReturnType<
  typeof vi.fn<(id: string) => Promise<Result<User, AppError>>>
>;
let updateMock: ReturnType<
  typeof vi.fn<(user: User) => Promise<Result<User, AppError>>>
>;

beforeEach(() => {
  getByIdMock = vi.fn();
  updateMock = vi.fn();

  const mockUserRepository: UserRepository = {
    from: () => ({
      getById: getByIdMock,
      getByEmail: vi.fn(),
      create: vi.fn(),
      update: updateMock,
      delete: vi.fn(),
    }),
  };
});
```

Since the `from()` pattern is used, the mock follows the same structure.

#### 3. Writing Test Cases

```typescript
describe("getById", () => {
  const testCases = [
    {
      name: "returns Ok when user is found",
      userId: "user-123",
      repoResult: () => Ok(createMockUser()),
      expectOk: true,
    },
    {
      name: "returns Err when user is not found",
      userId: "not-found",
      repoResult: () =>
        Err(new AppError({ message: "User not found", code: "NOT_FOUND" })),
      expectOk: false,
      expectedCode: "NOT_FOUND",
    },
  ];

  it.each(testCases)("$name", async ({
    userId,
    repoResult,
    expectOk,
    expectedCode,
  }) => {
    getByIdMock.mockResolvedValue(repoResult());

    const result = await useCase.getById({ userId });

    expect(getByIdMock).toHaveBeenCalledWith(userId);
    if (expectOk) {
      expect(result.err).toBeUndefined();
      expect(result.val).toBeDefined();
    } else {
      expect(result.err).toBeDefined();
      expect(result.err?.code).toBe(expectedCode);
    }
  });
});
```

**Key points:**
- Making `repoResult` a function ensures a new Result instance is created for each test case
- `expectedCode` is only set for error cases

### Mock Patterns for Infra Layer Tests

Mock patterns for external services (Stripe, etc.).

```typescript
const createMockStripe = () => ({
  customers: {
    create: vi.fn(),
    retrieve: vi.fn(),
  },
  checkout: {
    sessions: {
      create: vi.fn(),
    },
  },
  billingPortal: {
    sessions: {
      create: vi.fn(),
    },
  },
  webhooks: {
    constructEvent: vi.fn(),
  },
});

describe("StripeService", () => {
  describe("createCustomer", () => {
    const testCases = [
      {
        name: "can create a customer",
        input: { userId: "user-123", email: "test@example.com", name: "Test" },
        mockResult: { id: "cus_123", email: "test@example.com" },
        expectOk: true,
      },
      {
        name: "returns Err on Stripe API error",
        input: { userId: "user-123", email: "test@example.com", name: "Test" },
        mockError: new Error("Stripe API Error"),
        expectOk: false,
        expectedCode: "INTERNAL_SERVER_ERROR",
      },
    ];

    it.each(testCases)("$name", async ({
      input,
      mockResult,
      mockError,
      expectOk,
      expectedCode,
    }) => {
      const mockStripe = createMockStripe();
      if (mockResult) {
        mockStripe.customers.create.mockResolvedValue(mockResult);
      } else if (mockError) {
        mockStripe.customers.create.mockRejectedValue(mockError);
      }

      const service = createStripeService(mockStripe as never, "secret");
      const result = await service.createCustomer(input);

      if (expectOk) {
        expect(result.err).toBeUndefined();
      } else {
        expect(result.err?.code).toBe(expectedCode);
      }
    });
  });
});
```

### Test Helper Factories

Create factory functions for domain objects and reuse them.

```typescript
// Mock user factory
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  emailVerified: false,
  image: null,
  usage: {
    plan: "free",
    taskCount: 0,
    lastLoginAt: undefined,
    planExpiresAt: undefined,
  },
  settings: {
    theme: "system",
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    soundEnabled: true,
    language: "ja",
  },
  profile: {
    careerType: null,
    displayName: null,
    birthYear: null,
    graduationExpectedYear: null,
    simpleJobHuntingStatus: null,
    practiceGoals: [],
    onboardingCompleted: false,
    onboardingStep: 0,
  },
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  ...overrides,
});
```

### Testing Environment Variables

```typescript
describe("price-mapping", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      STRIPE_PRICE_LIGHT: "price_light_123",
      STRIPE_PRICE_STANDARD: "price_standard_456",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it.each(testCases)("$name", ({ priceId, expected }) => {
    expect(mapPriceIdToPlanType(priceId)).toBe(expected);
  });
});
```

### Test Naming Conventions

Write test case names descriptively in English:

```typescript
const testCases = [
  { name: "returns Ok when user is found", ... },
  { name: "returns Err when user is not found", ... },
  { name: "returns Err when update fails", ... },
  { name: "returns Err when survey is already answered", ... },
];
```

**Naming patterns:**
- Success cases: `"can ...", "returns ..."`
- Error cases: `"returns Err when ..."`
- Conditional: `"when ... then ..."`
