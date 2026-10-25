---
name: expo-skill-feedback
description: Submit actionable feedback about Expo skills or Expo, or manage the optional Expo skill telemetry. Use when a skill was useful, confusing, broken, missing context, or when the user asks to enable, disable, or inspect telemetry.
compatibility: Requires Node.js and internet access to submit feedback.
---

# Expo Skill Feedback

Telemetry is off by default. Enable it only after an explicit user request.

```bash
node "<skill-base-dir>/scripts/telemetry.cjs" --status
```

Send feedback only when it is specific and actionable:

```bash
npx --yes @expo/agent-cli@latest feedback --category skills --subject "expo-skill-feedback" "<actionable feedback>"
```

Use the canonical OpenCode skill as the detailed reference when the task needs
an eval-candidate report or telemetry troubleshooting.
