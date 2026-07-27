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
  it("starts at 0 by default", () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it("increments count", () => {
    const { result } = renderHook(() => useCounter())
    act(() => {
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

    const { result } = renderHook(() => usePatients(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
  })

  it("returns error on failure", async () => {
    vi.mock("../api/patients.api", () => ({
      fetchPatients: vi.fn().mockRejectedValue(new Error("API error")),
    }))

    const { result } = renderHook(() => usePatients(), {
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

  it("adds item to cart", () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
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
    const { result } = renderHook(() => useAuthStore())

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

- **`act()`** — wraps state updates. Every `result.current.someSetter()` call needs `act`.
- **`waitFor()`** — waits for async conditions. Use when the hook's state changes asynchronously (TanStack Query, API calls).
- **`findBy*` queries** — in component tests, these are async and wait for the element to appear. Equivalent to `waitFor` + `getBy`.

## Key Rules

1. Always wrap state-changing calls in `act()`
2. Use `waitFor` for async assertions, not arbitrary timeouts
3. Provide a `wrapper` option for hooks that need providers (QueryClient, Theme, Navigation)
4. Reset mocks and stores in `beforeEach`
5. Test the loading state too — not just success and error
