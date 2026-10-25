# Upstream Tracking

| Skill | Origin | Type | Upstream | Update |
|-------|--------|------|----------|--------|
| context7-mcp | Context7 (Upstash) | third-party (local workflow) | `@upstash/context7-mcp` (npm) | MCP remoto: revisar flujo de consulta; sin paquete local que actualizar |
| doc-system | psistema/caml07 | own | — | edición directa |
| eas-app-stores | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-app-stores -g -y` |
| eas-hosting | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-hosting -g -y` |
| eas-observe | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-observe -g -y` |
| eas-simulator | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-simulator -g -y` |
| eas-update | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-update -g -y` |
| eas-update-insights | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-update-insights -g -y` |
| eas-workflows | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-workflows -g -y` |
| emil-design-eng | psistema/caml07 (basado en Emil Kowalski) | own | — | edición directa |
| expo-animation | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-animation -g -y` |
| expo-data-fetching | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-data-fetching -g -y` |
| expo-design-system | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-design-system -g -y` |
| expo-dev-client | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-dev-client -g -y` |
| expo-dom | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-dom -g -y` |
| expo-app-clip | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-app-clip -g -y` |
| expo-brownfield | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-brownfield -g -y` |
| expo-examples | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-examples -g -y` |
| expo-module | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-module -g -y` |
| expo-migrate-module | expo | third-party | `expo/skills` @ `plugins/expo-experiments/skills/expo-migrate-module` | copiar upstream |
| expo-native-ui | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-native-ui -g -y` |
| expo-overview | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-overview -g -y` |
| expo-project-structure | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-project-structure -g -y` |
| expo-router | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-router -g -y` |
| expo-skill-feedback | expo (retirada upstream) | third-party (legacy) | `expo/skills` | conservar adapter local; feedback via `@expo/agent-cli` |
| expo-tailwind-setup | expo (retirada upstream) | third-party (legacy) | `expo/skills` | mantener; ya no existe upstream |
| expo-ui | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-ui -g -y` |
| expo-upgrade | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-upgrade -g -y` |
| expo-web-to-native | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-web-to-native -g -y` |
| find-skills | vercel-labs (skills.sh) | third-party | `vercel-labs/skills` | `npx skills add vercel-labs/skills --skill find-skills --agent opencode --copy -y` |
| fix-debug | psistema/caml07 | own | — | edición directa |
| humanizer | blader | third-party | `blader/humanizer` | `npx skills add blader/humanizer --skill humanizer --agent opencode --copy -y` |
| impeccable | pbakaus/impeccable (fork con adaptaciones opencode) | fork | `pbakaus/impeccable` @ `plugin/skills/impeccable` | Copiar upstream + re-aplicar: `AskUserQuestion`→`` `question` `` / pregunta estructurada y `agents/openai.yaml` |
| impeccable-rn | Fork curado RN/Expo por psistema/caml07 | fork | `pbakaus/impeccable` @ `plugin/skills/impeccable` | Intake manual; ver `skills/mobile/impeccable-rn/FORK.md` |
| junior-to-senior | juliusbrussee (skills.sh) | third-party | `juliusbrussee/skills` | `npx skills add juliusbrussee/skills --skill junior-to-senior --agent opencode --copy -y` |
| mattpocock-engineering/* | mattpocock | third-party (una legacy) | `mattpocock/skills` (`skills/engineering/` + `skills/productivity/grilling/`) | sincronizar solo las carpetas locales presentes upstream; conservar `resolving-merge-conflicts` (retirada) |
| mobile-app-ui-design | ceorkm | third-party | `ceorkm/mobile-app-ui-design` | `npx skills add https://github.com/ceorkm/mobile-app-ui-design` |
| no-commit-secrets | psistema/caml07 | own | — | edición directa |
| no-use-effect | psistema/caml07 | own | — | edición directa |
| notification | psistema/caml07 | own | — | edición directa |
| academic-notes | psistema/caml07 | own | — | edición directa |
| notes-vault | psistema/caml07 | own | — | edición directa |
| osf-vault | psistema/caml07 | own | — | edición directa |
| opencode-skill-creator | antongulin | plugin | npm `opencode-skill-creator` | checkout en `~/Projects/opencode-skill-creator`; actualizar paquete en `plugins` |
| ponytail | @dietrichgebert | plugin | npm | actualizar paquete en `plugins` |
| skill-creator | psistema/caml07 | own | — | edición directa |
| tanstack-query | psistema/caml07 | own | — | edición directa |
| test-first | psistema/caml07 | own | — | edición directa |
| vercel-react-native-skills | vercel-labs | third-party | `vercel-labs/agent-skills` | `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-native-skills -g -y` |
| security-audit | Cloudflare | third-party | `cloudflare/security-audit-skill` | `npx skills update security-audit -g -y` |

**Legend:**
- `own` — skill original, sin upstream externo
- `third-party` — skill obtenido de una fuente externa
- `third-party (legacy)` — depende de una fuente externa que ya no publica la skill; se conserva localmente
- `fork` — fork/modificación propia de un skill de terceros
- `plugin` — plugin npm, no un skill

## Last Upstream Audit

Reviewed 2026-09-16:

- `expo/skills` at `39708666ce7014def1f8e34f3d8c93e8d3f588bb`:
  - 12 skills changed and were re-synced: eas-app-stores, eas-simulator,
    expo-animation, expo-brownfield, expo-data-fetching, expo-design-system,
    expo-native-ui, expo-overview, expo-router, expo-upgrade, expo-web-to-native,
    and the new `eas-update`.
  - `expo-migrate-module` and `expo-tailwind-setup` were removed upstream and are
    kept as legacy.
