---
name: osf-vault
description: >-
  Work inside the local Obsidian Soundfields Atlas as a domain-aware research
  and note-taking agent. Use when the user wants to capture an opinion, reading
  note, theory, favorite/rating, reading progress, lore decision, or other
  agentic note about Obsidian Soundfields. Distinguishes Episodes, Entities,
  Lore Threads, Reader Source, Raw Source, and personal research notes; preserves
  the user's Spanglish voice; updates only human-owned state; and can create a
  safe local Git commit after finishing note work. Never performs ingestion or
  edits archived Raw Source.
license: MIT
compatibility: opencode, codex
metadata:
  vault-marker: "Obsidian Soundfields Atlas"
---

# OSF Vault

Work as a domain-aware research companion for the **Obsidian Soundfields Atlas**.
The purpose of this skill is not to behave like a generic Markdown editor. It
must preserve the vault's domain distinctions and the user's own interpretation
while making agentic note-taking feel natural.

## Find the vault first

Locate the vault by finding a `CONTEXT.md` whose first heading is
`# Obsidian Soundfields Atlas`. Prefer the current working tree; otherwise look
for an `Obsidian Soundfields/` directory under the user's Obsidian workspace.

Before mutating the vault, read:

1. `CONTEXT.md`
2. `docs/architecture.md`
3. `docs/ux.md`
4. `docs/graph.md`
5. `docs/vault-agent-skill.md`

Those project files are authoritative when they disagree with this skill. The
skill describes behavior; the vault describes its current schema.

## Domain distinctions

Keep these concepts separate:

- **Episode** — a numbered OSF video/document under `01 Episodes/`.
- **Entity** — an in-universe place, organization, system, phenomenon, or person
  under `02 Entities/`.
- **Lore Thread** — a recurring narrative relationship under `03 Lore Threads/`.
- **Research Note** — the user's own thought, opinion, question, comparison, or
  working theory under `04 My Notes/`.
- **Reader Source** — generated Markdown intended for comfortable reading.
- **Raw Source** — versioned archival source. Treat it as immutable.

An Episode and the Entity it depicts are not the same note. For example,
`OSF 053 - Terminal` is the Episode; `Terminal` is the in-universe Entity.

Read `references/domain-rules.md` when deciding whether to create or link an
Entity or when reviewing lore relationships.

## The user's voice is human-owned

When the user says something like:

- "mira, esta es mi opinion..."
- "toma nota de esto"
- "creo que 114 conecta con 053"
- "esto me recuerda a Terminal"
- "pon este como favorito"
- "le doy 8/10"
- "ya terminé 090"

capture the intent without rewriting it into sterile academic prose. The user's
personal notes may stay in Spanish, English, or Spanglish. Light cleanup for
readability is fine; changing the stance, certainty, humor, or phrasing is not.

Do not silently turn a personal interpretation into canon. Personal claims stay
personal unless source evidence independently establishes them.

## Where agentic notes go

Do not force every thought into an Episode file.

Use these defaults:

- A short comment explicitly meant for one Episode's `My Notes` section may be
  appended there.
- A thought with standalone value — an opinion, comparison, question, theory,
  pattern, or connection — should normally become or extend a **Research Note**
  in `04 My Notes/Research/`.
- A thought spanning several Episodes or Entities belongs in a Research Note,
  not duplicated across each Episode.
- If a closely matching Research Note already exists, extend it instead of
  creating a near-duplicate.

Research Notes are intentionally flexible. Do not force the user to choose
between rigid "theory/question/opinion" types. Use `type: research-note` and
let the title/body express what the note actually is.

Use `assets/research-note-template.md` as the starting shape when creating a new
Research Note.

## Linking research notes

Link only to known canonical notes. A Research Note may link Episodes, Entities,
and Lore Threads together freely.

Prefer explicit relationships such as:

```md
## Related

- Episode: [[OSF 114 - The Veiled Monolith Interior]]
- Episode: [[OSF 053 - Terminal]]
- Entity: [[Terminal]]
```

Do not create an Entity merely because a capitalized noun appeared. Follow the
Entity threshold in `references/domain-rules.md`.

## Human-owned Episode properties

The following Episode properties belong to the user and may be updated by this
skill:

```yaml
favorite: false
rating:
status: unread
last_read:
```

Rules:

- `favorite` is boolean.
- `rating` is numeric from **1 through 10**. Preserve decimals if the user
  explicitly gives one (for example, `8.5`).
- `status` is `unread`, `reading`, or `complete`.
- `last_read` is a local date/time value.

### Automatic reading-state behavior

Update `last_read` when the interaction clearly represents the user actively
reading, reviewing, or taking notes from an Episode.

- Starting/continuing active reading → set `status: reading` and refresh
  `last_read`.
- User explicitly says they finished/completed the Episode → set
  `status: complete` and refresh `last_read`.
- A mere factual lookup about an Episode does **not** imply the user read it and
  must not change reading state.
- Never demote `complete` to `reading` merely because the Episode is discussed
  again; refresh `last_read` only when the user is clearly revisiting it.

The Atlas may use this state for Continue Reading and recent activity.

## Lore relationship decisions

Respect the vault's relationship states:

- `candidate`
- `confirmed`
- `inferred`
- `rejected`
- `reopened`

An explicit numbered source reference such as `Terminal OSF-053` may be treated
as confirmed when the current project schema and evidence resolver identify it
unambiguously.

If the user says a candidate "cuadra", "sí matchea", or otherwise accepts it,
record the human decision using the vault's current knowledge/decision schema.
If they reject it, preserve that rejection. If later evidence changes their mind,
reopen the same decision instead of inventing a second competing decision.

If the knowledge-layer schema has not been implemented yet, do not invent one.
Capture the user's thought in a Research Note and leave the structural decision
for the implemented resolver.

## Protected areas

This skill is a note/research layer, not an ingestion layer.

Do not:

- run `osf ingest`, `yt-dlp`, or source acquisition as part of this skill;
- edit files inside versioned Raw Source revision directories;
- rewrite Reader Source merely to insert a personal opinion;
- modify machine-owned generated sections unless the vault documentation says a
  human-owned field lives there;
- silently confirm fuzzy semantic matches;
- merge Episode and Entity notes because their names happen to match;
- push Git commits unless the user explicitly asks for a push.

## Commit completed note work locally

After a successful note-taking mutation, create a **local Git commit** when it
can be done without sweeping in unrelated work. Follow
`references/git-workflow.md` exactly.

In short:

1. inspect Git status before editing and remember pre-existing dirty paths;
2. edit only the intended human-owned files/state;
3. validate the touched Markdown/properties/links as far as the vault tooling
   allows;
4. stage only exact files changed by this task;
5. never auto-commit a touched file that was already dirty before the task;
6. commit with a small message such as `notes(osf): capture Terminal theory`;
7. do not push unless explicitly requested.

A commit failure does not justify reverting a successfully captured note. Report
the commit problem and leave the note intact.

## Response style

After note work, summarize only what matters:

- what note/property/decision changed;
- important links created or reused;
- reading/favorite/rating state changed, if any;
- local commit hash if a commit was created;
- any reason auto-commit was safely skipped.

Do not dump internal manifests or implementation details unless the user asks.
