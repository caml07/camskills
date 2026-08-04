---
name: test-first
description: >-
  Test-Driven Development specifically for React Native + Expo with Vitest and
  @testing-library/react-native (RN/Expo mobile only; for generic/other-stack
  TDD use the 'tdd' skill). Write tests BEFORE functional code for every
  new feature, service, store, hook, screen, or validation schema. Covers Red-
  Green-Refactor cycle, mocking patterns, hook testing, navigation testing, and
  Zod validation. Trigger when the user asks to implement a feature, create a
  service, build a store, add a screen, or write validation — any prompt that
  implies new functional code without tests.
license: MIT
compatibility: opencode
---

# Test-First (TDD)

## The One Rule

> **No functional code without its test first.**

Every new feature starts with a failing test (RED), then the minimum implementation (GREEN), then refactor. This is not optional. It is the entire point of this skill.

### Why TDD?

Skipping tests saves time today but costs 10x tomorrow. TDD gives you:
- **Regression safety** — change code without fear of breaking things you forgot about
- **Better API design** — writing the test first forces you to think about the consumer's interface before you commit to an implementation
- **Documentation** — tests are executable specs that never go out of date
- **Confidence to refactor** — the green phase is safe because the red phase proved the test can fail

---

## Stack

```bash
npm install -D vitest @testing-library/react-native
# Optional but recommended:
npm install -D @testing-library/jest-native   # better matchers
```

## File Placement

Tests live next to the file they test (collocation). If you can't find a test file immediately next to its source, it doesn't exist.

```
src/
├── services/api.ts
├── services/api.test.ts              ← API tests
├── store/auth-store.ts
├── store/auth-store.test.ts           ← Store tests
├── hooks/use-auth.ts
├── hooks/use-auth.test.ts             ← Hook tests
├── components/atoms/button.tsx
├── components/atoms/button.test.tsx   ← UI tests
├── screens/login/login-screen.tsx
├── screens/login/login-screen.test.tsx ← Screen tests
└── utils/validation.ts
    └── utils/validation.test.ts        ← Validation tests
```

---

## TDD Flow

```
RED    → Write a test for the desired behavior. Run it. It FAILS (expected).
GREEN  → Write the MINIMUM code to make it pass. Run it. It PASSES.
REFACTOR → Improve the code. Tests guarantee nothing broke.
```

**Do not skip RED.** Writing the test second defeats the purpose — you'll write tests that pass against existing code rather than tests that specify desired behavior.

---

## Test Patterns

See `references/` for deeper patterns:
- `references/mocking-patterns.md` → MSW, network mocking, vi.mock
- `references/hook-testing.md` → renderHook, act, waitFor
- `references/navigation-testing.md` → navigation context mocks

## Resources

- `agents/test-writer.md` → subagent for writing tests
- `evals/evals.json` → test prompts for this skill itself
- `assets/vitest.config.ts` → configuration template

---

### Services (API layer)

Mock `fetch` or axios at the network level. Test success and error paths.

```typescript
import { describe, it, expect, vi } from "vitest"
import { api } from "./api"

describe("api.login", () => {
  it("returns token and user on valid credentials", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          token: "mock-token-abc",
          user: { id: "1", name: "Test" },
        }),
    })

    const res = await api.login({ email: "test@test.com", password: "123456" })
    expect(res.token).toContain("mock-token-")
    expect(res.user.name).toBe("Test")
  })

  it("throws on invalid credentials", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    })

    await expect(
      api.login({ email: "wrong@test.com", password: "wrong" })
    ).rejects.toThrow()
  })
})
```

### Stores (Zustand)

Reset store between tests with `beforeEach`. Mock the API layer, call the store action, assert state changed.

```typescript
import { describe, it, expect, beforeEach } from "vitest"
import { useAuthStore } from "./auth-store"

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  })

  it("sets isAuthenticated after successful login", async () => {
    await useAuthStore.getState().login({
      email: "test@test.com",
      password: "123456",
    })
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user).toBeTruthy()
  })

  it("clears state on logout", async () => {
    await useAuthStore.getState().login({
      email: "test@test.com",
      password: "123456",
    })
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })
})
```

### UI Components

Test what the user sees and interacts with. Test the disabled state, the loading state, the pressed callback.

```typescript
import { describe, it, expect, vi } from "vitest"
import { render, userEvent } from "@testing-library/react-native"
import { Button } from "./button"

describe("Button", () => {
  it("calls onPress when tapped", async () => {
    const onPress = vi.fn()
    const user = userEvent.setup()
    const { getByRole } = await render(
      <Button title="Submit" onPress={onPress} />
    )
    await user.press(getByRole("button"))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("does not call onPress when disabled", async () => {
    const onPress = vi.fn()
    const user = userEvent.setup()
    const { getByRole } = await render(
      <Button title="Submit" onPress={onPress} disabled />
    )
    await user.press(getByRole("button"))
    expect(onPress).not.toHaveBeenCalled()
  })
})
```

### Validation (Zod schemas)

Test valid and invalid inputs. Edge cases: empty strings, null, unexpected types.

```typescript
import { describe, it, expect } from "vitest"
import { loginSchema } from "./validation"

describe("loginSchema", () => {
  it("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "test@test.com",
      password: "123456",
    })
    expect(result.success).toBe(true)
  })

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "123456",
    })
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "test@test.com",
      password: "123",
    })
    expect(result.success).toBe(false)
  })
})
```

---

## Config Template

Copy `assets/vitest.config.ts` to the project root and adjust paths as needed.
