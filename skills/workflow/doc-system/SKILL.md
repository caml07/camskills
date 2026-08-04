---
name: doc-system
description: >-
  Documentación técnica estructurada con el sistema DOC-NNN-TYPE (propio).
  Tipos: FR-NFR, ADR, ARCHITECTURE, DESIGN, FLUJO (con PUML), API, RUNBOOK, SETUP,
  PLAN, AUDIT, CRITIQUE, OFFLINE. Soporta /doc:init, /doc:new, /doc:adr, /doc:diagram,
  /doc:audit, /doc:status. Detecta el idioma del proyecto (español/inglés).
  Compatible con notes-vault para persistir decisiones importantes.
  Activar cuando el usuario pida crear, actualizar, auditar o iniciar documentación
  técnica del proyecto, o mencione DOC-NNN, ADR, FR-NFR, PUML, diagramas de flujo.
  (Para definir modelo de dominio, lenguaje ubicuo o pasar una conversación a spec
  con issue tracker, usa 'domain-modeling' y 'to-spec' de la suite engineering.)
license: MIT
compatibility: opencode
---
# Doc System

Crea y mantiene documentación técnica usando el sistema de tipado `DOC-NNN-TYPE`.
Cada documento tiene tipo (FR-NFR, ADR, ARCHITECTURE, DESIGN, FLUJO, API, RUNBOOK,
SETUP, PLAN, AUDIT, CRITIQUE, OFFLINE) y un número secuencial auto-asignado.

## Por qué este sistema

La documentación técnica muere cuando:
- No hay un lugar predecible donde encontrarla → `docs/DOC-NNN-TYPE.md`
- No hay convención de tipos → cada doc type tiene un template con secciones obligatorias
- No se actualiza → `/doc:audit` detecta docs desactualizados contra código real
- No hay diagramas → PUML en `docs/diagrams/` versionable y generable desde texto

Cada tipo resuelve una pregunta distinta del proyecto. Usar el tipo correcto
hace que la info sea fácil de encontrar y mantener.

---

## Doc Types Catalog

| Tipo | Archivo | Para qué | Secciones clave |
|------|---------|----------|-----------------|
| **ARCHITECTURE** | `DOC-NNN-ARCHITECTURE.md` | Stack, routing, schema, data flow | Stack table, routing tree, SQL schema, data flow diagram |
| **FR-NFR** | `DOC-NNN-FR-NFR.md` | Requerimientos funcionales y no funcionales | Actores, FR table, NFR table, flujo actual |
| **ADR / DECISIONS** | `DOC-NNN-DECISIONS.md` | Architecture Decision Records | Contexto, Decisión, Cambios, Consecuencias, Token flow |
| **DESIGN** | `DOC-NNN-DESIGN.md` | Design tokens, UI system | YAML frontmatter, colors, typography, spacing, dark mode |
| **FLUJO** | `DOC-NNN-FLOW.md` + `.puml` | Diagramas de flujo con PUML | Descripción, diagrama PUML, actores, flujo paso a paso |
| **API** | `DOC-NNN-API.md` | Endpoints, request/response | Endpoints table, request/response schemas, auth, errores |
| **RUNBOOK** | `DOC-NNN-RUNBOOK.md` | Comandos y operaciones diarias | Dev commands, deploy, DB scripts, troubleshooting |
| **SETUP** | `DOC-NNN-SETUP.md` | Guía de instalación | Prerequisitos, install, config, dev users |
| **PLAN** | `DOC-NNN-PLAN.md` | Planes de implementación | Objetivo, fases, TDD steps, flujo nuevo, archivos a tocar |
| **AUDIT** | `DOC-NNN-AUDIT.md` | Auditorías de código/plataforma | Hallazgos por severidad, checklist, discrepancias, fix plan |
| **CRITIQUE** | `DOC-NNN-CRITIQUE.md` | Revisiones de UI/UX | Design health score, heuristics, RN audit, priority issues |
| **OFFLINE** | `DOC-NNN-OFFLINE.md` | Arquitectura offline | Schema, sync lifecycle, conflict resolution, queue |

---

## Convenciones

