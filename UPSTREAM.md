# Upstream Tracking

| Skill | Origin | Type | Upstream | Update |
|-------|--------|------|----------|--------|
| context7-mcp | Context7 (Upstash) | third-party | `@upstash/context7-mcp` (npm) | `npx ctx7 setup --opencode` |
| doc-system | psistema/caml07 | own | — | edición directa |
| eas-app-stores | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-app-stores -g -y` |
| eas-hosting | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-hosting -g -y` |
| eas-observe | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-observe -g -y` |
| eas-simulator | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill eas-simulator -g -y` |
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
| expo-migrate-module | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-migrate-module -g -y` |
| expo-native-ui | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-native-ui -g -y` |
| expo-overview | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-overview -g -y` |
| expo-project-structure | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-project-structure -g -y` |
| expo-router | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-router -g -y` |
| expo-skill-feedback | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-skill-feedback -g -y` |
| expo-tailwind-setup | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-tailwind-setup -g -y` |
| expo-ui | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-ui -g -y` |
| expo-upgrade | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-upgrade -g -y` |
| expo-web-to-native | expo | third-party | `expo/skills` | `npx skills add expo/skills --skill expo-web-to-native -g -y` |
| find-skills | vercel-labs (skills.sh) | third-party | `vercel-labs/skills` | `npx skills add vercel-labs/skills --skill find-skills --agent opencode --copy -y` |
| fix-debug | psistema/caml07 | own | — | edición directa |
| humanizer | blader | third-party | `blader/humanizer` | `npx skills add blader/humanizer --skill humanizer --agent opencode --copy -y` |
| impeccable | pbakaus/impeccable (fork con adaptaciones opencode) | fork | `pbakaus/impeccable` @ `plugin/skills/impeccable` | Copiar upstream + re-aplicar: rutas `.claude/`→`.opencode/` y `AskUserQuestion`→`` `question` `` |
| impeccable-rn | Fork curado RN/Expo por psistema/caml07 | fork | `pbakaus/impeccable` @ `c0f495212236129c2e92aaf7714a3a9914569d13` | Intake manual; ver `skills/mobile/impeccable-rn/FORK.md` |
| junior-to-senior | juliusbrussee (skills.sh) | third-party | `juliusbrussee/skills` | `npx skills add juliusbrussee/skills --skill junior-to-senior --agent opencode --copy -y` |
| mattpocock-engineering/* | mattpocock | third-party | `mattpocock/skills` (`skills/engineering/`) | clonar repo y recopiar las 18 carpetas (ask-matt, codebase-design, code-review, diagnosing-bugs, domain-modeling, grill-with-docs, implement, improve-codebase-architecture, prototype, research, resolving-merge-conflicts, setup-matt-pocock-skills, tdd, to-spec, to-tickets, triage, wayfinder, wizard) |
| mobile-app-ui-design | ceorkm | third-party | `ceorkm/mobile-app-ui-design` | `npx skills add https://github.com/ceorkm/mobile-app-ui-design` |
| no-commit-secrets | psistema/caml07 | own | — | edición directa |
| no-use-effect | psistema/caml07 | own | — | edición directa |
| notification | psistema/caml07 | own | — | edición directa |
| academic-notes | psistema/caml07 | own | — | edición directa |
| notes-vault | psistema/caml07 | own | — | edición directa |
| ponytail | @dietrichgebert | plugin | npm | `npm update @dietrichgebert/ponytail` |
| skill-creator | psistema/caml07 | own | — | edición directa |
| tanstack-query | psistema/caml07 | own | — | edición directa |
| test-first | psistema/caml07 | own | — | edición directa |
| vercel-react-native-skills | vercel-labs | third-party | `vercel-labs/agent-skills` | `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-native-skills -g -y` |
| security-audit | Cloudflare | third-party | `cloudflare/security-audit-skill` | `npx skills update security-audit -g -y` |

**Legend:**
- `own` — skill original, sin upstream externo
- `third-party` — skill obtenido de una fuente externa
- `fork` — fork/modificación propia de un skill de terceros
- `plugin` — plugin npm, no un skill

## Last Upstream Audit

Reviewed 2026-09-07:

- `vercel-react-native-skills`, `find-skills`, `junior-to-senior`,
  `mattpocock-engineering/*`, `mobile-app-ui-design`, and `security-audit`
  match their current upstream source trees exactly.
- `expo/skills` at `d0075ffa09928f1edb3e7ac4f5af07586d4b344d` now exposes a
  monolithic `expo-skill-eval` skill rather than the vendored per-skill paths.
  It also adds `eas-update`. Neither is imported automatically.
- `impeccable` at `2bc2879276c1f321a53c4ca99d3371e411329b52` is 69 commits past
  the v4.1.3 base. Its OpenCode fork needs a dedicated sync that reapplies the
  local provider and tool adaptations; `impeccable-rn` was reviewed separately.
- `@upstash/context7-mcp` latest is `4.0.5`, but it is not installed locally;
  this repository owns only its OpenCode workflow instructions.
