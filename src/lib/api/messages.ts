export async function getMessages(params: Record<string, string | number> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const res = await fetch(`/api/messages?${searchParams.toString()}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch messages")
  }

  return data
}

export async function getMessageById(id: string | number) {
  const res = await fetch(`/api/messages/${id}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch message")
  }

  return data.message
}

export async function sendMessage(payload: {
  name: string
  email: string
  phone?: string
  shopName?: string
  message: string
}) {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to send message")
  }

  return data.message
}

export async function updateMessageStatus(id: string | number, status: string) {
  const res = await fetch(`/api/messages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update message status")
  }

  return data.message
}

export async function deleteMessage(id: string | number) {
  const res = await fetch(`/api/messages/${id}`, {
    method: "DELETE",
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete message")
  }

  return data
}
