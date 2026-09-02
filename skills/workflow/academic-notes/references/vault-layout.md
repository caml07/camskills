# Vault Layout

The skill is reusable. It discovers the actual vault and semester rather than
hardcoding a user path. A configured semester has this minimal shape:

```text
Semester/
  _Semester.md
  Course A/
    Course.md
    Day 00 - Syllabus.md
    Week 01 Summary.md
    2026-09-01 - Week 01 - Course A.md
  Concepts/
    Durable concept.md
```

## `_Semester.md`

Use frontmatter with `type: semester`, `term`, and an ISO `starts` date. It may
contain a course table, but course-specific rules belong in `Course.md`.

## `Course.md`

Use frontmatter for stable facts:

```yaml
type: course
course: Course name
code: COURSE 1234
meetings: Monday and Wednesday, 10:00 AM-11:00 AM
ai_policy: approval-and-disclosure # or unspecified
```

Keep mutable instructions in `## Note-Taking Profile`, source-derived unknowns
in `## Open Questions`, and stable navigation links near the title.

## Source Provenance

- `Day 00 - Syllabus.md` links the original PDF and cleaned syllabus.
- Session notes distinguish `Captured From Class` from `AI Context and Sources`.
- Never overwrite `Raw notes` or source files.
