# Interaction Design

React Native is not the web. Do not import CSS focus rings, HTML dialogs,
Popover API, DOM portals, ARIA-only patterns, or browser hover assumptions into
a native screen. Design the native interaction contract first, then implement
it with the project's existing components.

## Press states

Every interactive element needs an intentional state model:

| State | Native treatment |
|---|---|
| Default | Clear affordance and role in the visual hierarchy |
| Pressed | Immediate visual feedback from `Pressable`'s `pressed` state |
| Long press | Only when it exposes a useful secondary action; provide a visible alternative |
| Disabled | `disabled` plus `accessibilityState={{disabled: true}}`; do not rely on opacity alone |
| Busy | Preserve context, prevent duplicate submission, expose `busy` to assistive technology |
| Error | Explain the problem near the field or task and provide recovery |
| Success | Confirm the result without stealing focus or forcing a new screen |
| Hover | Optional pointer or desktop enhancement, never the only affordance |

Use `Pressable` for ordinary touch interactions. Its `onPressIn`, `onPressOut`,
`onPress`, and `onLongPress` callbacks describe different moments; do not use a
long press where a normal tap is expected.

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Save profile"
  accessibilityState={{disabled: saving, busy: saving}}
  disabled={saving}
  hitSlop={8}
  onPress={save}
  style={({pressed}) => [styles.button, pressed && styles.pressed]}
>
  <Text>{saving ? 'Saving...' : 'Save'}</Text>
</Pressable>
```

On Android, use `android_ripple` when it fits the visual system. Do not hide
press feedback behind a custom animation that delays the action or blocks the
main thread.

## Touch geometry

- Meet the platform target: at least 44 pt on iOS and 48 dp on Android. Keep
  adjacent targets separated enough to prevent accidental activation.
- Use `hitSlop` to enlarge a small visible icon's touch area, not to excuse an
  undersized control. The hit area cannot escape the parent bounds, and a
  sibling with higher z-order still wins overlapping touches.
- Use `pressRetentionOffset` when a finger can reasonably slide while holding a
  press. Do not use it to make neighboring controls ambiguous.
- Test one-handed reach, edge gestures, keyboard or pointer input where the
  device supports it, and VoiceOver/TalkBack activation.

## Accessibility contract

Treat every custom control as a native accessibility API, not a styled `View`.

- Set `accessible` deliberately. A composite control should usually expose one
  logical element rather than making its decorative children interrupt the
  reading order.
- Give the element an `accessibilityRole`: `button`, `link`, `header`,
  `checkbox`, `switch`, `radio`, `tab`, `search`, `adjustable`, `progressbar`,
  or the role that actually matches the behavior.
- Give icon-only controls an explicit `accessibilityLabel`. Do not make users
  infer an icon's meaning from its pixels or nearby layout.
- Add `accessibilityHint` only when the result is not obvious from the label;
  do not repeat the label.
- Keep `accessibilityState` synchronized with `disabled`, `selected`,
  `checked`, `busy`, and `expanded`. Use `accessibilityValue` for sliders,
  progress, counters, and other ranges.
- For a form control, connect the visible label with `nativeID` and
  `accessibilityLabelledBy` on Android when that produces a clearer announcement.
- Use `accessibilityLanguage` for content that must be read in a different
  BCP 47 language.

The accessible name and the visible label should agree. A control that says
"Delete" visually must not announce an unrelated internal identifier.

## Custom actions and dynamic state

Use `accessibilityActions` plus `onAccessibilityAction` for actions that a
screen-reader user needs to perform directly, such as delete, expand, collapse,
increment, or decrement. The action must produce the same result as the visible
interaction.

When content changes without navigation:

- Use `accessibilityLiveRegion="polite"` on Android for non-urgent status text.
- Use `AccessibilityInfo.announceForAccessibility()` when a result must be
  announced and no live region is reliable for the component.
- Query `AccessibilityInfo.isScreenReaderEnabled()` only when behavior truly
  needs to change; do not hide information from sighted users.
- Keep loading, error, success, and permission changes in the same logical
  reading order as the visual UI.

## Focus, overlays, and navigation

There is no DOM focus trap to copy. For a modal or sheet:

- Make the modal content the accessible context. On iOS use
  `accessibilityViewIsModal`; on Android hide the obscured sibling tree with
  `importantForAccessibility="no-hide-descendants"` when the component requires
  it.
- Give the modal a clear heading, close action, and return path. Do not leave
  VoiceOver or TalkBack reading controls behind an active modal.
- Restore focus or announce the new screen after navigation when the transition
  would otherwise leave assistive technology with no useful context.
- Prefer the navigation and bottom-sheet primitives already used by the app;
  do not create an absolute-positioned overlay that clips inside a scroll view.

`AccessibilityInfo.setAccessibilityFocus()` is deprecated in current React
Native docs. Prefer `sendAccessibilityEvent()` with a host ref when an
imperative focus event is genuinely required, and test the behavior on both
platforms.

## Gestures need visible alternatives

Swipe, drag, pinch, and long press are useful accelerators, not exclusive
paths. Provide a visible button, menu action, or accessibility action for every
important operation. Explain a non-obvious gesture once, then keep the screen
usable without the hint.

## Reduced motion and device settings

Read `AccessibilityInfo.isReduceMotionEnabled()` and subscribe to
`reduceMotionChanged` when motion persists for the lifetime of a screen. In the
reduced-motion path:

- remove parallax, large travel, and decorative loops;
- keep short state feedback when it communicates cause and result;
- prefer a cross-fade or immediate state change;
- do not replace an accessible state change with silence.

Also verify large text, bold text, high contrast, dark mode, color inversion,
and the user's font scale where the platform exposes those settings.

## Verification pass

Test the rendered flow, not only the JSX:

1. Turn on VoiceOver on a real iOS device or use Accessibility Inspector for a
   first pass; verify order, names, roles, states, actions, and modal escape.
2. Turn on TalkBack on an Android device or emulator with the Play Store; verify
   the same flow and dynamic announcements.
3. Repeat with a large font scale, reduced motion, dark mode, and a slow or
   failed request.
4. Test touch targets and gesture alternatives with one hand. Test pointer or
   hardware keyboard input only when the product supports those surfaces.

## Official React Native references

- [Accessibility](https://reactnative.dev/docs/accessibility)
- [AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- [Pressable](https://reactnative.dev/docs/pressable)
- [useWindowDimensions](https://reactnative.dev/docs/usewindowdimensions)