### Naming
```
docs/DOC-NNN-TYPE.md
docs/diagrams/<diagram-name>.puml
```
- `NNN` = número secuencial de 3 dígitos (001, 002...). Lo lee de `DOC-000-INDEX.md`.
  Si no existe INDEX, busca el DOC-NNN más alto con glob y suma 1.
- `TYPE` = tipo en MAYUSCULAS (ARCHITECTURE, FR-NFR, DECISIONS, DESIGN, FLOW, API,
  RUNBOOK, SETUP, PLAN, AUDIT, CRITIQUE, OFFLINE)
- El INDEX siempre es `docs/DOC-000-INDEX.md`

### Status indicators
| Símbolo | Significado |
|---------|-------------|
| ✅ | Hecho / Completado |
| ⚠️ | Parcial / En progreso |
| ❌ | Pendiente / No iniciado |
| 🔄 | En revisión |

### Idioma (bilingüe)
- Detectar el idioma del proyecto: leer `README.md`, comentarios en código fuente,
  `AGENTS.md`, `package.json` `description`, etc. Si la mayoría está en español,
  los templates y docs se generan en español. Si está en inglés, en inglés.
- Si hay mezcla o no se puede determinar, usar español por defecto.
- Si el usuario pasa `--english` o `--español`, respetar el flag.

---

## Comandos

### `/doc:init`

Escanea el proyecto y genera la estructura base de documentación.

**Paso a paso:**
1. Detectar stack del proyecto: leer `package.json`, `composer.json`,
   `Cargo.toml`, `pyproject.toml`, `Gemfile`, `go.mod`, `.csproj`, etc.
2. Detectar lenguaje principal y framework.
3. Determinar idioma del proyecto.
4. Crear `docs/` y `docs/diagrams/` si no existen.
5. Crear `docs/DOC-000-INDEX.md` con la tabla de contenidos vacía.
6. Generar docs prioritarios según stack detectado:
   - **Siempre**: ARCHITECTURE (DOC-001), SETUP (DOC-002), RUNBOOK (DOC-003),
     FR-NFR (DOC-004)
   - **Si hay API endpoints** (express, fastapi, next.js API routes, etc.): API doc
   - **Si hay DB** (SQLite, PostgreSQL, prisma schema, migrations): OFFLINE o
     schema doc según corresponda
   - **Si hay diseño visible** (tailwind, style files, tokens): DESIGN doc
   - **Si hay tests**: subsección en RUNBOOK o PLAN
7. Dejar ADR, FLUJO, PLAN, AUDIT, CRITIQUE para creación bajo demanda.
8. Actualizar INDEX con los docs generados.
9. Mostrar resumen al usuario: qué docs se crearon, qué falta hacer.

### `/doc:new TYPE [--english] [--title "Título"]`

Crea un nuevo documento del tipo especificado.

**Paso a paso:**
1. Leer INDEX para encontrar el próximo número disponible. Si no existe INDEX,
   buscar el DOC-NNN más alto con glob.
2. Copiar template correspondiente de `templates/TYPE.md`.
3. Rellenar el template según el contexto del proyecto:
   - Leer `package.json`, `tsconfig`, `app.json` u otros config files del proyecto
   - Leer código fuente relevante según el tipo de doc
   - Preguntar al usuario info faltante si es necesario
4. Guardar como `docs/DOC-NNN-TYPE.md`.
5. Si el tipo es FLUJO, crear también `docs/diagrams/<diagram-name>.puml`.
6. Actualizar INDEX con la nueva entrada.

### `/doc:adr "Título de la decisión"`

Appenda un Architecture Decision Record al documento DECISIONS.

**Paso a paso:**
1. Buscar `docs/DOC-NNN-DECISIONS.md` existente. Si no existe, crearlo
   con `/doc:new DECISIONS --title "Decisiones de Arquitectura"`.
2. Identificar el próximo ADR number (ADR-001, ADR-002...).
3. Antes de crear, aplicar YAGNI check: ¿esto necesita ADR? Si es trivial
   (cambiar versión, renombrar, refactor sin impacto), una línea en el commit basta.
4. Agregar sección con estructura:
   ```
   ## ADR-NNN: Título

   **Contexto:** Por qué se necesita. Alternativas (máx 3, una línea c/u).

   **Decisión:** Qué se eligió. Una frase. Si no cabe, reconsiderar.

   **Impacto:**
   - Archivos tocados, dependencias cambiadas
   - ponytail: <qué se omitió>, agregar cuando <condición>
   ```
