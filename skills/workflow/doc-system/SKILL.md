---
name: doc-system
description: >-
  Documentación técnica estructurada con el sistema DOC-NNN-TYPE.
  Flujo canónico: BRD → PRD → FRD → TRD → TDD → ADR.
  Soporta Mermaid embebido en Markdown, trazabilidad por IDs, sincronización
  read-only contra código (doc:sync --check), y actualización controlada
  de evidencia técnica (doc:sync --apply). Español por defecto.
  Activa cuando el usuario pida crear, auditar, sincronizar o iniciar
  documentación del proyecto, o mencione DOC-NNN, ADR, BRD, PRD, FRD,
  TRD, TDD, Mermaid.
license: MIT
compatibility: opencode
---

# Doc System

Crea y mantiene documentación técnica con ciclo de vida gobernado:
**BRD → PRD → FRD → TRD → TDD → ADR**.

- **BRD** — Business Requirements Document: problema, objetivos, actores, métricas, alcance, riesgos.
- **PRD** — Product Requirements Document: comportamientos, journeys, UX, criterios de aceptación, scope por release.
- **FRD** — Functional Requirements Document: requisitos funcionales/no funcionales, reglas de negocio, casos borde, trazabilidad a PRD.
- **TRD** — Technical Requirements Document: arquitectura, stack, persistencia, API, seguridad, build, pruebas — baseline técnico.
- **TDD** — Technical Design Document: diseño técnico de un cambio concreto, archivos reales, migración, rollback, pruebas y aceptación.
- **ADR** — Architecture Decision Record: decisión técnica significativa con contexto, opciones, consecuencias y evidencia.

> **Nota:** TDD = *Technical Design Document*, no Test-Driven Development.

Cada documento vive en `docs/DOC-NNN-TYPE.md` con frontmatter de control. Diagramas en `docs/diagrams/<nombre>.md` con Mermaid nativo (sin dependencias externas).

---

## Catálogo de Tipos (Canónicos)

| Tipo | Archivo | Propósito | Secciones obligatorias |
|------|---------|-----------|------------------------|
| **BRD** | `DOC-NNN-BRD.md` | Requisitos de negocio | Problema, Objetivos, Actores, Métricas, Alcance/No-alcance, Riesgos, Supuestos, Aprobador |
| **PRD** | `DOC-NNN-PRD.md` | Requisitos de producto | Journeys, Comportamientos, Criterios de aceptación, Dependencias, Enlaces BRD, Prioridades, Scope por release |
| **FRD** | `DOC-NNN-FRD.md` | Requisitos funcionales | FR/NFR con IDs, Reglas, Casos borde, Estado (planificado/implementado/verificado), Trazabilidad PRD→FRD→Test |
| **TRD** | `DOC-NNN-TRD.md` | Requisitos técnicos | Stack, Arquitectura, Persistencia, API, Seguridad, Offline, Build, Testing, Evidencia de implementación |
| **TDD** | `DOC-NNN-TDD-<nombre>.md` | Diseño técnico de cambio | FRD/TRD afectados, Archivos reales, Diseño, Migración/Rollback, Offline/Errores, Pruebas, Aceptación |
| **ADR** | `DOC-NNN-ADR-<título>.md` (uno por decisión) | Registro de decisiones | Contexto, Opciones, Decisión, Consecuencias, Enlaces TDD/TRD, Estado (activo/sustituido/histórico) |

## Tipos de Referencia (Operativos)

| Tipo | Archivo | Propósito |
|------|---------|-----------|
| **SETUP** | `DOC-NNN-SETUP.md` | Instalación, prerequisitos, variables (solo nombres), verificación |
| **RUNBOOK** | `DOC-NNN-RUNBOOK.md` | Comandos diarios, deploy, DB scripts, troubleshooting — solo scripts comprobados en `package.json` |
| **API** | `DOC-NNN-API.md` | Referencia de comandos/endpoints: operación, transporte, auth, request/response, errores, ejemplos |
| **OFFLINE** | `DOC-NNN-OFFLINE.md` | Arquitectura offline: schema real, estados de cola, política de reintentos, evidencia de código |
| **DESIGN** | `DOC-NNN-DESIGN.md` | Design system: tokens, colores, tipografía, spacing, motion, dark mode, componentes |
| **FLOW** | `DOC-NNN-FLOW-<nombre>.md` + `.md` diagram | Flujo atómico con Mermaid: descripción, actores, diagrama, pasos, casos borde |

