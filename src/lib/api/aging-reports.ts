export async function getAgingReports(params: Record<string, string | number | undefined | null> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const res = await fetch(`/api/aging-reports?${searchParams.toString()}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch aging reports")
  }

  return data
}

export async function getAgingReportById(id: string | number) {
  const res = await fetch(`/api/aging-reports/${id}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch aging report")
  }

  return data.agingReport
}

export async function createAgingReport(payload: Record<string, any>) {
  const res = await fetch("/api/aging-reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create aging report")
  }

  return data.agingReport
}

export async function updateAgingReport(id: string | number, payload: Record<string, any>) {
  const res = await fetch(`/api/aging-reports/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update aging report")
  }

  return data.agingReport
}

export async function deleteAgingReport(id: string | number) {
  const res = await fetch(`/api/aging-reports/${id}`, {
    method: "DELETE",
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete aging report")
  }

  return data.agingReport
}
