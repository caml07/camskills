An interface that only works with perfect data is not production-ready. Harden
the React Native surface against the inputs, devices, settings, permissions,
network conditions, and interruptions real users bring to it.

## Assess the surface

Read the existing components, navigation, state boundaries, and design tokens
before changing them. Exercise the actual flow with:

- very long and very short labels;
- emoji, accents, CJK, Arabic, Hebrew, and mixed-script content;
- empty, partial, stale, duplicate, and out-of-order data;
- slow, timed-out, offline, unauthorized, forbidden, not-found, rate-limited,
  and server-error responses;
- denied, limited, revoked, and not-yet-requested permissions;
- rapid repeated taps, back navigation during a request, rotation, split view,
  keyboard appearance, and app backgrounding;
- large font scale, bold text, dark mode, high contrast, reduced motion, and
  screen-reader enabled.

Write down the state machine before fixing isolated screenshots. Every state
needs a visual treatment, a recoverable action where possible, and an
accessible announcement that does not erase the user's context.

## Text, type, and localization

- Let `Text` wrap naturally before truncating. Use `numberOfLines` only when
  truncation is intentional and provide a way to read or open the full value.
- Do not use `adjustsFontSizeToFit` as a rescue for a broken layout. It can make
  labels inconsistent and hides font-scale failures; fix the container and
  hierarchy first.
- Test `useWindowDimensions().fontScale` at large values. Do not globally disable
  `allowFontScaling` or cap `maxFontSizeMultiplier` just to preserve a
  screenshot.
- Use text roles and font tokens, not per-screen point guesses. Verify missing
  font weights, fallback metrics, line height, and loading transitions.
- Budget space for translation expansion. Avoid fixed-width buttons and rows;
  let labels wrap or restructure without hiding the primary action.
- Use the project's i18n library and `Intl` for plural, date, number, and
  currency formatting. Never build plural strings with English-only suffixes.
- Test RTL with `I18nManager` and directional layout values. Prefer `start` /
  `end` semantics where the project supports them, and verify that directional
  icons such as back and forward mirror only when their meaning requires it.

## Layout, insets, and device changes

- Use `react-native-safe-area-context` for screen and overlay insets. Do not
  hardcode status-bar, notch, Dynamic Island, home-indicator, or Android
  navigation-bar padding.
- Use `useWindowDimensions()` so width, height, and font scale changes trigger a
  layout decision. Do not branch on device model or freeze `Dimensions.get()` at
  module load.
- Exercise phone, tablet, landscape, foldable posture, split-screen, and the
  smallest supported window. Restructure navigation and columns; do not merely
  scale a phone screenshot.
- Use `KeyboardAvoidingView` or the project's keyboard/inset primitive for forms.
  Test focus, scroll-to-field, dismissal, and submit behavior with the keyboard
  open on both platforms.
- Keep absolute overlays inside a deliberate layer model. Check clipping,
  z-order, hit testing, and safe-area coverage with a keyboard and modal open.
- Test Android 15+ edge-to-edge with real insets. Do not rely on a colored status
  bar background to make content readable.

## Loading, empty, and failure states

For every request or mutation, design:

1. initial loading without layout jump;
2. refresh or pagination loading that preserves useful content;
3. empty state with a clear next action;
4. offline or stale state with honest freshness information;
5. recoverable error with retry or an alternate path;
6. permission or authentication state with an explanation;
7. success state that confirms the result without trapping focus.

Keep errors near the failed task. Preserve input and selection when validation
or network work fails. Disable only the action that cannot safely repeat, rather
than freezing the whole screen.

Use `Pressable` for retry and recovery actions. Do not make `Alert.alert()` the
default for every failure; use the product's existing sheet, inline message, or
dialog primitive according to consequence and platform.

## Lists and large data

- Use `FlatList`, `SectionList`, or `VirtualizedList` for unbounded content.
- Keep rows light and stable. Use `keyExtractor`, fixed-row `getItemLayout`, and
  measured list batch/window settings when needed.
