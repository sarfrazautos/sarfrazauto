export async function getReturns(params: Record<string, string | number | undefined | null> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const res = await fetch(`/api/returns?${searchParams.toString()}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch returns")
  }

  return data
}

export async function getReturnById(id: string | number) {
  const res = await fetch(`/api/returns/${id}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch return record")
  }

  return data.return
}

export async function updateReturnStatus(id: string | number, status: string) {
  const res = await fetch(`/api/returns/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update return status")
  }

  return data.return
}

export async function createReturn(payload: Record<string, any>) {
  const res = await fetch("/api/returns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create return record")
  }

  return data.return
}

export async function deleteReturn(id: string | number) {
  const res = await fetch(`/api/returns/${id}`, {
    method: "DELETE",
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete return record")
  }

  return data.return
}
