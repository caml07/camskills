## Performance Optimization

### Query Deduplication

**Automatic Deduplication:**
```tsx
// Multiple components request same data - only one network request
function Dashboard() {
  return (
    <div>
      <UserStats userId={1} />    {/* Triggers fetch */}
      <UserProfile userId={1} />  {/* Uses cache */}
      <UserActivity userId={1} /> {/* Uses cache */}
    </div>
  );
}
```

### Prefetching

**Hover Prefetch:**
```tsx
function UserLink({ userId }: { userId: number }) {
  const queryClient = useQueryClient();

  const prefetchUser = () => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 60000,
    });
  };

  return (
    <Link
      href={`/users/${userId}`}
      onMouseEnter={prefetchUser}
      onFocus={prefetchUser}
    >
      View User
    </Link>
  );
}
```

### Select and Transform Data

**Memo-ized Selectors:**
```tsx
// Only re-render when selected data changes
function TodoList({ filter }: { filter: 'all' | 'done' | 'pending' }) {
  const { data: filteredTodos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    select: (todos) => {
      if (filter === 'done') return todos.filter(t => t.done);
      if (filter === 'pending') return todos.filter(t => !t.done);
      return todos;
    },
  });

  return (
    <ul>
      {filteredTodos?.map(todo => <li key={todo.id}>{todo.title}</li>)}
    </ul>
  );
}
```

**Expensive Computations:**
```tsx
const { data: sortedUsers } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  select: (users) => {
    return users
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});
```

### Query Cancellation

**Abort In-Flight Requests:**
```tsx
const { data, refetch } = useQuery({
  queryKey: ['search', searchTerm],
  queryFn: async ({ signal }) => {
    const response = await fetch(`/api/search?q=${searchTerm}`, {
      signal, // Pass abort signal
    });
    return response.json();
  },
});

// When searchTerm changes, previous request is cancelled automatically
```

**Manual Cancellation:**
```tsx
const queryClient = useQueryClient();

// Cancel all queries
queryClient.cancelQueries();

// Cancel specific query
queryClient.cancelQueries({ queryKey: ['todos'] });
```

---

