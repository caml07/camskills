import React from "react"
import { Pressable } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"
import { useTheme } from "./theme-provider"

const TRACK_WIDTH = 52
const TRACK_HEIGHT = 28
const KNOB_SIZE = 24
const KNOB_PADDING = (TRACK_HEIGHT - KNOB_SIZE) / 2
const KNOB_END = TRACK_WIDTH - KNOB_SIZE - KNOB_PADDING * 2

export function ThemeToggle() {
  const { mode, toggle, colors } = useTheme()
  const isDark = mode === "dark"

  const knobTranslateX = useSharedValue(isDark ? KNOB_END : 0)
  const scale = useSharedValue(1)

  const isFirstRender = React.useRef(true)

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    knobTranslateX.value = withTiming(isDark ? KNOB_END : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    })
  }, [isDark])

  const knobAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: knobTranslateX.value },
      { scale: scale.value },
    ],
  }))

  function onPressIn() {
    scale.value = withTiming(0.85, { duration: 100 })
  }

  function onPressOut() {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.back(1.5),
    })
  }

  return (
    <Pressable
      onPress={toggle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
        borderRadius: TRACK_HEIGHT / 2,
        backgroundColor: isDark ? colors.cardBorder : colors.outline,
        justifyContent: "center",
        paddingHorizontal: KNOB_PADDING,
      }}
    >
      <Animated.View
        style={[
          {
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: KNOB_SIZE / 2,
            backgroundColor: isDark ? colors.onSurface : colors.card,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 3,
          },
          knobAnimatedStyle,
        ]}
      >
        <Animated.Text
          style={{
            fontSize: 13,
            lineHeight: 13,
          }}
        >
          {isDark ? "🌙" : "☀️"}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  )
}
