# React Native craft floor

Load after direction is settled and before editing. The project design system and
platform conventions win over this floor.

## Verify

- **Accessibility:** labels, roles, selected/disabled state, logical focus order,
  44 pt iOS and 48 dp Android touch targets, Dynamic Type/font scaling, and
  reduced-motion behavior.
- **Insets:** safe areas, status/navigation bars, and the keyboard never hide
  controls or content.
- **States:** loading, empty, error, offline, disabled, and real content are all
  represented.
- **Performance:** virtualize long lists with FlashList, use expo-image for remote
  images, and keep expensive work out of scroll and gesture paths.
- **Theming:** semantic tokens support light and dark appearances; do not add raw
  colors for one screen.
- **Motion:** Reanimated feedback is brief and purposeful. Honor reduced motion;
  do not animate navigation or loading merely for decoration.
- **Adaptivity:** tablet, orientation, split-screen, and keyboard layouts
  restructure rather than stretch or clip.

## Refuse

- Web-shaped navigation, hover-only affordances, or a custom back gesture.
- A stretched phone screen on tablet.
- ScrollView for an unbounded list.
- Generic card grids when platform lists or grouped settings better fit the task.
- Emoji or mixed icon sets in place of a coherent icon system.
- Decorative motion that obscures task completion.
