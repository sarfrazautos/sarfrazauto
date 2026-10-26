export async function getDealerRequests(params: Record<string, string | number | undefined | null> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const res = await fetch(`/api/dealer-requests?${searchParams.toString()}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch dealer requests")
  }

  return data
}

export async function getDealerRequestById(id: string | number) {
  const res = await fetch(`/api/dealer-requests/${id}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch dealer request")
  }

  return data.request
}

export async function updateDealerRequestStatus(id: string | number, status: string) {
  const res = await fetch(`/api/dealer-requests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update dealer request status")
  }

  return data.request
}

export async function createDealerRequest(payload: Record<string, any>) {
  const res = await fetch("/api/dealer-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create dealer request")
  }

  return data.request
}

export async function deleteDealerRequest(id: string | number) {
  const res = await fetch(`/api/dealer-requests/${id}`, {
    method: "DELETE",
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete dealer request")
  }

  return data.request
}
