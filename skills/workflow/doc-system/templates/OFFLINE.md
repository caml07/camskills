# DOC-{NNN}: {ProjectName} — Offline Architecture

## Stack

| Componente | Tecnología |
|------------|-----------|
| Local DB | |
| Sync engine | |
| Connectivity | |
| Queue | |

## Schema

```sql
CREATE TABLE ...
```

## Sync Lifecycle

```
ASCII diagram: syncAll() → upsert → UI reads from SQLite
```

## Offline Queue

```
submit → INSERT queue (PENDING) → flushQueue on reconnect → POST → DELETE
```

## Conflict Resolution

| Scenario | Strategy |
|----------|----------|
| Network lost during submit | Retry with backoff |
| Item already submitted | Idempotency key |
| Queue stale | TTL / max retries |
