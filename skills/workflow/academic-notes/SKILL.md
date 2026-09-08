---
name: academic-notes
description: >-
  Create, standardize, and maintain linked Obsidian notes for university courses.
  Use when the user says /note, /note-week-summary, Day 00, syllabus, lecture
  notes, raw class notes, course quirks, or asks to normalize filenames,
  frontmatter types, headings, weeks, or class days. Preserves raw notes until the
  user says done, builds durable concept links, and produces retrieval-practice
  review without inventing course facts.
license: MIT
compatibility: opencode with an Obsidian MCP that can read and edit the target vault
---

# Academic Notes

Turn rough lecture capture into a small, connected academic knowledge graph. This
skill is for course notes only; use `notes-vault` for general permanent knowledge.

## Preconditions

1. Locate the target vault and its semester note, normally `_Semester.md`.
2. Locate the matching `Course.md`; it is the source of the course name, schedule,
   AI policy, and note-taking profile.
3. If the course or semester does not exist, create it only when the user asks to
   add a course. Do not guess a schedule, policy, or grading rule.

<!-- ponytail: Course.md is both the mutable profile and course map; split it only when a course becomes hard to scan. -->

## Canonical Note Schema

Use English frontmatter keys so metadata remains queryable. Use bilingual fixed
headings (`English / Español`) while preserving the user's natural language in
the body. Do not invent extra keys when an existing field covers the need.

| `type` | Required frontmatter |
| --- | --- |
| `semester` | `type`, `term`, `starts` |
| `course` | `type`, `course`, `code`, `meetings`, `ai_policy`; `section` is optional |
| `syllabus` | `type`, `course` |
| `session` | `type`, `course`, `date`, `week`, `day`, `status` |
| `course-event` | `type`, `course`, `date`, `week`, `event`, `status` |
| `weekly-summary` | `type`, `course`, `week` |
| `concept` | `type`, `concept`, `courses`; `tags` is optional |

- Store `week` and `day` as integers (`week: 1`, not `week: 01`). Zero-pad them
  only in filenames, titles, and links (`Week 01`, `Day 03`).
- A session `status` is either `draft` or `complete`. Other note types do not
  carry `status` except `course-event`.
- `courses` on a concept is a YAML list of plain canonical course names. Keep
  navigation links in the body rather than embedding wiki-links in frontmatter.
- Use `Day 00` only for syllabus material. Normal lecture days begin at `Day 01`.

### Canonical Names

```text
_Semester.md
Course.md
Day 00 - Syllabus.md
YYYY-MM-DD - Week NN - Day NN - Filesystem-safe Course Name.md
YYYY-MM-DD - Week NN - Office Hours - Filesystem-safe Course Name.md
Week NN Summary.md
Concept name.md
```

Derive the session's filename course name from the canonical `course` value.
Replace `/` with `-`, replace `:` with ` -`, remove `\\ * ? " < > |`, and
collapse repeated spaces. Keep the display name unchanged in frontmatter and the
H1. Concept filenames must be globally unambiguous and filesystem-safe.

`day` is the chronological ordinal of an actual course meeting since the semester
start, not the number of notes captured. Use the meeting schedule plus known
holidays, cancellations, makeup classes, and earlier sessions. An explicit day
provided by the user is accepted when it does not conflict with another session;
ask before renumbering or overwriting when it does. Count lectures, labs, reviews,
and makeup classes that deliver course instruction. Do not count holidays,
cancelled meetings, or office hours unless the user says they replaced a class.
If the available course records cannot establish the ordinal safely, ask one
short question instead of guessing.

When adding a newly discovered historical or makeup session, recompute every
later session day for that course and update filenames and links in one migration.
If cancellations or prior meetings are uncertain, ask before renumbering.

## Command Workflows

### `/note <course> [date] <raw notes>`

1. Resolve the course name against `Course.md`, its aliases, and its folder.
2. Resolve the date. Use today only when no date is supplied. Use `_Semester.md`
   to calculate `Week NN`; never calculate a week from a guessed term start.
3. Resolve the chronological course day, then name the session
   `YYYY-MM-DD - Week NN - Day NN - Filesystem-safe Course Name.md` in that
   course's folder.
