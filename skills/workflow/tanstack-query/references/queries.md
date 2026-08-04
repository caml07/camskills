## Queries

### useQuery Hook

**Basic Syntax:**
```tsx
const {
  data,           // Query result
  error,          // Error object if failed
  isLoading,      // First load (no cached data)
  isFetching,     // Any fetch (including background)
  isSuccess,      // Query succeeded
  isError,        // Query failed
  status,         // 'pending' | 'error' | 'success'
  fetchStatus,    // 'fetching' | 'paused' | 'idle'
  refetch,        // Manual refetch function
} = useQuery({
  queryKey: ['key'],
  queryFn: async () => { /* fetch logic */ },
});
```

### Query Function Patterns

**Basic Fetch:**
```tsx
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Network error');
    return response.json();
  },
});
```

**Query Key in Function:**
```tsx
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: async ({ queryKey }) => {
    const [_key, userId] = queryKey;
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
});
```

**Abort Signal (Cancellation):**
```tsx
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: async ({ signal }) => {
    const response = await fetch('/api/todos', { signal });
    return response.json();
  },
});
// Automatically cancels on unmount or when query becomes inactive
```

**Axios Pattern:**
```tsx
import axios from 'axios';

const { data } = useQuery({
  queryKey: ['repos', username],
  queryFn: ({ signal }) =>
    axios.get(`/api/repos/${username}`, { signal }).then(res => res.data),
});
```

### Dependent Queries

**Sequential Queries:**
```tsx
// Wait for user before fetching projects
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

const { data: projects } = useQuery({
  queryKey: ['projects', user?.id],
  queryFn: () => fetchProjects(user!.id),
  enabled: !!user, // Only run when user exists
});
```

**Conditional Queries:**
```tsx
const { data } = useQuery({
  queryKey: ['premium-features', userId],
  queryFn: fetchPremiumFeatures,
  enabled: user?.isPremium === true, // Only fetch for premium users
});
```

### Parallel Queries

**Manual Parallel:**
```tsx
function Dashboard() {
  const users = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const posts = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
  const projects = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  if (users.isLoading || posts.isLoading || projects.isLoading) {
    return <Spinner />;
  }

  return <div>/* render dashboard */</div>;
}
```

**useQueries (Dynamic Parallel):**
```tsx
import { useQueries } from '@tanstack/react-query';

function MultiUserProfiles({ userIds }: { userIds: number[] }) {
  const results = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
      staleTime: 60000,
    })),
  });

  const allLoaded = results.every(r => r.isSuccess);

  if (!allLoaded) return <Spinner />;

  return (
    <div>
      {results.map((result, i) => (
        <UserCard key={userIds[i]} user={result.data} />
      ))}
    </div>
  );
}
```

### Query Placeholders

**Placeholder Data (Instant UI):**
```tsx
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  placeholderData: [], // Show empty array while loading
});

// Dynamic placeholder from cache
const { data } = useQuery({
  queryKey: ['todo', id],
  queryFn: () => fetchTodo(id),
  placeholderData: () => {
    // Use cached list to find placeholder
    return queryClient
      .getQueryData(['todos'])
      ?.find(d => d.id === id);
  },
});
```

**Initial Data (Hydration):**
```tsx
const { data } = useQuery({
  queryKey: ['todo', id],
  queryFn: () => fetchTodo(id),
  initialData: () => {
    return queryClient
      .getQueryData(['todos'])
      ?.find(d => d.id === id);
  },
  initialDataUpdatedAt: () =>
    queryClient.getQueryState(['todos'])?.dataUpdatedAt,
});
```

**Difference:**
- `placeholderData`: Not persisted to cache, purely UI
- `initialData`: Persisted to cache as real data

---

