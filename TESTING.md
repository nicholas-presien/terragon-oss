# Testing Guide

This document explains how to run tests in the Terragon monorepo.

## Quick Start

```bash
# Run all tests for the main app
pnpm -C apps/www test

# Run all tests for the shared package
pnpm -C packages/shared test

# Run tests in watch mode
pnpm -C apps/www test --watch

# Run a specific test file
pnpm -C apps/www test src/lib/batch-threads.test.ts
```

## Prerequisites

### Docker Containers

Tests require Docker containers for PostgreSQL and Redis. These are automatically started when you run tests, but you can also start them manually:

```bash
# Start test containers
pnpm -C packages/dev-env docker-up-tests

# Stop test containers
pnpm -C packages/dev-env docker-down-tests
```

The test containers use these ports:

- PostgreSQL: `15432` (vs `5432` for dev)
- Redis: `16379` (vs `6379` for dev)
- Redis HTTP: `18079` (vs `8079` for dev)

### Environment Variables

Test environment variables are pre-configured in `vitest.config.ts` files. You don't need to set up a `.env.test` file.

Key test environment variables:

- `NODE_ENV=test` - Ensures test mode
- `DATABASE_URL` - Points to test PostgreSQL container
- `REDIS_URL` / `REDIS_TOKEN` - Points to test Redis container
- Various API keys are set to test placeholders

## Running Tests

### All Tests

```bash
# Run all app tests
pnpm -C apps/www test

# Run all shared package tests
pnpm -C packages/shared test

# Run all daemon tests
pnpm -C packages/daemon test

# Run all sandbox tests
pnpm -C packages/sandbox test
```

### Specific Test Files

```bash
# Run a specific test file
pnpm -C apps/www test src/app/api/proxy/anthropic/route.test.ts

# Run multiple specific test files
pnpm -C apps/www test src/lib/batch-threads.test.ts src/lib/redis.test.ts
```

### Filter by Test Name

```bash
# Run tests matching a pattern
pnpm -C apps/www test -t "authorizes requests"

# Run tests in a specific describe block
pnpm -C apps/www test -t "Anthropic proxy route"
```

### Watch Mode

```bash
# Run tests in watch mode (re-runs on file changes)
pnpm -C apps/www test --watch

# Watch a specific test file
pnpm -C apps/www test src/lib/batch-threads.test.ts --watch
```

### Coverage

```bash
# Run tests with coverage report
pnpm -C apps/www test --coverage

# View coverage in browser
pnpm -C apps/www test --coverage --ui
```

## Test Structure

### Test Files Location

- **App tests**: `apps/www/src/**/*.test.ts(x)`
- **Shared package tests**: `packages/shared/src/**/*.test.ts`
- **Daemon tests**: `packages/daemon/src/**/*.test.ts`
- **Sandbox tests**: `packages/sandbox/src/**/*.test.ts`

### Test Setup Files

- `apps/www/src/test-helpers/test-setup.ts` - Global mocks for Next.js, Vercel, GitHub, Stripe
- `apps/www/src/test-helpers/test-global-setup.ts` - Starts Docker containers before tests
- `packages/shared/src/test-global-setup.ts` - Database schema setup

## Common Test Patterns

### Database Tests

Tests that interact with the database automatically use the test database:

```typescript
import { db } from "@/lib/db";
import { createTestUser } from "@terragon/shared/model/test-helpers";

it("creates a user", async () => {
  const { user } = await createTestUser({ db });
  expect(user.id).toBeTruthy();
});
```

### API Route Tests

API route tests use mocked Next.js requests:

```typescript
import { NextRequest } from "next/server";
import { POST } from "./route";

it("handles POST requests", async () => {
  const request = new Request("http://localhost:3000/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test: "data" }),
  });

  const response = await POST(request as NextRequest, { params: {} });
  expect(response.status).toBe(200);
});
```

### Mocking External Services

Common mocks are already set up in `test-setup.ts`:

