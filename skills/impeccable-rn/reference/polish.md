# Polish (React Native)

Final quality pass before shipping. Systems-level consistency and production readiness.

## Pre-Flight

Before making changes, run the context script to load any existing `.impeccable/critique/<target>.md` backlog. If a critique snapshot exists for this target, read it and prioritize the P0/P1 issues.

## RN Polish Checklist

### Visual Consistency

- [ ] All colors from the token object (no `#fff`, `#000`, or hardcoded values)
- [ ] Typography from the token scale (display/title/headline/body/callout/caption)
- [ ] Spacing from `spacing` token (xs/sm/md/lg/xl/xxl)
- [ ] Shadows apply both `shadowColor/Offset/Opacity/Radius` (iOS) AND `elevation` (Android)
- [ ] Border radius consistent per component type
- [ ] Dark mode: all surfaces use theme-aware colors
- [ ] No untransitioned color/opacity changes (Reanimated where visible)

### Interaction Polish

- [ ] Every Pressable has Reanimated scale feedback (even if subtle at 0.98)
- [ ] Touch targets ≥ 44×44pt
- [ ] Keyboard dismiss on scroll (`keyboardShouldPersistTaps="handled"`)
- [ ] ScrollView bounces on iOS (`bounces={true}`)
- [ ] No bare TouchableOpacity without Reanimated press animation
- [ ] Bottom sheet dismisses on swipe down
- [ ] TextInputs have clear `returnKeyType` and `onSubmitEditing` chaining

### State Coverage

- [ ] Loading state: skeleton shimmer (Reanimated), not plain ActivityIndicator
- [ ] Empty state: illustration + message + CTA
- [ ] Error state: message + retry button, preserves form data
- [ ] Offline: top banner, stale data if available
- [ ] Disabled state: visual indication (opacity 0.4–0.5)
- [ ] No unhandled states (a component loading without feedback is a bug)

### Navigation

- [ ] Screen titles consistent in Expo Router options
- [ ] Back navigation works on all screens
- [ ] Tab bar: active state visible, badges/counts if applicable
- [ ] Deep links configured if screen is shareable

### Accessibility

- [ ] All pressables have `accessibilityLabel` or `accessibilityRole`
- [ ] Images have `accessibilityLabel` (alt text)
- [ ] Color contrast ≥ 4.5:1 body text
- [ ] Vibrate/haptic feedback on primary actions (optional, but intentional)
- [ ] `accessibilityLiveRegion` on dynamically updating content

### i18n & Edge Cases

- [ ] All user-facing strings wrapped in translation function
- [ ] Dates formatted via `Intl.DateTimeFormat`
- [ ] `numberOfLines` on text that could overflow
- [ ] Long names tested (100+ chars)
- [ ] Empty states for all dynamic content

### Performance (Quick Checks)

- [ ] FlatList/FlashList has `keyExtractor` (stable, unique - never array index)
- [ ] `useMemo` / `useCallback` on expensive computations
- [ ] No inline functions in render props without memo
- [ ] `expo-image` used instead of RN `Image`
- [ ] Images have correct dimensions (no layout shift)

### Final Checks

- [ ] App launches without crash
- [ ] No console.error / console.warn in production code
- [ ] Works on iOS simulator
- [ ] Works on Android emulator
- [ ] StatusBar style correct per theme

## Process

1. Run through the checklist against the target files
2. Fix all P0/P1 items
3. Read the critique backlog if available, verify P0/P1 are resolved
4. Present the diff with what was fixed
5. Ask: "Check the screenshots. What needs more work?"