---

## Convenciones

### Naming
```
docs/DOC-NNN-TYPE.md                    # canónicos y referencias
docs/DOC-NNN-ADR-<slug>.md              # ADRs (uno por archivo)
docs/DOC-NNN-TDD-<slug>.md              # TDDs (uno por cambio)
docs/DOC-NNN-FLOW-<nombre>.md           # flujos con Mermaid
docs/diagrams/<diagram-name>.md         # diagramas Mermaid embebidos
```
- `NNN` = secuencial de 3 dígitos. Fuente: `docs/DOC-000-INDEX.md`; si no existe, glob al `DOC-*` más alto + 1.
- `TYPE` en MAYÚSCULAS: `BRD`, `PRD`, `FRD`, `TRD`, `TDD`, `ADR`, `SETUP`, `RUNBOOK`, `API`, `OFFLINE`, `DESIGN`, `FLOW`.
- El INDEX siempre es `docs/DOC-000-INDEX.md`.

### Frontmatter obligatorio (todos los DOC-NNN)
```yaml
---
id: DOC-016
tipo: BRD
estado: borrador | aprobado | vigente | reemplazado
idioma: es
verificado_el: 2026-08-21
relaciones: [DOC-017, DOC-018]    # trazabilidad forward/backward
evidencia: []                     # rutas de código/commits/pruebas que validan secciones
---
```

### Estados normalizados
| Símbolo | Significado |
|---------|-------------|
| ✅ | Vigente / Completado y verificado |
| ⚠️ | Parcial / En progreso |
| ❌ | Pendiente / No iniciado |
| 🔄 | En revisión / Discrepancia detectada |
| 📜 | Histórico / Reemplazado / Legacy |

### Idioma
- **Español por defecto**. Solo genera en inglés si el usuario pasa `--english` explícito.
- No detectar automáticamente: decide el usuario o el default.

---

## Comandos

### `/doc:init`
Inicializa la estructura documental canónica en un proyecto.

**Pasos:**
1. Leer `package.json`, `app.json`, `tsconfig.json`, rutas en `app/`, `src/`.
2. Detectar: framework (Expo/Next.js/etc.), persistencia (SQLite/Postgres/etc.), auth, API, testing, native config.
3. Crear `docs/` y `docs/diagrams/`.
4. Crear `docs/DOC-000-INDEX.md` vacío.
5. Generar **en orden** y **en español**:
   - `DOC-001-BRD.md` (template con supuestos marcados)
   - `DOC-002-PRD.md` (vinculado a BRD)
   - `DOC-003-FRD.md` (vinculado a PRD)
   - `DOC-004-TRD.md` (baseline técnico real: leer código, no inventar)
6. Crear referencias operativas según stack detectado:
   - `SETUP`, `RUNBOOK`, `API` (si hay endpoints/comandos), `OFFLINE` (si hay SQLite/cola), `DESIGN` (si hay tokens).
7. NO crear ADR, FLOW, TDD, AUDIT, CRITIQUE — solo bajo demanda.
8. Actualizar INDEX con todo lo generado.
9. Reportar resumen: qué se creó, qué supuestos requieren aprobación humana.

### `/doc:new TYPE [--english] [--title "Título"] [--links "DOC-001,DOC-002"]`
Crea un documento canónico o de referencia.

**Pasos:**
1. Validar `TYPE` ∈ {BRD, PRD, FRD, TRD, TDD, ADR, SETUP, RUNBOOK, API, OFFLINE, DESIGN, FLOW}.
2. Leer INDEX → próximo número. Si TYPE ∈ {TDD, ADR, FLOW}, el slug va en el nombre: `DOC-015-TDD-carrito-enviar.md`.
3. Cargar template `templates/TYPE.md`.
4. Rellenar con evidencia real:
   - Leer código fuente según tipo (rutas, stores, servicios, DB, config).
   - Para BRD/PRD: marcar secciones sin fuente como `⚠️ SUPUESTO — requiere aprobación`.
   - Para FRD/TRD/TDD: cada afirmación técnica debe tener `evidencia: ["src/...:L1-L10"]`.
