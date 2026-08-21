---
id: DOC-{NNN}
tipo: TRD
estado: vigente
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{FRD_ID}]
evidencia: []
---

# DOC-{NNN}: {Proyecto} — Technical Requirements Document

> Baseline técnico verificado contra código real. Fuente de verdad para TDDs y ADRs.

## 1. Stack Tecnológico
| Capa | Tecnología | Versión | Evidencia |
|------|------------|---------|-----------|
| Framework | | | package.json |
| Runtime | | | package.json |
| Navegación | | | package.json |
| Estado cliente | | | package.json |
| Estado servidor | | | package.json |
| Base de datos | | | package.json |
| Red | | | package.json |
| Animaciones | | | package.json |
| UI / Estilos | | | package.json |
| Testing | | | package.json |
| Native | | | app.json |

## 2. Arquitectura
### 2.1 Routing y Providers
```
app/
  _layout.tsx          # Root + providers + init
  (app)/
    _layout.tsx        # Auth guard
    (tabs)/            # Phone tabs
    feature/           # Feature routes
```
- Guards, providers, hidratación: evidencia `app/_layout.tsx:L1-L50`

### 2.2 Límites Feature/Shared
- `src/features/<dominio>/` — dominios aislados, no importan entre sí
- `src/shared/` — átomos, hooks, moléculas, organismos, providers, services, types, utils
- Evidencia: `src/features/`, `src/shared/`

## 3. Persistencia
| Store | Tecnología | Clave / Tabla | Evidencia |
|-------|------------|---------------|-----------|
| Auth | Zustand + MMKV | `auth-storage` | `src/features/auth/store/authStore.ts` |
| Biométrico | MMKV | `biometric-auth-token` | `src/shared/services/biometricAuth.ts` |
| Carrito | Zustand + expo-sqlite/kv-store | `dietas-cart-storage` | `src/features/cart/store/cartStore.ts` |
| Estación | React Context | memoria | `src/features/stations/context/StationContext.tsx` |
| Sync signal | useSyncExternalStore | memoria | `src/shared/services/syncStore.ts` |

## 4. Base de Datos (SQLite)
- **Archivo:** `nutricion.db`
- **Versión actual:** v{VER} (`PRAGMA user_version`)
- **Modo:** WAL, conexión lazy, serializada (`withDb`)

### 4.1 Esquema v{VER}
| Tabla | Columnas clave | JSON columns | Índices | Evidencia |
|-------|----------------|--------------|---------|-----------|
| agrupaciones | id, nombre, icon | — | | `database.ts` |
| stations | id, nombre, agrupacionId | — | | |
| patients | id, decPaciente, nombre, stationId, habitacion, cama, dietaId, alergias, doctorNotas, sexo, edad, intCompany, intFacility | alergias | | |
| dietas | id, nombre, tiempos, simbolo | tiempos | | |
| comidas | id, dietaId, nombre, tiempo, subcomidas, menuId, tiempoId | subcomidas | | |
| pedidos_queue | id, intCompany, intFacility, decCuenta, decPaciente, decIdDieta, decIdMenu, decIdTiempo, datFecha, strUsuarioCreacion, datFechaProcesar, strObservaciones, strObservacionesDieta, status, failed_attempts, next_attempt_at, idempotency_key, createdAt, updatedAt, comidaNombre | — | | |
| pedidos_history | id, decCuenta, decPaciente, decIdDieta, decIdMenu, decIdTiempo, intCompany, intFacility, datFecha, strUsuarioCreacion, strObservaciones, strObservacionesDieta, comidaNombre, status, enviarPendiente, syncedAt, queueId, idempotency_key, createdAt | — | | |
| meta | key (PK), value (JSON) | value | | `censoHash-v2` |

### 4.2 Migraciones
- Estrategia: bloque idempotente `CREATE TABLE IF NOT EXISTS` + `ALTER TABLE` guardados por `PRAGMA table_info`
- Versión en `database.ts`: `DATABASE_VERSION = {VER}`
- No borrar DB ante fallo: preserva cola e historial

## 5. API y Red
### 5.1 Transporte
| Entorno | Mecanismo | Detalle | Evidencia |
|---------|-----------|---------|-----------|
| Dev | `request<T>()` | json-server, `EXPO_PUBLIC_API_URL` | `api.ts` |
| Prod | `interfaceRequest<T>()` | POST `INTERFACE_URL?strSystem=...`, Bearer `STATIC_TOKEN` | `api.ts`, `config.ts` |

