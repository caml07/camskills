import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react-native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePatientDetail } from "./use-patient-detail"

const mockFetchPatientDetail = vi.fn()

vi.mock("../api/patient.api", () => ({
  fetchPatientDetail: mockFetchPatientDetail,
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe("usePatientDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("starts in loading state", () => {
    mockFetchPatientDetail.mockImplementation(
      () => new Promise(() => {}),
    )

    const { result } = renderHook(() => usePatientDetail("patient-1"), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.patient).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  it("returns patient on success", async () => {
    const patient = { id: "patient-1", name: "John Doe", age: 34 }
    mockFetchPatientDetail.mockResolvedValue(patient)

    const { result } = renderHook(() => usePatientDetail("patient-1"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.patient).toEqual(patient)
    expect(result.current.error).toBeNull()
    expect(mockFetchPatientDetail).toHaveBeenCalledWith("patient-1")
  })

  it("returns error on failure", async () => {
    const error = new Error("Failed to fetch patient")
    mockFetchPatientDetail.mockRejectedValue(error)

    const { result } = renderHook(() => usePatientDetail("patient-1"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.patient).toBeUndefined()
    expect(result.current.error).toBeDefined()
    expect(result.current.error?.message).toBe("Failed to fetch patient")
  })
})
