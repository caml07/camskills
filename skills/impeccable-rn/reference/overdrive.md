# Overdrive (React Native)

Push past conventional limits with technically extraordinary effects. For RN: Skia, Lottie, advanced Reanimated.

## Canvas & Custom Rendering (Skia)

Use `@shopify/react-native-skia` for custom rendering, effects, and clip paths:

```tsx
import { Canvas, Circle, Fill } from '@shopify/react-native-skia';

function GradientCircle() {
  return (
    <Canvas style={{ width: 200, height: 200 }}>
      <Fill color="#f0f0f0" />
      <Circle cx={100} cy={100} r={80} color="#0d9488" />
    </Canvas>
  );
}
```

Skia enables: custom shaders, blur masks, clip paths, SVG rendering, real-time particle systems.

## Complex Vector Animations (Lottie)

For animation-heavy moments (splash, transitions, celebrations):

```bash
npx expo install lottie-react-native
```

```tsx
import LottieView from 'lottie-react-native';

<LottieView
  source={require('./animations/checkmark.json')}
  autoPlay
  loop={false}
  style={{ width: 200, height: 200 }}
/>
```

Use Lottie for: branded loading animations, success celebrations, tutorial walkthroughs, empty state illustrations.

## Advanced Gestures (Gesture Handler + Reanimated)

Swipe-to-dismiss, drag-and-drop, pinch-to-zoom:

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function SwipeableCard() {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => { translateX.value = e.translationX; })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 100) {
        // Dismiss
        translateX.value = withSpring(500);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]} />
    </GestureDetector>
  );
}
```

## Use Responsibly

- Overdrive effects are for moments, not whole apps
- Respect reduced motion (AccessibilityInfo)
- Test on low-end Android devices
- Heavy Skia/Lottie can drain battery
- One extraordinary effect beats five mediocre ones

## Verification

- [ ] Performance acceptable on low-end devices
- [ ] Reduced motion respected (skip heavy effects)
- [ ] Battery impact considered
- [ ] One focused effect, not scattered
