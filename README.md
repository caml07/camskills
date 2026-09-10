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

### `engineering/` — Workflow general (mattpocock/skills, stack-agnostic)

| Skill | Descripción |
|-------|-------------|
| `ask-matt` | Router de skills: dice cuál/flow usar según la situación |
| `codebase-design` | Diseño de módulos profundos: interfaces chicas, seams limpios |
| `code-review` | Review de diff en 2 ejes (standards + spec) con sub-agents en paralelo |
| `diagnosing-bugs` | Loop de diagnóstico: reproduce → minimiza → hipótesis → instrument → fix |
| `domain-modeling` | Construir/afinar el modelo de dominio y lenguaje ubicuo (CONTEXT.md + ADRs) |
| `grill-with-docs` | Sesión que afila terminología del dominio y actualiza CONTEXT.md/ADRs |
| `implement` | Construir desde spec/tickets con `/tdd` y cierre con `/code-review` |
| `junior-to-senior` | Senior review adversarial de planes y arquitecturas agent-written |
| `improve-codebase-architecture` | Escanear la codebase por oportunidades de profundización + reporte HTML |
| `prototype` | Prototipo descartable para responder preguntas de diseño |
| `research` | Investigar contra fuentes primarias y capturar como Markdown citado |
| `resolving-merge-conflicts` | Resolver conflictos de merge hunk a hunk por intención |
| `setup-matt-pocock-skills` | Config del repo para la suite (issue tracker, labels, doc layout) |
| `tdd` | TDD genérico red-green-refactor (para RN usar `test-first`) |
| `to-spec` | Convertir la conversación en spec y publicarla al issue tracker |
| `to-tickets` | Romper plan/spec en tickets tracer-bullet con edges de bloqueo |
| `triage` | Mover issues por máquina de estados de roles |
| `wayfinder` | Planear trabajo enorme como mapa de tickets de decisión en el tracker |
| `wizard` | Generar wizards Bash interactivos para pasos que requieren intervención humana |

### `workflow/` — Herramientas propias y de productividad

| Skill | Descripción |
|-------|-------------|
| `academic-notes` | Organizar y enlazar apuntes de cursos universitarios con Day 00, resúmenes semanales y perfiles mutables por curso |
| `context7-mcp` | MCP de Context7 para docs actuales de librerías |
| `doc-system` | Documentación técnica humana: requirements, reference, change, ADR y runbook |
| `find-skills` | Descubrimiento e instalación de skills desde la CLI |
| `fix-debug` | Debug asistido con Context7 |
| `humanizer` | Reescritura de prosa que elimina patrones típicos de texto generado por IA |
| `no-commit-secrets` | Previene commits de secrets a git |
| `no-use-effect` | Prohíbe useEffect directo en React |
| `notes-vault` | Creación de notas en Obsidian vault |
| `skill-creator` | Creación de skills (flujo legacy con scripts) |
| `tanstack-query` | TanStack Query patterns y best practices |
| `security-audit` | Auditoría de seguridad de aplicaciones, APIs y clientes |

Origen y estado de cada skill (own / third-party / fork / plugin): ver `UPSTREAM.md`.

## MCPs

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

## Plugins

- `@dietrichgebert/ponytail` — modo lazy (externo, vía `opencode plugin --global`).
- `plugins/notification.js` (+ `toast.ps1`, `sounds/`) — notificaciones cuando opencode necesita atención, solo si el terminal no está enfocado (vía `niri msg windows`, falla abierto), con título `OC | <sesión>` y sonido por evento (Linux: `paplay`, sonidos en `plugins/sounds/`; Windows: `ms-winsoundevent` según urgencia). Eventos: `permission.asked` (critical), `question.asked` (critical), `session.idle`, `session.error` (critical), `tui.prompt.append`. Config: `OPENCODE_SOUNDS_DIR`, `OPENCODE_SOUND_{PERMISSION,QUESTION,IDLE,ERROR,PROMPT}`, `OPENCODE_NOTIFY_MATCH`, `OPENCODE_NOTIFY_DEVICE`. Copiar/symlink a `~/.config/opencode/plugins/`.

## Config

Copiar `opencode.jsonc.example` a `opencode.jsonc` y reemplazar `{{VAULT_PATH}}` y `{{CONTEXT7_API_KEY}}`.
