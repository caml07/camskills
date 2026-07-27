import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockPatients = [
  { id: 1, name: 'John Doe', age: 45, diagnosis: 'Hypertension' },
  { id: 2, name: 'Jane Smith', age: 32, diagnosis: 'Asthma' },
]

function createMockFetch(response: Partial<Response>) {
  return vi.fn().mockResolvedValue(response as Response)
}

async function fetchPatients(): Promise<unknown[]> {
  const res = await fetch('/api/patients')
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

describe('fetchPatients', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns patient array on success', async () => {
    globalThis.fetch = createMockFetch({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockPatients),
    } as Partial<Response>)

    const result = await fetchPatients()
    expect(result).toEqual(mockPatients)
    expect(fetch).toHaveBeenCalledWith('/api/patients')
  })

  it('returns empty array when API returns no patients', async () => {
    globalThis.fetch = createMockFetch({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([]),
    } as Partial<Response>)

    const result = await fetchPatients()
    expect(result).toEqual([])
  })

  it('throws on network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network failure'))

    await expect(fetchPatients()).rejects.toThrow('Network failure')
  })

  it('throws on 401 Unauthorized', async () => {
    globalThis.fetch = createMockFetch({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    } as Partial<Response>)

    await expect(fetchPatients()).rejects.toThrow('HTTP 401')
  })
})
