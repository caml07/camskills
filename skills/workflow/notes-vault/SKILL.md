---
name: notes-vault
description: >-
  Create and manage Obsidian vault notes. Preserves the user's voice, fills
  technical gaps, corrects inaccuracies, creates bidirectional wiki-links, and
  updates MOCs (Maps of Content). One atomic note per concept. Supports JS/React,
  TypeScript, Python, SQL, and general corrections. Templates for atomic notes
  and MOCs in assets/. Works with vault/ directory structure.
  Trigger when the user shares information they want to save as a note, says
  "toma nota", "guarda esto", "apunta", "crea una nota", or pastes code/explanations
  that should become permanent documentation.
license: MIT
compatibility: opencode
metadata:
  vault-path: "{{VAULT_PATH}}"
---
# Notes Vault

Capture and organize knowledge into an Obsidian vault that grows over time.

## Style

### Voice

- **Use their words** — preserve the user's tone, terminology, and way of explaining things
- **Fill gaps** — complete missing parts: correct syntax, best practices, edge cases the user didn't mention
- **Correct gently** — if something is technically wrong, fix it but maintain the user's voice
- **Small ideas count** — every concept deserves its own atomic note. Don't wait for a "complete" explanation

### Structure

- One note per concept (atomic). If a note gets too long, split it.
- Frontmatter: `tags`, `fecha` (YYYY-MM-DD), `estado` (borrador/completado/revisar/archivado)
- Real code, not pseudocode
- Use tables for comparisons (tabular data is easier to scan than paragraphs)
- Wiki-links `[[...]]` to:
  - The topic's MOC/index
  - Related MOCs
  - Prerequisite concepts
  - `[[Conceptos/Índice de Conceptos]]` if it connects to the general vault

### Workflow

1. User shares information (vague or detailed — doesn't matter)
2. Create or update the atomic note in `vault/[Topic]/...`
3. Update MOCs with wiki-link + brief description
4. Create bidirectional links to related notes
5. **Do not ask for confirmation** — create directly, user corrects later if needed

### Tags

Normalize to kebab-case:

- **By topic**: `react`, `react-native`, `typescript`, `node`, `sql`, `git`, `docker`, `python`
- **By type**: `concepto`, `hook`, `patron`, `sintaxis`, `performance`, `testing`, `debugging`, `config`
- **By status**: `borrador`, `completado`, `revisar`, `archivado`

---

## Templates

- `assets/note-template.md` — template for atomic notes
- `assets/moc-template.md` — template for Maps of Content
- `assets/daily-note-template.md` — template for daily notes

---

## Corrections by Language

See `references/corrections.md` for language-specific corrections.

## Formatting

See `references/obsidian-formatting.md` for callouts, tables, mermaid diagrams, and embeds.

---

## Resources

- `evals/evals.json` — test prompts
- `assets/` — note templates
- `references/` — formatting guides and correction catalogs
