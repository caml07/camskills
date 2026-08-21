---
id: DOC-{NNN}
tipo: CRITIQUE
estado: vigente
idioma: es
verificado_el: {YYYY-MM-DD}
relaciones: [DOC-{DESIGN_ID}, DOC-{TRD_ID}]
evidencia: []
---

# DOC-{NNN}: Critique — {Área}

> Revisión UX/UI con heurísticas accionables. Sin scores decorativos.

## Heurísticas (solo las que generan acción)
| # | Heurística | Problema detectado | Acción concreta | Evidencia |
|---|------------|-------------------|-----------------|-----------|
| 1 | Visibility of System Status | | | |
| 2 | User Control and Freedom | | | |
| 3 | Error Prevention | | | |
| 4 | Error Recovery | | | |
| 5 | Consistency and Standards | | | |

> Solo completar las que tengan issue real. Si no hay problema, omitir — no llenar por llenar.

## Platform Audit (RN/Expo)
| Check | Pasa? | Si falla → qué hacer | Evidencia |
|-------|-------|---------------------|-----------|
| Touch targets ≥ 44pt | | | |
| Safe areas correctas (`useSafeAreaInsets`) | | | |
| Virtualized lists (`FlashList`/`FlatList`) | | | |
| Loading states (skeleton + shimmer) | | | |
| Empty states (icon + title + message) | | | |
| Error states (message + retry) | | | |
| Dark mode tokens (light/dark palette) | | | |
| Reduced motion respetado | | | |
| Accesibilidad (labels, roles, hints) | | | |

## Issues Prioritarios
- **P1:** (bloquea uso / accesibilidad crítica)
- **P2:** (degrada UX / inconsistencia)
- **P3:** (pulido / nice-to-have)

## AI Slop Check
| Señal | Presente? | Qué cambiar |
|-------|-----------|-------------|
| Plain spinners | | Skeleton + shimmer |
| `Alert.alert()` | | Bottom sheet + gesture |
| Flat uniform cards | | borderRadius + themed shadow |
| `ScrollView.map()` | | `FlashList` |
| `<Image>` sin placeholder | | `expo-image` + blurhash |
| Sin dark mode tokens | | Light/dark en theme file |
| Spacing aleatorio | | Token system |
| Default RN typography | | Token scale hierarchy |
| Sin touch feedback | | Pressable scale (Reanimated) |
| Estados no cubiertos | | Skeleton → Empty → Error → Success → Offline |

---
*Crear bajo demanda. Vincular a DESIGN doc para tokens y TRD para plataforma.*