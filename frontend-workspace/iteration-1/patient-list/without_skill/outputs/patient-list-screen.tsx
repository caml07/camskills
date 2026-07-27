import { useCallback } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { useQuery } from "@tanstack/react-query"

type Patient = {
  id: string
  name: string
  room: string
  status: "stable" | "critical" | "observation"
}

async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch("https://api.example.com/patients")
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function PatientListScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  })

  const renderItem = useCallback(
    ({ item }: { item: Patient }) => (
      <View className="border-b border-gray-200 p-4">
        <Text className="text-base font-semibold">{item.name}</Text>
        <Text className="text-sm text-gray-500">Room {item.room}</Text>
      </View>
    ),
    [],
  )

  const keyExtractor = useCallback((item: Patient) => item.id, [])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-500">Loading patients...</Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-base font-medium text-red-600">
          Something went wrong
        </Text>
        <Text className="mb-4 text-center text-sm text-gray-500">
          {error?.message ?? "Unable to load patients."}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="rounded-lg bg-blue-600 px-6 py-3"
        >
          <Text className="font-medium text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-gray-500">No patients found</Text>
      </View>
    )
  }

  return (
    <View className="flex-1">
      {isRefetching && (
        <View className="absolute left-0 right-0 top-0 z-10 items-center bg-blue-50 py-2">
          <ActivityIndicator size="small" color="#2563eb" />
        </View>
      )}
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={72}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  )
}
