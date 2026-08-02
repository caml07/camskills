## Integration Patterns

### REST API with Axios

**API Client:**
```tsx
// lib/api-client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Query Hooks:**
```tsx
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get('/users', { signal });
      return data;
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get(`/users/${id}`, { signal });
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUser: NewUser) =>
      apiClient.post('/users', newUser).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Zustand for Global State

**Combined Pattern:**
```tsx
// store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
}));

// hooks/useAuthenticatedQuery.ts
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthenticatedQuery() {
  const token = useAuthStore(state => state.token);

  return useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      const response = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    enabled: !!token,
  });
}
```

---

