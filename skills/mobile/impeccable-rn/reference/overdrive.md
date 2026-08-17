Push a React Native interface beyond the conventional only when the product
earns it. This command is for a meaningful native interaction, material, or
performance capability, not for adding spectacle to an ordinary screen.

## Before choosing a technique

1. Name the user-visible effect and the product reason it matters.
2. Check the existing dependencies, platform targets, and design language.
3. Offer two or three feasible directions with their trade-offs: fidelity,
   accessibility, battery, memory, startup, maintenance, and platform reach.
4. Get the user's choice before introducing a new rendering or animation
   primitive.

## Native directions

- **Skia** for custom drawing, shaders, data visualization, or a material that
  cannot be expressed with normal views. Keep semantics and controls as native
  React Native elements around the canvas.
- **Reanimated** for high-frequency transforms, gesture-linked motion, and
  derived visual state when the project already uses it.
- **Gesture Handler** for pan, pinch, drag, and physically coherent gestures.
  Provide buttons or accessibility actions for important operations.
- **Lottie or an existing native animation asset** for a bounded, authored
  illustration when the project already has the runtime and asset pipeline.
- **Platform-native primitives** for blur, materials, system pickers, sheets,
  haptics, and navigation when they are the source of the desired behavior.
- **A native module or TurboModule** only when profiling proves the JS path
  cannot meet the requirement. The New Architecture is the baseline for
  supported versions; do not revive a legacy-bridge abstraction without a
  supported project constraint.

## Guardrails

- Keep core text, labels, actions, and state exposed through native views; a
  canvas is not an accessible replacement for the UI tree.
- Preserve safe areas, font scaling, dark mode, platform back behavior, and
  screen-reader order.
- Respect `AccessibilityInfo.isReduceMotionEnabled()`. Reduce particle count,
  parallax, travel, and loops while retaining meaningful state feedback.
- Bound memory and texture size. Avoid full-resolution assets for small surfaces
  and avoid continuously redrawing an unchanged scene.
- Avoid blocking startup or the JS thread. Profile gestures, scroll, and cold
  launch on the slowest shipped device.
- Keep a static and functional fallback for unsupported platforms, reduced
  motion, failed asset loading, and low-power conditions.

## Verify

- Capture the interaction on iOS and Android separately where both ship.
- Test a real low-end Android device, not just a flagship simulator.
- Check frame pacing at 60 Hz and 120 Hz when supported, memory after repeated
  navigation, and battery cost during a long session.
- Test VoiceOver/TalkBack, large font scale, dark mode, offline, and interrupted
  gestures.
- Remove the advanced technique. If the user loses no meaning, capability, or
  distinctive product character, keep the simpler implementation.

When the ambitious technique is justified and stable, hand off to
`/impeccable-rn polish`.

## Official React Native references

- [Animations](https://reactnative.dev/docs/animations)
- [Accessibility](https://reactnative.dev/docs/accessibility)
- [Performance](https://reactnative.dev/docs/performance)
- [New Architecture](https://reactnative.dev/architecture/overview)
