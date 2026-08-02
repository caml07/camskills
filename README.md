# camskills

Mis skills de [opencode](https://opencode.ai). Para instalar en cualquier máquina.

## Skills

| Skill | Descripción |
|-------|-------------|
| `context7-mcp` | MCP de Context7 para docs actuales de librerías |
| `doc-system` | Documentación técnica estructurada DOC-NNN-TYPE |
| `emil-design-eng` | Filosofía de diseño de Emil Kowalski |
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
- `plugins/notification.js` + `toast.ps1` — notificaciones toast nativas en Windows (opcional; omitir en Linux/macOS).

## Config

Copiar `opencode.jsonc.example` a `opencode.jsonc` y reemplazar `{{VAULT_PATH}}` y `{{CONTEXT7_API_KEY}}`.
