---
name: tanstack-query
description: TanStack Query (React Query) for server-state fetching, caching, mutations, invalidation, pagination, optimistic updates, and query testing in React. Use when writing or reviewing useQuery, useMutation, useInfiniteQuery, queryClient, staleTime, cache invalidation, query keys, or TanStack Query code.
license: UNLICENSED
compatibility: opencode
---

# TanStack Query

Use TanStack Query for remote server state. Keep UI state, form state, and
derived values outside its cache.

## Start Here

1. Check the installed TanStack Query version before selecting an API.
2. Read [quick-start.md](references/quick-start.md) for setup and the first query or mutation.
3. Read [core-concepts.md](references/core-concepts.md) for query keys, freshness, and cache lifecycle.
4. Prefer query-key factories for resources used in multiple places.
5. Pass the query `signal` to fetchers and invalidate the smallest affected key family after mutations.

## Choose A Reference

| Need | Read |
| --- | --- |
| `useQuery`, dependent queries, parallel queries, placeholder data | [queries.md](references/queries.md) |
| `useMutation`, invalidation, direct cache updates | [mutations.md](references/mutations.md) |
| Optimistic writes and rollback | [optimistic-updates.md](references/optimistic-updates.md) |
| Cursor or page-based pagination | [pagination.md](references/pagination.md) |
| QueryClient methods, defaults, persistence | [cache-management.md](references/cache-management.md) |
| Retry, error boundaries, offline mode | [error-handling.md](references/error-handling.md) |
| Axios or Zustand integration | [integration-patterns.md](references/integration-patterns.md) |
| Type-safe keys, queries, and mutations | [typescript.md](references/typescript.md) |
| Query and mutation tests | [testing.md](references/testing.md) |
| Prefetching, selection, cancellation | [performance.md](references/performance.md) |
| Key factories and reusable patterns | [best-practices.md](references/best-practices.md) |
| DevTools | [devtools.md](references/devtools.md) |
| Frequent implementation mistakes | [common-pitfalls.md](references/common-pitfalls.md) |

## Guardrails

- Query keys include every input used by `queryFn`.
- Cache writes are immutable.
- Do not put a `QueryClient` directly in a component render path.
- Prefer event handlers or query options over effects that mirror server state.
- Treat optimistic updates as a transaction: cancel, snapshot, update, rollback,
  then invalidate.
- Read the version-specific documentation through Context7 when the task needs
  current API syntax.
