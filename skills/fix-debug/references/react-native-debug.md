# React Native Debugging

## Common Issues

### Metro Bundler Crashes / Won't Start

```bash
# Clear cache
npx expo start -c

# Clear metro cache specifically
npx react-native start --reset-cache

# Check for port conflicts
lsof -i :8081
```

### Hermes Engine Issues

Symptoms: cryptic JSI errors, worklet failures, crash on launch.

- Verify Hermes is enabled in `app.json` (SDK 56 enables it by default)
- Check for unsupported JS features (Hermes doesn't support everything V8 does)
- Worklets must be strict JS — no closures over external scope

### Native Module Not Found

- Run `npx expo prebuild` to regenerate native folders
- `npx expo run:ios` or `npx expo run:android` to rebuild native code
- Check that the module supports the New Architecture (Fabric/TurboModules)

### Reanimated Worklet Errors

- All worklet functions must have `'worklet'` directive or use `useAnimatedStyle` wrapper
- Shared values must be accessed in `useAnimatedStyle`, not in `useEffect`
- `runOnJS` for calling JS thread from worklet
- `runOnUI` for calling UI thread from JS

### Gesture Handler Not Working

- Wrap the component in `GestureHandlerRootView` at the root
- Import `GestureDetector` + `Gesture` (v2 API, not the old one)
- Gesture handlers inside `ScrollView` need `waitFor` or `simultaneousHandlers`

### FlashList Performance Issues

- `estimatedItemSize` is required — measure or estimate
- Items should be `memo` wrapped
- Avoid absolute positioning inside list items
- Use `getItemType` for heterogeneous lists
