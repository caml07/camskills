# Craft Flow (React Native)

Build a feature with impeccable UX and UI quality: shape the design, land the visual direction, build real production RN code, inspect and improve.

Before writing code: PRODUCT.md loaded, register identified and matching reference loaded, confirmed design direction (from `shape` or supplied by user).

## Step 0: Project Foundation

Check the project:
- Framework: Expo SDK (check `package.json` for `expo` version). SDK 56+ is current for 2026.
- Navigation: Expo Router (file-based, `app/` directory). Check `app/_layout.tsx` for root config.
- Existing tokens: look for `theme.ts`, `tokens.ts`, `constants/Colors.ts`, `design-system/`.
- Existing component library: `src/components/`, `components/`.
- Package manager: `bun.lock` → bun, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm, else npm.

Read these before writing code:
```bash
cat package.json
ls app/ src/ components/ 2>/dev/null || true
cat theme.ts 2>/dev/null || cat constants/tokens.ts 2>/dev/null || echo "NO TOKENS"
```

## Step 1: Shape the Design

Run `/impeccable-rn shape`, passing the feature description. Present the shape output and wait for user confirmation.

Shape is **required** for craft. If the user already supplied a brief, use it directly.

## Step 2: Load References

Based on the brief, consult relevant references:
- [layout.md](layout.md): Flexbox, safe areas, spacing
- [typeset.md](typeset.md): expo-font, type hierarchy
- [animate.md](animate.md): Reanimated animations
- [interaction-design.md](interaction-design.md): Gesture Handler, forms
- [colorize.md](colorize.md): Palette tokens, hex colors
- [harden.md](harden.md): Error handling, offline

## Step 3: Build to Production Quality

### Navigation (Expo Router)

Standard file-based structure:
```
app/
├── _layout.tsx          ← Root (providers, fonts, splash)
├── index.tsx            ← Entry (redirect or home)
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── _layout.tsx      ← Bottom tabs
│   ├── index.tsx
│   └── settings.tsx
└── product/
    └── [id].tsx
```

### Screen Template

Every screen follows:
```tsx
export default function Screen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScreenHeader title="..." />
      <Content />
    </View>
  );
}
```

### State coverage (non-negotiable)

| State | What to Show |
|---|---|
| **Loading** | Skeleton cards matching content shape + shimmer (Reanimated) |
| **Empty** | Illustration + message + optional CTA |
| **Error** | Error message + retry button |
| **Success** | Actual content |
| **Offline** | Top banner + stale data if available |

### Form Patterns

- React Hook Form + Zod for validation
- Field-level errors inline
- Disable submit while submitting (RHF `isSubmitting`)
- KeyboardAvoidingView wrapping
- Scale-down Reanimated press feedback on submit

### Component patterns

- **Cards**: Reanimated pressable, themed shadow, consistent borderRadius (16)
- **Buttons**: Gesture Handler scale, solid/outline/text variants from token
- **Bottom Sheets**: gesture-handler driven, not Modal
- **Lists**: FlashList with `keyExtractor`, never array index
- **Images**: expo-image with blurhash placeholder
- **Status indicators**: icon + color, never color-only

### Token file structure

```ts
export const colors = {
  primary: '#0d9488',
  background: '#fafaf9',
  surface: '#ffffff',
  text: '#1c1917',
  textMuted: '#78716c',
  error: '#ef4444',
  border: '#e7e5e4',
  // Dark mode
  dark: { ... },
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const typography = { ... };

export const shadows = { ... };
```

## Step 4: Verify

- Run `npx expo start` — app loads without crashes
- Check on both iOS and Android simulators
- Test offline mode (airplane mode)
- Test with VoiceOver/TalkBack
- Test on tablet (iPad simulator)
- Review in Expo Go on a real device

## Step 5: Present

Show the result: primary state, key states (empty, error), screenshots, and design decisions connecting back to the brief. Ask: "What's working? What isn't?"
