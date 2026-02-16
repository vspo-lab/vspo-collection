# API Testing Strategy

## Overview

This document covers tool selection and implementation guidelines for API integration testing in this project.

**Note**: This project uses `@hono/zod-openapi` and automatically generates an **OpenAPI 3.1 specification** at the `/doc` endpoint. This provides excellent compatibility with OpenAPI-based testing tools.

## Tool Selection

### Recommended Stack

| Category | Tool | Reason |
|----------|------|--------|
| **Test framework** | Vitest | Native ESM and TypeScript support, fast |
| **API test client** | Hono testClient | Type-safe, Hono-native, IDE autocomplete |
| **OpenAPI contract testing** | Schemathesis | Auto-generates tests from OpenAPI spec, detects edge cases |
| **Mocking** | Vitest built-in | vi.mock, vi.fn are sufficient |
| **Coverage** | v8 (Vitest built-in) | No additional configuration needed |

---

## OpenAPI-based Testing Tool Comparison

Since this project exposes an OpenAPI spec at `/doc`, the following tools are available.

### Tool List

| Tool | Features | Language | CI Integration | Recommendation |
|------|----------|----------|----------------|----------------|
| **Schemathesis** | Property-based testing, automatic edge case detection | Python | Excellent | ★★★ |
| **Dredd** | Validates consistency with OpenAPI spec | Node.js | Excellent | ★★☆ |
| **Prism** | Mock server generation + validation proxy | Node.js | Good | ★★☆ |
| **Step CI** | YAML-based test definitions | Node.js | Excellent | ★★☆ |
| **Bruno** | Git-friendly API client | Electron | Good | ★☆☆ |
| **Hoppscotch** | OSS API client + CLI | Node.js | Good | ★☆☆ |

### Schemathesis (Recommended)

A property-based testing tool that **automatically generates thousands of test cases** from an OpenAPI spec.

**Pros**:
- Auto-generates tests from OpenAPI spec (no manual tests needed)
- Automatically detects edge cases and validation bugs
- Typically finds 5-15 issues on first run
- Used by Spotify, JetBrains, Red Hat, and others
- Easy GitHub Actions integration

**Cons**:
- Requires Python (additional dependency for Node.js projects)
- Endpoints requiring authentication need configuration

```bash
# Install
pip install schemathesis

# Basic execution
schemathesis run http://localhost:8787/doc

# With authentication
schemathesis run http://localhost:8787/doc \
  --header "Authorization: Bearer $TOKEN"
```

### Dredd

A contract testing tool that **validates consistency** between the OpenAPI spec and actual API responses.

**Pros**:
- Node.js native (no additional runtime needed)
- Prevents drift between documentation and implementation
- Easy CI/CD integration

**Cons**:
- Complex authentication and dynamic data require hooks
- Tests are insufficient if the spec is incomplete

```bash
# Install
pnpm add -D dredd

# Run
dredd http://localhost:8787/doc http://localhost:8787
```

### Prism

**Generates a mock server** from the OpenAPI spec and acts as a validation proxy.

**Pros**:
- Useful as a mock server during frontend development
- Detects contract violations with the `--errors` flag

**Cons**:
- More of a development support tool than a test runner

```bash
# Start mock server
prism mock http://localhost:8787/doc

# Validation proxy
prism proxy http://localhost:8787/doc http://localhost:8787 --errors
```

### Step CI

A lightweight framework for defining test scenarios in **YAML**.

**Pros**:
- Declarative test definitions in YAML
- Can import from OpenAPI
- Easy CI/CD integration

**Cons**:
- Test cases must be defined manually

```yaml
# stepci.yml
version: "1.1"
env:
  baseUrl: http://localhost:8787

tests:
  health:
    steps:
      - name: Health check
        http:
          url: ${{ env.baseUrl }}/health
          method: GET
          check:
            status: 200
```

### Bruno / Hoppscotch

Git-friendly **API clients** with CLI test execution.

**Features**:
- OSS alternative to Postman/Insomnia
- Collections managed as files (Git-compatible)
- Test automation via CLI

**Best suited for**:
- Teams primarily doing manual API testing with some automation
- Migration from Postman

---

### Candidate Comparison

#### Test Framework: Vitest vs Jest

| Criteria | Vitest | Jest |
|----------|--------|------|
| **ESM support** | Native | Experimental, requires configuration |
| **TypeScript** | Native | Requires ts-jest |
| **Performance** | Fast (uses HMR) | Relatively slow |
| **Configuration** | Minimal | Requires babel, ts-jest, etc. |
| **Memory usage** | ~30% reduction | Issues at scale |
| **Jest compatibility** | 95% compatible | - |

