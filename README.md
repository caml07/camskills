# camskills

Mis skills de [opencode](https://opencode.ai). Para instalar en cualquier máquina.

## Skills

| Skill | Descripción |
|-------|-------------|
| `doc-system` | Documentación técnica estructurada DOC-NNN-TYPE |
| `fix-debug` | Debug asistido con Context7 |
| `impeccable` | Diseño frontend web |
| `impeccable-rn` | Diseño frontend React Native / Expo |
| `no-commit-secrets` | Previene commits de secrets a git |
| `no-use-effect` | Prohíbe useEffect directo en React |
| `notes-vault` | Creación de notas en Obsidian vault |
| `skill-creator` | Creación y evaluación de skills |
| `tanstack-query` | TanStack Query patterns y best practices |
| `test-first` | TDD con Vitest + testing-library/react-native |

## Instalación

```bash
# Skill individual (vía npx skills)
npx skills add https://github.com/caml07/camskills --skill doc-system

# Todos a la vez (symlink desde ~/.config/opencode)
git clone git@github.com:caml07/camskills.git ~/camskills
ln -s ~/camskills/skills/* ~/.config/opencode/skills/
```

## Plugins

- `plugins/notification.js` + `toast.ps1` — notificaciones toast nativas en Windows.

## Config

Copiar `opencode.jsonc.example` a `opencode.jsonc` y reemplazar `{{VAULT_PATH}}` y `{{CONTEXT7_API_KEY}}`.
