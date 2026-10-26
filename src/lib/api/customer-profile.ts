export async function getCustomerProfile() {
  const res = await fetch("/api/customer/profile")
  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch profile")
  }
  return data.profile
}

export async function updateCustomerProfile(payload: Record<string, any>) {
  const res = await fetch("/api/customer/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update profile")
  }
  return data.profile
}
