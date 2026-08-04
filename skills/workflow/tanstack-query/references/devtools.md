## DevTools

**Setup DevTools:**
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**DevTools Features:**
- View all queries and their states
- Inspect query data and errors
- Manually trigger refetch
- Invalidate queries
- View query timelines
- Monitor cache size
- Debug network waterfalls

---