5. Guardar en `docs/`.
6. Si `FLOW`: crear también `docs/diagrams/<nombre>.md` con Mermaid.
7. Actualizar INDEX y `relaciones` en documentos vinculados (`--links` o inferidos por tipo).

### `/doc:adr "Título de la decisión"`
Crea **un ADR por archivo** (no append a un mega-doc).

**Pasos:**
1. Próximo número desde INDEX (ej. `DOC-021-ADR-012-cambio-auth.md`).
2. YAGNI check: ¿decidió arquitectura o fue trivial? Trivial = línea en commit.
3. Template ADR con: Contexto, Opciones (máx 3), Decisión (una frase), Consecuencias, Enlaces a TDD/TRD, Estado `activo`.
4. Guardar archivo individual.
5. Actualizar INDEX y `relaciones` del TDD/TRD relacionado.
6. Opcional: crear nota en `notes-vault` con wiki-link `[[docs/DOC-021-ADR-012-cambio-auth.md]]`.

### `/doc:diagram <nombre> [--type sequence|c4context|c4container|c4component|state|er|flow]`
Crea diagrama Mermaid en `docs/diagrams/<nombre>.md`.

**Pasos:**
1. Tipo por defecto: `flow` (flowchart). `--type` permite: `sequence`, `c4context`, `c4container`, `c4component`, `state`, `er`, `flow`.
2. Generar archivo `.md` con fence ````mermaid` y sintaxis GitHub-compatible.
3. Incluir título, actores/sistemas, relaciones claras.
4. Si pertenece a un `FLOW` doc, agregar referencia cruzada.
5. Recordar: validar render en GitHub PR (GitHub usa mermaid-cli interno, versión variable).

### `/doc:sync --check`
**Solo lectura.** Compara documentación vigente contra código real.

**Salida estructurada (tabla):**
```
documento | sección | evidencia_esperada | evidencia_real | discrepancia | impacto | acción_recomendada
```

**Qué verifica:**
- Canónicos (BRD/PRD/FRD/TRD): que cada requisito técnico tenga `evidencia` válida (archivo existe, línea coincide).
- TRD: stack, versiones, rutas, schema DB, auth, API, build, tests contra `package.json`, `app.json`, `src/`, `app/`.
- OFFLINE: schema SQLite, estados de cola, reintentos contra `database.ts`, `sync.ts`, `cartStore.ts`.
- API: comandos/endpoints, auth, timeouts contra `api.ts`, `config.ts`.
- DESIGN: tokens, colores, tipografía contra `tokens.ts`, `Colors.ts`, `useColors.ts`.
- Referencias (SETUP/RUNBOOK): comandos en `package.json`, variables en `.env.example`.
- ADR: estados coherentes, enlaces a TDD/TRD válidos.
- INDEX: numeración, estados, relaciones bidireccionales.

**Nunca modifica archivos.** Solo reporta.

### `/doc:sync --apply`
Actualiza **solo** bloques marcados como evidencia técnica e INDEX.

**Precondición:** `/doc:sync --check` limpio (sin discrepancias no intencionales).
**Lo que toca:**
- Bloques `evidencia:` en FRD/TRD/TDD/ADR/OFFLINE/API/DESIGN.
- Tabla de `DOC-000-INDEX.md`.
- Diagramas Mermaid si el código cambió la estructura (solo si el diff es trivial: renombre de archivo, adición de export).
**Lo que NO toca nunca:**
- BRD, PRD, FRD (requisitos de negocio/producto — autoridad humana).
- ADR (decisiones — inmutables salvo nuevo ADR que los sustituya).
- Código, `.env`, `KEYSTORE`, secretos, archivos ignorados.
- Documentos marcados `📜 Histórico` en INDEX.

### `/doc:audit`
Alias de `/doc:sync --check`. Mantiene compatibilidad.

### `/doc:status`
Muestra `DOC-000-INDEX.md` con estado actual. Si no existe INDEX, lo construye escaneando `docs/DOC-*.md`.

---

## Templates (contenido mínimo)

Cada template en `templates/<TYPE>.md` incluye frontmatter y secciones obligatorias.

### BRD
- Problema, Objetivos medibles, Actores (primarios/secundarios), Métricas de éxito, Alcance / No-alcance, Riesgos de negocio/datos, Supuestos (marcados `⚠️`), Aprobador y fecha.

### PRD
- Journeys por actor, Comportamientos por feature, Criterios de aceptación (Given/When/Then), Dependencias técnicas, Enlaces a BRD (IDs), Prioridades (MoSCoW), Scope por release.

### FRD
- Tabla FR (ID, Nombre, Descripción, Regla/Caso borde, Estado, PRD-ID, Test-ID).
- Tabla NFR (ID, Nombre, Descripción, Métrica, Estado, PRD-ID).
- Trazabilidad: cada FR → PRD → Test.

### TRD
- Stack table (capa | tecnología | versión | evidencia).
- Arquitectura: routing, providers, límites feature/shared.
- Persistencia: SQLite schema vN, migraciones, KV stores.
- API: transporte, comandos, auth, timeouts, errores.
- Seguridad: tokens, biometría, SSL, secrets handling.
- Offline: cola, sync, reintentos, idempotencia.
- Build: dev build, prebuild, plugins nativos, SSL Android.
- Testing: framework, setup, coverage gaps conocidos.

### TDD
- FRD-IDs y TRD-IDs afectados.
- Archivos a tocar (crear/modificar/eliminar) con responsabilidad.
- Diseño: interfaces, data shapes, flujos de error, offline.
- Migración DB (si aplica): up/down, idempotencia, datos legacy.
- Rollback plan.
- Pruebas: unitarias, integración, e2e, aceptación manual.
- Criterios de done verificables.

### ADR
- Contexto (por qué), Opciones (máx 3, una línea c/u), Decisión (una frase), Consecuencias (positivas/negativas/riesgos), Enlaces TDD/TRD, Estado (`activo`/`sustituido`/`histórico`/`desconocido`), Próximo ADR number.

### FLOW + Diagrama Mermaid
- Descripción, Actores/Sistemas.
- Diagrama Mermaid embebido en `docs/diagrams/<nombre>.md`:
  ````markdown
  # Diagrama: <nombre>
  ```mermaid
  flowchart LR
      A[Actor] --> B[Sistema]
  ```
  ````
- Pasos numerados, Casos borde.

### API
- Base URL / transporte / auth.
- Tabla: Operación | Comando/Path | Descripción | Auth | Request | Response | Errores | Ejemplo.
- Soporta REST y command-based (POST único con `action`).

### OFFLINE
- Stack offline (SQLite, KV, NetInfo, Queue).
- Schema completo con versión actual.
- Sync lifecycle (inicial, foreground, timer, reconexión).
- Estados reales de cola (sin inventar `DEAD_LETTER` si no existe).
- Política de reintentos con evidencia de código.
- Conflict resolution strategy.

### DESIGN
- YAML frontmatter: colorStrategy, colors (light/dark), typography scale, borderRadii, shadowElevation, motion, spacing.
- Color strategy (Restrained/Committed/Full Palette/Drenched).
- WCAG contrast table.
- Typography: expo-font, Platform.select, line-length cap.
- Motion: Reanimated patterns, reduced motion.
- Component examples con tokens semánticos.

### SETUP / RUNBOOK
- Solo pasos comprobados. Variables: nombres, nunca valores. Scripts: solo los de `package.json`.

---

## Perfil Expo (activación automática)

Si `/doc:init` detecta **Expo** (`package.json` tiene `expo`, `expo-router`, `expo-sqlite`):

1. **TRD incluye obligatoriamente:**
   - `app.json` completo: plugins, ios/android config, bundle IDs, permissions.
   - Rutas `app/` con grupos, layouts, guards.
   - `expo-sqlite` schema + migraciones (`PRAGMA user_version`).
   - Persistencia: MMKV, SecureStore, `expo-sqlite/kv-store`.
   - Auth: flujo real (HVP, mock, biométrico), token storage.
   - API: `interfaceRequest` vs `request`, comandos HVP, static token.
   - Offline: `pedidos_queue`, `pedidos_history`, `syncStore`, `flushQueue`.
   - Build: `expo prebuild --clean`, `expo run:android`, SSL plugin, certificado.
   - Tests: Vitest setup, mocks RN, known failures.

2. **Diagramas base generados:**
   - Contexto (C4 Context): app ↔ HVP ↔ SQLite ↔ Device.
   - Navegación/Providers: root → auth guard → phone/tablet shells.
   - Módulos: features (auth, stations, patients, cart, layout) + shared.
   - Auth/Session: MMKV ↔ SecureStore ↔ Biometric.
   - Sync censo/dietas: HVP → api.ts → sync.ts → SQLite → queries.
   - Pedido online/offline: cart → queue/history → carrito_enviar.
   - Estado cola: máquina de estados real (no inventada).
   - SQLite ER: tablas, relaciones lógicas, JSON columns.
   - API HVP: comandos, auth, timeouts.
   - Responsive: phone (tabs) vs tablet (sidebar).
   - Build nativo: prebuild, plugins, gradle/xcode, SSL.
   - Tests: Vitest, mocks, baseline.

3. **Catálogo de codebase** (`docs/reference/CODEBASE-CATALOG.md`):
   - Rutas (`app/**`) con pantalla, guard, providers.
   - Features con componentes, hooks, stores, contextos.
   - Shared: átomos, moléculas, organismos, hooks, servicios, tipos, utils.
   - Cómo añadir: ruta, feature, componente, hook, servicio, consulta SQL, mutación, migración, comando HVP.

---

## Integración con otras skills

### notes-vault
Al crear ADR o decisión clave: nota atómica en Obsidian con título, wiki-link al ADR, tags `tipo/adr`, `proyecto/<nombre>`, resumen 2-3 líneas.

### ponytail
Al generar TDD o PLAN: aplicar principio "lo mínimo que funciona". Marcar simplificaciones con `ponytail: <qué se omitió>, agregar cuando <condición>`.

---

## Edge Cases

- **Sin docs/**: `/doc:init` crea todo.
- **INDEX inexistente**: glob `docs/DOC-*.md` → max NNN + 1.
- **Número saltado** (001, 002, 005): siguiente es 006. No rellenar.
- **Tipo sin template**: preguntar secciones, generar custom, evaluar añadir template.
- **Proyecto vacío**: solo BRD con stack detectado.
- **Diagrama complejo**: dividir en múltiples `FLOW` + diagrams atómicos.
- **Documentos legacy (pre-canónicos)**: mover a sección "Histórico" en INDEX, marcar `📜`, no renumerar, no borrar. Enlazar desde canon si aportan evidencia.

---

## Validación de la skill

Un proyecto Expo nuevo con `/doc:init` debe producir:
1. `DOC-001-BRD.md` a `DOC-004-TRD.md` en español, indexados, con trazabilidad.
2. `SETUP`, `RUNBOOK`, `API`, `OFFLINE`, `DESIGN` según stack.
3. Diagramas Mermaid en `docs/diagrams/` (contexto, nav, módulos, auth, sync, pedido, cola, ER, API, responsive, build, tests).
4. `CODEBASE-CATALOG.md` con rutas, features, shared y guías de extensión.

En este repo (HVP Dietas), `/doc:sync --check` debe detectar al menos:
- `DOC-009-OFFLINE.md` vs `database.ts` (schema v9, cola sin DEAD_LETTER).
- `DOC-002-API.md` vs `api.ts` (REST mock vs comandos HVP).
- `DOC-008-FRD.md` vs código real (auth MMKV, no AsyncStorage; cola sin DEAD_LETTER).
- ADRs en `DOC-007` con IDs inconsistentes vs registro canónico nuevo.

`--check` no modifica archivos. `--apply` solo tras check limpio y confirmación.