# Layout

Fix spacing, alignment, visual rhythm, safe areas, and Flexbox layout for React Native.

## RN Flexbox vs CSS Flexbox

RN Flexbox looks like CSS but has critical default differences. These cause the most common layout bugs for web-trained developers:

| Property | CSS default | RN default |
|---|---|---|
| `flexDirection` | `row` | `column` |
| `flexShrink` | `1` | `0` |
| `alignContent` | `stretch` | `flex-start` |
| `flex` | shorthand (`1 1 auto`) | single number (`flex: 1` = `flexGrow: 1`) |

### Flexbox principles for RN

- `flex: 1` fills available space. Used at screen level: root View gets `flex: 1`, children distribute proportionally.
- `flexDirection: 'row'` for horizontal layouts. Default `'column'` stacks vertically.
- `gap` works on both directions (RN supports `gap`, `rowGap`, `columnGap` from RN 0.71+).
- No CSS Grid in RN. For 2D layouts, combine `flexDirection: 'row'` with `flexWrap: 'wrap'`.
- No `auto` margins. Use `justifyContent` / `alignItems` / Spacer components.

## Responsive Layout

RN handles "responsive" differently from web. There are no CSS breakpoints; use:

- `useWindowDimensions()` for screen width/height
- `Dimensions.get('window')` for static reads
- `useSafeAreaInsets()` for notch/home indicator insets
- `Platform.isPad` / `Platform.OS` for device-level branching

```tsx
import { useWindowDimensions } from 'react-native';

function Feed() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numColumns = isTablet ? 2 : 1;

  return <FlashList numColumns={numColumns} ... />;
}
```

### Spacing Token Scale

Multiply of 4 base:

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;
```

Every padding/margin value must come from this scale. Never hardcode `padding: 5` or `margin: 7`.

### Semantic Insets

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();
  // insets.top (status bar), insets.bottom (home indicator)
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      ...
    </View>
  );
}
```

Don't hardcode status bar height. Use `SafeAreaView` from `react-native-safe-area-context` for screen-level wrappers.

### Cards & Containers

- Consistent `borderRadius` per component type: card 16, button 12, input 10, chip 999 (full).
- Cards need both iOS shadow properties AND Android `elevation`:
  ```ts
  cardShadow: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
    android: { elevation: 4 },
  }),
  ```
- Nested cards are always wrong.

### ScrollView vs FlatList vs FlashList

| Need | Component |
|---|---|
| < 5 static items | `ScrollView` |
| Dynamic list, any size | `FlashList` (from `@shopify/flash-list`) |
| Horizontal scroll chips | `ScrollView horizontal` or `FlashList horizontal` |
| Sectioned list | `SectionList` or FlashList with sticky headers |

### Semantic z-index scale

RN z-index is simpler than CSS. Use:
- `zIndex: 1` for absolute-positioned overlays
- `elevation` for Android shadows (creates z-index automatically)
- Never arbitrary 999 values

```ts
const zIndex = {
  dropdown: 10,
  sticky: 20,
  modalBackdrop: 30,
  modal: 40,
  toast: 50,
  tooltip: 60,
} as const;
```

## Verification Checklist

- [ ] No hardcoded status bar / notch padding — uses `SafeAreaView` or `useSafeAreaInsets`
- [ ] `flex: 1` on screen-level container
- [ ] All padding/margin from token scale, no arbitrary values
- [ ] Cards use both iOS shadow and Android elevation
- [ ] `gap` used instead of manual margin on children where possible
- [ ] NumColumns for tablet layouts
- [ ] KeyboardAvoidingView for form screens
- [ ] FlashList for dynamic lists > 5 items
- [ ] No ScrollView inside ScrollView
- [ ] No CSS Grid patterns — RN doesn't support it
- [ ] Touch targets ≥ 44×44pt
