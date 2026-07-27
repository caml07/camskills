import { describe, it, expect, vi, beforeEach } from "vitest"
import { fetchPatients } from "./patients.api"

describe("fetchPatients", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns patients on successful response", async () => {
    const mockPatients = [
      { id: "1", name: "Alice", age: 30 },
      { id: "2", name: "Bob", age: 45 },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPatients),
    })

    const result = await fetchPatients()

    expect(fetch).toHaveBeenCalledWith("/api/patients")
    expect(result).toEqual(mockPatients)
    expect(result).toHaveLength(2)
  })

  it("returns empty array when API returns empty list", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })

    const result = await fetchPatients()

    expect(fetch).toHaveBeenCalledWith("/api/patients")
    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })

  it("throws on 401 unauthorized", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Unauthorized" }),
    })

    await expect(fetchPatients()).rejects.toThrow()
    expect(fetch).toHaveBeenCalledWith("/api/patients")
  })

  it("throws on network error", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(new Error("Network request failed"))

    await expect(fetchPatients()).rejects.toThrow("Network request failed")
    expect(fetch).toHaveBeenCalledWith("/api/patients")
  })
})
