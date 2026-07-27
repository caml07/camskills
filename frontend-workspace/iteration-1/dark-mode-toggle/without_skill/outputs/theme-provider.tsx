import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { useColorScheme, TouchableOpacity } from "react-native"
import { StatusBar } from "expo-status-bar"
import { MMKV } from "react-native-mmkv"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated"

// ─── Storage ────────────────────────────────────────────────────────────────

const storage = new MMKV({ id: "theme-storage" })
const STORAGE_KEY = "theme.mode"

// ─── Color tokens ───────────────────────────────────────────────────────────

export const Colors = {
  light: {
    primary: "#0284c7",
    primaryHover: "#0369a1",
    secondary: "#0ea5e9",
    accent: "#38bdf8",
    surface: "#f8fafc",
    onSurface: "#0f172a",
    muted: "#64748b",
    disabled: "#94a3b8",
    outline: "#e2e8f0",
    divider: "#f1f5f9",
    card: "#ffffff",
    cardBorder: "#e2e8f0",
    error: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#0ea5e9",
    overlay: "rgba(0,0,0,0.4)",
    toggleTrack: "#e2e8f0",
    toggleThumb: "#ffffff",
    toggleIcon: "#64748b",
    moon: "#94a3b8",
    sun: "#f59e0b",
  },
  dark: {
    primary: "#38bdf8",
    primaryHover: "#7dd3fc",
    secondary: "#0ea5e9",
    accent: "#7dd3fc",
    surface: "#0f172a",
    onSurface: "#f1f5f9",
    muted: "#94a3b8",
    disabled: "#64748b",
    outline: "#1e293b",
    divider: "#1e293b",
    card: "#1e293b",
    cardBorder: "#334155",
    error: "#f87171",
    success: "#4ade80",
    warning: "#fbbf24",
    info: "#38bdf8",
    overlay: "rgba(0,0,0,0.6)",
    toggleTrack: "#1e293b",
    toggleThumb: "#38bdf8",
    toggleIcon: "#38bdf8",
    moon: "#38bdf8",
    sun: "#fbbf24",
  },
} as const

export type ThemeMode = "light" | "dark"
export type ThemeColors = (typeof Colors)[keyof typeof Colors]

// ─── Context ────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  colors: ThemeColors
  mode: ThemeMode
  isDark: boolean
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// ─── Provider ───────────────────────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode
  /** Override initial mode (e.g. for Storybook / testing) */
  initialMode?: ThemeMode
}

export function ThemeProvider({ children, initialMode }: ThemeProviderProps) {
  const systemScheme = useColorScheme()

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (initialMode) return initialMode
    const persisted = storage.getString(STORAGE_KEY) as ThemeMode | null
    return persisted ?? systemScheme ?? "light"
  })

  useEffect(() => {
    const persisted = storage.getString(STORAGE_KEY) as ThemeMode | null
    if (!persisted) {
      setModeState(systemScheme ?? "light")
    }
  }, [systemScheme])

  const isDark = mode === "dark"
  const colors: ThemeColors = Colors[mode]

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark"
      storage.set(STORAGE_KEY, next)
      return next
    })
  }, [])

  const setTheme = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    storage.set(STORAGE_KEY, newMode)
  }, [])

  return (
    <ThemeContext.Provider
      value={{ colors, mode, isDark, toggleTheme, setTheme }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return ctx
}

// ─── Animated Toggle Button ─────────────────────────────────────────────────

interface DarkModeToggleProps {
  size?: number
}

export function DarkModeToggle({ size = 52 }: DarkModeToggleProps) {
  const { isDark, toggleTheme } = useTheme()

  const trackWidth = size
  const trackHeight = size * 0.52
  const thumbSize = trackHeight * 0.8
  const padding = trackHeight * 0.1
  const thumbOffset = trackWidth - thumbSize - padding * 2

  const translateX = useSharedValue(isDark ? thumbOffset : 0)
  const thumbScale = useSharedValue(isDark ? 0.85 : 1)
  const moonOpacity = useSharedValue(isDark ? 1 : 0)
  const sunOpacity = useSharedValue(isDark ? 0 : 1)

  useEffect(() => {
    translateX.value = withSpring(isDark ? thumbOffset : 0, {
      mass: 0.6,
      stiffness: 180,
      damping: 15,
      reduceMotion: ReduceMotion.System,
    })
    thumbScale.value = withSpring(isDark ? 0.85 : 1, {
      mass: 0.6,
      stiffness: 180,
      damping: 15,
      reduceMotion: ReduceMotion.System,
    })
    moonOpacity.value = withTiming(isDark ? 1 : 0, {
      duration: 200,
      reduceMotion: ReduceMotion.System,
    })
    sunOpacity.value = withTiming(isDark ? 0 : 1, {
      duration: 200,
      reduceMotion: ReduceMotion.System,
    })
  }, [isDark, thumbOffset, translateX, thumbScale, moonOpacity, sunOpacity])

  const thumbAnimated = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: thumbScale.value },
    ],
  }))

  const moonAnimated = useAnimatedStyle(() => ({
    opacity: moonOpacity.value,
  }))

  const sunAnimated = useAnimatedStyle(() => ({
    opacity: sunOpacity.value,
  }))

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Animated.View
        style={{
          width: trackWidth,
          height: trackHeight,
          borderRadius: trackHeight / 2,
          paddingHorizontal: padding,
          justifyContent: "center",
          backgroundColor: isDark ? Colors.dark.toggleTrack : Colors.light.toggleTrack,
          borderWidth: 1,
          borderColor: isDark ? Colors.dark.cardBorder : Colors.light.cardBorder,
        }}
      >
        <Animated.View
          style={[
            thumbAnimated,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: isDark ? Colors.dark.toggleThumb : Colors.light.toggleThumb,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 3,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Animated.Text
            style={[
              moonAnimated,
              { fontSize: thumbSize * 0.6, position: "absolute" },
            ]}
          >
            🌙
          </Animated.Text>
          <Animated.Text
            style={[
              sunAnimated,
              { fontSize: thumbSize * 0.6, position: "absolute" },
            ]}
          >
            ☀️
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  )
}
