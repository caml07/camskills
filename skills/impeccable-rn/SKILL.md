---
name: impeccable-rn
description: Use when the user wants to design, redesign, shape, critique, polish, clarify, distill, harden, optimize, animate, colorize, typeset, layout, extract, or otherwise improve a React Native or Expo frontend interface. Covers mobile app UI, screens, components, forms, settings, onboarding, empty states, navigation, and bottom sheets. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility (VoiceOver/TalkBack), performance (FlashList, expo-image), responsive behavior (tablet/mobile), theming, anti-patterns, typography (expo-font), fonts, spacing, layout (Flexbox), alignment, color, motion (Reanimated), micro-interactions, UX copy, error states, edge cases, i18n (expo-localization), safe areas, platform-specific code, and reusable design systems or tokens. Also for bland designs that need to become bolder or more delightful, loud designs that should become quieter, or ambitious visual effects with Reanimated/Skia. Not for web-only or backend-only tasks.
version: 1.0.0-rn
user-invocable: true
argument-hint: "[craft|shape · critique|audit|polish · adapt|doctor] [target]"
license: Apache 2.0
allowed-tools:
  - Bash(node ~/.config/opencode/skills/impeccable-rn/scripts/*)
---

Designs and iterates production-grade React Native interfaces. Real working code, committed design choices, exceptional craft.

## Setup

Do these steps before proceeding:

1. Run `node ~/.config/opencode/skills/impeccable-rn/scripts/context.mjs` once per session. If the request names or implies a file, route, or app inside a monorepo, infer the concrete path and run `node ~/.config/opencode/skills/impeccable-rn/scripts/context.mjs --target <path>` instead. If you've already seen its output in this conversation, do not re-run it. The script either prints the project's PRODUCT.md (and DESIGN.md when present) as a markdown block, or tells you it's missing. Follow whatever it prints. **If it reports `NO_PRODUCT_MD`, stop and follow `reference/init.md` before doing anything else.** If the output ends with an `UPDATE_AVAILABLE` directive, follow it (ask the user once, then continue). It never blocks the current task.
2. If the user invoked a sub-command (`craft`, `shape`, `audit`, `polish`, ...), read `reference/<command>.md` next. The reference defines the command's flow; without it you will skip steps the user expects.
3. Familiarize yourself with the existing project. Read `package.json`, existing components, tokens/theme files, and navigation structure. Don't reinvent the wheel; use what's there when it works.
4. Read the matching register reference. If the project is marketing or brand-led (design IS the product), read `reference/brand.md`. If it is app UI, admin, dashboard, or tool (design SERVES the product), read `reference/product.md`. Pick by: (1) task cue; (2) surface in focus; (3) `register` field in PRODUCT.md.
5. For iOS, Android, or adaptive work, read `reference/ios.md`, `reference/android.md`, or both before changing navigation, controls, or layout.
6. Before editing UI, read `reference/craft-floor.md` and apply it to the platform and the existing design system.
7. **If the project is brand-new (no existing tokens/theme/colors found in step 3)**, run `node ~/.config/opencode/skills/impeccable-rn/scripts/palette.mjs` to receive a brand seed color and composition guidance. Compose the palette (bg, surface, ink, accent, muted) around it. Convert to hex for RN styles. **Skip if step 3 found committed brand colors in existing tokens.**

## Design guidance

Produce ready-to-ship, production-grade code. Take no shortcuts unless asked. Every screen, section, or component crafted is tested using available tools (Expo Go screenshots, emulator, device preview).

### General rules

#### Color

- **Verify contrast.** Body text must hit ≥4.5:1 against its background; large text (≥18px or bold ≥14px) needs ≥3:1. Use WCAG contrast checkers.
- RN uses hex/rgba colors. Convert OKLCH to hex. Define all colors in a token file (`theme.ts` or `tokens.ts`), never hardcoded.
- Gray text on a colored background looks washed out. Use a darker shade of the background's own hue, or a transparency of the text color.
- Use `PlatformColor` for system colors when appropriate (`PlatformColor('systemBlue')` on iOS).

#### Typography

- Load fonts via `expo-font` (`useFonts` hook at the root level, gate with `SplashScreen`).
- Cap body line length at 65–75 characters per line. In RN this means constraining width on tablets.
- Don't pair fonts that are similar but not identical. Pair on contrast axis or use one family in multiple weights (common for product UI).
- Use `Platform.select` for font families: iOS uses SF Pro (system), Android uses Roboto. Custom fonts load via `useFonts`.
- Text sizes should come from a token scale: `display/title/headline/body/callout/caption`.

#### Layout

- RN Flexbox defaults: `flexDirection: 'column'`, `flexShrink: 0`. CSS-trained developers often miss these differences.
- Use `SafeAreaView` from `react-native-safe-area-context` for screen-level containers. Never hardcode status bar or notch padding. The core RN `SafeAreaView` is deprecated since RN 0.81 — never import it from `react-native`.
- `flex: 1` is the standard way to fill available space. Combine with `gap` for consistent spacing.
- Cards: use consistent `borderRadius` (card: 16, button: 12, input: 10, chip: 999). Build a semantic z-index scale if using `position: 'absolute'`.
- No `overflow: 'hidden'` on containers with `position: 'absolute'` children — they clip.
- For lists, use `FlashList` (v2, no `estimatedItemSize` needed). Never `ScrollView.map()` for more than ~5 items.
- **RN ≥0.85**: `StyleSheet.absoluteFillObject` removed — use `StyleSheet.absoluteFill` instead.

#### Motion (Reanimated 4)

- Use `useAnimatedStyle` + `withSpring` / `withTiming` on `Animated.View`. Never animate layout properties directly.
- Easing: exponential (ease-out-quart/quint/expo). No bounce, no elastic.
- Reduced motion: check `AccessibilityInfo.isReduceMotionEnabled()` and skip heavy animations.
- Layout animations: `EntryExitTransition.entering().exiting()` for mount/unmount.
- Touch feedback: scale transform on Pressable using `useAnimatedStyle` + `withSpring`.
- Motion conveys state, not decoration. 150–250ms for most transitions. Users are in flow; don't make them wait.

#### Safe Areas & Platform

- Every screen uses `useSafeAreaInsets()` for top/bottom padding.
- Tab bars account for bottom inset (home indicator).
- Use `Platform.OS` / `Platform.select` for platform-specific code.
- `KeyboardAvoidingView` for forms: `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`.
- **New Architecture is the only config since RN 0.82** — `newArchEnabled` is ignored/always-on; assume Fabric + TurboModules. Migrate anything that assumes the legacy architecture.
- **Android 15 (SDK 35) forces edge-to-edge; Android 16 (API 36) makes it mandatory with no opt-out.** Content must respect insets — `StatusBar.setBackgroundColor()` is deprecated on API 35+ and does nothing. Rely on `react-native-safe-area-context` (handles it automatically) instead of hand-tuned bars.
- **RN ≥0.84 requires Node ≥22.11.**

#### Interaction

#### Expo SDK 56

- Navigation imports migrated from `@react-navigation/*` to `expo-router/*` entry points: `ThemeProvider`, `DarkTheme` from `expo-router/react-navigation`; `createMaterialTopTabNavigator` from `expo-router/js-top-tabs`.
- Drawer navigation requires `react-native-worklets` alongside `react-native-reanimated` and `react-native-gesture-handler`.
- Touch targets ≥ 44×44pt (Apple HIG minimum).
- `Pressable` with scale animation (Reanimated) instead of bare `TouchableOpacity`.
- Gesture Handler (`GestureDetector` + `Gesture.xxx()`) for swipe, pinch, drag.
- Dropdowns/pickers: use bottom sheets, not `position: 'absolute'` overlays that clip.
- Forms: React Hook Form + Zod for validation. Field-level errors inline. Disable submit while submitting.

### New projects only (when no prior work exists)

#### Color & Theme

- **The cream / sand / beige body bg is the AI default of 2026.** The warm-neutral band (OKLCH L 0.84-0.97, C < 0.06, hue 40-100) reads as AI. If the brief is "warm", carry warmth by accent + typography + imagery, not by body bg. Pick: (a) a saturated brand color as body, (b) a true off-white at chroma 0, or (c) a darker mid-tone tinted neutral.
- When picking a theme: write one sentence of physical scene: who uses this, where, under what ambient light. If the sentence doesn't force dark vs light, it's not concrete enough.
- Pick a **color strategy**: Restrained (neutrals + one accent ≤10%), Committed (one color carries 30–60%), Full Palette (3–4 named roles), Drenched (surface IS the color).
- Start with hex/rgba. Define light and dark mode palettes in the token file.

### Absolute bans

- **Side-stripe borders.** `borderLeft`/`borderRight` > 1px as accent on cards. Rewrite with full borders, background tints, or nothing.
- **Gradient text.** RN doesn't support `background-clip: text` easily. Use a single solid color.
- **The hero-metric template.** Big number, small label, gradient accent. Cliché in both web and mobile.
- **Identical card grids.** Same-sized cards with icon + heading, repeated endlessly. Vary layout.
- **Tiny uppercase tracked eyebrow above every section.** The "ABOUT · PROCESS · PRICING" kicker over every section is AI grammar. Choose a different cadence.
- **Text overflow.** Long heading words in narrow layouts overflow on smaller screens. Use `numberOfLines` with `adjustsFontSizeToFit` or test every breakpoint.
- **Nested ScrollViews.** A `ScrollView` inside a `ScrollView` or `FlatList` inside `ScrollView` without `nestedScrollEnabled` or `scrollEnabled={false}`.

### The AI slop test

If someone could look at this interface and say "AI made that" without doubt, it's failed. The table below shows RN-specific tells:

| AI Slop Signal | Professional Solution |
|---|---|
| Plain spinners | Skeleton screens with shimmer (Reanimated) |
| `Alert.alert()` | Bottom sheet with gesture handler |
| Flat, uniform cards | Cards with consistent `borderRadius` + themed shadow |
| `ScrollView.map()` | `FlashList` |
| `<Image>` | `expo-image` with blurhash placeholder + transition |
| No dark mode tokens | Light + dark palette in theme file |
| Random spacing | Token system: `xs(4)/sm(8)/md(12)/lg(16)/xl(24)` |
| Default RN typography | Clear hierarchy from token scale |
| No touch feedback | Scale-down press on all interactives via Reanimated |
| State not covered | Skeleton → Empty → Error → Success → Offline |

## Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | Build | Shape, then build a feature end-to-end | [reference/craft.md](reference/craft.md) |
| `shape [feature]` | Build | Plan UX/UI before writing code | [reference/shape.md](reference/shape.md) |
| `init` | Build | Set up project context: PRODUCT.md, DESIGN.md | [reference/init.md](reference/init.md) |
| `document` | Build | Generate DESIGN.md from existing RN code | [reference/document.md](reference/document.md) |
| `extract [target]` | Build | Pull reusable tokens and components into design system | [reference/extract.md](reference/extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [reference/critique.md](reference/critique.md) |
| `audit [target]` | Evaluate | Technical native quality audit | [reference/audit.native.md](reference/audit.native.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive designs | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [reference/distill.md](reference/distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n, offline, edge cases | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations via Reanimated | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and font loading | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, alignment, safe areas | [reference/layout.md](reference/layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits (Skia, Lottie) | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages | [reference/clarify.md](reference/clarify.md) |
| `optimize [target]` | Fix | Diagnose and fix RN performance | [reference/optimize.md](reference/optimize.md) |
| `adapt [target]` | Fix | Adapt an existing screen for another device, orientation, or platform | [reference/adapt.native.md](reference/adapt.native.md) |
| `doctor` | Maintain | Check whether PRODUCT.md and DESIGN.md are present | [reference/doctor.md](reference/doctor.md) |

Plus three management commands: `pin <command>`, `unpin <command>`, detailed below.

### Routing rules

1. **No argument**: run `node ~/.config/opencode/skills/impeccable-rn/scripts/context-signals.mjs` once and read its JSON, then lead with the **2-3 highest-value next commands**, each with a one-line reason pulled from the signals, followed by the full menu. Never auto-run a command.
2. **First word matches a command**: load its reference file and follow its instructions. Everything after the command name is the target.
3. **First word doesn't match but intent maps** (e.g. "fix the spacing" → `layout`): load that command's reference and proceed.
4. **No clear match**: general design invocation. Apply the setup steps and General rules using the register reference.

## Pin / Unpin

Creates or removes standalone shortcuts so `/<command>` invokes `/impeccable-rn <command>` directly.

```bash
node ~/.config/opencode/skills/impeccable-rn/scripts/pin.mjs <pin|unpin> <command>
```

Valid `<command>` is any command from the table above. Report the script's result concisely.