4. If any session exists for that course and date, append the new material under
   `## Raw Notes / Notas crudas`. Keep a draft open; if the session is complete,
   refresh its structured sections after appending. Otherwise create this minimum
   draft:

```markdown
---
type: session
course: Course name
date: YYYY-MM-DD
week: 1
day: 1
status: draft
---

# Course name - Week NN / Semana NN - Day NN / Día NN

[[Semester/Course Folder/Course]] · [[Semester/Course Folder/Week NN Summary]]

## Raw Notes / Notas crudas
```

5. Reply briefly that the draft remains open. Do not organize, expand, research,
   or create concepts until the user writes `done`.
6. `done` closes the active draft in the conversation. If the active draft is not
   known, require `/note <course> done [date]` rather than risking the wrong file.
7. Later raw material for a completed session is appended to
   `## Raw Notes / Notas crudas`, then the structured sections are refreshed.
   Never create a second session for the same course and date. Never replace or
   paraphrase raw notes.

The raw capture excludes command syntax (`/note`), resolved selectors (course,
date, week, day), the terminal control word `done`, and explicit instructions to
the assistant such as “research this” or “add the official link.” Preserve quoted
or clearly attributed classroom wording even when it resembles an instruction.

An off-schedule instructional meeting may be a lab, review, or makeup; record it
as a session and count it in the chronological Day sequence. Office hours do not
change that sequence. Record them as `type: course-event` with
`event: office-hours`, omit `day`, and name them
`YYYY-MM-DD - Week NN - Office Hours - Filesystem-safe Course Name.md`. Use the
same draft/complete content sections, but exclude them from weekly synthesis
unless the user explicitly asks to include supplementary material.

### Closing a Session

When the user says `done`, set `status: complete` and write, in Spanglish natural
to the user's style:

```markdown
## Captured From Class / Capturado en clase
## Detailed Notes / Notas detalladas
## Examples, Commands, and Diagrams / Ejemplos, comandos y diagramas
## Decisions, Trade-offs, and Failure Modes / Decisiones, trade-offs y modos de fallo
## Tasks and Deadlines / Tareas y fechas límite
## Questions and Gaps / Preguntas y vacíos
## Senior Challenge / Reto senior
## AI Context and Sources / Contexto y fuentes de IA
## Raw Notes / Notas crudas
```

- `Captured From Class` contains only claims supported by the user's raw notes,
  lecture artifacts, or quoted course source.
- `Detailed Notes` explains the material like a concise textbook, but never turns
  an inference into something the professor said.
- `Examples, Commands, and Diagrams` preserves exact commands and may link an
  attached photo or scan when the profile calls for handwritten work.
- When the course's note-taking profile specifies PlantUML, use `plantuml` code
  blocks for diagrams instead of Mermaid; only use this when the target vault has
  a PlantUML renderer/plugin available.
- `Tasks and Deadlines` contains only announced or sourced dates. Leave unknown
  dates unknown.
- `AI Context and Sources` labels all externally researched explanation and links
  to the official source. Research only when the user requests it, asks for a
  link, or names a library/tool that needs documentation.

### Linked Concepts

Every completed session always links to its `Course.md` and current week summary.
Add concept links only when the session explains, applies, contrasts, or questions
the concept.

Create at most three new concept notes per session in `<semester>/Concepts/` when all
of these hold:

1. The concept is durable beyond this one lecture.
2. The note has enough material for a definition and one example or relationship.
3. It has a meaningful prerequisite, contrast, application, or common confusion.

Use a globally unambiguous filename, such as `Finite automaton.md` or
`Service model (cloud).md`. A concept note contains a short explanation, example,
relationships, and source session links. Do not create a concept for logistics,
one-off assignments, or every named library. Leave weaker candidates under
`## Questions and Gaps`.

Use vault-root paths in wiki-links to avoid collisions, for example:

```markdown
[[Semester/Theory/Course|Theory of Computation]]
[[Semester/Concepts/Finite automaton]]
```

Use aliases only for genuine alternate names. Let backlinks provide reverse
navigation; do not duplicate every session link in a course map.

### Junior-to-Senior Challenge

End each completed session with two or three questions that make the student:

1. Explain a concept without jargon.
2. Apply it to a new case.
3. Justify a decision against an alternative, predict a failure, or give a
   counterexample.

