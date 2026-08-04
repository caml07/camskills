# Quick Start

## Summary

TanStack Query (formerly React Query) is a powerful asynchronous state management library for React that handles server-state fetching, caching, synchronization, and updates. It eliminates the need for manual data fetching boilerplate and provides built-in features like background refetching, optimistic updates, pagination, and intelligent cache management.

## When to Use

**Use TanStack Query when:**
- Fetching data from REST APIs, GraphQL, or tRPC endpoints
- Need automatic background refetching and cache invalidation
- Building real-time dashboards with polling or websocket data
- Implementing infinite scroll or pagination
- Require optimistic UI updates for mutations
- Managing complex server-state synchronization
- Need offline support with cache persistence
- Building applications with frequent data updates

**TanStack Query excels at:**
- Server-state management (API data, external state)
- Request deduplication and caching
- Stale-while-revalidate patterns
- Loading and error state management
- Prefetching and eager loading
- Parallel and dependent query orchestration

**Avoid TanStack Query for:**
- Pure client-side state (use Zustand, Jotai, or Context)
- Form state management (use React Hook Form, Formik)
- Simple one-time fetches without caching needs

## Quick Start

### Installation

```bash
npm install @tanstack/react-query
# DevTools (optional but recommended)
npm install @tanstack/react-query-devtools
```

### Basic Setup

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### First Query

```tsx
// components/UserProfile.tsx
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json() as Promise<User>;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

### First Mutation

```tsx
// components/CreateUserForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

---
