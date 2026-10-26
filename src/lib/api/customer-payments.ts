export async function getCustomerPayments(params: Record<string, string | number | undefined | null> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const res = await fetch(`/api/customer/payments?${searchParams.toString()}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch payments")
  }

  return data
}
