---
id: DOC-{NNN}
tipo: RUNBOOK
estado: vigente
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{TRD_ID}, DOC-{SETUP_ID}]
evidencia: []
---

# DOC-{NNN}: {Proyecto} — Runbook

> Solo comandos comprobados en `package.json`. Sin inventar scripts.

## 1. Desarrollo
```bash
# Instalar dependencias
npm install

# Dev server (Expo)
npm start

# Type check
npx tsc --noEmit

# Tests (Vitest)
npm test           # single run
npm run test:watch # watch mode
```

## 2. Base de Datos (SQLite)
```bash
# Traer DB del device a logs/nutricion.db
npm run pull-db

# Abrir sqlite3 shell (crudo)
npm run db

# Abrir con headers y columnas
npm run db:q

# Exportar todas las tablas a logs/db-export.json
npm run db:dietas
# alias: npm run dump
```

## 3. Build y Deploy
```bash
# Dev build nativo Android (device físico requerido)
npm run android

# Dev build nativo iOS
npm run ios

# Build release APK (firmado con debug keystore — solo interno)
npx expo run:android --variant release
# o manual:
# cd android && ./gradlew assembleRelease

# Prebuild limpio (tras cambios en app.json o plugins)
npx expo prebuild --clean
```

## 4. Publicación (Manual)
1. GitHub → Releases → Draft a new release
2. Crear tag `vX.Y.Z`
3. Adjuntar `.apk` como asset

## 5. Troubleshooting
| Problema | Solución | Evidencia |
|----------|----------|-----------|
| `SSLHandshakeException` Android | Cert intermedio GoDaddy G2 faltante | `npx expo prebuild --clean && npx expo run:android` |
| Metro no conecta en device físico | Falta `adb reverse` | `adb reverse tcp:8081 tcp:8081` (repetir tras reconectar cable) |
| Fuentes no cargan | `useFonts` comentado en `app/_layout.tsx` | Descomentar carga de fuentes |
| Tests fallan | Mocks incompletos (RTL, Reanimated) | Ver `tests/DIAGNOSTICO-FALLOS.md` — baseline aceptado |
| `EXPO_PUBLIC_*` no definidas | Falta `.env` | Copiar `.env.example` → `.env` y completar |

## 6. Logs y Debug
- Logs app: `logs/app-log.txt` (device/emulador)
- `appLogger.ts` escribe ahí
- `adb logcat` para logs nativos

---
*Actualizar solo cuando `package.json` scripts cambien o se verifiquen nuevos comandos.*