- Make empty, loading, error, refreshing, and end-of-list states part of the
  list rather than nesting competing `ScrollView`s.
- Ensure virtualized rows do not lose essential state when unmounted. Put that
  state in the item model or an external store.
- Test 0, 1, 5, 100, and 1000 items, long rows, duplicate labels, rapid scroll,
  refresh during pagination, and an item removed while it is focused.

## Accessibility resilience

For every custom control, verify:

- `accessible` groups the intended logical element;
- `accessibilityLabel` names icon-only or ambiguous controls;
- `accessibilityRole` matches behavior;
- `accessibilityHint` explains a non-obvious outcome without repeating the label;
- `accessibilityState` reflects disabled, selected, checked, busy, and expanded;
- `accessibilityValue` represents range or progress values;
- `accessibilityActions` exposes important gesture-only actions;
- dynamic status is announced with `accessibilityLiveRegion="polite"` on
  Android or `AccessibilityInfo.announceForAccessibility()` when needed;
- modal and sheet content isolates the obscured accessibility tree;
- reading order, visible order, and navigation order agree.

Test with VoiceOver and TalkBack, not only snapshots. Use
`AccessibilityInfo.isScreenReaderEnabled()` and
`AccessibilityInfo.isReduceMotionEnabled()` only when the product behavior
actually needs their state; never remove content for assistive users.

## Permissions and platform interruption

- Explain why a permission is needed before requesting it when the platform
  allows the explanation.
- Handle denied, restricted, limited, and permanently denied states. Provide a
  route to settings only when it is the correct recovery.
- Preserve or restore the user's task after backgrounding, rotation, navigation,
  a system sheet, an incoming call, or a permission prompt.
- Keep back behavior platform-native. Do not intercept iOS edge-swipe back or
  Android predictive Back merely to protect a fragile transition.

## Input and concurrency

- Validate at the field and submit levels, but do not punish users with errors
  before they have a reasonable chance to finish input.
- Keep the submit action idempotent. Guard against double taps and stale request
  results overwriting newer state.
- Preserve drafts across validation and recoverable network failures.
- Handle paste, autofill, password managers, IME actions, numeric keyboards,
  composition text, and selection where the field supports them.
- Make destructive operations reversible when product semantics allow it. Use a
  confirmation only when the consequence is high-cost, irreversible, or batch.

## Images, media, and resources

- Provide dimensions or an aspect-ratio container before remote media arrives.
- Use appropriately sized thumbnails and the existing cache/image component.
- Give content images an accessible label and keep decorative images out of the
  reading order.
- Handle failed, slow, offline, and expired media without collapsing the layout.
- Stop nonessential playback and animation when hidden, backgrounded, or
  reduced motion is enabled.

## Verification matrix

Run the complete path with:

- iPhone and Android phone, plus tablet when supported;
- portrait and landscape, plus split-screen or foldable posture when supported;
- small and large font scale, dark mode, high contrast, and reduced motion;
- VoiceOver and TalkBack;
- online, slow, offline, retry, permission, and authentication failure;
- empty, long, localized, RTL, CJK, emoji, and large-list data;
- repeated taps, back during work, keyboard open, rotation, and app resume.

Record evidence from the simulator, emulator, or real device. A screenshot
cannot prove that a screen-reader action, font scale, gesture, or retry path
works.

## Never

- assume English-length text or a single device size;
- disable font scaling, accessibility, or reduced motion to match a comp;
- use ARIA/DOM/CSS instructions as a substitute for native semantics;
- hide a failure behind an indefinite spinner;
- make a gesture the only path to an important action;
- nest virtualized lists inside an unbounded `ScrollView`;
- discard user input after a recoverable error;
- trust a simulator alone for gestures, performance, or screen-reader behavior.

When the edge-case matrix passes, hand off to `/impeccable-rn polish`.

## Official React Native references

- [Accessibility](https://reactnative.dev/docs/accessibility)
- [AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- [useWindowDimensions](https://reactnative.dev/docs/usewindowdimensions)
- [KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview)
- [FlatList](https://reactnative.dev/docs/flatlist)
