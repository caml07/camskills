<div align="center">

# CamSkills

**One collection. Two agents. The right skill for the job.**

Una colección curada de skills para desarrollo asistido por agentes.
Rutas inteligentes, workflows verificables y una instalación que respeta tu entorno.

[![OpenCode](https://img.shields.io/badge/OpenCode-supported-151B20?style=flat-square)](https://opencode.ai)
[![Codex](https://img.shields.io/badge/Codex-supported-151B20?style=flat-square)](https://developers.openai.com/codex)
[![Python](https://img.shields.io/badge/installer-Python_3.9%2B-6FAF8C?style=flat-square)](docs/INSTALL.md)
[![Agent Skills](https://img.shields.io/badge/format-Agent_Skills-6FAF8C?style=flat-square)](https://agentskills.io)
[![Validation](https://github.com/caml07/camskills/actions/workflows/validate.yml/badge.svg)](https://github.com/caml07/camskills/actions/workflows/validate.yml)

[**Instalar**](#quick-start) · [**Explorar skills**](docs/CATALOG.md) · [**Cómo funciona**](#workflow) · [**Documentación**](#documentación)

</div>

---

## Quick start

```bash
git clone https://github.com/caml07/camskills.git
cd camskills
./setup
```

Abre el menú interactivo, escoge un perfil y selecciona **Codex**, **OpenCode** o ambos. No necesita sudo ni instala dependencias de terceros. Si tienes [gum](https://github.com/charmbracelet/gum), el menú usa un selector TUI; sin gum sigue funcionando con un menú de texto.

```text
╭──────────────────────────────────────────────────╮
│  CAMSKILLS   /   AGENT SKILL MANAGER             │
╰──────────────────────────────────────────────────╯
  141 skills / Codex + OpenCode / no sudo

  › Install / Sync
    Browse catalog
    Doctor / Status
    Remove installed skills
    Help
    Exit
```

<details>
<summary><strong>Prefiero un comando directo</strong></summary>

```bash
# Colección esencial para ambos agentes.
./setup install --profile core --agent both -y

# Diseño web y frontend para Codex.
./setup install --profile web --agent codex -y

# Expo / React Native para OpenCode.
./setup install --profile mobile --agent opencode -y

# Ver todos los cambios sin tocar el sistema.
./setup install --profile all --dry-run
```

La ejecución sin terminal requiere `-y` para instalar o quitar enlaces.

</details>

## Qué incluye

| Colección | Enfoque |
|:--|:--|
| **Essentials** | Routing, TDD, debugging, verificación, reviews y seguridad. |
| **Web + Design** | Frontend, UI, diseño de interfaces y auditorías visuales. |
| **Mobile** | Expo, React Native, UI móvil y pruebas de componentes. |
| **Engineering** | Especificaciones, arquitectura, implementación y code review. |
| **Pstack** | Verificación avanzada, agentes, principios y revisión Thermo-Nuclear. |
| **Everything** | Todas las skills del catálogo, sin instalar alias duplicados. |

El catálogo contiene **141 skills únicas** agrupadas en `engineering`, `design`, `mobile`, `workflow` y `pstack`. La distribución original de Pstack incluye 67; sus versiones de `tdd` y `teach` quedan internas y prevalecen las variantes ya curadas.

[**Ver el catálogo completo**](docs/CATALOG.md) · [**Ver procedencia y versiones**](UPSTREAM.md)

## Workflow

CamSkills no necesita activar todos los prompts ni todos los agentes para hacer una tarea. **`cam-route`** lee la intención, la superficie y el riesgo; selecciona una ruta principal y añade herramientas solo cuando tienen sentido.

```text
                        YOUR REQUEST
                             │
                         cam-route
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
       Explore            Build               Review
      & document        & debug              & verify
          │                  │                  │
     Skill(s) needed   ai-native-workflow   Targeted review
                             │
                PLAN → BUILD → VERIFY → REVIEW
                             │
                      Evidence + handoff
```

El pipeline de ingeniería trabaja con tres niveles:

| Modo | Cuándo usarlo | Cierre esperado |
|:--|:--|:--|
| **Quick** | Cambio acotado, reversible | Diff y comprobación pertinente. |
| **Standard** | Feature, bug o cambio funcional | Tests, verificación real cuando aplica, review proporcional. |
| **Deep** | Seguridad, arquitectura, migraciones | Plan, aislamiento, evidencias y revisiones especializadas. |

Por ejemplo, una mejora visual web usa `impeccable`; una app Expo puede usar `impeccable-rn` y `test-first`; y una revisión de mantenibilidad puede usar `thermo-nuclear-code-quality-review`. No se ejecutan simultáneamente por defecto.

[**Tabla de rutas y casos**](skills/workflow/cam-route/references/route-map.md)

## Instalación y mantenimiento

El instalador usa **enlaces simbólicos**, así que una actualización del checkout actualiza las skills para los agentes que apuntan a él. Mantiene intactos los archivos existentes que no pertenecen a esta instalación.

```bash
./setup list                                # Catálogo
./setup status                              # Qué está vinculado
./setup doctor                              # Detectar enlaces rotos o conflictos
./setup install --profile all --dry-run     # Previsualizar
./setup remove --profile core --agent both -y
```

`--replace` es **opt-in**: antes de sustituir un archivo, enlace o directorio preexistente, lo guarda en una copia de seguridad bajo `~/.local/state/camskills/backups/` (o `$XDG_STATE_HOME/camskills/backups/`). La desinstalación solo elimina enlaces que reconoce como propios; no borra carpetas ajenas.

Para instalar una skill con la CLI del ecosistema, también puedes utilizar:

```bash
npx skills add caml07/camskills --skill cam-route
```

[**Manual de instalación, opciones y recuperación**](docs/INSTALL.md)

## Documentación

| Documento | Para qué sirve |
|:--|:--|
| [Catálogo](docs/CATALOG.md) | Todas las skills y sus categorías. |
| [Instalación](docs/INSTALL.md) | Perfiles, comandos, conflictos, backups y diagnóstico. |
| [Rutas](skills/workflow/cam-route/references/route-map.md) | Cuándo activar cada skill y cuáles no combinar. |
| [Provenance](UPSTREAM.md) | Skills propias, forks y revisiones upstream. |
| [MCPs](MCP.md) | Integraciones opcionales para OpenCode. |
| [Codex](codex/README.md) | Aliases de compatibilidad y uso desde Codex. |
| [Contribuir](CONTRIBUTING.md) | Convenciones de edición, pruebas y actualización. |

### Diseño y límites

- **Sin alteraciones globales ocultas.** El setup crea enlaces de skills; no cambia tu configuración de modelos, MCPs ni hooks.
- **Pstack skills-only.** Algunos workflows necesitan subagentes propios del runtime. La instalación de skills no los habilita por sí sola.
- **Sin auto-commit ni auto-merge.** Cam Route conserva el control de las operaciones externas.
- **Fuentes trazables.** Las skills de terceros conservan sus notas de licencia, origen y cambios locales.

---

<div align="center">
  <sub>Curated for Codex & OpenCode · Built around evidence, not prompt overload.</sub>
</div>
