# Pstack (skills-only)

Vendored from [`michael-denyer/pstack-claude`](https://github.com/michael-denyer/pstack-claude), commit `0dcb9cc049764a4a11aaf3aa32ae064832ee8ac9` (2026-11-09 audit). Original framework by Lauren Tan; Cursor team-kit and Thermos work retains its notices in `NOTICE-skills.md` and the three neighboring MIT license files.

All 67 upstream skill directories are preserved together because playbooks and principles refer to siblings with paths such as `../<skill>/SKILL.md`. Only 65 have discovery links in Codex/OpenCode. The names `tdd` and `teach` intentionally keep their Matt Pocock implementations in the user's shared discovery directories. Pstack's own copies remain here for internal references.

This is **not** the native Pstack plugin. It intentionally installs no SessionStart hooks, agent registrations, automatic task router, model overrides, or changes to `opencode.jsonc`/Codex configuration. Use `poteto-mode` explicitly when desired. The `thermo-nuclear-code-quality-review` skill works as a prompt-level review; `thermos` and other multi-agent routines require compatible subagent support and can be limited in a skills-only environment.

## Future updates

1. Verify the new upstream commit and read its change log, license notices, and any hooks or script additions.
2. Compare the skill tree with this vendored copy; do not blindly overwrite local changes.
3. Preserve the two suppressed aliases, documentation and all license files.
4. Recheck every discovery symlink and relative reference, then update `UPSTREAM.md` with the exact source SHA.

Do not run a generic `npx skills update` against this repository: it does not preserve its Codex overlays, existing aliases, and curated forks.
