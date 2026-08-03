## TypeScript Patterns

### Typed Queries

**Generic Query Hook:**
```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

// Explicit typing
const { data } = useQuery<User, Error>({
  queryKey: ['user', id],
  queryFn: async () => {
    const response = await fetch(`/api/users/${id}`);
    return response.json(); // TypeScript infers return type
  },
});

// data is User | undefined
// error is Error | null
```

**Type-safe Query Keys:**
```tsx
// Define query keys with types
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Usage with full type safety
const { data } = useQuery({
  queryKey: userKeys.detail(userId),
  queryFn: () => fetchUser(userId),
});

// Invalidate with autocomplete
queryClient.invalidateQueries({ queryKey: userKeys.lists() });
```

**Custom Hook with Types:**
```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

interface UseUserOptions {
  enabled?: boolean;
}

function useUser(id: number, options?: UseUserOptions) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: options?.enabled,
  });
}

// Usage — side effects on query data go in an effect or the caller's useMutation,
// never in useQuery callbacks (removed in v5)
const { data } = useUser(1, { enabled: true });
```

### Typed Mutations

```tsx
interface CreateUserPayload {
  name: string;
  email: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

function useCreateUser() {
  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: async (payload) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: (data) => {
      // data is User
      console.log('Created user:', data.name);
    },
    onError: (error) => {
      // error is Error
      console.error('Failed:', error.message);
    },
  });
}

// Usage
const mutation = useCreateUser();
mutation.mutate({ name: 'John', email: 'john@example.com' });
```

### Query Client Typing

```tsx
import { QueryClient } from '@tanstack/react-query';

// Type-safe query client methods
const user = queryClient.getQueryData<User>(['user', 1]);

queryClient.setQueryData<User>(['user', 1], (old) => {
  // old is User | undefined
  if (!old) return old;
  return { ...old, name: 'Updated' };
});

// Type-safe invalidation
queryClient.invalidateQueries<User>({
  queryKey: ['users'],
  predicate: (query) => {
    // query.state.data is User | undefined
    return query.state.data?.isActive === true;
  },
});
```

---

