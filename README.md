# camskills

Mis skills de [opencode](https://opencode.ai). Para instalar en cualquier máquina.

## Skills

| Skill | Descripción |
|-------|-------------|
| `context7-mcp` | MCP de Context7 para docs actuales de librerías |
| `doc-system` | Documentación técnica estructurada DOC-NNN-TYPE |
| `eas-app-stores` | Deploy de apps Expo a tiendas con EAS (build + submit, eas.json) |
| `emil-design-eng` | Filosofía de diseño de Emil Kowalski |
| `expo-data-fetching` | Networking/API en Expo: fetch, React Query, offline, caching |
| `expo-dev-client` | Dev clients Expo para probar código nativo en dispositivos |
| `expo-native-ui` | UI nativa Expo: HIG, controles nativos, animaciones, storage |
| `expo-router` | Navegación y routing en Expo Router |
| `expo-upgrade` | Guía de upgrades de SDK Expo y fixes de dependencias |
| `find-skills` | Descubrimiento e instalación de skills desde la CLI |
| `fix-debug` | Debug asistido con Context7 |
| `impeccable` | Diseño frontend web (fork de pbakaus/impeccable) |
| `impeccable-rn` | Diseño frontend React Native / Expo (fork + doctor/audit propios) |
| `junior-to-senior` | Senior review adversarial de planes y arquitectura |
| `mobile-app-ui-design` | Diseño de UI móvil |
| `no-commit-secrets` | Previene commits de secrets a git |
| `no-use-effect` | Prohíbe useEffect directo en React |
| `notes-vault` | Creación de notas en Obsidian vault |
| `skill-creator` | Creación de skills (flujo legacy con scripts) |
| `tanstack-query` | TanStack Query patterns y best practices |
| `test-first` | TDD con Vitest + testing-library/react-native |
| `vercel-react-native-skills` | Best practices de perf RN/Expo (FlashList, animaciones, native modules) |

### Suite engineering (mattpocock/skills) — stack-agnostic

Workflow general de ingeniería (no RN). Origen y estado: ver `UPSTREAM.md`.

| Skill | Descripción |
|-------|-------------|
| `ask-matt` | Router de skills: dice cuál/flow usar según la situación |
| `codebase-design` | Diseño de módulos profundos: interfaces chicas, seams limpios |
| `code-review` | Review de diff en 2 ejes (standards + spec) con sub-agents en paralelo |
| `diagnosing-bugs` | Loop de diagnóstico: reproduce → minimiza → hipótesis → instrument → fix |
| `domain-modeling` | Construir/afinar el modelo de dominio y lenguaje ubicuo (CONTEXT.md + ADRs) |
| `grill-with-docs` | Sesión que afila terminología del dominio y actualiza CONTEXT.md/ADRs |
| `implement` | Construir desde spec/tickets con `/tdd` y cierre con `/code-review` |
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

Origen y estado de cada skill (third-party / fork / own): ver `UPSTREAM.md`.

## Instalación

```bash
# Skill individual (vía npx skills)
npx skills add https://github.com/caml07/camskills --skill doc-system

# Todos a la vez (symlink desde ~/.config/opencode)
git clone git@github.com:caml07/camskills.git ~/camskills
ln -s ~/camskills/skills/* ~/.config/opencode/skills/
```

Nota: si ya tenés `context7-mcp` instalado en otra ruta, no lo symlinkees.

## Plugins

- `@dietrichgebert/ponytail` — modo lazy (externo, vía `opencode plugin --global`).
- `plugins/notification.js` (+ `toast.ps1`, `sounds/`) — notificaciones cuando opencode necesita atención, solo si el terminal no está enfocado (vía `niri msg windows`, falla abierto), con título `OC | <sesión>` y sonido por evento (Linux: `paplay`, sonidos en `plugins/sounds/`; Windows: `ms-winsoundevent` según urgencia). Eventos: `permission.asked` (critical), `question.asked` (critical), `session.idle`, `session.error` (critical), `tui.prompt.append`. Config: `OPENCODE_SOUNDS_DIR`, `OPENCODE_SOUND_{PERMISSION,QUESTION,IDLE,ERROR,PROMPT}`, `OPENCODE_NOTIFY_MATCH`, `OPENCODE_NOTIFY_DEVICE`. Copiar/symlink a `~/.config/opencode/plugins/`.

## Config

Copiar `opencode.jsonc.example` a `opencode.jsonc` y reemplazar `{{VAULT_PATH}}` y `{{CONTEXT7_API_KEY}}`.
