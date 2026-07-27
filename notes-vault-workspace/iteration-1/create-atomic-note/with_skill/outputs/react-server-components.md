---
tags: [react, nextjs, concepto]
fecha: 2026-06-18
estado: borrador
---

# React Server Components

## Summary

React Server Components (RSC) let you run components exclusively on the server. They can be async and fetch data directly without `useEffect` or client-state libraries. Client Components are the default in Next.js App Router — you use `"use client"` to mark them when you need interactivity, but they still get server-rendered on the first request.

## Details

### Server Components

Server Components run **only** on the server. They never ship JavaScript to the client, which means zero bundle-size impact for those components.

```tsx
// This is a Server Component by default in the App Router
async function BlogPost({ id }: { id: string }) {
  const post = await db.posts.findUnique({ where: { id } })
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

Key characteristics:
- Can be `async` — `await` data directly inside the component body
- Cannot use hooks (`useState`, `useEffect`, `useContext`, etc.)
- Cannot use browser-only APIs (`window`, `localStorage`, etc.)
- Reduce client bundle size — heavy dependencies stay on the server
- Support streaming via `loading.tsx` or `Suspense` boundaries

### Client Components

In Next.js App Router, every component is a Server Component **by default**. You opt into client interactivity with the `"use client"` directive at the top of the file.

```tsx
"use client"

import { useState } from "react"

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "❤️" : "🤍"}
    </button>
  )
}
```

Key characteristics:
- Still **server-rendered** on first request (Next.js pre-renders the HTML)
- Hydrated on the client to become interactive
- Can use hooks, event handlers, browser APIs
- Cannot be `async`

### Comparison

| Feature | Server Component | Client Component |
|---|---|---|
| Runs on server | ✅ Always | ✅ First render (SSR) |
| Runs on client | ❌ Never | ✅ After hydration |
| Bundle size | 0 KB added | Full JS bundle shipped |
| `async` / `await` | ✅ Directly in component | ❌ Not allowed |
| Hooks (`useState`, `useEffect`) | ❌ | ✅ |
| Event handlers (`onClick`) | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Default in App Router | ✅ | ❌ (opt-in with `"use client"`) |

### The "use client" Boundary

The `"use client"` directive marks a **boundary**. All modules imported by a Client Component also become part of the client bundle — unless they are Server Actions or pass through the boundary as props.

```tsx
// parent.tsx — Server Component
import { ClientWidget } from "./client-widget"

export function Page() {
  return <ClientWidget><ServerContent /></ClientWidget>
  // ServerContent passed as children: it's still a Server Component!
}
```

> [!TIP] Composition pattern
> Pass Server Components as `children` or props to Client Components. This lets you keep interactive wrappers on the client while the inner content stays on the server.

### When to Use Each

- **Server Component** — fetching data, rendering static content, heavy libraries (markdown parsing, date formatting), SEO-critical pages
- **Client Component** — forms, buttons, modals, animated elements, anything with `useState`/`useEffect`/event handlers, browser API access

## Related

- [[Next.js App Router]] — the framework that makes RSC a first-class citizen
- [[Server-Side Rendering (SSR)]] — how RSC differs from traditional SSR
- [[React Suspense]] — streaming and fallback patterns for async RSC
- [[Conceptos/Índice de React]] — all React-related notes
