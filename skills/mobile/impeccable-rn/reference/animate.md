> **Additional context needed**: target platforms, interaction frequency, and performance constraints.

Use motion to explain state, relationship, hierarchy, or one authored moment
the surface has earned. In React Native, motion must remain native-feeling,
interruptible, accessible, and smooth on the slowest supported device.

## Find the job

Inspect the existing motion language, navigation transitions, gesture model,
target devices, and reduced-motion behavior. Add motion only when it:

- acknowledges an action;
- makes a state change or spatial relationship legible;
- preserves continuity through navigation or layout change;
- directs attention to a meaningful event;
- expresses the chosen product world without slowing routine work.

Do not add a generic fade-and-rise or a scroll reveal because a screen has empty
space. Ask only when a material motion constraint cannot be inferred.

## Set the motion thesis

Before implementation, name:

- the focal moment, if there is one;
- the state or spatial change that needs explanation;
- the controls that need immediate feedback;
- the animation budget: frequency, device range, and expensive effects;
- the reduced-motion alternative.

The default state must remain useful if animation is interrupted, skipped, or
the app is backgrounded.

## Choose the native mechanism

- Use the project's existing Reanimated, Animated, LayoutAnimation, or native
  navigation primitive. Do not add a dependency for one transition.
- Use `useAnimatedStyle` with transforms and opacity for frequent feedback when
  the existing animation system supports UI-thread execution.
- Use `withTiming` for deliberate, predictable state changes and `withSpring`
  only when physical settling communicates the interaction. Do not use bounce or
  elastic motion as a generic personality layer.
- Animate layout only when the relationship changing is the point. Measure the
  result on target devices; layout transitions can be more expensive than a
  transform.
- Use Gesture Handler for pan, pinch, drag, and swipe when the project already
  uses it. Provide a visible or accessibility action alternative for important
  gesture-only operations.
- Use Skia, Lottie, shaders, or a native module only for a real visual job that
  the existing stack cannot express, and verify startup, memory, and reduced
  motion costs before keeping it.

## Timing and easing

Use the smallest duration that preserves comprehension:

| Duration | Typical use |
|---|---|
| 100-150 ms | press and immediate feedback |
| 150-300 ms | routine state change |
| 300-500 ms | sheet, layout, or navigation transition |
| 500-800 ms | a rare, authored focal entrance |

Exits can be faster than entrances. Use confident deceleration for arrivals and
avoid making the user wait through choreography before a task is usable.

## Accessibility and interruption

Respect `AccessibilityInfo.isReduceMotionEnabled()` and the
`reduceMotionChanged` event. In the reduced-motion path:

- remove parallax, large travel, and decorative loops;
- keep short feedback when it communicates cause and result;
- prefer a cross-fade or immediate state change;
- never hide content until an animation completes;
- pause or stop nonessential loops when the surface is hidden or backgrounded.

Motion must not steal screen-reader focus, block the back gesture, or make a
pressed control look disabled. Dynamic state still needs an accessible name,
role, state, and announcement independent of the animation.

## Verify

1. Test the complete interaction with a finger, including interruption and
   rapid repetition.
2. Test iOS and Android platform transitions separately; do not assume a
   cross-platform animation reads as native on both.
3. Test low-end Android, 60 Hz, and 120 Hz where supported. Check dropped frames,
   input latency, memory, and battery cost.
4. Test VoiceOver/TalkBack, large font scale, dark mode, and reduced motion.
5. Remove the animation. If no meaning, feedback, continuity, or authored
   character is lost, do not ship it.

When motion earns its place and remains smooth, hand off to
`/impeccable-rn polish`.

## Official React Native references

- [Animations](https://reactnative.dev/docs/animations)
- [Pressable](https://reactnative.dev/docs/pressable)
- [AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- [Gesture Responder System](https://reactnative.dev/docs/gesture-responder-system)
