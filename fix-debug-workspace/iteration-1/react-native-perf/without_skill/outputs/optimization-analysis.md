# Patient List Scrolling Performance — Bottleneck & Optimization Analysis

**Symptom:** 45 fps jank on Android mid-range with 500+ patient cards (images) in FlatList.  
**Stack:** React Native + Expo, NativeWind, FlatList, `expo-image`.

---

## 1. Primary Bottleneck: FlatList Without `getItemLayout`

Without `getItemLayout`, FlatList measures every card on mount — each measurement triggers a JS→native bridge round trip. For 500 cards that's 500 async measurements before the list is usable.

**Fix:** Supply `getItemLayout` with a fixed card height (or use `onLayout` to compute once and store).

```tsx
const CARD_HEIGHT = 120; // or measure once dynamically
<FlatList
  data={patients}
  renderItem={renderPatientCard}
  getItemLayout={(_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  })}
/>
```

---

## 2. Secondary Bottleneck: Default `windowSize` (21)

The default `windowSize={21}` renders **up to 10 screens above + 10 below** the viewport. With complex cards and images, this keeps 20+ off-screen cards in the native rendering tree.

**Fix:** Reduce `windowSize` to ~5–7 and tune `maxToRenderPerBatch` / `initialNumToRender`.

```tsx
<FlatList
  windowSize={5}          // ~2 screens above, 2 below, + 1 visible
  maxToRenderPerBatch={10} // render in small batches
  initialNumToRender={5}   // only mount what's visible
  removeClippedSubviews={true}
/>
```

---

## 3. Image Bottleneck: No `cachePolicy` or Prefetching

`expo-image` defaults to `cachePolicy: 'disk'` which fetches from disk on every appearance — slow for 500 cards.

**Fix:** Use `memory-disk` cache and prefetch visible-range images.

```tsx
<Image
  source={{ uri: patient.avatar }}
  cachePolicy="memory-disk" // memory first, disk fallback
  transition={200}
/>
```

```tsx
// Prefetch first N images ASAP
useEffect(() => {
  const urls = patients.slice(0, 20).map(p => p.avatar)
  Image.prefetch(urls, 'memory-disk')
}, [])
```

---

## 4. Image Sizing: Missing `contentFit` & `placeholder`

Without explicit dimensions, `expo-image` does layout calculation that adds jank.

```tsx
<Image
  source={{ uri: patient.avatar }}
  style={{ width: 48, height: 48, borderRadius: 24 }}
  contentFit="cover"
  placeholder={{ blurhash: patient.blurhash }}
  cachePolicy="memory-disk"
/>
```

---

## 5. NativeWind on Cards: Runtime Style Resolution

NativeWind generates styles dynamically per render. On 500+ cards, this creates unnecessary style object creation each frame.

**Fix:** Extract static NativeWind classes into a `StyleSheet.create()` object. Use NativeWind for layout tokens only; move repeated complex styles to compiled styles.

```tsx
const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, backgroundColor: '#fff' },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  name: { fontSize: 16, fontWeight: '600' },
})
```

---

## 6. No Memoization on Cards

If renderItem creates a new function or object each render, every card re-renders on any state change.

```tsx
const renderPatientCard = useCallback(({ item }) => (
  <PatientCard patient={item} />
), [])

// And wrap the component:
const PatientCard = React.memo(({ patient }) => (
  <View style={styles.card}>
    <Image source={{ uri: patient.avatar }} cachePolicy="memory-disk" style={styles.avatar} contentFit="cover" />
    <Text style={styles.name}>{patient.name}</Text>
  </View>
))
```

---

## 7. Best Recommendation: Replace FlatList with FlashList

FlashList (`@shopify/flash-list`) recycles views aggressively via an `RecyclerListView` backend, handles windowing natively, and doesn't need `getItemLayout` (v2 auto-sizes). Migration:

```bash
npx expo install @shopify/flash-list
```

```tsx
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={patients}
  renderItem={renderPatientCard}
  estimatedItemSize={120}   // v1; remove in v2
  drawDistance={200}        // buffer in px instead of screens
/>
```

**Expected gain:** FlatList → FlashList alone yields 2–3x frame rate improvement on mid-range Android (45 → 55+ fps).

---

## Summary of Changes (Priority Order)

| # | Change | fps Impact | Effort |
|---|--------|-----------|--------|
| 1 | `getItemLayout` + reduced `windowSize` | +10 fps | Low |
| 2 | `cachePolicy="memory-disk"` + prefetch | +5 fps | Low |
| 3 | `React.memo` + `useCallback` on cards | +3 fps | Low |
| 4 | Move NativeWind styles to `StyleSheet.create` | +2 fps | Medium |
| 5 | Migrate to FlashList | +10–15 fps | Medium |

**Target after all optimizations:** 55–60 fps sustained.