**Conclusion**: Since this project uses ESM + TypeScript, **Vitest is adopted**.

#### API Test Client: testClient vs Supertest

| Criteria | Hono testClient | Supertest |
|----------|-----------------|-----------|
| **Type safety** | Full type inference | None |
| **IDE autocomplete** | Route autocompletion | None |
| **Framework** | Hono-specific | General-purpose (Express, etc.) |
| **Server startup** | Not required (direct testing) | Auto-binds |
| **Learning curve** | Low (for Hono users) | Low |

**Conclusion**: Since the project uses Hono, the type-safe **testClient is adopted**.

## Vitest + testClient Integration Test Design

A concrete integration test design based on this project's structure.

### Design Principles

- **Use a real DB**: Use the MySQL instance started by `pnpm dev` as-is
- **Mock only external services**: Only mock external APIs, email delivery, notification services, etc.
- **Mock authentication**: Inject test users directly

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Test Layer                             │
├─────────────────────────────────────────────────────────────┤
│  testClient(app) ──▶ Routes ──▶ UseCase ──▶ Repository     │
│       ↑                 ↑          ↑           ↑            │
│   Type-safe        Auth mock   Real Container  Real DB      │
│                                     ↓                       │
│                      Only external services are mocked      │
│                    (ExternalAPI, TokenService, Email, etc.)  │
└─────────────────────────────────────────────────────────────┘
```

### External Services to Mock

| Service | File | Purpose |
|---------|------|---------|
| `ExternalAPIClient` | `infra/external/apiClient.ts` | Communication with external APIs |
| `TokenService` | `infra/auth/tokenService.ts` | Auth token issuance |
| `NotificationService` | `infra/notification/notificationService.ts` | Notification delivery |
| `FileStorageService` | `infra/storage/fileStorageService.ts` | File storage operations |
| `EmailService` | `infra/email/emailService.ts` | Email delivery |

---

## Setup Procedure

### 1. Install Dependencies

```bash
pnpm add -D vitest @vitest/coverage-v8 --filter server
```

### 2. Create Vitest Configuration File

`services/server/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['domain/**', 'usecase/**', 'infra/**'],
      exclude: ['**/*.test.ts', '**/node_modules/**'],
    },
    setupFiles: ['./test/setup.ts'],
    testTimeout: 30000, // Longer timeout for DB operations
    // Run tests serially (to avoid DB state conflicts)
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
})
```

### 3. Test Setup File

`services/server/test/setup.ts`:

```typescript
import { beforeAll, afterAll, afterEach, vi } from 'vitest'
import { getDb } from '../infra/repository/mysql/db'

// Environment variables (expected to load from .env.local, but can also be set explicitly)
beforeAll(() => {
  process.env.NODE_ENV = 'test'
})

// Reset mocks after each test
afterEach(() => {
  vi.restoreAllMocks()
})

// Close DB connection after all tests
afterAll(async () => {
  const dbResult = await getDb()
  if (!dbResult.err) {
    // Close Drizzle connection pool (as needed)
  }
})
```

### 4. Add package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Test Helper Design

### Directory Structure

```
services/server/
├── test/
│   ├── setup.ts                 # Global setup
│   ├── helpers/
│   │   ├── createTestApp.ts     # Test app factory
│   │   ├── createTestContainer.ts # Container with AI mocks
│   │   ├── mockExternal.ts      # External service mocks
│   │   ├── testDb.ts            # DB utilities
│   │   └── testUser.ts          # Test user creation
│   └── integration/
│       └── routes/
│           ├── user.test.ts
│           ├── task.test.ts
│           └── survey.test.ts
```

### External Service Mocks

`services/server/test/helpers/mockExternal.ts`:

```typescript
import { vi } from 'vitest'
import { Ok } from '@vspo/errors'
import type { ExternalAPIClient } from '../../infra/external/apiClient'
import type { TokenService } from '../../infra/auth/tokenService'

/**
 * Mock for ExternalAPIClient
 */
export const createMockExternalAPIClient = (): ExternalAPIClient => ({
  fetch: vi.fn().mockResolvedValue(
    Ok({
      data: { id: 'item-123', status: 'success' },
      metadata: { processedAt: new Date().toISOString() },
    })
  ),
  post: vi.fn().mockResolvedValue(
    Ok({
      id: 'created-123',
      status: 'created',
    })
  ),
})

