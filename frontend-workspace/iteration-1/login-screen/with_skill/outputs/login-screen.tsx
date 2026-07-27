import { View, Text, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const

const Typography = {
  h2: { fontSize: 24, lineHeight: 32, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
  bodyBold: { fontSize: 15, lineHeight: 22, fontWeight: "600" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  label: { fontSize: 12, lineHeight: 16, fontWeight: "500", textTransform: "uppercase" as const },
} as const

const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
} as const

const Colors = {
  primary: "#0d9488",
  onSurface: "#0f172a",
  muted: "#64748b",
  disabled: "#94a3b8",
  outline: "#e2e8f0",
  card: "#ffffff",
  error: "#ef4444",
  background: "#f8fafc",
  inputBg: "#f1f5f9",
  errorBg: "#fef2f2",
  iconBg: "#f0fdfa",
} as const

function PressableScale({
  onPress,
  scale = 0.97,
  children,
  disabled,
}: {
  onPress?: () => void
  scale?: number
  children: React.ReactNode
  disabled?: boolean
}) {
  const s = useSharedValue(1)
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: s.value }],
  }))

  return (
    <Animated.View
      onTouchStart={() => {
        if (!disabled) s.value = withSpring(scale)
      }}
      onTouchEnd={() => {
        s.value = withSpring(1)
        if (!disabled) onPress?.()
      }}
      onTouchCancel={() => {
        s.value = withSpring(1)
      }}
      style={style}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View style={disabled && { opacity: 0.5 }}>{children}</View>
    </Animated.View>
  )
}

export function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (_data: LoginForm) => {
    await new Promise((r) => setTimeout(r, 1500))
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <View style={styles.accentBar} />

          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✚</Text>
          </View>

          <Text style={styles.title}>MediPortal</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="you@practice.com"
                    placeholderTextColor={Colors.disabled}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    accessibilityLabel="Email address"
                  />
                  {errors.email && (
                    <Text style={styles.error}>{errors.email.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.disabled}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    autoComplete="password"
                    accessibilityLabel="Password"
                  />
                  {errors.password && (
                    <Text style={styles.error}>{errors.password.message}</Text>
                  )}
                </View>
              )}
            />

            <PressableScale
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <View style={styles.submitBtn}>
                <Text style={styles.submitText}>
                  {isSubmitting ? "Signing in\u2026" : "Sign in"}
                </Text>
              </View>
            </PressableScale>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  accentBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.iconBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  iconText: {
    fontSize: 28,
    color: Colors.primary,
  },
  title: {
    ...Typography.h2,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.muted,
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.md,
  },
  field: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.label,
    color: Colors.onSurface,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.inputBg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.onSurface,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorBg,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  submitText: {
    ...Typography.bodyBold,
    color: "#ffffff",
  },
})