```typescript
// GitHub API is mocked
vi.mock("@/lib/github", () => ({
  getOctokitForUser: vi.fn(),
  getOctokitForApp: vi.fn(),
}));

// Stripe is mocked
vi.mock("stripe", () => ({
  /* ... */
}));

// Next.js functions are mocked
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
  headers: vi.fn(),
}));
```

## Troubleshooting

### Tests Fail with "ECONNREFUSED"

**Problem**: Tests can't connect to PostgreSQL or Redis containers.

**Solution**: Ensure Docker containers are running:

```bash
docker ps | grep terragon_postgres_test
docker ps | grep terragon_redis_test
```

If containers aren't running, start them:

```bash
pnpm -C packages/dev-env docker-up-tests
```

### Database Schema Errors

**Problem**: Tests fail with "relation does not exist" errors.

**Solution**: The database schema is automatically applied when tests start. If you see schema errors:

1. Check that `drizzle-kit push` completed successfully (look for test output)
2. Manually push the schema:
   ```bash
   pnpm -C packages/shared drizzle-kit-push-test
   ```

### NODE_ENV Issues

**Problem**: Tests behave differently than expected, or broadcast server starts when it shouldn't.

**Solution**: Ensure `NODE_ENV=test` is set. This is automatically handled by the test scripts, but if running vitest directly:

```bash
NODE_ENV=test npx vitest run
```

### Redis Race Conditions

**Problem**: Batch-threads tests are flaky.

**Solution**: These tests use HTTP-based Redis which has higher latency. The tests are designed to handle this, but if you see intermittent failures, run them in isolation:

```bash
pnpm -C apps/www test src/lib/batch-threads.test.ts
```

### Memory Issues

**Problem**: Tests fail with out-of-memory errors.

**Solution**:

1. Run tests in smaller batches
2. Increase Node.js memory limit:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm -C apps/www test
   ```

## Self-Hosted Mode

The codebase includes a self-hosted mode that removes Stripe subscriptions, Better Auth sessions, and GitHub OAuth. Tests are adapted to work in this mode:

- **Auth**: Uses `DEFAULT_USER_ID` instead of session-based auth
- **Credits**: Credit checks are removed from proxy routes
- **GitHub**: `getUserIdByGitHubAccountId` always returns `null`
- **Subscriptions**: All subscription-related functionality returns default values

## CI/CD

Tests run automatically in GitHub Actions on:

- Every pull request
- Every push to `main`

The CI pipeline:

1. Starts Docker containers
2. Runs database migrations
3. Runs all tests in parallel
4. Reports coverage

## Performance Tips

1. **Run tests in parallel**: Vitest runs tests in parallel by default
2. **Use `.only` during development**: Focus on specific tests
   ```typescript
   it.only("specific test", () => {
     /* ... */
   });
   ```
3. **Skip slow tests**: Use `.skip` for tests you don't need right now
   ```typescript
   it.skip("slow integration test", () => {
     /* ... */
   });
   ```
4. **Watch mode**: Use `--watch` to run only changed tests

## Writing New Tests

### Test File Naming

- Unit tests: `*.test.ts`
- Component tests: `*.test.tsx`
- Place test files next to the code they test

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from "vitest";

describe("MyComponent", () => {
  beforeEach(() => {
    // Setup before each test
  });

  it("should do something", () => {
    // Test implementation
    expect(result).toBe(expected);
  });

  it("should handle errors", () => {
    // Error case test
    expect(() => riskyFunction()).toThrow();
  });
});
```

### Best Practices

1. **Descriptive test names**: Use "should..." or action-based names
2. **One assertion per concept**: Keep tests focused
3. **Avoid test interdependence**: Each test should be independent
4. **Clean up resources**: Use `afterEach` or cleanup functions
5. **Mock external dependencies**: Don't make real API calls
6. **Test edge cases**: Empty inputs, null values, boundary conditions

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test Helper Functions](./packages/shared/src/model/test-helpers.ts)