/**
 * Mock for TokenService
 */
export const createMockTokenService = (): typeof TokenService => ({
  createToken: vi.fn().mockResolvedValue(Ok('mock-token-xxx')),
  verifyToken: vi.fn().mockResolvedValue(Ok({ userId: 'user-123', valid: true })),
})

/**
 * Mock for NotificationService
 */
export const createMockNotificationService = () => ({
  send: vi.fn().mockResolvedValue(Ok({ sent: true, messageId: 'msg-123' })),
})

/**
 * Mock for EmailService
 */
export const createMockEmailService = () => ({
  send: vi.fn().mockImplementation(async (to: string, subject: string) => Ok({ sent: true })),
})
```

### Test Container Factory

`services/server/test/helpers/createTestContainer.ts`:

```typescript
import Stripe from 'stripe'
import { vi } from 'vitest'
import type { Container } from '../../infra/di/container'
import { BillingUseCase } from '../../usecase/billing'
import { TaskUseCase } from '../../usecase/task'
import { ReportUseCase } from '../../usecase/report'
import { UserUseCase } from '../../usecase/user'
// ... other UseCases

// Import actual Repositories
import { BillingRepository } from '../../infra/repository/billing'
import { TaskRepository } from '../../infra/repository/task'
import { ReportRepository } from '../../infra/repository/report'
import { UserRepository } from '../../infra/repository/user'
import { TxManager } from '../../infra/repository/txManager'
// ... other Repositories

import {
  createMockExternalAPIClient,
  createMockTokenService,
  createMockNotificationService,
  createMockEmailService,
} from './mockExternal'

/**
 * Create a test Container
 * - Repository: Real (connected to real DB)
 * - External services: Mocked
 * - Stripe: Mocked
 */
export const createTestContainer = (): Container => {
  // Mock external services
  const externalAPIClient = createMockExternalAPIClient()
  const tokenService = createMockTokenService()
  const notificationService = createMockNotificationService()
  const emailService = createMockEmailService()

  // Mock Stripe
  const mockStripe = {
    customers: { create: vi.fn(), retrieve: vi.fn() },
    subscriptions: { create: vi.fn(), retrieve: vi.fn() },
    checkout: { sessions: { create: vi.fn() } },
  } as unknown as Stripe

  const stripeService = {
    createCheckoutSession: vi.fn().mockResolvedValue(Ok({ url: 'https://checkout.stripe.com/test' })),
    handleWebhook: vi.fn(),
  }

  // Actual Repositories (connected to real DB)
  const txManager = TxManager
  const userRepository = UserRepository
  const taskRepository = TaskRepository
  const reportRepository = ReportRepository
  const billingRepository = BillingRepository
  // ... other Repositories

  // Assemble UseCases (external services are mocked, Repositories are real)
  const userUseCase = UserUseCase.from({ userRepository, txManager })

  const taskUseCase = TaskUseCase.from({
    taskRepository,
    reportRepository,
    userRepository,
    txManager,
    // ... other dependencies
  })

  const reportUseCase = ReportUseCase.from({
    reportRepository,
    taskRepository,
    txManager,
  })

  // ... other UseCases

  return {
    userUseCase,
    taskUseCase,
    reportUseCase,
    tokenService,             // <- Mocked
    notificationService,      // <- Mocked
    stripeService,            // <- Mocked
    // ... others
  } as Container
}
```

### Test App Factory

`services/server/test/helpers/createTestApp.ts`:

```typescript
import { OpenAPIHono } from '@hono/zod-openapi'
import { contextStorage } from 'hono/context-storage'
import type { MiddlewareHandler } from 'hono'
import type { HonoEnv } from '../../infra/http/hono/env'
import type { Container } from '../../infra/di/container'
import { handleError, handleZodError } from '../../infra/http/hono/error'
import { registerRoutes } from '../../infra/http/hono/routes'

export type TestAppOptions = {
  container: Container
  userId: string
  user?: {
    id: string
    email: string
    name: string
  }
}

/**
 * Create a Hono app for testing
 * - Injects a real Container (only AI is mocked)
 * - Bypasses authentication and injects a test user
 */
