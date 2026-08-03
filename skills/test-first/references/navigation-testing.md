# Navigation Testing

## Mocking Navigation

Testing screens that use Expo Router navigation requires mocking the router.

### Basic navigation mock

```typescript
// setup file or test file
import { vi } from "vitest"

const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  replace: vi.fn(),
  canGoBack: vi.fn(),
}

vi.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Stack: {
    Screen: ({ children }: any) => children,
  },
  Tabs: ({ children }: any) => children,
}))

// In test, assert navigation:
it("navigates to profile on button press", async () => {
  const user = userEvent.setup()
  const { getByText } = await render(<HomeScreen />)
  await user.press(getByText("View Profile"))
  expect(mockRouter.push).toHaveBeenCalledWith("/profile")
})
```

### Mocking route params

```typescript
const mockParams = { id: "123" }

vi.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}))

it("uses route param to fetch data", async () => {
  const { result } = await renderHook(() => useProduct(), {
    wrapper: createWrapper(),
  })
  // The hook reads mockParams.id internally
  expect(mockParams.id).toBe("123")
})
```

### Mocking segments (for conditional layout)

```typescript
vi.mock("expo-router", () => ({
  useSegments: () => ["(auth)", "login"],
  useRouter: () => mockRouter,
}))

it("shows auth layout when user is not logged in", async () => {
  await render(<RootLayout />)
  // Component renders login screen based on segment
})
```

## Testing Navigation within components

If a component uses `useRouter()` internally:

```typescript
import { useRouter } from "expo-router"

function PatientCard({ id }: { id: string }) {
  const router = useRouter()
  return (
    <PressableScale onPress={() => router.push(`/patient/${id}`)}>
      <Text>View Patient</Text>
    </PressableScale>
  )
}
```

Test:

```typescript
const mockPush = vi.fn()

vi.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: vi.fn() }),
  useLocalSearchParams: () => ({}),
}))

it("navigates to patient detail on press", async () => {
  const user = userEvent.setup()
  const { getByText } = await render(<PatientCard id="42" />)
  await user.press(getByText("View Patient"))
  expect(mockPush).toHaveBeenCalledWith("/patient/42")
})
```

### Screen-level integration test

Test a screen that uses route params, fetches data, and navigates:

```typescript
import { render, userEvent, waitFor } from "@testing-library/react-native"
import PatientDetailScreen from "../screens/patient-detail-screen"

const mockPush = vi.fn()
const mockParams = { id: "1" }

vi.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: vi.fn() }),
  useLocalSearchParams: () => mockParams,
}))

vi.mock("../api/patients.api", () => ({
  fetchPatient: vi.fn().mockResolvedValue({
    id: "1",
    name: "John Doe",
    age: 45,
  }),
}))

it("loads patient and allows editing", async () => {
  const user = userEvent.setup()
  const { getByText } = await render(<PatientDetailScreen />)

  // Wait for data to load
  await waitFor(() => {
    expect(getByText("John Doe")).toBeTruthy()
  })

  // Navigate to edit
  await user.press(getByText("Edit"))
  expect(mockPush).toHaveBeenCalledWith("/patient/1/edit")
})
```

## Key Rules

1. Mock `expo-router` at the top of each test file (or globally in setup)
2. Use a fresh `mockRouter` object per test file (but can be reused within file)
3. Test both navigation trigger (the press) and navigation target (the route)
4. Mock `useLocalSearchParams` when the screen reads route params
5. Test the loading state before asserting the success content