4. Si la decisión es importante para el conocimiento persistente, crear una nota
   en el vault de Obsidian vía `notes-vault` con un resumen + wiki-link al ADR.
5. Actualizar INDEX.

### `/doc:diagram <nombre>`

Crea un diagrama PUML en `docs/diagrams/`.

**Paso a paso:**
1. Preguntar al usuario qué tipo de diagrama necesita:
   - **Sequence**: flujo de interacción entre actores/sistemas (login, payment...)
   - **C4 Context**: sistema y sus relaciones con externos
   - **C4 Container**: componentes internos del sistema
   - **C4 Component**: detalle de un container
   - **Activity**: flujo de decisiones y branching
   - **Use Case**: actores y casos de uso
2. Generar el archivo `.puml` en `docs/diagrams/<nombre>.puml`.
3. Usar `@startuml` / `@enduml`, incluir librerías C4 si corresponde:
   ```
   @startuml
   !include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
   ```
4. Poner título descriptivo, actores/sistemas relevantes, relaciones claras.
5. Si el diagrama pertenece a un FLUJO doc existente, agregar referencia
   en el doc correspondiente.
6. Informar al usuario que puede renderizar el `.puml` con PlantUML
   (VSCode extension, plantuml.com, o CLI).

### `/doc:audit`

Recorre `docs/` y verifica el estado de cada documento contra el código real.

**Paso a paso:**
1. Leer todos los `docs/DOC-*.md`.
2. Por cada doc:
   - **ARCHITECTURE**: verificar que stack table coincida con `package.json` /
     config files. Routing aún vigente? Schema SQL existe?
   - **FR-NFR**: features implementadas coinciden con estado reportado?
     Buscar en código si los FR marcados como ✅ realmente existen.
   - **RUNBOOK**: comandos aún funcionan? Flags correctos?
   - **API**: endpoints aún existen en el código?
   - **SETUP**: pasos aún válidos?
3. Marcar en INDEX los docs desactualizados: cambiar status a 🔄 y agregar
   nota de qué revisar.
4. Reportar al usuario: "X de Y docs actualizados. Z requieren revisión: ..."

### `/doc:status`

Muestra la tabla de `docs/DOC-000-INDEX.md` con el estado actual.

Si no existe INDEX, crearlo escaneando todos los `docs/DOC-*.md`.

---

## Template structure por tipo

Cada template está en `templates/<TYPE>.md`. Usarlos como base, no como
camisa de fuerza — adaptar secciones según el proyecto.

### ARCHITECTURE
- `# DOC-NNN: <Project> — Architecture`
- Stack table (Capa | Tecnología)
- Routing architecture (ASCII tree de directorios)
- SQL/Data schema (si aplica)
- Data flow diagram (ASCII o referencia a PUML)
- Platform notes

### FR-NFR
- `# DOC-NNN: <Project> — FR / NFR`
- Header con proyecto, stack, fechas
- Actores table
- FR table (ID, Nombre, Estado, Descripción)
- NFR table (ID, Nombre, Estado, Descripción)
- Flujo actual (ASCII) — paso a paso
- Fixes aplicados (si ya hay)
- PUML reference si existe diagrama asociado

### ADR (DECISIONS)
- `# DOC-NNN: Decisiones de Arquitectura`
- Cada ADR como sección `## ADR-NNN: Título`
- Schema: Contexto → Decisión → Cambios → Consecuencias → Token flow

### DESIGN
- YAML frontmatter con tokens completos: colorStrategy, colors light+dark, typography scale
  (display a footnote con fontFamily/fontSize/fontWeight/lineHeight), borderRadii semánticos
  (card:16, button:12, input:10, chip:999), shadowElevation, motion (duration, easing, spring),
  spacing scale (xs→xxl)
