## Common Pitfalls

**❌ Don't Create QueryClient Inside Component:**
```tsx
// WRONG - Creates new client on every render
function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}

// CORRECT - Stable client instance
function App() {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

**❌ Don't Use Query Data in Render Without Checking:**
```tsx
// WRONG - data might be undefined
function UserProfile() {
  const { data } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
  return <div>{data.name}</div>; // Crashes if data is undefined
}

// CORRECT - Handle loading state
function UserProfile() {
  const { data, isLoading } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
  if (isLoading) return <Spinner />;
  return <div>{data.name}</div>;
}
```

**❌ Don't Forget Query Keys Are Dependencies:**
```tsx
// WRONG - Missing dependency in query key
function UserPosts({ userId, filter }: Props) {
  const { data } = useQuery({
    queryKey: ['posts'], // Missing userId and filter
    queryFn: () => fetchUserPosts(userId, filter),
  });
}

// CORRECT - All dependencies in key
function UserPosts({ userId, filter }: Props) {
  const { data } = useQuery({
    queryKey: ['posts', userId, filter],
    queryFn: () => fetchUserPosts(userId, filter),
  });
}
```

**❌ Don't Mutate Query Data Directly:**
```tsx
// WRONG - Mutating cached data
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
data.push(newTodo); // Mutates cache directly

// CORRECT - Use setQueryData
queryClient.setQueryData(['todos'], (old = []) => [...old, newTodo]);
```

---

