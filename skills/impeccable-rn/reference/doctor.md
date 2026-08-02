# Doctor (React Native)

Check the design context used by this skill. This is maintenance, not a redesign.

1. Run `node ~/.config/opencode/skills/impeccable-rn/scripts/doctor.mjs --json`.
2. If there are no findings, report that the design context is present and stop.
3. Route missing `PRODUCT.md` to `init` and missing `DESIGN.md` to `document`.
4. Do not create or rewrite either artifact unless the user asks in this turn.
