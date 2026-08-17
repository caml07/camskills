Typography carries information, hierarchy, and voice. Improve it inside the
established visual world; do not replace the identity unless the user asked.
In React Native, typography is also a system setting: Dynamic Type, font scale,
fallback metrics, and localization must survive the design.

## Visitor mode

- **Persuade + Experience:** display type may carry the voice when it remains
  readable at large font scale and narrow widths.
- **Operate + Read:** scanability, stable roles, and platform scaling come first.
- **Native:** follow [ios.md](ios.md) or [android.md](android.md), including
  Dynamic Type, sp behavior, system fonts, and dark/high-contrast settings.

If changing the font family would create a new identity, route through
[new-work.md](new-work.md) and update DESIGN.md. Otherwise preserve confirmed
families and improve their use.

## Assess

Inspect representative screens and answer with source or rendered evidence:

- Which faces, weights, and semantic roles are authoritative?
- Can title, heading, body, label, metadata, and data roles be distinguished
  without reading every word?
- What happens at the largest supported `fontScale` and with bold text enabled?
- Do long headings, CJK, Arabic, Hebrew, emoji, and German expansion wrap or
  clip?
- Are fallback fonts and weights close enough to avoid layout jumps while a
  custom font loads?
- Are list rows, buttons, tabs, and inputs still large enough when text grows?

For native work, skip the web detector. Inspect the rendered screen on the
shipped device classes and use the project's existing RN checks.

## Set the system

Before editing, name:

- the semantic roles the interface needs;
- the intended contrast between those roles;
- the reading width or density appropriate to the task;
- the existing font assets and weights that are allowed;
- the platform scaling, localization, and accessibility constraints.

Use the fewest roles and families that make hierarchy unmistakable. Tokens
should describe purpose (`title`, `body`, `label`, `caption`) rather than a
screen-specific point value.

## Apply

- Use the platform system font for ordinary controls and body copy unless the
  product has a confirmed type direction. iOS and Android have different native
  metrics; do not force one family across both without checking the result.
- Load only used font files and weights. In Expo, use the existing `expo-font`
  setup and do not show the main UI before its font policy is intentional.
- Keep `allowFontScaling` enabled by default. Treat
  `maxFontSizeMultiplier` as a product decision for a specific role, never as a
  blanket fix for clipping.
- Let body and button labels wrap when the task permits. Use `numberOfLines` or
  truncation only when the product defines what the user can do to read the full
  value.
- Use a token scale with clear role and weight steps. Do not create adjacent
  sizes that users cannot distinguish.
- Tune line height to the actual face, language, and font scale. Check ascenders,
  descenders, emoji, and mixed scripts instead of relying on a universal ratio.
- Keep numeric data aligned and legible; use tabular or monospaced features only
  where the content benefits and the platform font supports them.
- Prefer `useWindowDimensions().fontScale` for decisions that truly need to
  react to the user's setting. Do not scale typography from device model names.
- Keep text and controls inside safe areas and verify bottom sheets, tab bars,
  and keyboard states with enlarged text.

## Verify

- Title, body, label, and metadata roles are recognizable at a glance.
- Text remains readable in light and dark themes and under high contrast.
- Large font scale does not clip, overlap, hide the primary action, or break
  navigation.
- Long localized strings, RTL, CJK, and emoji remain usable.
- Font loading does not cause unacceptable reflow or invisible text.
- VoiceOver/TalkBack announcements use the same words as the visible labels.
- The screen still works in portrait, landscape, tablet, and split-screen sizes.

When the hierarchy holds, hand off to `/impeccable-rn polish`.

## Official React Native references

- [Text](https://reactnative.dev/docs/text)
- [useWindowDimensions](https://reactnative.dev/docs/usewindowdimensions)
- [Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS Human Interface guidance](https://reactnative.dev/docs/ios-views)
- [Android native UI guidance](https://reactnative.dev/docs/native-components-android)
