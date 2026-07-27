# FlatList + expo-image Scroll Performance Analysis

**Stack:** React Native Expo | NativeWind | FlatList | expo-image  
**Symptom:** 45fps scrolling with 500+ patient cards on Android mid-range  
**Severity:** Performance (complex bug per fix-debug skill decision tree)

---

## Bottleneck Identification

### 1. No `getItemLayout` — Dynamic measurement per item

FlatList measures every card's dimensions at render time. With 500+ uniform-height cards, the layout engine recalculates on every scroll tick, starving the UI thread.

**Source:** `/react/react-native-website` — "skipping measurement of dynamic content if size is known... great performance boost for lists of several hundred items."

### 2. Default `windowSize` of 21

Default renders **21 viewport heights** worth of items. At 500 cards, this means ~all items stay mounted, consuming GPU memory and increasing composite cost per frame.

**Source:** `/react/react-native-website` — "Reducing this number will reduce memory consumption and may improve performance."

### 3. No `React.memo` on card components

Without memoization, every FlatList re-render cycle triggers re-renders on all visible cards, even when data hasn't changed. This multiplies the JS thread work per frame.

**Source:** `/websites/shopify_github_io_flash-list` — "Use React.memo to optimize rendering of heavy leaf components, preventing unnecessary re-renders during item recycling."

### 4. expo-image default `cachePolicy: 'disk'`

Disk reads are I/O-bound. On mid-range Android devices (eMMC storage), reading 5–10 images from disk per frame creates frame drops. The `'memory-disk'` policy keeps hot images in RAM.

**Source:** `/expo/expo` — `'memory-disk'` = "Image is cached in memory, but with a fallback to the disk cache."

### 5. Full-resolution images in list cards

If the card shows a 4000×3000 photo downscaled via CSS, the GPU decodes the full bitmap. This is the #1 GPU memory pressure source on mid-range Android (Adreno 5xx/6xx with shared memory).

### 6. Inline functions in `renderItem`

Arrow functions inside `renderItem={({item}) => ...}` create new closures every render pass, defeating `React.memo` on the child component.

### 7. NativeWind runtime style resolution

NativeWind resolves `className` strings to `StyleSheet` objects at runtime. On 500+ items with complex class strings, this adds measurable serialization cost per render.

---

## Solutions (ordered by impact)

### Primary — Immediate 45→60fps

| Step | Change | Expected Gain |
|------|--------|---------------|
| 1 | Replace FlatList with `@shopify/flash-list` (drop-in, same API) | 2–5x render throughput |
| 2 | Set `estimatedItemSize={CARD_HEIGHT}` | ~40% fewer layout passes |
| 3 | Set `cachePolicy="memory-disk"` on all expo-image cards | Eliminates disk I/O per frame |
| 4 | Wrap card component with `React.memo` | ~30% fewer JS thread re-renders |
| 5 | Extract `keyExtractor` and `renderItem` as module-level stable references | Enables memo to work |

**FlashList migration reference:**

```typescript
import { FlashList } from '@shopify/flash-list';

// Single estimatedItemSize replaces getItemLayout
<FlashList
  data={patients}
  renderItem={renderPatientCard}
  estimatedItemSize={120}
  keyExtractor={keyExtractor}
/>
```

### Secondary — Additional headroom

| Step | Change | Expected Gain |
|------|--------|---------------|
| 6 | Serve/cache thumbnail images (e.g., 150×150 WebP) instead of originals | ~60% GPU memory reduction |
| 7 | Set `maxToRenderPerBatch={10}`, `initialNumToRender={10}` | Lower spike render cost |
| 8 | Reduce `windowSize` to 5–7 (FlatList only, not needed for FlashList) | Fewer off-screen mounted items |
| 9 | Use `getItemType` in FlashList for heterogeneous card types | Better recycling pool separation |

### expo-image optimized card pattern:

```typescript
const PatientCard = memo(({ item }: { item: Patient }) => (
  <View className="p-4 border-b border-gray-200">
    <Image
      source={{ uri: item.photoUrl }}
      style={{ width: 80, height: 80, borderRadius: 40 }}
      cachePolicy="memory-disk"
      contentFit="cover"
      placeholder={{ blurhash: item.blurhash }}
    />
    <Text className="text-base font-semibold">{item.name}</Text>
    <Text className="text-sm text-gray-500">{item.diagnosis}</Text>
  </View>
));
```

### FlatList config if migration is deferred:

```typescript
<FlatList
  data={patients}
  renderItem={renderPatientCard}
  keyExtractor={keyExtractor}
  getItemLayout={(_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  })}
  windowSize={5}
  maxToRenderPerBatch={10}
  initialNumToRender={10}
  removeClippedSubviews={true}
  // removeClippedSubviews defaults to true on Android, explicit for safety
/>
```

---

## References

| Source | Library ID |
|--------|------------|
| React Native FlatList docs | `/react/react-native-website` |
| FlashList performance guide | `/websites/shopify_github_io_flash-list` |
| expo-image cache policies | `/expo/expo` |
| React Native perf guide (v0.83) | `/react/react-native-website` |

---

## Verification

After applying changes, verify in **release mode** (JS dev mode adds overhead):

```bash
npx expo run:android --variant release
```

Measure with:
- **React DevTools** — profiler flamegraph (check `PatientCard` re-render count)
- **Flipper / hermes** — `console.disableYellowBox=false` + `PerformanceMonitor` module
- **Manual** — FPS monitor overlay: `npx expo start --dev-client` then shake → "Show Perf Monitor"

Target: **55–60fps** sustained on a Moto G84 (Snapdragon 695) or equivalent mid-range device.
