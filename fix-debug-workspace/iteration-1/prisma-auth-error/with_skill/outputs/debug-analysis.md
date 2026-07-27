# Debug Analysis: Prisma "Can't reach database server" on Railway (Neon + PgBouncer)

## Symptom

Next.js app works fine locally. On Railway (production), it randomly throws `Can't reach database server` (Prisma error P1001) every few minutes, then recovers.

## Trace — Root Cause

### 1. Missing `?pgbouncer=true` in DATABASE_URL

Prisma uses **named prepared statements** by default. PgBouncer in **transactional mode** does not support named prepared statements across transactions. When Prisma tries to reuse a prepared statement that PgBouncer has discarded, the connection breaks — manifesting as "Can't reach database server."

**Fix:** Append `?pgbouncer=true` to the pooled connection URL:

```
DATABASE_URL="postgres://user:pass@neon-pooler:6543/neondb?pgbouncer=true"
```

This tells Prisma to use unnamed (anonymous) prepared statements, which PgBouncer handles correctly.

### 2. Missing `DIRECT_URL` for Prisma CLI

Prisma Migrate and `prisma generate` require a **direct** database connection — they fail or behave unpredictably through PgBouncer. If the deploy pipeline runs migrations via the pooled URL, it can corrupt connection state.

**Fix:** Add a `DIRECT_URL` env var pointing to the direct Neon endpoint (port 5432, no PgBouncer):

```
DIRECT_URL="postgres://user:pass@neon-direct:5432/neondb"
```

Use `DIRECT_URL` in `prisma.config.ts` / `schema.prisma` datasource for CLI operations.

### 3. Connection Pool Exhaustion

Neon's PgBouncer has a **pool limit** (e.g., 50 pooled connections on Free tier). Serverless functions on Railway may create many `PrismaClient` instances — each with its own connection pool — quickly exhausting the limit. Once the pool is full, new connections time out with P1001.

**Contributing factors:**

- No global `PrismaClient` singleton (re-created per request)
- Default `connection_limit` too high for Neon's pool
- `pool_timeout` too short (default 10s) — fast retries compound the problem

**Fix:**

- Use the **global singleton pattern** for `PrismaClient` in Next.js:
  ```ts
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
  export const prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```
- Tune pool params in the connection URL:
  ```
  DATABASE_URL="...?pgbouncer=true&connection_limit=10&pool_timeout=20"
  ```

### 4. Idle Connection Drops by PgBouncer

PgBouncer's `server_idle_timeout` (default often 300s) closes backend connections that sit idle. If Prisma keeps connections open between requests (via a global pool), those connections get silently dropped. The next query on a stale connection fails with P1001.

**Fix:** Set `pool_timeout` and enable connection retry logic. In Prisma 6+, use the driver adapter with proper pool management:

```ts
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

### 5. Neon Specific: SSL/TLS

Neon requires SSL/TLS. Without `sslmode=require`, connections from Railway can be silently dropped or rejected.

**Fix:** Add to the connection string:
```
DATABASE_URL="...?pgbouncer=true&sslmode=require"
```

## Primary Root Cause

The intermittent "every few minutes" pattern strongly points to **#1 (missing `?pgbouncer=true`)** combined with **#3 (pool exhaustion)**: Prisma creates named prepared statements → PgBouncer fails to handle them → Prisma opens new connections → pool saturates → new requests hit P1001. After PgBouncer's timeout clears dead connections, things recover — hence the cyclic nature.

## Checklist

| Cause | Likelihood | Fix |
|---|---|---|
| 1. Missing `?pgbouncer=true` | **High** | Add to `DATABASE_URL` |
| 2. Missing `DIRECT_URL` | Medium | Add direct URL |
| 3. Pool exhaustion | **High** | Singleton + `connection_limit` |
| 4. Idle drops | Medium | Driver adapter + pool config |
| 5. SSL/TLS | Low | Add `sslmode=require` |

## References

- Prisma docs: PgBouncer configuration (`/prisma/web`)
- Prisma error reference: P1001 — "Can't reach database server"
- Prisma error reference: P2024 — "Connection pool timeout"
- Neon docs: Connection pooling limits
