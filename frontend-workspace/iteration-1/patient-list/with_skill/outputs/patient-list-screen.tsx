import { useCallback } from "react"
import { View, Text, StyleSheet, Platform } from "react-native"
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated"
import { useQuery } from "@tanstack/react-query"
import { FlashList } from "@shopify/flash-list"
import { useNetInfo } from "@react-native-community/netinfo"
import { TouchableOpacity } from "react-native"
import { fetchPatients, type Patient } from "../api/patients.api"

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  listGap: 12,
} as const

const Typography = {
  h2: { fontSize: 24, lineHeight: 32, fontWeight: "700" as const },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: "600" as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  bodyBold: { fontSize: 15, lineHeight: 22, fontWeight: "600" as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    textTransform: "uppercase" as const,
  },
} as const

const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
} as const

const Shadows = {
  md: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 3 },
  }),
} as const

const Colors = {
  primary: "#0284c7",
  onSurface: "#0f172a",
  muted: "#64748b",
  disabled: "#94a3b8",
  outline: "#e2e8f0",
  card: "#ffffff",
  surface: "#f8fafc",
  error: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#0ea5e9",
}

const statusColor: Record<Patient["status"], string> = {
  stable: Colors.success,
  critical: Colors.error,
  recovering: Colors.warning,
  discharged: Colors.disabled,
}

function Skeleton({ width, height, radius = BorderRadius.sm }: { width: number | string; height: number; radius?: number }) {
  const opacity = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withTiming(0.3, {
        duration: 1000,
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true,
    ),
  }))

  return (
    <Animated.View
      style={[
        opacity,
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: Colors.outline,
        },
      ]}
    />
  )
}

function PatientCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={{ gap: Spacing.sm }}>
        <Skeleton width="55%" height={18} />
        <Skeleton width="35%" height={14} />
      </View>
      <View style={{ flexDirection: "row", gap: Spacing.md, marginTop: Spacing.sm }}>
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
      </View>
    </View>
  )
}

function PatientCard({ patient }: { patient: Patient }) {
  return (
    <TouchableOpacity activeOpacity={1}>
      <Animated.View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ gap: Spacing.xs, flex: 1 }}>
            <Text style={Typography.h3} numberOfLines={1}>
              {patient.name}
            </Text>
            <Text style={[Typography.caption, { color: Colors.muted }]}>
              MRN: {patient.mrn}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor[patient.status] + "18" }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor[patient.status] }]} />
            <Text style={[Typography.caption, { color: statusColor[patient.status], fontWeight: "600" }]}>
              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={{ flexDirection: "row", gap: Spacing.lg }}>
          <View style={{ gap: Spacing.xs }}>
            <Text style={[Typography.label, { color: Colors.muted }]}>Room</Text>
            <Text style={Typography.bodyBold}>{patient.room}</Text>
          </View>
          <View style={{ gap: Spacing.xs }}>
            <Text style={[Typography.label, { color: Colors.muted }]}>Age</Text>
            <Text style={Typography.bodyBold}>{patient.age}</Text>
          </View>
          <View style={{ gap: Spacing.xs }}>
            <Text style={[Typography.label, { color: Colors.muted }]}>Last Visit</Text>
            <Text style={Typography.body}>{patient.lastVisit}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  )
}

function EmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <View style={styles.stateContainer}>
      <Text style={{ fontSize: 56, marginBottom: Spacing.sm }}>🏥</Text>
      <Text style={[Typography.h2, { color: Colors.onSurface, textAlign: "center" }]}>
        No Patients
      </Text>
      <Text style={[Typography.body, { color: Colors.muted, textAlign: "center", maxWidth: 260 }]}>
        Add your first patient to get started with rounds.
      </Text>
      {onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={1}>
          <Animated.View style={styles.primaryButton}>
            <Text style={[Typography.bodyBold, { color: Colors.card }]}>Add Patient</Text>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.stateContainer}>
      <Text style={{ fontSize: 56, marginBottom: Spacing.sm }}>⚠️</Text>
      <Text style={[Typography.body, { color: Colors.muted, textAlign: "center", maxWidth: 280 }]}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} activeOpacity={1}>
          <Animated.View style={styles.retryButton}>
            <Text style={[Typography.bodyBold, { color: Colors.onSurface }]}>Retry</Text>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  )
}

function OfflineBanner() {
  return (
    <View style={styles.offlineBanner}>
      <Text style={[Typography.caption, { color: Colors.card, fontWeight: "600" }]}>
        No internet connection
      </Text>
    </View>
  )
}

function renderPatient({ item }: { item: Patient }) {
  return <PatientCard patient={item} />
}

function keyExtractor(item: Patient) {
  return item.id
}

export function PatientListScreen() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  })
  const { isConnected } = useNetInfo()

  if (isLoading) {
    return (
      <View style={styles.screen}>
        {isConnected === false && <OfflineBanner />}
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PatientCardSkeleton key={i} />
          ))}
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.screen}>
        {isConnected === false && <OfflineBanner />}
        <ErrorState message={error.message} onRetry={refetch} />
      </View>
    )
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState onAction={() => {}} />
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      {isConnected === false && <OfflineBanner />}
      <FlashList
        data={data}
        renderItem={renderPatient}
        keyExtractor={keyExtractor}
        estimatedItemSize={140}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.listGap }} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.xl,
  },
  skeletonContainer: {
    padding: Spacing.md,
    gap: Spacing.listGap,
  },
  skeletonCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outline,
    ...Shadows.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outline,
    marginVertical: Spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  primaryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
  },
  retryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  offlineBanner: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.warning,
    alignItems: "center",
  },
})
