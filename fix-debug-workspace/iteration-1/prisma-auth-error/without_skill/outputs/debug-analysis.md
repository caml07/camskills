# Debug Analysis: Prisma "Can't reach database server" on Neon + PgBouncer

## Environment

- **App**: Next.js + Prisma
- **Host**: Railway (serverless-like container orchestration)
- **DB**: Neon Postgres with PgBouncer connection pooling
- **Symptom**: Random "Can't reach database server" errors every few minutes — works fine locally

---

## Root Cause

The error has **three compounding causes**, all common when using Prisma behind PgBouncer (especially Neon's pooled endpoint):

### 1. Missing `?pgbouncer=true` in `DATABASE_URL`

When PgBouncer runs in **transaction mode** (Neon's default), it **does not support PostgreSQL prepared statements**. Prisma uses prepared statements by default. Without `?pgbouncer=true` in the connection string, Prisma does not disable prepared statements, causing random errors when PgBouncer tries to proxy a `PREPARE` / `DEALLOCATE` cycle that spans across transaction boundaries.

The error is intermittent because it only surfaces when:
- A connection is reused by PgBouncer and assigned to a different backend
- A prepared statement name collides across connections

### 2. No `DIRECT_URL` for Migrations / Long-Running Queries

Neon's PgBouncer pooled endpoint has:
- A **short idle timeout** (60–300s depending on plan)
- A **limited max connections** (typically 10–25 in the pool)
- No support for `LISTEN`/`NOTIFY`, `PgBouncer` prepared statements, or session-level features

When Prisma Migrate or a long-running query hits the pooled URL, it can trigger "Can't reach database server" as PgBouncer terminates the idle session.

### 3. Connection Pool Exhaustion & No Retry Logic

Prisma Client maintains its own internal connection pool. Defaults:
- `connection_limit`: OS-dependent (typically 10–20 in containers)
- `pool_timeout`: 10 seconds

On Railway, containers can be recycled or scaled up, spawning new Prisma instances. Each instance opens its own pool connections. When the sum of all pools exceeds Neon's PgBouncer connection limit, new connection attempts fail with "Can't reach database server". Additionally, if a connection is dropped by PgBouncer (idle timeout), Prisma's pool does not automatically retry — it surfaces the error directly.

---

## The Fix

### Step 1: Two Connection Strings

In your `.env` / Railway environment variables:

```env
# Pooled connection for Prisma Client (production runtime)
DATABASE_URL="postgres://user:password@ep-example-pooler.us-east-2.aws.neon.tech/neondb?pgbouncer=true&connection_limit=5&pool_timeout=5"

# Direct connection for Prisma Migrate (CLI only)
DIRECT_URL="postgres://user:password@ep-example.us-east-2.aws.neon.tech/neondb"
```

Key parameters appended to `DATABASE_URL`:
- `pgbouncer=true` — Tells Prisma to disable prepared statements (compatible with PgBouncer transaction mode)
- `connection_limit=5` — Limits Prisma's internal pool so multiple container instances don't exhaust Neon's pool
- `pool_timeout=5` — Fails fast (5s) instead of waiting the default 10s

### Step 2: Configure `schema.prisma`

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

The `directUrl` field tells Prisma Migrate to use the **direct** (non-pooled) connection for schema changes, while Prisma Client uses the pooled URL.

### Step 3: Optimize Prisma Client Instantiation

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

This singleton pattern prevents multiple Prisma Client instances during hot reload in development. In production, while each Railway container gets its own instance, it ensures only **one per process**.

### Step 4: Add Connection Retry Logic (Optional but Recommended)

```ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      if (
        error instanceof Error &&
        error.message.includes("Can't reach database server")
      ) {
        await new Promise((r) => setTimeout(r, delay * (i + 1)))
        continue
      }
      throw error
    }
  }
  throw new Error("Unreachable")
}
```

### Step 5: Railway-Specific Check

Ensure Railway's network is not the bottleneck:
- Set `RAILWAY_RUN_ALLOCATION_TIMEOUT` to a reasonable value (or leave default)
- Verify the **Neon pooler host** is used (e.g., `ep-xxx-pooler.us-east-2.aws.neon.tech`) — not the direct host
- Confirm no firewall rules block outbound on port 5432

---

## Summary

| Cause | Fix |
|---|---|
| Prepared statements incompatible with PgBouncer | `?pgbouncer=true` in `DATABASE_URL` |
| Pool exhausted by multiple containers | `connection_limit=5` + singleton client |
| Idle connections dropped by PgBouncer | `pool_timeout=5` + optional retry wrapper |
| Migrations hitting pooled endpoint | `DIRECT_URL` + `directUrl` in schema |
