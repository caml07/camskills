# Product register

When design SERVES the product: app UIs, admin dashboards, settings panels, data tables, tools, authenticated surfaces, anything where the user is in a task.

## The product slop test

Not "would someone say AI made this." Familiarity is often a feature here. The test is: would a user fluent in the category's best tools (Linear, Figma, Notion, Raycast, Stripe come to mind) sit down and trust this interface, or pause at every subtly-off component?

Product UI's failure mode isn't flatness, it's strangeness without purpose: over-decorated buttons, mismatched form controls, gratuitous motion, display fonts where labels should be, invented affordances for standard tasks. The bar is earned familiarity. The tool should disappear into the task.

## Typography

- **One family is often right.** Product UIs don't need display/body pairing. A well-tuned sans carries headings, buttons, labels, body, data.
- **Token scale, not device hacks.** React Native does not use `rem` or CSS
  `clamp()`. Keep a stable role scale, then let `fontScale`, window size, and
  platform typography determine the final reading experience.
- **Tighter scale ratio.** 1.125–1.2 between steps is typical. More type elements here than on brand surfaces; exaggerated contrast creates noise.
- **Reading measure still matters.** Constrain prose on tablets, but do not use
  CSS `ch` values as a rule. Verify wrapping at the supported font scales and
  localized lengths.

## Color

Product defaults to Restrained. A single surface can earn Committed (a dashboard where one category color carries a report, an onboarding flow with a drenched welcome screen), but Restrained is the floor.

- State-rich semantic vocabulary: pressed, disabled, selected, busy, expanded,
  loading, error, warning, success, offline, and permission. Standardize these
  in both the visual tokens and `accessibilityState`.
- Accent color used for primary actions, current selection, and state indicators only, not decoration.
- A second neutral layer for sidebars, toolbars, and panels (slightly cooler or warmer than the content surface).

## Layout

- Responsive behavior is structural: use `useWindowDimensions()` and window or
  size-class thresholds to change navigation, columns, and density. Do not use
  device-model checks or fluid typography to hide a broken layout.

## Components

Every interactive component has: default, pressed, disabled, busy, loading,
error, success, and a native accessibility name, role, and state. Add hover or
hardware-keyboard focus only when the target supports it. Do not ship with half
of these.

- Skeleton states for loading, not spinners in the middle of content.
- Empty states that teach the interface, not "nothing here."
- Consistent affordances across the surface. Same button shape. Same form-control vocabulary. Same icon style.

## Motion

- 150–250 ms on most routine transitions. Users are in flow; do not make them
  wait for choreography.
- Motion conveys state, not decoration. State change, feedback, loading, reveal: nothing else.
- No orchestrated page-load sequences. Product loads into a task; users don't want to watch it load.

## Product bans (on top of the shared absolute bans)

- Decorative motion that doesn't convey state.
- Inconsistent component vocabulary across screens. If the "save" button looks different in two places, one is wrong.
- Display fonts in UI labels, buttons, data.
- Reinventing standard affordances for flavor (custom scrollbars, web-shaped
  form controls, non-standard sheets or modals, broken Back behavior).
- Heavy color or full-saturation accents on inactive states.
- Modal as first thought. Modals are usually laziness. Exhaust inline / progressive alternatives first.

## Product permissions

Product can afford things brand surfaces can't.

- System fonts and familiar sans defaults (Inter, SF Pro, system-ui stacks).
- Standard navigation patterns: top bar + side nav, breadcrumbs, tabs, command palettes.
- Density. Tables with many rows, panels with many labels, dense information when users need it.
- Consistency over surprise. The same visual vocabulary screen to screen is a virtue; delight is saved for moments, not pages.
