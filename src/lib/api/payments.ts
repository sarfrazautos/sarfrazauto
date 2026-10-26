export async function getPayments(params: Record<string, string | number | undefined | null> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const res = await fetch(`/api/payments?${searchParams.toString()}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch payments")
  }

  return data
}

export async function getPaymentById(id: string | number) {
  const res = await fetch(`/api/payments/${id}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch payment")
  }

  return data.payment
}

export async function updatePaymentStatus(id: string | number, status: string) {
  const res = await fetch(`/api/payments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update payment status")
  }

  return data.payment
}

export async function createPayment(payload: Record<string, any>) {
  const res = await fetch("/api/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create payment")
  }

  return data.payment
}

export async function deletePayment(id: string | number) {
  const res = await fetch(`/api/payments/${id}`, {
    method: "DELETE",
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete payment")
  }

  return data.payment
}
