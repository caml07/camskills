# Animate

Add purposeful motion with Reanimated 4. Motion conveys state, not decoration.

## Core Pattern: useAnimatedStyle

The fundamental building block. A shared value drives an animated style:

```tsx
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

function AnimatedCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      onTouchStart={() => { scale.value = withSpring(0.96); }}
      onTouchEnd={() => { scale.value = withSpring(1); }}
    />
  );
}
```

### Animation Functions

| Function | Use case |
|---|---|
| `withSpring(value, { damping, mass, stiffness })` | Natural feel, press feedback, card movements |
| `withTiming(value, { duration, easing })` | Precise timing, opacity, position |
| `withSequence(...)` | Chain animations (shake, multi-step) |
| `withDelay(delay, animation)` | Staggered reveals |
| `withRepeat(animation, count, reverse)` | Pulse, shimmer loops |

### Easing

- Default for `withTiming`: `Easing.out(Easing.exp)` (exponential ease-out).
- No bounce, no elastic. They feel dated on mobile.
- 150–250ms for most transitions. Users are in flow.

### Layout Animations

For mount/unmount animations on elements within a list or conditional render:

```tsx
import { EntryExitTransition } from 'react-native-reanimated';

<Animated.View
  entering={EntryExitTransition.entering().exiting()}
/>
// Or with specific presets:
import { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

<Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} />
```

### Pressable with Scale Feedback

Standard press interaction pattern:

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

function PressableCard({ children, onPress }) {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => { scale.value = withSpring(0.96); })
    .onEnd(() => { scale.value = withSpring(1); onPress?.(); })
    .onFinalize(() => { scale.value = withSpring(1); });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
```

### Shimmer / Skeleton Loading

```tsx
function SkeletonCard() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.skeleton, animatedStyle]} />;
}
```

### Reduced Motion

Check system preference. Gate heavy animations:

```tsx
import { AccessibilityInfo } from 'react-native';

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
}, []);

// Then conditionally:
if (reduceMotion) {
  // Skip animation, set final state immediately
  opacity.value = 1;
} else {
  opacity.value = withTiming(1, { duration: 300 });
}
```

### Premium Motion

Not just transform/opacity. Blur, backdrop-filter (via iOS vibrancy), clip-path (via Skia), and shadow animation are part of the palette. Use libraries:

- Reanimated 4: core animations
- `@shopify/react-native-skia`: custom shaders, clip paths, advanced effects
- `lottie-react-native`: complex vector animations (Lottie files)
- `react-native-masked-view`: mask-based reveals

### What NOT to animate

- Layout properties (width, height, padding) — causes layout thrashing. Use `transform: [{ scale }]`.
- Color changes across many elements (causes jank on Android).
- Navigation transitions (let Expo Router handle them).

### Verification Checklist

- [ ] Pressable components use Reanimated scale, not bare TouchableOpacity
- [ ] No bounce/elastic easing
- [ ] Reduced motion handled via `AccessibilityInfo`
- [ ] Layout animations for list mount/unmount
- [ ] Shimmer on skeleton loaders, not plain spinners
- [ ] No animation of layout properties
- [ ] Duration 150–250ms for interactions
- [ ] Gesture Handler for complex gestures (swipe, drag)
