# Optimize (React Native)

Diagnose and fix React Native performance issues.

## Key Performance Levers

### FlashList v2

The single biggest performance win. Replace `FlatList` and `ScrollView.map()`:

```tsx
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  estimatedItemSize={100}  // v1 only; v2 auto-sizes, remove this
  ListEmptyComponent={<EmptyState />}
/>
```

**FlashList v2 notes:** `estimatedItemSize` is deprecated in v2. No longer needed. Use `drawDistance` to control rendering buffer. Remove `onBlankArea` — not supported.

### expo-image

Replaces RN `Image` with native performance + blurhash placeholders:

```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: item.imageUrl }}
  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
  contentFit="cover"
  transition={300}
  style={styles.image}
/>
```

Benefits: disk/memory caching, blurhash preview, smooth transitions, no layout shift.

### MMKV (Storage)

Replace AsyncStorage with MMKV — 10-100x faster, synchronous:

```bash
npx expo install react-native-mmkv
```

```ts
import { MMKV } from 'react-native-mmkv';
export const storage = new MMKV({ id: 'app-storage' });

// Instead of await AsyncStorage.getItem('key'):
const token = storage.getString('authToken');  // Synchronous!
```

### Reanimated (UI Thread)

Keep expensive work off the JS thread:

```tsx
// ❌ JS thread animation (jank)
Animated.timing(opacity, { toValue: 1, duration: 300 }).start();

// ✅ UI thread animation (smooth)
opacity.value = withTiming(1, { duration: 300 });
```

### Memoization

- `React.memo` on list item components
- `useMemo` for computed values
- `useCallback` for callback props to memoized children
- `useDerivedValue` in Reanimated for complex animated calculations

### Common Bottlenecks

| Issue | Fix |
|---|---|
| ScrollView.map() for 50+ items | FlashList |
| RN Image without caching | expo-image |
| AsyncStorage frequent reads | MMKV |
| Heavy re-renders | React.memo + useMemo |
| Layout animation via state | Reanimated shared values |
| Large inline styles in render | StyleSheet.create outside component |
| console.log in render | Remove |
| Unmounted state updates | AbortController / isMounted ref |

## Verification

- [ ] FlashList for all dynamic lists
- [ ] expo-image replacing RN Image
- [ ] MMKV for storage (not AsyncStorage)
- [ ] Reanimated for animations (not Animated API)
- [ ] React.memo on list items
- [ ] No un-memoized callbacks in render
- [ ] No console.log in production
- [ ] Images have sized dimensions (no layout shift)
