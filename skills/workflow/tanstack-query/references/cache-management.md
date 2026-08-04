## Cache Management

### Query Client Methods

**getQueryData (Read Cache):**
```tsx
const todos = queryClient.getQueryData<Todo[]>(['todos']);
const user = queryClient.getQueryData<User>(['user', userId]);
```

**setQueryData (Write Cache):**
```tsx
queryClient.setQueryData(['user', 1], newUser);

// Updater function
queryClient.setQueryData<Todo[]>(['todos'], (old = []) => [...old, newTodo]);
```

**invalidateQueries (Mark Stale + Refetch):**
```tsx
// Invalidate all queries
queryClient.invalidateQueries();

// Invalidate by key prefix
queryClient.invalidateQueries({ queryKey: ['todos'] });

// Exact match only
queryClient.invalidateQueries({ queryKey: ['todos'], exact: true });

// With refetch control
queryClient.invalidateQueries({
  queryKey: ['todos'],
  refetchType: 'active', // 'active' | 'inactive' | 'all' | 'none'
});
```

**refetchQueries (Immediate Refetch):**
```tsx
// Refetch all active queries
await queryClient.refetchQueries();

// Refetch specific queries
await queryClient.refetchQueries({ queryKey: ['todos'] });

// Refetch with filters
await queryClient.refetchQueries({
  queryKey: ['todos'],
  type: 'active', // Only refetch active queries
});
```

**removeQueries (Delete from Cache):**
```tsx
// Remove all queries
queryClient.removeQueries();

// Remove specific
queryClient.removeQueries({ queryKey: ['todos', 1] });

// Remove with predicate
queryClient.removeQueries({
  predicate: (query) =>
    query.queryKey[0] === 'todos' &&
    query.state.data?.isArchived === true,
});
```

**resetQueries (Reset to Initial State):**
```tsx
// Reset all queries
queryClient.resetQueries();

// Reset specific
queryClient.resetQueries({ queryKey: ['todos'] });
```

### Cache Configuration

**Global Defaults:**
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 1 minute
      gcTime: 5 * 60 * 1000,          // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Per-Query Configuration:**
```tsx
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: Infinity,      // Never mark stale
  gcTime: Infinity,         // Never garbage collect
  refetchInterval: 5000,    // Refetch every 5s
  refetchIntervalInBackground: false, // Don't refetch when tab inactive
});
```

### Cache Persistence

**Persist to LocalStorage:**
```tsx
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});
```

**IndexedDB Persistence:**
```tsx
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { get, set, del } from 'idb-keyval';

const persister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => await get(key),
    setItem: async (key, value) => await set(key, value),
    removeItem: async (key) => await del(key),
  },
});
```

---

