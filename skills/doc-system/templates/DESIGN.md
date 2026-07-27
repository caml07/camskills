---
name: {ProjectName}
description: {Brief description}
colorStrategy: Restrained | Committed | Full Palette | Drenched
colors:
  primary: ""
  primary-light: ""
  primary-dark: ""
  secondary: ""
  background: ""
  surface: ""
  surface-alt: ""
  text-primary: ""
  text-secondary: ""
  text-tertiary: ""
  text-disabled: ""
  text-inverse: ""
  success: ""
  success-light: ""
  error: ""
  error-light: ""
  warning: ""
  warning-light: ""
  info: ""
  info-light: ""
  overlay: ""
  card: ""
  dark-primary: ""
  dark-primary-light: ""
  dark-background: ""
  dark-surface: ""
  dark-surface-alt: ""
  dark-text-primary: ""
  dark-text-secondary: ""
  dark-text-tertiary: ""
  dark-card: ""
typography:
  display:
    fontFamily: ""
    fontSize: 34
    fontWeight: "700"
    lineHeight: 41
  title1:
    fontFamily: ""
    fontSize: 28
    fontWeight: "700"
    lineHeight: 34
  title2:
    fontFamily: ""
    fontSize: 22
    fontWeight: "700"
    lineHeight: 28
  title3:
    fontFamily: ""
    fontSize: 20
    fontWeight: "600"
    lineHeight: 25
  headline:
    fontFamily: ""
    fontSize: 17
    fontWeight: "600"
    lineHeight: 22
  body:
    fontFamily: ""
    fontSize: 17
    fontWeight: "400"
    lineHeight: 22
  callout:
    fontFamily: ""
    fontSize: 16
    fontWeight: "400"
    lineHeight: 21
  subhead:
    fontFamily: ""
    fontSize: 15
    fontWeight: "400"
    lineHeight: 20
  footnote:
    fontFamily: ""
    fontSize: 13
    lineHeight: 18
borderRadii:
  card: 16
  button: 12
  input: 10
  chip: 999
  modal: 20
shadowElevation:
  card: 2
  modal: 8
  overlay: 12
motion:
  durationMs: 200
  easing: easeOutQuart
  springDamping: 0.8
  springStiffness: 100
spacing:
  xs: 4
  sm: 8
  md: 16
  lg: 24
  xl: 32
  xxl: 48
---

# DOC-{NNN}: {ProjectName} — Design System

## Color Strategy

**Estrategia elegida:** `{colorStrategy}`

| Estrategia | Qué significa | Cuándo usarla |
|---|---|---|
| Restrained | Neutrals + un accent ≤10% | Product UI, dashboards |
| Committed | Un color lleva 30-60% de la UI | Brand-led apps |
| Full Palette | 3-4 roles de color con nombre | Design systems grandes |
| Drenched | El surface ES el color | Editorial, fashion, bold |

> **Anti-AI-slop**: Si body bg es cream/sand/beige (OKLCH L 0.84-0.97, C < 0.06, hue 40-100), es el default AI de 2026. Elegir: (a) saturado como body, (b) off-white verdadero chroma 0, (c) mid-tone tinted neutral.

### Contraste WCAG

| Uso | Ratio mínimo | Ejemplo |
|-----|-------------|---------|
| Body text | ≥4.5:1 | #1a1a1a on #f5f2ed |
| Large text (≥18px bold / ≥14px regular) | ≥3:1 | |
| Interactive states | ≥3:1 contra adyacente | |

Usar `PlatformColor('systemBlue')` para colores del sistema en iOS.

## Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| primary | | | CTAs, active states |
| background | | | Body bg |
| surface | | | Cards, sheets |
| surface-alt | | | Secondary surfaces |
| text-primary | | | Body content |
| text-secondary | | | Labels, captions |
| text-tertiary | | | Placeholders, disabled |
| success | | | Confirmations |
| error | | | Errors, destructive |
| warning | | | Warnings |
| card | | | Card bg |
| overlay | | | Modals backdrops |

## Typography

### Font loading

```typescript
// expo-font en root layout
const [loaded] = useFonts({
  'PlusJakartaSans': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
  'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
})
```

Usar `Platform.select` para font family: `Platform.OS === 'ios' ? 'SF Pro' : 'Roboto'` como fallback cuando no hay custom font.

| Style | Font | Size | Weight | Line Height | Letter-spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| Display | | 34 | 700 | 41 | -0.5 | Hero, empty states |
| Title1 | | 28 | 700 | 34 | -0.3 | Page titles |
| Title2 | | 22 | 700 | 28 | -0.2 | Section headers |
| Title3 | | 20 | 600 | 25 | -0.2 | Card titles |
| Headline | | 17 | 600 | 22 | -0.1 | Subheaders |
| Body | | 17 | 400 | 22 | 0 | Paragraphs |
| Callout | | 16 | 400 | 21 | 0 | Secondary text |
| Body leading | | 15 | 400 | 20 | 0 | Dense layouts |
| Footnote | | 13 | 400 | 18 | 0 | Captions, chips |