Put each model answer directly beneath its question in a collapsed Obsidian
callout. Do not use HTML `<details>` or put all answers into one block.

```markdown
1. Question text

> [!faq]- Model answer / Respuesta modelo
> Answer text
```

This borrows the evidence and trade-off discipline of `junior-to-senior`, but it
coaches understanding rather than reviewing a software plan.

### `/note-week-summary <course> [week]`

1. Resolve the course and week. Default to the current week only when it can be
   calculated from `_Semester.md`.
2. Read only completed session notes whose `course` and `week` match. Do not turn
   an unfinished draft into syllabus truth.
3. Create or refresh `Week NN Summary.md` in the course folder:

```markdown
---
type: weekly-summary
course: Course name
week: 1
---

# Week NN Summary / Resumen de semana NN - Course name

## Sessions / Sesiones
## Detailed Synthesis / Síntesis detallada
## Connections and Durable Concepts / Conexiones y conceptos duraderos
## Exam Preparation / Preparación para examen
## Questions / Preguntas
## Answers / Respuestas
## Open Gaps / Vacíos abiertos
```

4. Link each source session under `## Sessions`.
5. In `## Exam Preparation / Preparación para examen`, write numbered retrieval
   questions that require explanation, application, comparison, proof, design
   rationale, or failure analysis. Put matching numbered collapsed callouts under
   `## Answers / Respuestas`.
6. Summarize raw notes only through their completed session's structured content;
   do not repeat the raw capture in the weekly summary.

## Day 00 and Course Mutation

`Day 00 - Syllabus.md` uses `type: syllabus`, preserves course source material,
and links to the original PDF and a cleaned operational syllabus. It is not a
session, has no `week`, `day`, or `status`, and does not affect the lecture-day
counter. Use these fixed headings:

```markdown
# Day 00 - Syllabus / Programa
## Captured From Class / Capturado en clase
## Operational Notes / Notas operativas
## Verify With Instructor / Verificar con instructor
```

When the user asks to change a course's quirks, update only `## Note-Taking
Profile / Perfil de notas` in its `Course.md`. Course notes use
`## Course Map / Mapa del curso` and `## Open Questions / Preguntas abiertas`.
When adding a course:

1. Add one row to `_Semester.md`.
2. Create `Course.md` with course identity, meetings, AI policy, and mutable
   profile.
3. Create `Day 00 - Syllabus.md` only when a syllabus or its source link exists.

Do not rewrite a source PDF or raw conversion. Keep ambiguities in an explicit
`## Open Questions / Preguntas abiertas` section until the instructor resolves
them.

## Normalizing Existing Notes

When the user asks to standardize or fix note typing:

1. Inventory every Markdown note in the requested semester and classify it by
   role before editing.
2. Normalize frontmatter to the canonical schema. If an unknown key carries real
   user data, ask how to map it into a canonical field or body section; never
   silently delete it or leave a noncanonical key behind.
3. Rename session files to the canonical pattern and update every wiki-link that
   targets an old name.
4. Normalize fixed headings and their order without rewriting source content.
5. Preserve every raw section byte-for-byte except its heading. Never migrate a
   source PDF or raw conversion. Exclude `RESOURCES/` directories from structural
   validation.
6. Convert challenge answers to collapsed Obsidian callouts.
7. Verify there are no old type names, unpadded filename week/day tokens, stale
   links, duplicate fixed headings, or completed sessions missing required
   sections.

Before a bulk migration, record a hash of each raw-section body; compare those
hashes afterward so heading normalization cannot silently alter the capture.

Run the bundled structural check after creating or normalizing notes:

```bash
python scripts/validate_notes.py /path/to/semester
```

## Academic Integrity

Follow each course's `ai_policy`. For `approval-and-disclosure`, maintain an
`AI Context and Sources` record in notes, but do not represent notes as safe to
submit. The student must obtain approval and disclose AI use before submitting
any AI-assisted work. For `unspecified`, ask the instructor before AI touches
graded work.

## References

- [Vault layout and note templates](references/vault-layout.md)
- `commands/note.md` and `commands/note-week-summary.md` are installer-linked
  shortcuts into this workflow.
