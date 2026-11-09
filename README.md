# camskills

Mis skills de [opencode](https://opencode.ai). Para instalar en cualquier máquina.

## Skills

Los skills se organizan en `skills/` por **categoría** (cada skill es una carpeta con `SKILL.md`).

### `mobile/` — React Native / Expo

| Skill | Descripción |
|-------|-------------|
| `eas-app-stores` | Deploy de apps Expo a tiendas con EAS (build + submit, eas.json) |
| `eas-hosting` | Hosting de proyectos Expo con EAS |
| `eas-observe` | Observabilidad y métricas de EAS |
| `eas-simulator` | Ejecutar y depurar apps Expo en simuladores iOS/Android con EAS |
| `eas-update-insights` | Insights de EAS Update |
| `eas-workflows` | Workflows de EAS |
| `expo-animation` | Animaciones y gestos en Expo (Reanimated, haptics, transiciones) |
| `expo-app-clip` | App Clips iOS integrados con proyectos Expo |
| `expo-brownfield` | Integrar Expo dentro de una app nativa existente |
| `expo-data-fetching` | Networking/API en Expo: fetch, React Query, offline, caching |
| `expo-design-system` | Design system en Expo: tokens, temas y componentes consistentes |
| `expo-dev-client` | Dev clients Expo para probar código nativo en dispositivos |
| `expo-dom` | Integración Expo DOM |
| `expo-examples` | Encontrar ejemplos oficiales de Expo antes de inventar una implementación |
| `expo-migrate-module` | Migrar módulos Expo |
| `expo-module` | Crear módulos nativos Expo y config plugins |
| `expo-native-ui` | UI nativa Expo: HIG, controles nativos, animaciones, storage |
| `expo-overview` | Punto de entrada y router de skills Expo: detecta el objetivo y deriva al skill correcto |
| `expo-project-structure` | Estructura y límites recomendados para proyectos Expo |
| `expo-router` | Navegación y routing en Expo Router |
| `expo-skill-feedback` | Enviar feedback accionable sobre skills Expo |
| `expo-tailwind-setup` | Configurar Tailwind en proyectos Expo |
| `expo-ui` | Componentes y patrones de UI para Expo |
| `expo-upgrade` | Guía de upgrades de SDK Expo y fixes de dependencias |
| `expo-web-to-native` | Migrar superficies web a patrones nativos Expo |
| `mobile-app-ui-design` | Diseño de UI móvil |
| `impeccable-rn` | Diseño React Native / Expo nativo (fork curado; cambio, craft y audit) |
| `test-first` | TDD con Vitest + testing-library/react-native |
| `vercel-react-native-skills` | Best practices de perf RN/Expo (FlashList, animaciones, native modules) |

### `design/` — Diseño web/UI

| Skill | Descripción |
|-------|-------------|
| `emil-design-eng` | Filosofía de diseño de Emil Kowalski |
| `impeccable` | Diseño frontend web (fork de pbakaus/impeccable; adapta rutas `.opencode` y tool `question`) |

### `pstack/` — Workflows rigurosos para agentes

Colección de 67 skills de Pstack (port de `michael-denyer/pstack-claude`) con
principios de ingeniería, diagnóstico, arquitectura, revisión de código y
verificación. Incluye `poteto-mode`, `thermo-nuclear-code-quality-review`,
`thermo-nuclear-review` y `thermos`.

- Codex y OpenCode exponen 65 skills de forma individual.
- `tdd` y `teach` de Pstack se conservan solo dentro de la colección: no
  sustituyen las versiones existentes de Matt Pocock.
- Instalación **skills-only**: no hay hooks de inicio, enrutamiento automático,
  agentes nativos ni cambios a la configuración de los modelos. Las funciones
  que requieren subagentes dependen de que el runtime tenga esos recursos.
- Invoca `$poteto-mode` o `$thermo-nuclear-code-quality-review` en Codex;
  desde OpenCode selecciona la skill correspondiente.
- Procedencia, licencias y notas: [`skills/pstack/README.md`](skills/pstack/README.md).

### `engineering/` — Workflow general (mattpocock/skills, stack-agnostic)

| Skill | Descripción |
|-------|-------------|
| `ask-matt` | Router de skills: dice cuál/flow usar según la situación |
| `codebase-design` | Diseño de módulos profundos: interfaces chicas, seams limpios |
| `code-review` | Review de diff en 2 ejes (standards + spec) con sub-agents en paralelo |
| `diagnosing-bugs` | Loop de diagnóstico: reproduce → minimiza → hipótesis → instrument → fix |
| `domain-modeling` | Construir/afinar el modelo de dominio y lenguaje ubicuo (GLOSSARY.md + ADRs) |
| `grilling` | Entrevista iterativa que recorre el árbol de decisiones hasta eliminar supuestos abiertos |
| `grill-me` | Entrevista intensa para afinar un plan o diseño fuera de un repo |
| `grill-with-docs` | Sesión que afila terminología del dominio y actualiza GLOSSARY.md/ADRs |
| `handoff` | Compactar la conversación en un documento portátil para otro agente |
| `implement` | Construir desde spec/tickets con `/tdd` y cierre con `/code-review` |
| `implement-spec` | Implementar una spec completa como grafo de tickets en una rama de integración |
| `junior-to-senior` | Senior review adversarial de planes y arquitecturas agent-written |
| `improve-codebase-architecture` | Escanear la codebase por oportunidades de profundización + reporte HTML |
| `pr` | Escribir el cuerpo de un PR con resumen, evidencia y riesgo de merge |
| `prototype` | Prototipo descartable para responder preguntas de diseño |
| `research` | Investigar contra fuentes primarias y capturar como Markdown citado |
| `retro` | Retrospectiva de una sesión para mejorar el entorno y guardrails del agente |
| `resolving-merge-conflicts` | Resolver conflictos de merge hunk a hunk por intención |
| `setup-matt-pocock-skills` | Config del repo para la suite (issue tracker, labels, doc layout) |
| `tdd` | TDD genérico red-green-refactor (para RN usar `test-first`) |
| `teach` | Enseñar un concepto de forma persistente en un workspace de aprendizaje |
| `to-questionnaire` | Convertir decisiones bloqueadas en un cuestionario para quien tiene el contexto |
| `to-spec` | Convertir la conversación en spec y publicarla al issue tracker |
| `to-tickets` | Romper plan/spec en tickets tracer-bullet con edges de bloqueo |
| `triage` | Mover issues por máquina de estados de roles |
| `wait-what` | Reexplicar el último mensaje con contexto y lenguaje sencillo |
| `wayfinder` | Planear trabajo enorme como mapa de tickets de decisión en el tracker |
| `wizard` | Generar wizards Bash interactivos para pasos que requieren intervención humana |
| `writing-for-agents` | Guía para escribir skills, AGENTS.md y documentos consumidos por agentes |

### `workflow/` — Herramientas propias y de productividad

| Skill | Descripción |
|-------|-------------|
| `academic-notes` | Organizar y enlazar apuntes de cursos universitarios con Day 00, resúmenes semanales y perfiles mutables por curso |
| `cam-route` | Router de intención y riesgo: elige el mínimo set de skills por tarea y deriva el código a un workflow proporcional |
| `ai-native-workflow` | Pipeline Quick/Standard/Deep para planificar, implementar, verificar, simplificar y revisar cambios de código |
| `context7-mcp` | MCP de Context7 para docs actuales de librerías |
| `doc-system` | Documentación técnica humana: requirements, reference, change, ADR y runbook |
| `find-skills` | Descubrimiento e instalación de skills desde la CLI |
| `fix-debug` | Debug asistido con Context7 |
| `humanizer` | Reescritura de prosa que elimina patrones típicos de texto generado por IA |
| `no-commit-secrets` | Previene commits de secrets a git |
| `no-use-effect` | Prohíbe useEffect directo en React |
| `notes-vault` | Creación de notas en Obsidian vault |
| `osf-vault` | Notas, lectura y research agentico para el vault de Obsidian Soundfields; preserva Episode/Entity/Lore distinctions y commits locales seguros |
| `skill-creator` | Creación de skills (flujo legacy con scripts) |
| `tanstack-query` | TanStack Query patterns y best practices |
| `security-audit` | Auditoría de seguridad de aplicaciones, APIs y clientes |

Origen y estado de cada skill (own / third-party / fork / plugin): ver `UPSTREAM.md`.

### Enrutamiento por intención

`cam-route` clasifica tareas por resultado, superficie y riesgo. Responde
directamente a peticiones simples; activa una skill principal para planes,
UI, documentación, estudio y revisiones; y usa `ai-native-workflow` cuando
se modifica código. El workflow aplica **Quick**, **Standard** o **Deep**,
con skills de apoyo solo en la fase donde sean necesarias.

La [tabla de rutas](skills/workflow/cam-route/references/route-map.md) recoge
los criterios y ejemplos. Pstack, Ponytail y Thermo-Nuclear son herramientas
optativas de fases específicas, no reglas globales obligatorias. Para
verificar UI, la skill `verify` se genera **en el proyecto** con
`create-verification-skill`; no existe un verificador universal.

En esta máquina, Codex usa `~/.codex/AGENTS.md` y OpenCode usa
`~/.config/opencode/AGENTS.md` como punteros mínimos de activación.
En otra instalación, esos punteros se deben configurar por separado.
Invocación manual: `$cam-route` (Codex) o `cam-route` (OpenCode).
Comprobación estática del catálogo: `node --test scripts/check-cam-route.mjs`.

## OpenCode MCPs

La plantilla opcional y la configuración segura de Context7, Obsidian y
Composio están en [`MCP.md`](MCP.md) y
[`opencode.mcp.example.jsonc`](opencode.mcp.example.jsonc). No contienen
credenciales.

## Instalación

### Instalador CamSkills (recomendado)

Elegís por categoría y activa los skills en `~/.config/opencode/skills/`:

```bash
git clone git@github.com:caml07/camskills.git ~/camskills
cd ~/camskills && ./install.sh
```

### Skill individual (vía npx skills)

```bash
npx skills add https://github.com/caml07/camskills --skill doc-system
```

### Todos a la vez (manual)

```bash
git clone git@github.com:caml07/camskills.git ~/camskills
# Linux/macOS: symlinks
ln -s ~/camskills/skills/*/* ~/.config/opencode/skills/
```

Nota: si ya tenés `context7-mcp` instalado en otra ruta, no lo actives.

## Codex

La colección compatible con Codex vive en [`codex/.agents/skills`](codex/.agents/skills).
Las skills portables son symlinks a la fuente OpenCode; solo las que dependen de
herramientas del host tienen un overlay específico para Codex.

```bash
git clone git@github.com:caml07/camskills.git ~/camskills
mkdir -p ~/.agents/skills
ln -s ~/camskills/codex/.agents/skills/* ~/.agents/skills/
```

En Codex, ejecuta `/skills` para comprobar el descubrimiento y usa
`$nombre-skill` para invocar una explícitamente. La configuración opcional de
Context7 está en [`codex/config.example.toml`](codex/config.example.toml); no
copies configuraciones OpenCode JSONC ni credenciales.

## Plugins

- `@dietrichgebert/ponytail@5.3.2` — modo lazy (externo, configurado en `plugins` de OpenCode V2).
- `opencode-skill-creator@0.3.6` — plugin V2 instalado desde npm; el checkout de desarrollo vive fuera de `~/.config/opencode/skills/` para evitar skills duplicadas.
- `plugins/notification.js` (+ `toast.ps1`, `sounds/`) — notificaciones cuando opencode necesita atención, solo si el terminal no está enfocado (vía `niri msg windows`, falla abierto), con título `OC | <sesión>` y sonido por evento (Linux: `paplay`, sonidos en `plugins/sounds/`; Windows: `ms-winsoundevent` según urgencia). Eventos: `permission.asked` (critical), `question.asked` (critical), `session.idle`, `session.error` (critical), `tui.prompt.append`. Config: `OPENCODE_SOUNDS_DIR`, `OPENCODE_SOUND_{PERMISSION,QUESTION,IDLE,ERROR,PROMPT}`, `OPENCODE_NOTIFY_MATCH`, `OPENCODE_NOTIFY_DEVICE`. Copiar/symlink a `~/.config/opencode/plugins/`.

## Config

Copiar `opencode.jsonc.example` a `opencode.jsonc` y reemplazar `{{VAULT_PATH}}` y `{{CONTEXT7_API_KEY}}`.
