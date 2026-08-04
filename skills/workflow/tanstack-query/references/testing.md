## Testing

### Setup Testing Environment

**Test Utils:**
```tsx
// test/utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed queries in tests
        gcTime: Infinity,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Silence errors in tests
    },
  });
}

export function renderWithClient(ui: ReactNode) {
  const testQueryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

### Testing Queries

**Basic Query Test:**
```tsx
// UserProfile.test.tsx
import { renderWithClient } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { UserProfile } from './UserProfile';

const server = setupServer(
  rest.get('/api/users/1', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays user profile', async () => {
  renderWithClient(<UserProfile userId={1} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

test('handles fetch error', async () => {
  server.use(
    rest.get('/api/users/1', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  renderWithClient(<UserProfile userId={1} />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Testing Mutations

```tsx
// CreateUserForm.test.tsx
import { renderWithClient } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CreateUserForm } from './CreateUserForm';

const server = setupServer(
  rest.post('/api/users', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.json({
        id: 1,
        ...body,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('creates user successfully', async () => {
  const user = userEvent.setup();
  renderWithClient(<CreateUserForm />);

  await user.type(screen.getByPlaceholderText('Name'), 'John Doe');
  await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
  await user.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() => {
    expect(screen.getByText(/created successfully/i)).toBeInTheDocument();
  });
});
```

### Testing with Mock Data

**Hydrate Query Data:**
```tsx
test('renders with initial data', () => {
  const testQueryClient = createTestQueryClient();

  // Pre-populate cache
  testQueryClient.setQueryData(['user', 1], {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  });

  render(
    <QueryClientProvider client={testQueryClient}>
      <UserProfile userId={1} />
    </QueryClientProvider>
  );

  // Data immediately available (no loading state)
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Testing Custom Hooks

```tsx
// useUser.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useUser } from './useUser';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: 'John Doe' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches user data', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useUser(1), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual({ id: 1, name: 'John Doe' });
});
```

---

