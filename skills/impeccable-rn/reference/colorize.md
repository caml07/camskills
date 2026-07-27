# Colorize

Add strategic color to monochromatic or flat RN UIs. RN uses hex/rgba colors — no OKLCH CSS support.

## Color Token Structure

```ts
// theme.ts — light mode
export const colors = {
  primary: '#0d9488',       // Brand color, used sparingly
  background: '#fafaf9',    // Screen background
  surface: '#ffffff',       // Card surface
  surfaceSecondary: '#f5f5f4', // Secondary surface (sidebar, filter bar)
  text: '#1c1917',          // Primary text (high contrast)
  textMuted: '#78716c',     // Secondary text (4.5:1 minimum against background)
  accent: '#0891b2',        // Accent for highlights
  error: '#ef4444',         // Errors and destructive actions
  success: '#22c55e',       // Success states
  warning: '#f59e0b',       // Warnings
  border: '#e7e5e4',        // Borders and dividers
  disabled: '#d6d3d1',      // Disabled controls
};

// Dark mode
export const darkColors: typeof colors = {
  primary: '#2dd4bf',
  background: '#0c0a09',
  surface: '#1c1917',
  surfaceSecondary: '#292524',
  text: '#fafaf9',
  textMuted: '#a8a29e',
  accent: '#22d3ee',
  error: '#fca5a5',
  success: '#86efac',
  warning: '#fcd34d',
  border: '#44403c',
  disabled: '#57534e',
};
```

### Color Strategy

Pick one of four commitment levels:

| Strategy | Description | Use Case |
|---|---|---|
| **Restrained** | Neutrals + one accent ≤10% of surface | Product UI default |
| **Committed** | One saturated color carries 30-60% | Brand-led screens |
| **Full Palette** | 3-4 named roles, each deliberate | Dashboards, data viz |
| **Drenched** | Surface IS the color | Hero screens, onboarding |

### Color Roles

- **Primary**: main CTA, selected state, active indicator. Applied to one element per screen.
- **Accent**: secondary highlights, links, data emphasis. Complementary or distinct from primary.
- **Error**: validation errors, destructive buttons, NPO/allergy indicators.
- **Success**: confirmed actions, delivered states.
- **Surface**: card, sheet, panel backgrounds. Light/dark variants.
- **Text**: high contrast body, muted secondary, disabled.

### Contrast Rules

- Body text ≥ 4.5:1 against background
- Large text (≥18px or bold ≥14px) ≥ 3:1
- Placeholder text: 4.5:1 (not the default muted gray)
- Touch targets need visual boundary (border, background tint, or shadow)

### Theme Selection

Dark vs light is never a default. Write one sentence of physical scene: who uses this, where, under what ambient light. "Kitchen staff under fluorescent lights at 6am" forces light. "Browsing menus in bed at night" forces dark. If the sentence doesn't force the answer, it's not concrete enough.

Apply theme via:
```tsx
import { useColorScheme } from 'react-native';
const scheme = useColorScheme(); // 'light' | 'dark'
const theme = scheme === 'dark' ? darkColors : colors;
```

### Anti-Patterns

- Gray text on colored backgrounds (washed out)
- Pure black `#000000` on non-OLED screens (harsh)
- Color-only indicators (add icon or label for accessibility)
- Saturated color on inactive states
- Teal / purple gradient combos (AI slop tell)
- Warm cream/sand backgrounds as default

### Verification Checklist

- [ ] All colors from token file, never hardcoded
- [ ] Dark mode tokens defined and applied via useColorScheme
- [ ] Body text ≥ 4.5:1 contrast
- [ ] Color is not the only indicator of state (add icons/labels)
- [ ] Primary color used sparingly (≤ 1 CTA per screen)
- [ ] No pure black or pure white
- [ ] Color strategy chosen intentionally (not default)
