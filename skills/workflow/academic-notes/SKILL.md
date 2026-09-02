---
name: academic-notes
description: >-
  Create and maintain linked Obsidian notes for university courses. Use when the
  user says /note, /note-week-summary, Day 00, syllabus, lecture notes, raw class
  notes, course quirks, or wants to organize notes by academic week and session.
  Preserves raw notes until the user says done, builds durable concept links, and
  produces retrieval-practice review without inventing course facts.
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

## Command Workflows

### `/note <course> [date] <raw notes>`

1. Resolve the course name against `Course.md`, its aliases, and its folder.
2. Resolve the date. Use today only when no date is supplied. Use `_Semester.md`
   to calculate `Week NN`; never calculate a week from a guessed term start.
3. Name the session `YYYY-MM-DD - Week NN - Course.md` in that course's folder.
4. If a draft exists for that course and date, append the new material under
   `## Raw notes`. Otherwise create this minimum draft:

```markdown
---
type: session
course: Course name
date: YYYY-MM-DD
week: NN
status: draft
---

# Course name - Week NN

[[FALL26/Course Folder/Course]] · [[FALL26/Course Folder/Week NN Summary]]

## Raw notes
```

5. Reply briefly that the draft remains open. Do not organize, expand, research,
   or create concepts until the user writes `done`.
6. `done` closes the active draft in the conversation. If the active draft is not
   known, require `/note <course> done [date]` rather than risking the wrong file.
7. Later raw material for a completed session is appended to `## Raw notes`, then
   the structured sections are refreshed. Never replace or paraphrase raw notes.

An off-schedule date is allowed: it may be a lab, review, makeup, or office hour.
Record it without pretending it was a normal lecture.

### Closing a Session

When the user says `done`, set `status: complete` and write, in Spanglish natural
to the user's style:

```markdown
## Captured From Class
## Detailed Notes
## Examples, Commands, and Diagrams
## Decisions, Trade-offs, and Failure Modes
## Tasks and Deadlines
## Questions and Gaps
## Senior Challenge
## AI Context and Sources
## Raw notes
```

- `Captured From Class` contains only claims supported by the user's raw notes,
  lecture artifacts, or quoted course source.
- `Detailed Notes` explains the material like a concise textbook, but never turns
  an inference into something the professor said.
- `Examples, Commands, and Diagrams` preserves exact commands and may link an
  attached photo or scan when the profile calls for handwritten work.
- `Tasks and Deadlines` contains only announced or sourced dates. Leave unknown
  dates unknown.
- `AI Context and Sources` labels all externally researched explanation and links
  to the official source. Research only when the user requests it, asks for a
  link, or names a library/tool that needs documentation.

### Linked Concepts

Every completed session always links to its `Course.md` and current week summary.
Add concept links only when the session explains, applies, contrasts, or questions
the concept.

Create at most three new concept notes per session in `FALL26/Concepts/` when all
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
[[FALL26/Theory/Course|Theory of Computation]]
[[FALL26/Concepts/Finite automaton]]
```

Use aliases only for genuine alternate names. Let backlinks provide reverse
navigation; do not duplicate every session link in a course map.

### Junior-to-Senior Challenge

End each completed session with two or three questions that make the student:

1. Explain a concept without jargon.
2. Apply it to a new case.
3. Justify a decision against an alternative, predict a failure, or give a
   counterexample.

Put model answers in collapsed Obsidian callouts. The question remains visible;
the answer is available only after an honest retrieval attempt.

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
week: NN
---

# Week NN Summary - Course name

## Sessions
## Detailed Synthesis
## Connections and Durable Concepts
## Exam Preparation
## Questions
## Answers
## Open Gaps
```

4. Link each source session under `## Sessions`.
5. In `## Exam Preparation`, write retrieval questions that require explanation,
   application, comparison, proof, design rationale, or failure analysis. Put each
   answer in a collapsed callout under `## Answers`.
6. Summarize raw notes only through their completed session's structured content;
   do not repeat the raw capture in the weekly summary.

## Day 00 and Course Mutation

`Day 00 - Syllabus.md` preserves course source material. It links to the original
PDF and a cleaned operational syllabus; it is not a normal session note.

When the user asks to change a course's quirks, update only `## Note-Taking
Profile` in its `Course.md`. When adding a course:

1. Add one row to `_Semester.md`.
2. Create `Course.md` with course identity, meetings, AI policy, and mutable
   profile.
3. Create `Day 00 - Syllabus.md` only when a syllabus or its source link exists.

Do not rewrite a source PDF or raw conversion. Keep ambiguities in an explicit
`## Open Questions` section until the instructor resolves them.

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
