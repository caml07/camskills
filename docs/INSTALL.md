# Instalación de CamSkills

CamSkills mantiene una copia de las skills en el repositorio y crea enlaces
simbólicos hacia los agentes. El proceso no modifica modelos, credenciales,
plugins, hooks ni los repositorios de tus proyectos.

## Requisitos

- Git para obtener y actualizar el checkout.
- Python **3.9 o superior**.
- Bash para el lanzador `./setup`.
- Linux/macOS; en Windows la creación de symlinks depende de permisos del
  sistema y no está validada. Si no está disponible, usa la CLI
  [`skills`](https://github.com/vercel-labs/skills).

[`gum`](https://github.com/charmbracelet/gum) es opcional. Si existe y hay una
terminal interactiva, el selector se presenta como menú TUI. Si no, muestra un
menú numerado. No es necesario instalar gum para ejecutar el setup.

## Primer uso

```bash
git clone https://github.com/caml07/camskills.git
cd camskills
./setup
```

1. Elige **Install / Sync**.
2. Elige el perfil (para comenzar, **Essentials**).
3. Selecciona **Codex**, **OpenCode** o ambos.
4. Revisa el resumen de enlaces por crear, enlaces existentes y conflictos.
5. Confirma. Reinicia el agente para actualizar el descubrimiento.

El instalador conserva el checkout como fuente de verdad. No copies carpetas
manualmente a la configuración del agente: perderías la actualización por
enlace y la detección de archivos gestionados.

## Perfiles

| Perfil | Incluye | Uso típico |
|:--|:--|:--|
| `core` | Cam Route, AI Native Workflow, TDD, debugging, documentación, UI web, seguridad, verificación y review | Desarrollo diario |
| `web` | Core + colección de diseño | Frontend web y diseño UI |
| `mobile` | Core + colección Expo/React Native | Apps móviles |
| `engineering` | Core + herramientas de planificación, arquitectura y entrega | Trabajo técnico general |
| `pstack` | Core + Pstack público y versiones canónicas de `tdd`/`teach` | Flujos avanzados y verificadores |
| `all` | Todas las skills únicas del catálogo | Uso completo de las colecciones |

```bash
./setup install --profile core --agent both -y
./setup install --profile web --agent codex -y
./setup install --profile mobile --agent opencode -y
./setup install --profile all --agent both --dry-run
```

También puedes elegir una categoría o una o varias skills:

```bash
./setup install --category workflow --agent codex -y
./setup install --category design --category engineering --agent both -y
./setup install --skill cam-route --skill doc-system --agent opencode -y
```

`tdd` y `teach` aparecen en varias colecciones, pero los alias públicos
continúan apuntando a las versiones curadas de ingeniería. Las variantes
internas de Pstack no sobrescriben esas versiones.

## Comandos

| Comando | Qué hace |
|:--|:--|
| `./setup` | Menú interactivo principal |
| `./setup install` | Selector interactivo de perfil y agentes |
| `./setup install -y` | Instala `core` en ambos agentes, sin preguntas |
| `./setup list` | Lista categorías y cantidades |
| `./setup list --full` | Enumera todas las skills |
| `./setup status` | Muestra enlaces activos, ausentes y conflictos |
| `./setup doctor` | Detecta conflictos y enlaces rotos, sin modificar nada |
| `./setup remove --profile core --agent both -y` | Quita solo enlaces gestionados |
| `./install.sh` | Compatibilidad con el acceso anterior; equivale a `./setup install` |

Opciones comunes:

- `--profile <nombre>`: selecciona una colección curada.
- `--category <nombre>`: añade una categoría, repetible.
- `--skill <nombre>`: selecciona una skill, repetible.
- `--agent opencode|codex|both`: limita los destinos.
- `-y` o `--yes`: confirma operaciones sin interacción. Obligatorio al escribir
  desde scripts, cron o CI sin terminal.
- `--dry-run`: previsualiza sin crear directorios o enlaces.
- `--replace`: autoriza reemplazos **con respaldo** de archivos ajenos.
- `--verbose`: imprime el estado de cada skill, en vez de un resumen.
- `--full`: muestra el catálogo completo con `list`.

```bash
./setup --help
```

## Seguridad de instalación

Por defecto, el instalador hace tres cosas:

1. Si el enlace apunta a la skill correcta, **lo conserva**.
2. Si el destino no existe, crea un enlace simbólico.
3. Si hay una carpeta, un archivo, un enlace roto o un enlace a otro proyecto,
   **lo deja intacto** y señala el conflicto.

Una ejecución con conflictos puede instalar otros enlaces no afectados y salir
con código `2`. Una ejecución repetida es idempotente.

Si deseas reemplazar un conflicto conocido:

```bash
./setup install --skill cam-route --agent codex --replace --dry-run
./setup install --skill cam-route --agent codex --replace -y
```

El archivo o directorio anterior se mueve a una copia dentro de:

```text
~/.local/state/camskills/backups/<timestamp>-<pid>/<agent>/<skill>
```

Si está definida `XDG_STATE_HOME`, se utiliza ese directorio como base.
El instalador muestra la ruta exacta de la copia y **no elimina** esos backups.
Para recuperar algo, quita primero el enlace creado con `./setup remove` y
copia o mueve manualmente desde la ruta indicada. No reemplaces un nuevo
archivo de usuario sin inspeccionarlo.

### Directorios de destino

| Agente | Destino predeterminado | Origen de enlaces |
|:--|:--|:--|
| OpenCode | `~/.config/opencode/skills/` | `skills/<category>/<name>` |
| Codex | `~/.agents/skills/` | `codex/.agents/skills/<name>` cuando exista, o el origen canónico |

Puedes usar rutas de prueba sin tocar tu entorno actual:

```bash
CAMSKILLS_OPENCODE_DIR=/tmp/demo-opencode \
CAMSKILLS_CODEX_DIR=/tmp/demo-codex \
./setup install --profile core --agent both --dry-run
```

Ambas rutas se pueden configurar con variables de entorno:
`CAMSKILLS_OPENCODE_DIR` y `CAMSKILLS_CODEX_DIR`.
`OPENCODE_SKILLS_DIR` sigue siendo reconocido por compatibilidad.

## Actualización

Los enlaces apuntan al checkout. Para actualizar las skills y el instalador,
actualiza el repositorio:

```bash
cd ~/camskills
git status --short
git pull --ff-only
./setup doctor
```

Si añadiste skills nuevas y quieres incorporarlas, ejecuta otra vez
`./setup install --profile ...`. El instalador no realiza `git pull`,
ni hace commits, pushes, merges o cambios de configuración por su cuenta.

## Cam Route y plugins opcionales

La instalación de `cam-route` no añade automáticamente directivas globales.
La descripción de la skill permite que el agente la descubra; si deseas una
regla explícita, añade un puntero en el `AGENTS.md` de tu proyecto o de tu
configuración global indicando que consulte `cam-route/SKILL.md` antes de tareas
de ingeniería y que omita el router para preguntas simples.

Pstack está instalado en modalidad **skills-only**. El instalador tampoco
configura plugins de OpenCode como Ponytail, ni hooks de Claude Code, ni
subagentes que el runtime no pueda ejecutar.

## Verificación del instalador

```bash
python3 -m unittest discover -s tests -v
node --test scripts/check-cam-route.mjs
./setup doctor
```

La suite de Python crea directorios temporales separados del `HOME` real
y comprueba instalación, idempotencia, conflictos, backups y eliminación.