- Cap body line length: 65-75 chars por línea (constrain width en tablets).
- No pairar fonts que son similares pero no iguales. Pair on contrast axis o una familia mult-weight.
- Para código: `Platform.OS === 'ios' ? 'Menlo' : 'monospace'`.

## Spacing

| Token | Pixels | Usage |
|-------|--------|-------|
| xxsmall | 2 | Inner padding tiny |
| xsmall | 4 | Inner padding small |
| small | 8 | Between related elements |
| medium | 16 | Between sections |
| large | 24 | Card padding, page margins |
| xlarge | 32 | Section spacing |
| xxlarge | 48 | Screen-level padding |

Preferir `gap` en Flexbox sobre margins individuales.

## Border Radii

| Elemento | Radius | Uso |
|----------|--------|-----|
| Card | 16 | Contenedores principales |
| Button | 12 | Botones principales |
| Input | 10 | Campos de texto |
| Chip | 999 | Tags, badges (pill shape) |
| Modal | 20 | Bottom sheets, modales |
| Small | 6 | Icon containers |

## Shadow / Elevation

| Nivel | Shadow | Uso |
|-------|--------|-----|
| Card | elevation 2 | Cards estáticas |
| Raised | elevation 4 | Cards interactivas, sheets |
| Modal | elevation 8 | Modals, overlays |
| Toast | elevation 12 | Toasts, FABs |

## Motion

```typescript
// Reanimated 4 — patrones estándar
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
```

| Propiedad | Valor | Razón |
|-----------|-------|-------|
| Duración | 150-250ms | Usuarios en flow, no hacerlos esperar |
| Easing | easeOutQuart | Natural, no bounce |
| Spring damping | 0.8 | Interacciones táctiles |
| Spring stiffness | 100 | Táctil responsivo |
| Reduced motion | `AccessibilityInfo.isReduceMotionEnabled()` | Accesibilidad |

**Patrones:**

- `useAnimatedStyle` + `withSpring` en `Animated.View`. No animar layout properties directamente.
- Touch feedback: scale transform on `Pressable` usando `useAnimatedStyle` + `withSpring`.
- Layout animations: `EntryExitTransition.entering().exiting()` para mount/unmount.
- Sin bounce, sin elastic. Movimiento convey estado, no decoración.

## Interaction

- Touch targets ≥ 44×44pt (Apple HIG).
- `Pressable` con scale animation en vez de `TouchableOpacity`.
- `GestureDetector` + `Gesture.xxx()` para swipe, pinch, drag.
- `KeyboardAvoidingView`: `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`.
- Forms: React Hook Form + Zod con field-level errors inline.

## AI Slop Signals

| Señal AI | Solución profesional |
|----------|---------------------|
| Plain spinners | Skeleton screens con shimmer (Reanimated) |
| `Alert.alert()` | Bottom sheet con gesture handler |
| Flat cards uniformes | Cards con consistent borderRadius + themed shadow |
| `ScrollView.map()` | `FlashList` |
| `<Image>` sin placeholder | `expo-image` con blurhash + transition |
| Sin dark mode tokens | Light + dark palette en theme file |
| Spacing aleatorio | Token system: xs/sm/md/lg/xl |
| Default RN typography | Clear hierarchy de token scale |
| Sin touch feedback | Scale-down press en todos los interactivos |
| Estados no cubiertos | Skeleton → Empty → Error → Success → Offline |

## Dark Mode

| Light token | Dark token |
|-------------|------------|
| primary | dark-primary |
| primary-light | dark-primary-light |
| background | dark-background |
| surface | dark-surface |
| surface-alt | dark-surface-alt |
| text-primary | dark-text-primary |
| text-secondary | dark-text-secondary |
| text-tertiary | dark-text-tertiary |
| card | dark-card |

Detectar con `useColorScheme()` de RN y switchear token file.

## Component Examples

### Button
- Height: 48px. Border radius: 12.
- States: default, pressed (scale 0.96 via Reanimated), disabled (opacity 0.4).
- Pressable con escala animada.

### Card
- Border radius: 16. Background: card token.
- Shadow elevation: 2 (static) / 4 (interactive).
- Padding: spacing.lg (24).

### Input
- Border radius: 10. Height: 48px.
- Focus state: border primary. Error state: border error + error text below.
- KeyboardAvoidingView wraps form.

### Chip / Badge
- Border radius: 999 (pill). Padding horizontal: 12.
- Font: footnote (13px). Height: 28px.

### Bottom Sheet
- Border radius top: 20. Overlay: rgba(0,0,0,0.4).
- Gesture handler for swipe-to-dismiss.
- SafeAreaView for bottom inset.
