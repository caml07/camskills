# Harden (React Native)

Production-ready: errors, offline, i18n, edge cases. Designs that only work with perfect data aren't production-ready.

## RN-Specific Hardening

### Network & Offline

RN apps frequently operate on unreliable connections. Handle these with:

```tsx
import { useNetInfo } from '@react-native-community/netinfo';

function Feed() {
  const netInfo = useNetInfo();

  if (!netInfo.isConnected) {
    return <OfflineBanner />;  // Top banner + stale data
  }
  // ...
}
```

**Critical paths:**
- API calls wrapped in try/catch with user-facing error messages
- Retry button on network failures
- Offline banner at top of screen (not a blocking modal)
- Stale data shown when offline (cache last successful response)
- Optimistic updates with rollback

### AppState (Foreground/Background)

```tsx
import { AppState, AppStateStatus } from 'react-native';

useEffect(() => {
  const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') refetch();  // Refresh data on return
  });
  return () => sub.remove();
}, []);
```

### Text Overflow

RN equivalents of CSS overflow handling:

| CSS | RN |
|---|---|
| `text-overflow: ellipsis` | `numberOfLines={3}` (or any N) |
| `overflow: hidden` | `overflow: 'hidden'` (works on View) |
| `word-break` | RN handles word break naturally |
| `hyphens` | Not supported. Use `numberOfLines` or adaptive layout |
| `min-width: 0` on flex items | Not needed - RN flex items shrink by default with `flexShrink: 1` |

```tsx
<Text numberOfLines={2} ellipsizeMode="tail">
  Long text that will truncate after two lines...
</Text>
```

### Internationalization (i18n)

Use `expo-localization` for device locale detection:

```tsx
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({ en, es, pt });
i18n.locale = getLocales()[0].languageCode;
i18n.enableFallback = true;
```

**Text expansion:** German is often 30% longer than English. Test tablet layouts with long text. Use flexible containers, not fixed widths.

**RTL:** RN supports RTL natively via `I18nManager`:
```tsx
import { I18nManager } from 'react-native';
// Text will auto-align based on language
```

**Date/Number formatting:**
```javascript
new Intl.DateTimeFormat(locale).format(date);
new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(n);
```

### Error Handling

- **API errors**: catch in TanStack Query / fetch, show inline error below content, offer retry.
- **Form validation**: Zod schema → field-level errors inline (not Alert).
- **Crashes**: wrap each section in error boundary. One component crashing shouldn't crash the app.

### Empty States

Every list/view must handle:
- No initial data (first launch)
- No search results
- Cleared feed (all items processed)
- Empty with CTA to next action

### Edge Cases

- Very long text (name with 100+ chars)
- Zero items (show empty state, not blank screen)
- Items with no image (fallback placeholder)
- Double-tap submit (disable button with `isSubmitting`)

## Verification Checklist

- [ ] Network failures caught, show retry + offline banner
- [ ] Optimistic updates with rollback on failure
- [ ] AppState listener refreshes data on foreground
- [ ] `numberOfLines` on all text that could overflow
- [ ] i18n setup with expo-localization
- [ ] RTL tested (Arabic, Hebrew)
- [ ] Long text tested (German, CJK)
- [ ] Empty states for every list
- [ ] Error boundaries around sections
- [ ] Double-submit prevented on forms
- [ ] Form data preserved on validation error
