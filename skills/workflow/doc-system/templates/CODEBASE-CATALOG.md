---
id: DOC-{NNN}
tipo: REFERENCE
subtipo: CODEBASE-CATALOG
estado: vigente
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{TRD_ID}]
evidencia: []
---

# DOC-{NNN}: {Proyecto} — Codebase Catalog

> Generado automáticamente desde exports runtime. Fuente de verdad para extender el código.

## 1. Rutas (app/)
| Ruta | Pantalla | Guard | Providers | Descripción |
|------|----------|-------|-----------|-------------|
| `/login` | LoginScreen | Público | — | Autenticación |
| `/` | StationsScreen | Protegido | StationProvider | Lista de estaciones |
| `/history` | HistoryScreen | Protegido | StationProvider | Historial global |
| `/paciente/:stationId` | PatientListScreen | Protegido | StationProvider | Pacientes por estación |
| `/paciente/:stationId/:patientId` | PatientMenuScreen | Protegido | StationProvider | Menú por turno |

**Tablet (≥744pt):** `TabletHomeShell` + `Sidebar` reemplazan tabs. Mismas rutas.

## 2. Features (src/features/)
| Feature | Componentes | Hooks | Stores/Contextos | Servicios | Rutas asociadas |
|---------|-------------|-------|------------------|-----------|-----------------|
| auth | LoginScreen | useAuth | authStore (Zustand+MMKV) | biometricAuth, mmkvStorage | /login |
| stations | StationCard | useStations | StationContext | — | /, /paciente/:stationId |
| patients | PatientCard, MenuItem, PatientCartModal, PatientHistoryModal | usePatients, useMenu, useTiempoMap, useOrderedToday, useOrderedTiempos, useDietaCensusByStation | patientStatus utils | — | /paciente/:stationId, /paciente/:stationId/:patientId |
| cart | AddToCartSheet | — | cartStore (Zustand+SQLiteKV) | historyService | /paciente/:stationId/:patientId |
| layout | TabletHomeShell, Sidebar | — | — | — | (shell global) |

## 3. Shared (src/shared/)
| Categoría | Contenido |
|-----------|-----------|
| atoms | Button, Chip, Checkbox, Input, Icon, BlurWrapper, Accordion, PressableScale, Skeleton, ConnectivityBanner |
| molecules | FloatingTabBar, ErrorState, EmptyState, ModalShell |
| organisms | Screen, ScreenLoading, SplashScreen, ToastProvider |
| hooks | useSQLiteQuery, useResponsive, useColors, useToast, useChevronAnimation |
| services | api, database, sync, syncStore, mmkvStorage, historyService, biometricAuth, appLogger |
| types | Entidades: Agrupacion, Station, Patient, Dieta, Comida, Subcomida, CartItem, Order |
| utils | tokens, config, date, constants, breakpoints |

## 4. Cómo Añadir Algo Nuevo

### 4.1 Nueva Ruta
1. Crear archivo en `app/` (ej. `app/nueva-ruta.tsx`)
2. Si protegida: registrar en `app/(app)/_layout.tsx` (Stack) y/o `app/(app)/(tabs)/_layout.tsx` (Tab)
3. Si tab principal: agregar a tabs, barra flotante y sidebar (`TabletHomeShell`)
4. Ejecutar `npx tsc --noEmit`

### 4.2 Nueva Feature
1. Crear `src/features/<dominio>/` con estructura: `components/`, `hooks/`, `store/`, `context/`, `utils/`
2. La ruta es adaptador fino; lógica en feature
3. **No importar otras features** — pasar callbacks/props o subir utilidad genuina a `shared/`

### 4.3 Nuevo Componente
1. Reutilizar: `Screen`, `ModalShell`, átomos, `useColors`, `Icon`, `space`, `Typography`, `BorderRadius`
2. Shared UI: `src/shared/atoms/`, `molecules/`, `organisms/`
3. Tokens: `src/shared/utils/tokens.ts`

### 4.4 Nuevo Hook / Consulta SQLite
1. Usar `useSQLiteQuery<T>(key, sql, params)` — lee SQLite directo, re-ejecuta en `syncStore` signal
2. JSON fields (`subcomidas`, `tiempos`, `alergias`) → parsear con `tryDeserialize` de `database.ts`
3. Tras mutación: `withDb(...)` + `syncStore.getState().notify()`

### 4.5 Nuevo Servicio
1. En `src/shared/services/` — patrón singleton o funciones puras
2. API: `api.ts` → `request<T>()` (dev) / `interfaceRequest<T>()` (prod HVP)
3. Config: `src/shared/utils/config.ts`

### 4.6 Nueva Migración DB
1. Modificar bloque idempotente final en `database.ts: migrateDbIfNeeded`
2. Subir `DATABASE_VERSION` (actual: v9)
3. Añadir índices/columnas + guards `PRAGMA table_info`
4. Actualizar `ALLOWED_TABLES` si usar helpers genéricos
5. **No borrar DB** ante fallo — preserva cola e historial

### 4.7 Nuevo Comando HVP
1. Añadir en `api.ts: interfaceRequest()` — case en switch
2. Definir request/response types en `src/shared/types/index.ts`
3. Timeout: 5s lectura, 12s escritura
4. Documentar en `DOC-XXX-API.md`

---
*Actualizar con `doc:sync --apply` tras cambios en código. No editar a mano.*