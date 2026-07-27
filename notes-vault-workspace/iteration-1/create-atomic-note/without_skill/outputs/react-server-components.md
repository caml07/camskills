---
tags: [react, nextjs, concepto]
fecha: 2026-06-18
estado: borrador
---

# React Server Components

## Summary

React Server Components (RSC) let components run exclusively on the server. They can be `async`, fetch data directly, and never ship JavaScript to the client.

## Details

### Server Components

- Run **only on the server** — zero client-side JavaScript
- Can be `async` and `await` data inside the component body
- Cannot use hooks (`useState`, `useEffect`, etc.), event handlers, or browser APIs
- Fetch data directly from databases, filesystems, or APIs without exposing secrets
- Rendered to a serializable payload (React Server Component Payload) sent to the client

```tsx
// Server Component (no "use client" needed — default in App Router)
async function ProfilePage() {
  const user = await db.users.findUnique({ where: { id: 1 } });
  return <h1>{user.name}</h1>;
}
```

### Client Components

- **Default** in Next.js App Router are Server Components
- Mark a Client Component with `"use client"` at the top of the file
- Still **server-rendered** on first request — the directive only means they hydrate on the client
- Can use hooks, state, effects, event handlers, and browser APIs
- JavaScript for Client Components is sent to the browser

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Key Distinctions

| Aspect | Server Component | Client Component |
|---|---|---|
| Runtime | Server only | Server + Browser |
| `async` / direct data fetch | ✅ | ❌ |
| Hooks (`useState`, `useEffect`) | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| JS sent to client | ❌ | ✅ (hydration bundle) |
| Default in App Router | ✅ | ❌ (opt-in via `"use client"`) |

### Rules of Thumb

- Keep components on the server **as far down the tree as possible**
- Push interactivity to leaf components — wrap with `"use client"` only where hooks or events are needed
- Server Components can import and render Client Components, but not the other way around (Client Components cannot import Server Components directly — pass them as `children` instead)
- Fetch in Server Components, pass data as props to Client Components

## Related

- [[Next.js/App Router]]
- [[Conceptos/Índice de Conceptos]]