export const createTestApp = (options: TestAppOptions) => {
  const app = new OpenAPIHono<HonoEnv>({
    defaultHook: handleZodError,
  })

  app.use(contextStorage())
  app.onError(handleError)

  // Test middleware
  const testMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
    c.set('container', options.container)
    c.set('requestId', `test-${Date.now()}`)
    c.set('userId', options.userId)
    c.set('user', options.user ?? {
      id: options.userId,
      email: 'test@example.com',
      name: 'Test User',
    })
    c.set('session', {
      id: 'test-session',
      userId: options.userId,
      expiresAt: new Date(Date.now() + 86400000),
    })
    await next()
  }

  app.use('*', testMiddleware)

  // Register all routes
  return registerRoutes(app)
}
```

### DB Utilities

`services/server/test/helpers/testDb.ts`:

```typescript
import { getDb } from '../../infra/repository/mysql/db'
import { users, tasks, reports } from '../../infra/repository/mysql/schema'
import { eq } from 'drizzle-orm'

/**
 * Create a test user
 */
export const createTestUser = async (data: {
  id: string
  email: string
  name: string
}) => {
  const dbResult = await getDb()
  if (dbResult.err) throw dbResult.err

  const db = dbResult.val
  await db.insert(users).values({
    id: data.id,
    email: data.email,
    name: data.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return data
}

/**
 * Clean up test data
 */
export const cleanupTestData = async (userId: string) => {
  const dbResult = await getDb()
  if (dbResult.err) throw dbResult.err

  const db = dbResult.val

  // Delete related data (mind foreign key constraint order)
  await db.delete(reports).where(eq(reports.userId, userId))
  await db.delete(tasks).where(eq(tasks.userId, userId))
  await db.delete(users).where(eq(users.id, userId))
}

/**
 * Run a test within a transaction (auto-rollback)
 */
export const withTestTransaction = async <T>(
  fn: (tx: typeof db) => Promise<T>
): Promise<T> => {
  const dbResult = await getDb()
  if (dbResult.err) throw dbResult.err

  const db = dbResult.val

  return db.transaction(async (tx) => {
    const result = await fn(tx)
    // Always rollback after the test
    throw new RollbackError(result)
  }).catch((e) => {
    if (e instanceof RollbackError) {
      return e.result
    }
    throw e
  })
}

class RollbackError<T> extends Error {
  constructor(public result: T) {
    super('Rollback')
  }
}
```

---

## Test Implementation Examples

### User API Test (Real DB)

`services/server/test/integration/routes/user.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { testClient } from 'hono/testing'
import { createTestApp } from '../../helpers/createTestApp'
import { createTestContainer } from '../../helpers/createTestContainer'
import { createTestUser, cleanupTestData } from '../../helpers/testDb'

describe('User API', () => {
  const TEST_USER_ID = `test-user-${Date.now()}`
  const container = createTestContainer()

  const app = createTestApp({
    container,
    userId: TEST_USER_ID,
  })

  const client = testClient(app)

  // Create a test user
  beforeAll(async () => {
    await createTestUser({
      id: TEST_USER_ID,
      email: 'integration-test@example.com',
      name: 'Integration Test User',
    })
  })

  // Clean up after tests
  afterAll(async () => {
    await cleanupTestData(TEST_USER_ID)
  })

  describe('GET /me', () => {
    it('should retrieve user information', async () => {
      const res = await client.me.$get()

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.id).toBe(TEST_USER_ID)
      expect(data.email).toBe('integration-test@example.com')
    })
  })

  describe('PUT /me', () => {
    it('should update user information', async () => {
      const res = await client.me.$put({
        json: {
          name: 'Updated Name',
          targetPosition: 'Tech Lead',
        },
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.name).toBe('Updated Name')

      // Verify it was persisted to the DB
      const getRes = await client.me.$get()
      const getData = await getRes.json()
      expect(getData.name).toBe('Updated Name')
    })
  })
})
```

### Task API Test (External Service Mocks)

```typescript
// services/server/test/integration/routes/task.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { testClient } from 'hono/testing'
import { createTestApp } from '../../helpers/createTestApp'
import { createTestContainer } from '../../helpers/createTestContainer'
import { createTestUser, cleanupTestData } from '../../helpers/testDb'

describe('Task API', () => {
  const TEST_USER_ID = `test-task-${Date.now()}`
  const container = createTestContainer()

  const app = createTestApp({
    container,
    userId: TEST_USER_ID,
  })

  const client = testClient(app)

  beforeAll(async () => {
    await createTestUser({
      id: TEST_USER_ID,
      email: 'task-test@example.com',
      name: 'Task Test User',
    })
  })

  afterAll(async () => {
    await cleanupTestData(TEST_USER_ID)
  })

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const res = await client['tasks'].$post({
        json: {
          title: 'Test Task',
          description: 'Test Description',
        },
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.id).toBeDefined()
      expect(data.status).toBe('pending')
    })
  })

  describe('POST /tasks/:id/complete', () => {
    it('should generate a report when a task is completed (external services are mocked)', async () => {
      // Create a task
      const createRes = await client['tasks'].$post({
        json: {
          title: 'Test Task',
          description: 'Test Description',
        },
      })
      const task = await createRes.json()

      // Complete the task
      const completeRes = await client['tasks'][':id'].complete.$post({
        param: { id: task.id },
        json: {
          steps: [
            { action: 'step1', result: 'completed' },
            { action: 'step2', result: 'completed' },
          ],
        },
      })

      expect(completeRes.status).toBe(200)
      const result = await completeRes.json()

      // Report was generated (response from mock)
      expect(result.report).toBeDefined()
      expect(result.report.status).toBe('completed')
    })
  })
})
```

### Test with Transaction Rollback

```typescript
import { describe, it, expect } from 'vitest'
import { withTestTransaction } from '../../helpers/testDb'

