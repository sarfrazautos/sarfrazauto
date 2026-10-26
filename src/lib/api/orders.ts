export async function getOrders(params: Record<string, string | number> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const res = await fetch(`/api/orders?${searchParams.toString()}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch orders")
  }

  return data
}

export async function getOrderById(id: string | number) {
  const res = await fetch(`/api/orders/${id}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch order")
  }

  return data.order
}

export async function createOrder(payload: Record<string, any>) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create order")
  }

  return data.order
}

export async function updateOrderStatus(id: string | number, status: string) {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update order status")
  }

  return data.order
}

export async function updateOrder(id: string | number, payload: Record<string, any>) {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update order")
  }

  return data.order
}

export async function deleteOrder(id: string | number) {
  const res = await fetch(`/api/orders/${id}`, {
    method: "DELETE",
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete order")
  }

  return data
}