- `# DOC-NNN: <Project> — Design System`
- Color strategy selection (Restrained / Committed / Full Palette / Drenched) con anti-AI-slop check
- WCAG contrast table (4.5:1 body, 3:1 large text)
- Typography: expo-font loading, Platform.select font families, line length cap 65-75 chars
- Spacing: token system + preferir `gap` sobre margins
- Motion: Reanimated 4 patterns (useAnimatedStyle + withSpring, 150-250ms, reduced motion)
- Interaction: touch targets ≥44pt, Pressable scale animation, Gesture Handler, KeyboardAvoidingView
- AI Slop signals table (spinner→skeleton, Alert→bottom sheet, ScrollView→FlashList, etc.)
- Component examples: Button, Card, Input, Chip, Bottom Sheet con radios y patrones específicos
- Dark mode: light↔dark token mapping

### FLUJO
- `# DOC-NNN: <Project> — <Nombre del Flujo>`
- Descripción del flujo
- Actores / Sistemas participantes
- Diagrama PUML: referencia a `docs/diagrams/<name>.puml`
- Flujo paso a paso numerado
- Casos borde (errores, timeouts, offline)

### API
- `# DOC-NNN: <Project> — API Reference`
- Base URL, auth method
- Tabla de endpoints (Método, Path, Descripción, Auth)
- Por endpoint: Request schema, Response schema, Errores, Ejemplo

### RUNBOOK
- `# DOC-NNN: Runbook`
- Dev commands grupados por tarea
- Deploy / build steps
- DB scripts
- Troubleshooting section

### SETUP
- `# DOC-NNN: Setup Guide`
- Prerequisitos (lenguaje, herramientas, versiones)
- Instalación paso a paso
- Configuración
- Dev users / test data
- Verificación (cómo saber que funciona)

### PLAN
- `# DOC-NNN: Plan — <Nombre>`
- Objetivo, branch
- Flujo nuevo (ASCII)
- Fases de implementación con TDD (RED → GREEN → REFACTOR)
- Archivos a modificar/crear por fase
- Riesgos y mitigaciones

### AUDIT
- `# DOC-NNN: Audit — <Área>`
- Findings table (file, problema, root cause, qué cortar, reemplazar con)
- Regla ponytail: un guard en función compartida > guard en cada caller
- Actions: prioridad + qué hacer + archivo(s)
- Sin severidades, sin checklist especulativo, sin discrepancias — solo findings que llevan a acción

### CRITIQUE
- `# DOC-NNN: Critique — <Área>`
- 5 heurísticas clave (Visibility of System Status, User Control, Error Prevention,
  Error Recovery, Consistency) — solo las que generan acción
- Platform audit checklist con acción por cada fail
- Issues (P1/P2/P3) — qué cambiar, no scores
- Sin AI Slop verdict, sin personas especulativas

### OFFLINE
- `# DOC-NNN: Arquitectura Offline`
- Stack de componentes offline
- SQLite schema completo
- Sync lifecycle
- Conflict resolution strategy
- Queue management

---

## Integración con otras skills

### notes-vault
Cuando crees un ADR o una decisión importante, crear también una nota atómica
en Obsidian vault usando `notes-vault`. La nota debe tener:
- Título que refleje la decisión
- Wiki-link al ADR: `[[docs/DOC-NNN-DECISIONS.md#ADR-NNN]]`
- Tags: `tipo/adr`, `proyecto/<nombre-proyecto>`
- Resumen de 2-3 líneas con contexto y decisión

### ponytail
Cuando generes un PLAN, aplicar ponytail mode para asegurar que el plan
no incluya trabajo innecesario. Preguntar: "Esto es lo mínimo que funciona?"

---

## Edge cases

- **Proyecto sin docs/**: `/doc:init` lo crea junto con INDEX
- **INDEX no existe**: escanear con glob `docs/DOC-*.md` para determinar next number
- **Número saltado**: si existe DOC-001, DOC-002, DOC-005, el próximo es DOC-006.
  No rellenar saltos — respetar la secuencia natural.
- **Tipo no existe en templates**: preguntar al usuario qué secciones quiere
  y generar un doc custom, luego considerar agregar el template.
- **Proyecto vacío**: `/doc:init` genera solo ARCHITECTURE básico con el stack
  detectado (ej: solo package.json). El resto se crea bajo demanda.
- **Diagrama PUML muy complejo**: dividir en múltiples diagramas en vez de
  uno gigante. Un diagrama = un flujo atómico.
