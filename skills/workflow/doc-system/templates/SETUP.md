---
id: DOC-{NNN}
tipo: SETUP
estado: vigente
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{TRD_ID}]
evidencia: []
---

# DOC-{NNN}: {Proyecto} — Setup Guide

> Solo pasos comprobados. Variables: **nombres únicamente**, nunca valores ni credenciales.

## 1. Prerrequisitos
| Herramienta | Versión mínima | Comando de verificación |
|-------------|----------------|------------------------|
| Node.js | | `node --version` |
| npm | | `npm --version` |
| Expo CLI | | `npx expo --version` |
| Android SDK | | `adb version` |
| Xcode (iOS) | | `xcodebuild -version` |
| SQLite CLI | 3.45+ | `sqlite3 --version` |

## 2. Instalación
```bash
git clone <repo-url>
cd <proyecto>
npm install
```

## 3. Configuración
### 3.1 Variables de entorno (nombres فقط)
Copiar `.env.example` a `.env` y completar:

| Variable | Descripción | Requerida | Ejemplo (formato) |
|----------|-------------|-----------|-------------------|
| `EXPO_PUBLIC_HVP_STATIC_TOKEN` | Token estático HVP | Prod | `hvp_...` |
| `EXPO_PUBLIC_HVP_INTERFACE_URL` | URL interface HVP | Prod | `https://...` |
| `EXPO_PUBLIC_HVP_INTERFACE_SYSTEM` | Sistema HVP | Prod | `NUTRICION` |
| `EXPO_PUBLIC_API_URL` | Mock API (dev) | Dev | `http://localhost:3001` |

### 3.2 Certificados SSL (Android)
- `android/app/src/main/res/raw/gdig2.crt` — certificado GoDaddy G2
- Verificar en `plugins/withNetworkSecurityConfig.js`

## 4. Usuarios de Prueba / Datos de Desarrollo
| Usuario | Rol | Contexto |
|---------|-----|----------|
| | | Mock / Dev |

## 5. Verificación
```bash
# TypeScript
npx tsc --noEmit

# Tests
npm test

# Dev server
npm start

# Build nativo Android (requiere device físico)
npm run android

# DB local
npm run db
```

## 6. Troubleshooting Común
| Síntoma | Causa | Solución |
|---------|-------|----------|
| `SSLHandshakeException` Android | Falta cert intermedio GoDaddy G2 | `npx expo prebuild --clean && npx expo run:android` |
| Metro no conecta en device | Falta `adb reverse` | `adb reverse tcp:8081 tcp:8081` |
| Fuentes no cargan | Carga comentada en `_layout.tsx` | Descomentar `useFonts` en `app/_layout.tsx` |

---
*Actualizar solo cuando cambien prerequisitos, variables o pasos comprobados.*