- `security-audit` at `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` was fully
  re-synced (the local tree had drifted; upstream now ships more coverage files
  and validation scripts).
- `impeccable` at `f2c7051853848826aac2f4646581d62a732155ad` (v4.3.1) was
  re-synced as a fork. The sync drops the bundled playbook resources that moved
  upstream (interaction-design.md, codex.md, brand.md, product.md, and the old
  `scripts/*` standalone bin), and reapplies the OpenCode adaptations:
  `AskUserQuestion` → `question`-style structured prompt, `<skill-base-dir>`,
  `agents/openai.yaml`, and the `agents/*.toml` sub-agent files (which upstream
  now ships as `.md` outside the skill dir).
- `impeccable-rn` re-reviewed against the same upstream commit; only the
  touch-gesture audit criterion was imported. See `FORK.md`.
- `file:///`-relative symlinks on a source tree now expose all Codex-portable
  skills under `codex/.agents/skills`; `context7-mcp`, `fix-debug`, and
  `expo-skill-feedback` carry a Codex overlay, and `skill-creator` is excluded
  because Codex ships its own.
- `@upstash/context7-mcp` latest is `4.1.1`; `opencode-skill-creator` latest is
  `0.2.25`; `@dietrichgebert/ponytail` latest is `4.10.0`. This repository
  vendors only workflows/instructions, not installed plugin versions.

Additional sync 2026-09-24:

- Added the missing `grilling` primitive from `mattpocock/skills`
  (`skills/productivity/grilling/`) at upstream commit
  `c55ee46073ed923f86ce59a5eb3b6d895095d1b7`. This resolves the dependency
  used by `grill-with-docs`, `triage`, `wayfinder`, and
  `improve-codebase-architecture`.

Additional sync 2026-09-26:

- Audited tracked third-party skills against current upstream heads.
- `pbakaus/impeccable` at `9d715cc` (v4.4.0) was re-synced into the curated
  OpenCode/Codex-compatible fork, preserving `<skill-base-dir>`, structured-question
  wording, and local `agents/` adapters. New upstream component-review and region-map
  references are included.
- `expo/skills` at `efa52f0` changed `eas-simulator`; the three changed files were
  re-synced. `expo-skill-feedback` still differs only by the intentional portable
  skill-root adaptation. All other tracked Expo skills match upstream; removed
  `expo-migrate-module` and `expo-tailwind-setup` remain local legacy copies.
- `impeccable-rn` was reviewed through `9d715cc`; no RN-relevant changes were
  imported because the 4.4.0 delta is comp/browser tooling.
- `mattpocock/skills` (`c55ee46`), `vercel-labs/agent-skills` (`063bee9`),
  `vercel-labs/skills` (`7407f38`), `blader/humanizer` (`9862685`),
  `juliusbrussee/skills` (`8470b26`), `cloudflare/security-audit-skill`
  (`c1c8a8c`), and `ceorkm/mobile-app-ui-design` (`4c67a0e`) match the vendored
  skill content currently tracked here.
- `opencode-skill-creator` checkout is current; published versions checked remain
  `opencode-skill-creator` 0.2.25, `@dietrichgebert/ponytail` 4.10.0, and
  `@upstash/context7-mcp` 4.1.1. Context7 is configured as a remote MCP, so no
  local npm package update was required.

Additional sync 2026-10-24:

- OpenCode V2 plugin migration: `notification.js` now has a V2 default export,
  subscribes to events with cleanup, and runs notification commands without the
  removed V1 `$` helper. Ponytail 5.3.2 and opencode-skill-creator 0.3.6 load
  from the global `plugins` array. The creator's upstream checkout was fast-
  forwarded and moved to `~/Projects/opencode-skill-creator` so its nested
  bundled skills are not discovered multiple times; its installed workflow
  skill is now managed by the plugin.

Additional upstream audit 2026-10-24:

- Reviewed all 65 local skills. Synchronized `expo/skills` at `d5caf7f`,
  including the returned `expo-migrate-module` (now under `expo-experiments`),
  EAS simulator/Observe changes and the current Expo feedback command. Kept
  `expo-tailwind-setup` and `expo-skill-feedback` as legacy local copies;
  the latter retains opt-in telemetry and now submits feedback through the
  current Expo agent CLI. Preserved the local OSS/paid description prefixes.
- Synchronized the installed Matt Pocock engineering and grilling skills at
  `5beb35b`, including the `GLOSSARY.md` terminology and template rename.
  Retained `resolving-merge-conflicts`, which upstream removed, as a local
  legacy copy; did not add newly published skills outside the local selection.
- Synchronized the OpenCode-adapted `impeccable` fork with `pbakaus/impeccable`
  at `9368675` (4.7.1), keeping local agent adapters, skill-base-dir paths and
  structured-question wording. Reviewed its native-relevant changes into
  `impeccable-rn` manually; see that fork's `FORK.md`.
- Synchronized `humanizer` at `8c307f3`. The locally selected skills from
  `vercel-labs/agent-skills` (`063bee9`), `vercel-labs/skills` (`a80e4c9`),
  `juliusbrussee/skills` (`8470b26`), `cloudflare/security-audit-skill`
  (`c1c8a8c`), and `ceorkm/mobile-app-ui-design` (`4c67a0e`) match their
  upstream content. The local `context7-mcp` workflow still matches the
  configured remote MCP's resolve-then-query flow; npm is at 4.4.4, but no
  local npm package is installed. Original skills have no upstream to import.
