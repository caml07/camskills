# Vault Layout

The skill is reusable. It discovers the actual vault and semester rather than
hardcoding a user path. A configured semester has this minimal shape:

```text
Semester/
  _Semester.md
  Course A/
    Course.md
    Day 00 - Syllabus.md
    Week 00 Summary.md
    Week 01 Summary.md
    2026-09-01 - Week 01 - Day 01 - Course A.md
  Concepts/
    Durable concept.md
```

## `_Semester.md`

Use frontmatter with `type: semester`, `term`, and an ISO `starts` date. It may
contain a course table and an explicit `## Calendar / Calendario` table. The
calendar is required when Week 00, breaks, delayed starts, or other exceptions
make a simple seven-day calculation ambiguous. Course-specific rules belong in
`Course.md`.

## `Course.md`

Use frontmatter for stable facts:

```yaml
type: course
course: Course name
code: COURSE 1234
meetings: Monday and Wednesday, 10:00 AM-11:00 AM
ai_policy: approval-and-disclosure # or unspecified
```

Keep mutable instructions in `## Note-Taking Profile / Perfil de notas`,
source-derived unknowns in `## Open Questions / Preguntas abiertas`, and stable
navigation links near the title.

## Canonical Frontmatter

Store `week` and `day` as integers. Zero-padding belongs only in filenames and
titles.

```yaml
# Session
type: session
course: Course name
date: YYYY-MM-DD
week: 0
day: 1
status: draft # or complete

# Weekly summary
type: weekly-summary
course: Course name
week: 0

# Non-instructional course event
type: course-event
course: Course name
date: YYYY-MM-DD
week: 0
event: office-hours
status: draft

# Concept
type: concept
concept: Durable concept name
courses:
  - Course name
```

Fixed headings are bilingual (`English / Español`). See `SKILL.md` for the exact
session, summary, syllabus, and course templates.

## Source Provenance

- `Day 00 - Syllabus.md` links the original PDF and cleaned syllabus.
- Session notes distinguish `Captured From Class / Capturado en clase` from
  `AI Context and Sources / Contexto y fuentes de IA`.
- Never overwrite `Raw Notes / Notas crudas` or source files.