### 5.2 Comandos HVP (Prod)
| Comando | Descripción | Timeout | Evidencia |
|---------|-------------|---------|-----------|
| censo | Descarga agrupaciones, stations, patients | 5s | `api.ts` |
| dietas | Descarga dietas, comidas, tiempos | 5s | `api.ts` |
| carrito | Envía items individuales | 12s | `api.ts` |
| carrito_enviar | Confirma grupo enviado | 12s | `api.ts` |

### 5.3 Configuración
- Variables: `EXPO_PUBLIC_HVP_STATIC_TOKEN`, `EXPO_PUBLIC_HVP_INTERFACE_URL`, `EXPO_PUBLIC_HVP_INTERFACE_SYSTEM` (ver `.env.example`)
- Token transaccional dinámico en MMKV (`session-token`)
- Timeouts: lecturas 5s, escrituras 12s

## 6. Seguridad
| Aspecto | Implementación | Evidencia |
|---------|----------------|-----------|
| Auth prod | HVP commands + static token + session token MMKV | `api.ts`, `mmkvStorage.ts` |
| Biometría | `expo-local-authentication` → token en MMKV | `biometricAuth.ts` |
| Secrets | `.env` (gitignored), nunca en código | `.gitignore`, `config.ts` |
| SSL Android | `withNetworkSecurityConfig.js` + `gdig2.crt` | `plugins/`, `app.json` |
| Tokens en bundle | `EXPO_PUBLIC_*` inlineados → seguridad en rotación servidor | `config.ts` |

## 7. Arquitectura Offline
### 7.1 Cola de Pedidos
- Tabla: `pedidos_queue`
- Estados reales: `PENDING` → `IN_FLIGHT` → `DELETE` (éxito) | reintento con backoff exponencial (max 60s)
- **NO existe** estado `DEAD_LETTER` — reintenta indefinidamente; UI marca "atascado" si `failed_attempts > 3`
- Evidencia: `sync.ts:358-371`, `cartStore.ts`

### 7.2 Sync Lifecycle
1. Login exitoso → `syncAll()`: censo → upsert agrupaciones/stations/patients
2. `syncDietas()`: dietas/comidas → upsert + meta(tiempos)
3. UI lee **solo** de SQLite (offline-first)
4. Reconexión (NetInfo + timer 5min) → `DatabaseSync.flushQueue()`
5. `flushQueue()`: recupera `IN_FLIGHT` huérfanos, filtra por usuario, reintenta

### 7.3 Deduplicación
- Hash censo: `meta.censoHash-v2` — si no cambia, no refresca dietas/comidas
- Idempotencia: `idempotency_key` en queue e history

## 8. Build y Configuración Nativa
| Item | Detalle | Evidencia |
|------|---------|-----------|
| Dev build | `npx expo prebuild --clean && npx expo run:android` | `package.json`, `app.json` |
| Android SSL | `plugins/withNetworkSecurityConfig.js` + `android/app/src/main/res/raw/gdig2.crt` | `plugins/`, `app.json` |
| iOS | `app.json` → `ios.bundleIdentifier`, `ios.infoPlist` | `app.json` |
| Fuentes | Plus Jakarta Sans + Lora Italic (`expo-font`) | `app/_layout.tsx` |
| Iconos | `lucide-react-native` + `Icon.tsx` wrapper | `src/shared/atoms/Icon.tsx` |

## 9. Testing
| Aspecto | Detalle | Evidencia |
|---------|---------|-----------|
| Framework | Vitest (globals, environment: node) | `vitest.config.ts` |
| Mocks RN | `__mocks__/react-native/` + `vitest.setup.ts` / `vitest.minimal.setup.ts` | `vitest.setup.ts` |
| Cobertura | sync, migración, API, auth, biometría, cart, history, patient status, syncStore | `tests/` |
| Known failures | `tests/DIAGNOSTICO-FALLOS.md` — mock incompleto RTL, reanimated Pressable | `tests/DIAGNOSTICO-FALLOS.md` |
| Comandos | `npm test`, `npm run test:watch` | `package.json` |

## 10. UI y Responsive
- Tokens: `src/shared/utils/tokens.ts` → `constants/Colors.ts` + `useColors.ts`
- Breakpoints: tablet ≥744pt, desktop ≥1024pt (`useResponsive.ts`)
- Shell tablet: `TabletHomeShell` + `Sidebar`; phone: `Stack` + tabs
- Glassmorphism: `BlurWrapper` (expo-blur iOS, semi-transparent View Android)
- No NativeWind/Tailwind — `StyleSheet.create`

---
*Este documento es baseline técnico. Cambios → nuevo TDD + ADR si afecta arquitectura.*