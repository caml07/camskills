# Hook Testing

## renderHook

Custom hooks need `renderHook` from `@testing-library/react-native`:

```typescript
import { renderHook, act, waitFor } from "@testing-library/react-native"
import { useAuth } from "./use-auth"
```

### Simple hook (no async)

```typescript
import { renderHook, act } from "@testing-library/react-native"
import { useCounter } from "./use-counter"

describe("useCounter", () => {
  it("starts at 0 by default", async () => {
    const { result } = await renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it("increments count", async () => {
    const { result } = await renderHook(() => useCounter())
    await act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
  })
})
```

### Hook with async operations (TanStack Query mocking)

```typescript
import { renderHook, waitFor } from "@testing-library/react-native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePatients } from "./use-patients"

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe("usePatients", () => {
  it("returns patients on success", async () => {
    // Mock the API call before rendering
    vi.mock("../api/patients.api", () => ({
      fetchPatients: vi.fn().mockResolvedValue([
        { id: "1", name: "Patient 1" },
        { id: "2", name: "Patient 2" },
      ]),
    }))

    const { result } = await renderHook(() => usePatients(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it("returns error on failure", async () => {
    vi.mock("../api/patients.api", () => ({
      fetchPatients: vi.fn().mockRejectedValue(new Error("API error")),
    }))

    const { result } = await renderHook(() => usePatients(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })
})
```

### Hook with Zustand store

```typescript
import { renderHook, act } from "@testing-library/react-native"
import { useCartStore } from "./cart-store"

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0 })
  })

  it("adds item to cart", async () => {
    const { result } = await renderHook(() => useCartStore())

    await act(() => {
      result.current.addItem({ id: "1", name: "Item", price: 10 })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.total).toBe(10)
  })
})
```

### Hook with async store action

```typescript
describe("authStore login via hook", () => {
  it("handles login success", async () => {
    const { result } = await renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login({
        email: "test@test.com",
        password: "123456",
      })
    })

    expect(result.current.isAuthenticated).toBe(true)
  })
})
```

## `act()` and `waitFor`

- **`act()`** — wraps state updates. Every `result.current.someSetter()` call needs `act`. In RNTL v14 `act` is async: always `await act(...)`.
- **`renderHook`** — async in RNTL v14: always `await renderHook(...)`.
- **`waitFor()`** — waits for async conditions. Use when the hook's state changes asynchronously (TanStack Query, API calls).
- **`findBy*` queries** — in component tests, these are async and wait for the element to appear. Equivalent to `waitFor` + `getBy`.

## Key Rules

1. Always wrap state-changing calls in `await act()`
2. `render`, `renderHook`, `fireEvent`, `userEvent`, and `act` are async in RNTL v14 — always `await` them
3. Use `waitFor` for async assertions, not arbitrary timeouts
4. Provide a `wrapper` option for hooks that need providers (QueryClient, Theme, Navigation)
5. Reset mocks and stores in `beforeEach`
6. Test the loading state too — not just success and error
