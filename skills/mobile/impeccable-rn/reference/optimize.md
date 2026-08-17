Performance is a UI quality property. Find the bottleneck in this React Native
surface, fix the smallest cause, and measure again. Do not turn a design pass
into a cargo-cult list of memoization and animation tricks.

## Establish evidence

Before changing code, record:

- startup time to the first useful frame;
- dropped frames during the slow interaction or scroll;
- JS responsiveness while pressing, typing, navigating, and animating;
- memory and image decode pressure on a low-end Android device;
- list size, row complexity, and whether the issue is blank areas, memory, or
  delayed input;
- release-build behavior on real hardware, not only a development simulator.

Use React Native DevTools, the project's existing profiler, and platform tools
already used by the repository. Compare before and after on the same device,
build mode, data, and interaction path.

## Lists and scrolling

`ScrollView` renders all of its children at once. For long or dynamic content,
use `FlatList`, `SectionList`, or `VirtualizedList`.

- Keep rows small: simple hierarchy, bounded images, and no expensive work in
  `renderItem`.
- Give items stable keys with `keyExtractor`; never use an array index when
  items can be inserted, removed, or reordered.
- Move a reused row into a component and use `React.memo` only when profiling
  shows avoidable renders. A comparator that hides real state changes is a bug.
- Provide `getItemLayout` when rows have a fixed size; it avoids asynchronous
  layout measurement.
- Keep row state in an external store or item model when virtualization can
  unmount the row. Do not depend on an off-screen row preserving local state.
- Tune `initialNumToRender`, `maxToRenderPerBatch`,
  `updateCellsBatchingPeriod`, and `windowSize` together. Larger windows reduce
  blank areas but consume memory; larger batches improve fill rate but can block
  presses and other JS work.
- Treat `removeClippedSubviews` as a measured trade-off. It detaches views but
  does not free their memory and can expose missing content with transforms or
  absolute positioning.
- Keep pull-to-refresh, pagination, empty, error, offline, and end-of-list
  states inside the same list model rather than mounting competing scroll views.
- Use `FlashList` only when the project already uses it or a measured bottleneck
  justifies it; do not add it as a default replacement for the core list APIs.

## Images and media

- Request or generate an image near its display size. Do not decode a full-size
  hero image for a small list thumbnail.
- Reserve the final aspect ratio before the image loads so rows do not jump.
- Use the project's image component and cache. In Expo projects, prefer the
  existing `expo-image` setup when it is already part of the app.
- Provide a meaningful placeholder, error state, and accessible label for
  content images. Decorative images should not interrupt the accessible tree.
- Stop or reduce video, GIF, shader, and high-frequency visual work when the
  surface is hidden or the user has enabled reduced motion.

## Rendering and interaction

- Keep synchronous computation out of render, scroll, gesture, and press paths.
- Avoid reading layout and immediately causing a chain of writes during an
  interaction. Batch measurement and updates through the project's existing
  primitives.
- Keep `Pressable` feedback immediate. A press animation must not delay
  `onPress` or make a control feel unresponsive.
- Use the project's existing Reanimated or native animation system for motion;
  run high-frequency animation work on the UI/native path when that system
  supports it. Do not add a dependency for one transition.
- Prefer transforms and opacity for routine motion. Animate layout only when
  the layout change is the point and the target devices remain smooth.
- Honor `AccessibilityInfo.isReduceMotionEnabled()` and its change event. Keep
  meaningful state feedback, but remove parallax, large travel, and decorative
  loops.
- Do not memoize every component or wrap every callback by reflex. Verify that
  a render is expensive, the inputs are stable, and the change improves the
  measured path.

## Startup, architecture, and native boundaries

- Defer non-critical work until after the first useful frame when the product
  allows it. Do not block launch on analytics, large parsing, or hidden screens.
- Keep the JavaScript bundle and native binary free of unused dependencies and
  duplicated assets. Measure bundle changes instead of guessing.
- Treat Hermes, Fabric, and TurboModules as the current baseline for supported
  React Native versions. Remove assumptions about the legacy bridge rather than
  adding compatibility branches without a real supported version.
- Keep frequent JS-to-native calls out of gestures and scrolling. Aggregate
  work or move it to the project's existing native/UI-thread primitive.
- Test the exact target SDK, OS version, screen refresh rate, and device class
  that ships. Android edge-to-edge and keyboard/inset behavior can differ from
  a development simulator.

## Network and state

Performance is not only frame rate. A slow request still needs a useful screen:

- show a stable loading or skeleton state without shifting the layout;
- keep stale content useful while a refresh is in flight when product semantics
  allow it;
- make retry, offline, empty, permission, and partial-failure states explicit;
- prevent duplicate submissions and stale responses from overwriting newer
  state;
- preserve user input when a request fails.

Do not hide a slow operation with an indefinite spinner or block the whole app
because one card cannot load.

## Verification

After the change, repeat the same path and check:

- first useful frame and navigation response;
- smooth press, scroll, keyboard, and gesture interaction;
- no blank list areas, unexpected row state loss, or image layout shift;
- memory and battery behavior on a low-end Android device;
- 60 Hz and 120 Hz behavior when the product supports both;
- VoiceOver/TalkBack labels and announcements still work;
- reduced motion, large font scale, dark mode, offline, and error states still
  communicate the same product state.

## Never

- optimize before measuring;
- use `ScrollView` for an unbounded feed;
- add `memo`, `useMemo`, or `useCallback` everywhere without evidence;
- tune list props until blank areas disappear while press latency worsens;
- decode oversized images in list rows;
- sacrifice accessibility, font scaling, or error recovery for a benchmark;
- measure only on a desktop browser or a flagship simulator;
- add a new performance dependency when the existing stack already solves it.

When the measured bottleneck is gone, hand off to `/impeccable-rn polish`.

## Official React Native references

- [Performance overview](https://reactnative.dev/docs/performance)
- [Optimizing FlatList configuration](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [FlatList](https://reactnative.dev/docs/flatlist)
- [VirtualizedList](https://reactnative.dev/docs/virtualizedlist)
- [New Architecture](https://reactnative.dev/architecture/overview)