describe('Survey API with Transaction Rollback', () => {
  it('should test survey submission (auto-rollback)', async () => {
    await withTestTransaction(async (tx) => {
      // DB operations within this transaction
      // are automatically rolled back after the test

      // Create test data
      await tx.insert(users).values({ ... })

      // API test
      // ...

      // Assertions
      expect(...).toBe(...)
    })
    // Rolled back at this point
  })
})
```

---

## GitHub Actions Configuration (Real DB)

`.github/workflows/api-test.yml`:

```yaml
name: API Integration Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: my_app_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping -proot"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run database migrations
        run: pnpm --filter server db:migrate
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/my_app_test

      - name: Run API tests
        run: pnpm --filter server test:run
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/my_app_test
          NODE_ENV: test
          # AI service API keys are not needed (mocked)

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: always()
        with:
          files: ./services/server/coverage/coverage-final.json
```

## GitHub Actions Configuration

### Basic CI Workflow

`.github/workflows/api-test.yml`:

```yaml
name: API Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping -proot"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run database migrations
        run: pnpm --filter server db:migrate
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/test_db

      - name: Run API tests
        run: pnpm --filter server test:run
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/test_db
          NODE_ENV: test

      - name: Upload coverage report
        uses: codecov/codecov-action@v4
        if: always()
        with:
          files: ./services/server/coverage/coverage-final.json
          fail_ci_if_error: false
```

### Workflow with Coverage Report

```yaml
name: API Tests with Coverage

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping -proot"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run database migrations
        run: pnpm --filter server db:migrate
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/test_db

      - name: Run tests with coverage
        run: pnpm --filter server test:coverage
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/test_db
          NODE_ENV: test

      - name: Comment coverage on PR
        uses: davelosert/vitest-coverage-report-action@v2
        if: github.event_name == 'pull_request'
        with:
          working-directory: ./services/server
```

## Test Classification and Recommended Structure

### Test Types

| Type | Target | Environment | Frequency |
|------|--------|-------------|-----------|
| **Unit** | Domain, UseCase | Mocked | Per PR |
| **Integration** | API Routes + DB | Real DB (test) | Per PR |
| **E2E** | Full flow | Production-like environment | Pre-deploy |

### Proposed Directory Structure

```
services/server/
├── test/
│   ├── setup.ts           # Test setup
│   ├── helpers/           # Test helpers
│   │   ├── db.ts         # DB test utilities
│   │   └── auth.ts       # Auth mocks
│   └── fixtures/          # Test data
│       └── users.ts
├── domain/
│   └── user/
│       └── user.test.ts   # Domain tests
├── usecase/
│   └── user.test.ts       # Use case tests
└── infra/
    └── http/
        └── routes/
            └── user.test.ts  # API tests
```

## External Service Mock Strategy

### External API Services

```typescript
// test/helpers/external-mock.ts
import { vi } from 'vitest'

export const mockExternalServices = () => {
  return {
    externalAPIClient: {
      fetch: vi.fn().mockResolvedValue(
        Ok({ data: { id: 'item-123' }, status: 'success' })
      ),
    },
    notificationService: {
      send: vi.fn().mockResolvedValue(
        Ok({ sent: true, messageId: 'msg-123' })
      ),
    },
  }
}
```

### Stripe

```typescript
// test/helpers/stripe-mock.ts
import { vi } from 'vitest'

