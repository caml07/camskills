import React from "react"
import { createContext, useContext, useColorScheme } from "react-native"

export type ThemeMode = "light" | "dark"

export type ThemeColors = {
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  surface: string
  onSurface: string
  muted: string
  disabled: string
  outline: string
  divider: string
  card: string
  cardBorder: string
  error: string
  success: string
  warning: string
  info: string
  overlay: string
}

export const Colors: Record<ThemeMode, ThemeColors> = {
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
  },
}

type ThemeContextValue = {
  mode: ThemeMode
  colors: ThemeColors
  toggle: () => void
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  colors: Colors.light,
  toggle: () => {},
  setMode: () => {},
})

export function ThemeProvider({
  children,
  onToggle,
}: {
  children: React.ReactNode
  onToggle?: (mode: ThemeMode) => void
}) {
  const systemScheme = useColorScheme()
  const [mode, setModeState] = React.useState<ThemeMode>(
    systemScheme === "dark" ? "dark" : "light"
  )

  function toggle() {
    setModeState((prev) => {
      const next = prev === "light" ? "dark" : "light"
      onToggle?.(next)
      return next
    })
  }

  function setMode(next: ThemeMode) {
    setModeState(next)
    onToggle?.(next)
  }

  const value = React.useMemo(
    () => ({ mode, colors: Colors[mode], toggle, setMode }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
