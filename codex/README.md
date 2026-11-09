# CamSkills for Codex

Codex discovers this collection from `.agents/skills`. Most entries are
symlinks to the canonical OpenCode skills so their instructions do not drift.
The few real directories are Codex-specific overlays for host-dependent tools.

## Use From This Clone

Run Codex from this directory or link the skills into the user discovery root:

```bash
mkdir -p ~/.agents/skills
ln -s ~/camskills/codex/.agents/skills/* ~/.agents/skills/
```

Codex follows symlinked skill folders. Use `/skills` to inspect the collection
and `$skill-name` to invoke a skill explicitly.

`$cam-route` selects a minimal skill route based on the requested outcome,
surface and risk. For code changes it can use `$ai-native-workflow` with
Quick, Standard or Deep depth. The host's `~/.codex/AGENTS.md` contains a
small pointer so this selection can run without an explicit invocation.
See [the route map](../../skills/workflow/cam-route/references/route-map.md).

Validate the routing references and Codex links from the repository root:

```bash
node --test scripts/check-cam-route.mjs
```

`skill-creator` is intentionally omitted: Codex includes its own
`$skill-creator`, which avoids two skills with the same name in its selector.

Pstack is available as a skills-only collection with 65 discoverable entries.
The `tdd` and `teach` aliases retain the existing Matt Pocock implementations;
their Pstack counterparts remain as internal references under
`skills/pstack/`. Native Pstack hooks and subagents are not enabled.

## MCP

Copy the optional Context7 block from `config.example.toml` into
`~/.codex/config.toml`, then restart Codex. MCP credentials and local paths
stay outside this repository.

Sources: https://developers.openai.com/codex/build-skills and
https://developers.openai.com/codex/extend/mcp.
