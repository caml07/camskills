# Mocking Patterns

## Network Mocking

### Approach 1: Mock fetch directly (simple)

Best for: single-file API modules, simple apps.

```typescript
global.fetch = vi.fn()

// Success
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: [...] }),
})

// Error
global.fetch = vi.fn().mockResolvedValue({
  ok: false,
  json: () => Promise.resolve({ message: "Server error" }),
})

// Network failure
global.fetch = vi.fn().mockRejectedValue(new Error("Network request failed"))
```

**Reset between tests:**
```typescript
beforeEach(() => {
  vi.restoreAllMocks()
})
```

### Approach 2: Mock the API module

Best for: multiple modules that call different API functions.

```typescript
import { api } from "./api"
import { useAuthStore } from "./auth-store"

vi.mock("./api", () => ({
  api: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

describe("authStore", () => {
  it("stores token on login", async () => {
    ;(api.login as Mock).mockResolvedValue({
      token: "mock-token",
      user: { id: "1" },
    })
    // ... test
  })
})
```

### Approach 3: MSW (Mock Service Worker)

Best for: integration tests, complex API interactions, testing loading states.

```bash
npm install -D msw
```

```typescript
// src/test/server.ts
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const body = await request.json()
    if (body.email === "test@test.com") {
      return HttpResponse.json({
        token: "mock-token",
        user: { id: "1", name: "Test" },
      })
    }
    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }),
]

export const server = setupServer(...handlers)

// setup file
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Module Mocking (vi.mock)

Mock entire modules for isolated component tests:

```typescript
// Mock a hook used internally by a component
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { name: "Test" },
    isAuthenticated: true,
    logout: vi.fn(),
  }),
}))

// Mock expo-router
vi.mock("expo-router", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  useLocalSearchParams: () => ({}),
}))
```

## Timer Mocking

For debounced inputs, timeout-based flows, or polling:

```typescript
vi.useFakeTimers()

// Advance time
vi.advanceTimersByTime(1000)

// Run all pending timers
vi.runAllTimers()

// Combine with async:
await vi.advanceTimersByTimeAsync(5000)

afterEach(() => {
  vi.useRealTimers()
})
```

## Key Rules

1. **Reset mocks between tests** — always. `beforeEach(() => vi.restoreAllMocks())`
2. **Mock the edge cases** — 401, 500, timeout, empty response
3. **Prefer MSW for integration tests** — it mocks at the network level, so your API module runs for real
4. **Prefer vi.mock for unit tests** — isolate the module under test
5. **Don't mock what you don't own** — mocking `fetch` is fine, mocking internals of a library you imported is brittle
