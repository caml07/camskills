## Core Concepts

### Server State vs Client State

**Server State Characteristics:**
- Persisted remotely (database, API, cloud)
- Requires asynchronous APIs for fetching/updating
- Can be out of sync with client
- Can be updated by other users/systems
- Examples: User data, posts, products, settings

**Client State Characteristics:**
- Persisted locally (memory, localStorage)
- Synchronously accessible
- Fully controlled by client
- Examples: UI theme, modal open/closed, form inputs

**TanStack Query manages server state**. Use Zustand/Context for client state.

### Query Keys

Query keys uniquely identify queries and their cached data.

**Key Structure:**
```tsx
// String key (simple)
queryKey: ['todos']

// Array key (recommended for dependencies)
queryKey: ['todo', todoId]
queryKey: ['todos', { status: 'active', page: 1 }]

// Nested arrays (complex hierarchies)
queryKey: ['users', userId, 'posts', { sort: 'date' }]
```

**Key Matching:**
```tsx
// Exact match
queryClient.invalidateQueries({ queryKey: ['todos', 1], exact: true });

// Prefix match (invalidates all matching)
queryClient.invalidateQueries({ queryKey: ['todos'] }); // Matches ['todos', 1], ['todos', 2], etc.

// Predicate match
queryClient.invalidateQueries({
  predicate: (query) => query.queryKey[0] === 'todos' && query.state.data?.status === 'draft'
});
```

**Best Practices:**
- Use arrays with hierarchical structure: `['resource', id, 'subresource']`
- Place variables at the end: `['users', { filter, sort }]`
- Consistent ordering across components
- Use objects for complex parameters

### Query Lifecycle

```
FRESH → STALE → INACTIVE → GARBAGE COLLECTED
  ↓       ↓         ↓              ↓
  0ms   staleTime  no observers  cacheTime
```

**States:**
- **Fresh**: Data is considered up-to-date (within `staleTime`)
- **Stale**: Data might be outdated, will refetch on trigger
- **Inactive**: No components using the query
- **Garbage Collected**: Removed from cache after `cacheTime`

**Configuration:**
```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5 * 60 * 1000,     // 5 minutes (data fresh)
  gcTime: 10 * 60 * 1000,       // 10 minutes (cache retention)
  refetchOnWindowFocus: true,    // Refetch when window regains focus
  refetchOnReconnect: true,      // Refetch when reconnecting
  refetchInterval: 30000,        // Poll every 30 seconds
});
```

### Cache Behavior

**Automatic Caching:**
```tsx
// First component - triggers fetch
function ComponentA() {
  const { data } = useQuery({ queryKey: ['user', 1], queryFn: fetchUser });
  return <div>{data?.name}</div>;
}

// Second component - uses cache instantly
function ComponentB() {
  const { data } = useQuery({ queryKey: ['user', 1], queryFn: fetchUser });
  return <div>{data?.email}</div>; // No second fetch!
}
```

**Stale-While-Revalidate:**
```tsx
// Shows cached data immediately, refetches in background if stale
const { data, isRefetching } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 60000, // Fresh for 1 minute
});

// data available from cache immediately
// isRefetching = true if background refetch happening
```

---