export const mockStripe = () => {
  return {
    customers: {
      create: vi.fn().mockResolvedValue({ id: 'cus_test123' }),
    },
    subscriptions: {
      create: vi.fn().mockResolvedValue({ id: 'sub_test123', status: 'active' }),
    },
  }
}
```

## Testing Patterns with Result Type

Since this project uses the `Result` type, tests must handle it accordingly.

```typescript
import { Ok, Err, isOk, isErr } from '@vspo/errors'

describe('UserUseCase', () => {
  it('should return Ok on successful user creation', async () => {
    const result = await userUseCase.createUser({ email: 'test@example.com' })

    expect(isOk(result)).toBe(true)
    if (isOk(result)) {
      expect(result.val.email).toBe('test@example.com')
    }
  })

  it('should return Err on duplicate email', async () => {
    const result = await userUseCase.createUser({ email: 'duplicate@example.com' })

    expect(isErr(result)).toBe(true)
    if (isErr(result)) {
      expect(result.err.code).toBe('DUPLICATE_EMAIL')
    }
  })
})
```

## GitHub Actions: OpenAPI Contract Tests

### Automated Testing with Schemathesis

`.github/workflows/openapi-test.yml`:

```yaml
name: OpenAPI Contract Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  schemathesis:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping -proot"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install Schemathesis
        run: pip install schemathesis

      - name: Install dependencies
        run: pnpm install

      - name: Run database migrations
        run: pnpm --filter server db:migrate
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/test_db

      - name: Start API server
        run: |
          pnpm --filter server dev &
          sleep 5  # Wait for server startup
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/test_db

      - name: Run Schemathesis tests
        run: |
          schemathesis run http://localhost:8787/doc \
            --checks all \
            --hypothesis-max-examples 50 \
            --report
        continue-on-error: true

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: schemathesis-report
          path: .schemathesis/
```

### Declarative Testing with Step CI

`.github/workflows/stepci-test.yml`:

```yaml
name: Step CI API Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  stepci:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping -proot"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run database migrations
        run: pnpm --filter server db:migrate
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/test_db

      - name: Start API server
        run: |
          pnpm --filter server dev &
          sleep 5
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/test_db

      - name: Run Step CI tests
        run: npx stepci run stepci.yml
```

---

## Recommended Testing Strategy

### Suggested Combination

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | Vitest | Unit tests for domain logic and use cases |
| **Integration** | Vitest + testClient | Integration tests for API routes (with DI mocks) |
| **Contract** | Schemathesis | OpenAPI spec consistency and edge case detection |
| **E2E** | Step CI / Bruno | Scenario-based integration tests |

### Phased Adoption Recommendation

1. **Phase 1**: Build basic API tests with Vitest + testClient
2. **Phase 2**: Add Schemathesis to CI for automatic OpenAPI consistency verification
3. **Phase 3**: Add scenario tests with Step CI as needed

---

## References

### Official Documentation

- [Vitest](https://vitest.dev/)
- [Hono Testing Guide](https://hono.dev/docs/guides/testing)
- [Hono Testing Helper](https://hono.dev/docs/helpers/testing)
- [Schemathesis](https://schemathesis.io/)
- [Step CI](https://stepci.com/)
- [Bruno](https://www.usebruno.com/)
- [Hoppscotch](https://hoppscotch.io/)
- [Dredd](https://dredd.org/)
- [Prism](https://stoplight.io/open-source/prism)

### Comparison and Reference Articles

- [Jest vs Vitest: Which Test Runner Should You Use in 2025?](https://medium.com/@ruverd/jest-vs-vitest-which-test-runner-should-you-use-in-2025-5c85e4f2bda9)
- [Vitest vs Jest Comparison](https://vitest.dev/guide/comparisons)
- [OpenAPI Testing and Validation](https://openapispec.com/docs/testing-and-validation/)
- [Automated Contract Testing with OpenAPI and Dredd](https://dev.to/r3d_cr0wn/enforcing-api-correctness-automated-contract-testing-with-openapi-and-dredd-2212)
- [Step CI: Automate API Testing](https://garysvenson09.medium.com/step-ci-automate-api-testing-7edebe796be7)
- [GitHub Actions MySQL Testing](https://blogs.oracle.com/mysql/running-mysql-tests-with-github-actions)
