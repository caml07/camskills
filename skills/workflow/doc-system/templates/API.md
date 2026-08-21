---
id: DOC-{NNN}
tipo: API
estado: vigente
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{TRD_ID}]
evidencia: []
---

# DOC-{NNN}: {Proyecto} — API Reference

> Soporta REST y command-based (POST único con `action`). Documentar lo que existe en código.

## 1. Transporte y Autenticación
| Entorno | Mecanismo | Base URL / Endpoint | Auth | Timeout | Evidencia |
|---------|-----------|---------------------|------|---------|-----------|
| Dev | `request<T>()` (REST) | `EXPO_PUBLIC_API_URL` | Ninguna (mock) | 5s | `api.ts`, `config.ts` |
| Prod | `interfaceRequest<T>()` (Command) | `EXPO_PUBLIC_HVP_INTERFACE_URL` | Bearer `STATIC_TOKEN` + session token | 5s (R) / 12s (W) | `api.ts`, `config.ts` |

## 2. Variables de Configuración (nombres solo)
| Variable | Descripción | Entorno |
|----------|-------------|---------|
| `EXPO_PUBLIC_HVP_STATIC_TOKEN` | Token estático HVP | Prod |
| `EXPO_PUBLIC_HVP_INTERFACE_URL` | URL endpoint HVP | Prod |
| `EXPO_PUBLIC_HVP_INTERFACE_SYSTEM` | Sistema HVP (ej. `NUTRICION`) | Prod |
| `EXPO_PUBLIC_API_URL` | Mock API (json-server) | Dev |

## 3. Operaciones / Comandos

### 3.1 Desarrollo (REST Mock — json-server)
| Método | Path | Descripción | Auth | Evidencia |
|--------|------|-------------|------|-----------|
| GET | `/nurses` | Login (validación client-side) | No | `api.ts` (mock) |
| GET | `/agrupaciones` | Agrupaciones de estaciones | No | |
| GET | `/stations` | Estaciones con `agrupacionId` | No | |
| GET | `/patients` | Pacientes (filtro client-side) | No | |
| GET | `/dietas` | Tipos de dieta | No | |
| GET | `/comidas` | Catálogo comidas con subcomidas | No | |
| GET | `/pedidos` | Historial pedidos | No | |
| POST | `/pedidos` | Crear pedido (status: `sent`) | No | |

> **Deprecado:** Mock API se limpia antes de merge a `main`.

### 3.2 Producción (HVP Command-Based)
**Transporte:** POST único a `INTERFACE_URL?strSystem={SYSTEM}` con body `{ strComando, ...params }`

| Comando | Descripción | Parámetros clave | Response | Evidencia |
|---------|-------------|------------------|----------|-----------|
| `censo` | Descarga agrupaciones, stations, patients | `strTokenTransaccion` | Censo completo | `api.ts:128-143` |
| `dietas` | Descarga dietas, comidas, tiempos | `strTokenTransaccion` | Dietas + comidas | `api.ts` |
| `carrito` | Envía items individuales a cocina | `decCuenta`, `decPaciente`, `decIdDieta`, `decIdMenu`, `decIdTiempo`, `datFecha`, `strObservaciones` | Confirmación | `api.ts` |
| `carrito_enviar` | Confirma grupo enviado por cuenta/paciente/dieta | `decCuenta`, `decPaciente`, `decIdDieta`, `datFecha` | Confirmación grupo | `api.ts` |

#### Ejemplo Request (carrito)
```json
{
  "strComando": "carrito",
  "strTokenTransaccion": "TOKEN_DINAMICO",
  "decCuenta": "123",
  "decPaciente": "456",
  "decIdDieta": "789",
  "decIdMenu": "101",
  "decIdTiempo": "202",
  "datFecha": "2026-08-21",
  "strObservaciones": "",
  "strObservacionesDieta": ""
}
```

#### Ejemplo Response
```json
{
  "success": true,
  "data": { "id": "..." },
  "error": null
}
```

## 4. Errores Comunes
| Código / Tipo | Significado | Acción |
|---------------|-------------|--------|
| 401 / Unauthorized | Token expirado / inválido | Re-login / refresh biométrico |
| Timeout 5s/12s | Red lenta / server down | Reintento (cola offline en prod) |
| `SSLHandshakeException` | Cert intermedio faltante (Android) | Ver `RUNBOOK` → SSL fix |

## 5. Idempotencia y Cola Offline
- `idempotency_key` en `pedidos_queue` y `pedidos_history`
- Deduplicación censo: `meta.censoHash-v2`
- Reintentos: backoff exponencial max 60s (ver `sync.ts`, `cartStore.ts`)

---
*Actualizar cuando cambien comandos, parámetros, timeouts o auth en `api.ts` / `config.ts`.*