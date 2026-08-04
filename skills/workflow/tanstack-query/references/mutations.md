## Mutations

### useMutation Hook

**Basic Mutation:**
```tsx
const mutation = useMutation({
  mutationFn: async (newTodo: Todo) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    });
    return response.json();
  },
  onSuccess: (data) => {
    console.log('Created:', data);
  },
  onError: (error) => {
    console.error('Failed:', error);
  },
});

// Trigger mutation
mutation.mutate({ title: 'New Todo', done: false });

// Async/await variant
try {
  const data = await mutation.mutateAsync(newTodo);
  console.log(data);
} catch (error) {
  console.error(error);
}
```

**Mutation State:**
```tsx
const {
  mutate,          // Trigger function
  mutateAsync,     // Promise variant
  data,            // Result from successful mutation
  error,           // Error from failed mutation
  isPending,       // Mutation in progress
  isSuccess,       // Mutation succeeded
  isError,         // Mutation failed
  reset,           // Reset mutation state
} = useMutation({ /* ... */ });
```

### Cache Invalidation

**Invalidate Queries After Mutation:**
```tsx
const mutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    // Refetch all 'todos' queries
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

**Multiple Invalidations:**
```tsx
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (data, variables) => {
    // Invalidate multiple query families
    queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['teams', data.teamId] });
  },
});
```

**Selective Invalidation:**
```tsx
// Only invalidate specific queries
queryClient.invalidateQueries({
  queryKey: ['todos'],
  exact: true, // Only ['todos'], not ['todos', 1]
});

// Predicate-based invalidation
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'todos' &&
    query.state.data?.status === 'draft',
});
```

### Manual Cache Updates

**setQueryData (Direct Update):**
```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: (updatedTodo) => {
    // Update specific todo in cache
    queryClient.setQueryData(
      ['todo', updatedTodo.id],
      updatedTodo
    );

    // Update todo in list
    queryClient.setQueryData(['todos'], (old: Todo[] = []) =>
      old.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    );
  },
});
```

**Immutable Updates:**
```tsx
// Add to list
queryClient.setQueryData(['todos'], (old: Todo[] = []) =>
  [...old, newTodo]
);

// Remove from list
queryClient.setQueryData(['todos'], (old: Todo[] = []) =>
  old.filter(todo => todo.id !== deletedId)
);

// Update in list
queryClient.setQueryData(['todos'], (old: Todo[] = []) =>
  old.map(todo => todo.id === id ? { ...todo, ...updates } : todo)
);
```

---

