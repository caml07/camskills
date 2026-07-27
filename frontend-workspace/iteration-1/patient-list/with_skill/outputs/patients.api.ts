export interface Patient {
  id: string
  name: string
  age: number
  mrn: string
  room: string
  status: "stable" | "critical" | "recovering" | "discharged"
  lastVisit: string
}

export async function fetchPatients(): Promise<Patient[]> {
  const response = await fetch("https://api.example.com/patients")

  if (!response.ok) {
    throw new Error("Unable to load patients. Please try again.")
  }

  return response.json()
}
