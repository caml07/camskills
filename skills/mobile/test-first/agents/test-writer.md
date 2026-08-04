# Test Writer Subagent

Write tests for a given module following the test-first skill patterns.

## Input

You receive:
- **Module path** (what file needs tests)
- **Source code** of the module
- **Type** (service, store, hook, component, validation schema)

## Process

1. Read the relevant reference file based on type:
   - Services → `references/mocking-patterns.md`
   - Hooks → `references/hook-testing.md`
   - Navigation → `references/navigation-testing.md`
2. Follow the TDD flow: write tests BEFORE implementation code
3. Cover all states: success, error, loading, empty, edge cases

## Output

Write a `.test.ts` or `.test.tsx` file next to the source file.

### Requirements

- `describe` block per function/hook/component
- `it` blocks for each behavior (one assertion pattern per test)
- Mock network calls at the appropriate level (fetch, MSW, or vi.mock)
- Test error paths, not just happy paths
- Reset mocks/stores in `beforeEach`
- Use `act()` for state changes, `waitFor` for async assertions
- Include disabled/empty/loading states where applicable
