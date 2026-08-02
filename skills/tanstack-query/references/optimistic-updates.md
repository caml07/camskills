## Optimistic Updates

### Basic Optimistic Update

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  // Before mutation executes
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos']);

    // Optimistically update cache
    queryClient.setQueryData(['todos'], (old: Todo[] = []) =>
      old.map(todo => todo.id === newTodo.id ? newTodo : todo)
    );

    // Return context with snapshot
    return { previousTodos };
  },
  // On error, rollback
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
  // Always refetch after success or error
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

### Complex Optimistic Update Pattern

```tsx
interface Todo {
  id: number;
  title: string;
  done: boolean;
}

const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedTodo: Todo) => {
      const response = await fetch(`/api/todos/${updatedTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },

    onMutate: async (updatedTodo) => {
      // Cancel queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      await queryClient.cancelQueries({ queryKey: ['todo', updatedTodo.id] });

      // Snapshot current state
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
      const previousTodo = queryClient.getQueryData<Todo>(['todo', updatedTodo.id]);

      // Optimistically update list
      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
          old.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
        );
      }

      // Optimistically update detail
      queryClient.setQueryData(['todo', updatedTodo.id], updatedTodo);

      return { previousTodos, previousTodo };
    },

    onError: (err, updatedTodo, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      if (context?.previousTodo) {
        queryClient.setQueryData(['todo', updatedTodo.id], context.previousTodo);
      }
    },

    onSettled: (data, error, variables) => {
      // Always refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', variables.id] });
    },
  });
};

// Usage
function TodoItem({ todo }: { todo: Todo }) {
  const updateTodo = useUpdateTodo();

  const toggleDone = () => {
    updateTodo.mutate({ ...todo, done: !todo.done });
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={toggleDone}
        disabled={updateTodo.isPending}
      />
      {todo.title}
    </div>
  );
}
```

---

