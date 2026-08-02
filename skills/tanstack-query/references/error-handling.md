## Error Handling and Retry

### Error Handling

**Query Error Boundaries:**
```tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <p>Error: {error.message}</p>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          <Component />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

// Component throws errors to boundary
function Component() {
  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    throwOnError: true, // Throw errors to error boundary
  });
  return <div>{data.name}</div>;
}
```

**Custom Error Types:**
```tsx
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const { error } = useQuery({
  queryKey: ['user'],
  queryFn: async () => {
    const response = await fetch('/api/user');
    if (!response.ok) {
      throw new APIError(
        'Failed to fetch user',
        response.status,
        await response.text()
      );
    }
    return response.json();
  },
});

if (error instanceof APIError) {
  if (error.status === 404) return <NotFound />;
  if (error.status === 401) return <Unauthorized />;
}
```

### Retry Logic

**Default Retry:**
```tsx
// Retries 3 times with exponential backoff
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  retry: 3, // Number of retries
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

**Conditional Retry:**
```tsx
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  retry: (failureCount, error) => {
    // Don't retry on 404
    if (error instanceof APIError && error.status === 404) {
      return false;
    }
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
});
```

**Mutation Retry:**
```tsx
useMutation({
  mutationFn: createUser,
  retry: 2, // Retry mutations (use sparingly)
  retryDelay: 1000,
});
```

### Network Status Detection

**Online/Offline Handling:**
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst', // 'online' | 'always' | 'offlineFirst'
      refetchOnReconnect: true,
    },
  },
});

// Custom online/offline indicator
function OnlineStatus() {
  const queryClient = useQueryClient();
  const isOnline = useOnlineManager().isOnline();

  useEffect(() => {
    if (isOnline) {
      queryClient.refetchQueries();
    }
  }, [isOnline, queryClient]);

  return isOnline ? <OnlineIcon /> : <OfflineIcon />;
}
```

---

