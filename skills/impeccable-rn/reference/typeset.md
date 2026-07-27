# Typeset

Improve typography hierarchy, font loading strategy, and font pairing for React Native.

## Font Loading (expo-font)

RN doesn't ship with custom fonts. Load them at the app root:

```tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.otf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.otf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return <Stack />;
}
```

### Platform system fonts

For a native feel, prefer system fonts over custom:

| Platform | Sans | Mono |
|---|---|---|
| iOS | `San Francisco` (via `undefined` fontFamily) | `Menlo` |
| Android | `Roboto` | `monospace` |

Use `Platform.select`:

```ts
fontFamily: Platform.select({
  ios: 'System',  // SF Pro
  android: 'Roboto',
  default: 'System',
}),
```

### Typography Token Scale

```ts
export const typography = {
  display: { fontSize: 34, fontWeight: '700' as const, lineHeight: 41 },
  title:   { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  headline:{ fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  body:    { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  callout: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label:   { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
} as const;
```

Line height in RN is a single number (not unitless ratio like CSS). Use fixed pixel values.

### Pairing

- **Product UI**: One well-tuned sans family (Inter, SF Pro, Roboto) in 3-4 weights. Don't pair display + body in app UI.
- **Brand / Marketing**: Pair a display face with a body sans. Contrast axis: serif + sans, geometric + humanist.
- Don't pair fonts that are similar but not identical.

### Text Props

RN Text offers props that CSS doesn't:

- `numberOfLines={2}` — clamp to N lines (no `-webkit-line-clamp` needed)
- `adjustsFontSizeToFit` — auto-shrink text to fit (iOS)
- `minimumFontScale={0.5}` — floor for adjust (iOS)
- `lineBreakMode='tail'` — truncation style
- `selectable` — allow text selection
- `allowFontScaling={false}` — disable system font size override (use sparingly)

### Heading text

Use `textAlign: 'center'` for centered headings manually. No `text-wrap: balance` equivalent in RN — wrap happens naturally.

### Verification Checklist

- [ ] Fonts loaded via `useFonts` at root level before any screen renders
- [ ] SplashScreen gates app launch until fonts are ready
- [ ] Typography comes from token scale, not hardcoded sizes
- [ ] `numberOfLines` on text that could overflow
- [ ] Line heights use pixel values, not unitless numbers
- [ ] Font weights are intentional (400 body, 600 subheadings, 700 titles)
- [ ] No generic `fontSize: 14` without a token reference
- [ ] Platform-specific font families where appropriate
- [ ] No Inter on brand/marketing surfaces (unless explicitly requested)
- [ ] `allowFontScaling` off only for UI labels, on for body text
