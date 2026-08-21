---
id: DOC-{NNN}
tipo: OFFLINE
estado: vigente
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{TRD_ID}, DOC-{FRD_ID}]
evidencia: []
---

# DOC-{NNN}: {Proyecto} — Arquitectura Offline

> Cada afirmación debe tener `evidencia: ["archivo:L1-L10"]`. No inventar estados ni flujos.

## 1. Stack Offline
| Componente | Tecnología | Evidencia |
|------------|------------|-----------|
| Local DB | expo-sqlite (SQLite nativo) | `database.ts` |
| Sync Engine | Custom (`sync.ts`, `syncStore.ts`) | `sync.ts`, `syncStore.ts` |
| Connectivity | `@react-native-community/netinfo` | `package.json`, `DatabaseSync` |
| Queue | Tabla `pedidos_queue` + `pedidos_history` | `database.ts` schema |
| KV Stores | MMKV (auth), expo-sqlite/kv-store (cart) | `mmkvStorage.ts`, `cartStore.ts` |

## 2. Schema SQLite Real (v{VER})
```sql
-- Ver database.ts: migración idempotente v1-v{VER}
-- Tablas: agrupaciones, stations, patients, dietas, comidas,
--         pedidos_queue, pedidos_history, meta
-- JSON columns: patients.alergias, dietas.tiempos, comidas.subcomidas
```

**Evidencia:** `database.ts` — `CREATE TABLE IF NOT EXISTS` + `ALTER TABLE` guards + `DATABASE_VERSION = {VER}`

## 3. Sync Lifecycle (Verificado en Código)
| Fase | Trigger | Qué ocurre | Evidencia |
|------|---------|------------|-----------|
| Inicial | Login exitoso | `syncAll()` → censo → upsert agrupaciones/stations/patients | `sync.ts: syncAll()` |
| Inicial | Login exitoso | `syncDietas()` → dietas/comidas → upsert + meta(tiempos) | `sync.ts: syncDietas()` |
| Foreground | App focus | Re-sync si datos stale | `DatabaseSync` en `app/_layout.tsx` |
| Timer | Cada 5 min | Re-sync incremental | `DatabaseSync` timer |
| Reconexión | NetInfo `isConnected=true` | `flushQueue()` + re-sync | `DatabaseSync.flushQueue()` |

**UI lee SOLO de SQLite** (offline-first) — `useSQLiteQuery` + `syncStore` signal.

## 4. Cola de Pedidos — Estados REALES
| Estado | Significado | Transición | Evidencia |
|--------|-------------|------------|-----------|
| `PENDING` | Insertado, pendiente de envío | → `IN_FLIGHT` al procesar | `cartStore.submitOrder()` |
| `IN_FLIGHT` | Enviando a API | → `DELETE` si éxito | `flushQueue()` en `sync.ts` |
| (reintento) | Fallo temporal | `failed_attempts++`, `next_attempt_at` = backoff exponencial (max 60s) | `sync.ts:358-371` |

> **NO existe `DEAD_LETTER`** — reintenta indefinidamente. UI considera "atascado" si `failed_attempts > 3`.

## 5. Flush Queue (Reconexión)
1. `NetInfo` listener + timer 5min → `DatabaseSync.flushQueue(db)`
2. Lee `pedidos_queue WHERE status IN ('PENDING','IN_FLIGHT') ORDER BY createdAt`
3. Filtra por usuario actual (`strUsuarioCreacion`)
4. Marca `IN_FLIGHT` → POST individual via `interfaceRequest("carrito")`
5. **Éxito:** `DELETE` de queue + `INSERT` en `pedidos_history` (`status: SYNCED`, `enviarPendiente=1`) → `carrito_enviar` por grupo → `markGroupEnviado`
6. **Fallo:** Incrementa `failed_attempts`, calcula `next_attempt_at` con backoff, conserva fila

**Evidencia:** `sync.ts: flushQueue()`, `cartStore.ts: submitOrder()`, `historyService.ts`

## 6. Deduplicación e Idempotencia
| Mecanismo | Qué protege | Evidencia |
|-----------|-------------|-----------|
| `censoHash-v2` en `meta` | Re-sync censo/dietas solo si cambia | `sync.ts: parseCenso()` |
| `idempotency_key` | Reenvío duplicado (queue/history) | `database.ts` schema |
| `queueId` en history | Trazabilidad queue → history | `pedidos_history.queueId` |

## 7. Conflict Resolution
| Escenario | Estrategia Real | Evidencia |
|-----------|-----------------|-----------|
| Network lost during submit | Fila queda `PENDING`/`IN_FLIGHT` → reintento en flush | `flushQueue()` |
| Item already submitted | `idempotency_key` evita duplicado en history | `historyService.ts` |
| Queue stale (IN_FLIGHT huérfano) | `flushQueue` recupera y reintenta | `sync.ts:358-371` |
| Censo sin cambios (hash igual) | No refresca dietas/comidas | `sync.ts: parseCenso()` |

## 8. Persistencia Multi-Layer
| Layer | Qué guarda | TTL / Limpieza | Evidencia |
|-------|------------|----------------|-----------|
| MMKV (auth) | `session-token`, `biometric-auth-token`, `auth-storage` | 30 min inactividad (online) | `mmkvStorage.ts`, `authStore.ts` |
| SQLite KV (cart) | `dietas-cart-storage` (items planos) | `clearStaleItems()` al rehidratar (filta `createdAt` < hoy) | `cartStore.ts` |
| SQLite Principal | Censo, dietas, cola, historial | Manual / `npm run pull-db` | `database.ts` |

---
*Actualizar solo cuando `database.ts`, `sync.ts`, `cartStore.ts`, `api.ts` cambien el comportamiento offline real.*