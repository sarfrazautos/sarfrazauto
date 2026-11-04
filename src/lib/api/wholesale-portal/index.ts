const cacheStore: {
  dashboard: { data: any; timestamp: number } | null
  bulkOrders: { data: any; timestamp: number } | null
  orders: Record<string, { data: any; timestamp: number }>
  invoices: Record<string, { data: any; timestamp: number }>
  payments: Record<string, { data: any; timestamp: number }>
  inflight: Record<string, Promise<any> | null>
} = {
  dashboard: null,
  bulkOrders: null,
  orders: {},
  invoices: {},
  payments: {},
  inflight: {},
}

const CACHE_TTL_MS = 5 * 60 * 1000

export function invalidateWholesalePortalCache() {
  cacheStore.dashboard = null
  cacheStore.bulkOrders = null
  cacheStore.orders = {}
  cacheStore.invoices = {}
  cacheStore.payments = {}
  cacheStore.inflight = {}
}

export async function getCustomerDashboard(options?: { forceRefresh?: boolean }) {
  const now = Date.now()

  if (
    !options?.forceRefresh &&
    cacheStore.dashboard &&
    now - cacheStore.dashboard.timestamp < CACHE_TTL_MS
  ) {
    return cacheStore.dashboard.data
  }

  if (cacheStore.inflight["dashboard"] && !options?.forceRefresh) {
    return cacheStore.inflight["dashboard"]
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch("/api/customer/dashboard", {
        headers: { "Cache-Control": "private, max-age=60" },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch dashboard data")
      }
      cacheStore.dashboard = { data, timestamp: Date.now() }
      return data
    } finally {
      cacheStore.inflight["dashboard"] = null
    }
  })()

  cacheStore.inflight["dashboard"] = fetchPromise
  return fetchPromise
}

export async function getCustomerBulkOrders(options?: { forceRefresh?: boolean }) {
  const now = Date.now()

  if (
    !options?.forceRefresh &&
    cacheStore.bulkOrders &&
    now - cacheStore.bulkOrders.timestamp < CACHE_TTL_MS
  ) {
    return cacheStore.bulkOrders.data
  }

  if (cacheStore.inflight["bulkOrders"] && !options?.forceRefresh) {
    return cacheStore.inflight["bulkOrders"]
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch("/api/customer/bulk-orders", {
        headers: { "Cache-Control": "private, max-age=60" },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch bulk orders")
      }
      cacheStore.bulkOrders = { data, timestamp: Date.now() }
      return data
    } finally {
      cacheStore.inflight["bulkOrders"] = null
    }
  })()

  cacheStore.inflight["bulkOrders"] = fetchPromise
  return fetchPromise
}

export async function getCustomerOrders(
  params: Record<string, string | number | undefined | null> = {},
  options?: { forceRefresh?: boolean }
) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const queryKey = searchParams.toString() || "default"
  const now = Date.now()

  if (
    !options?.forceRefresh &&
    cacheStore.orders[queryKey] &&
    now - cacheStore.orders[queryKey].timestamp < CACHE_TTL_MS
  ) {
    return cacheStore.orders[queryKey].data
  }

  const inflightKey = `orders_${queryKey}`
  if (cacheStore.inflight[inflightKey] && !options?.forceRefresh) {
    return cacheStore.inflight[inflightKey]
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(`/api/customer/orders?${searchParams.toString()}`, {
        headers: { "Cache-Control": "private, max-age=60" },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch customer orders")
      }
      cacheStore.orders[queryKey] = { data, timestamp: Date.now() }
      return data
    } finally {
      cacheStore.inflight[inflightKey] = null
    }
  })()

  cacheStore.inflight[inflightKey] = fetchPromise
  return fetchPromise
}

export async function getCustomerOrderById(id: string | number) {
  const res = await fetch(`/api/customer/orders/${id}`)
  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch order details")
  }
  return data.order
}

export async function getCustomerInvoices(
  params: Record<string, string | number | undefined | null> = {},
  options?: { forceRefresh?: boolean }
) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const queryKey = searchParams.toString() || "default"
  const now = Date.now()

  if (
    !options?.forceRefresh &&
    cacheStore.invoices[queryKey] &&
    now - cacheStore.invoices[queryKey].timestamp < CACHE_TTL_MS
  ) {
    return cacheStore.invoices[queryKey].data
  }

  const res = await fetch(`/api/customer/invoices?${searchParams.toString()}`)
  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch invoices")
  }

  cacheStore.invoices[queryKey] = { data, timestamp: Date.now() }
  return data
}

export async function getCustomerPayments(
  params: Record<string, string | number | undefined | null> = {},
  options?: { forceRefresh?: boolean }
) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const queryKey = searchParams.toString() || "default"
  const now = Date.now()

  if (
    !options?.forceRefresh &&
    cacheStore.payments[queryKey] &&
    now - cacheStore.payments[queryKey].timestamp < CACHE_TTL_MS
  ) {
    return cacheStore.payments[queryKey].data
  }

  const res = await fetch(`/api/customer/payments?${searchParams.toString()}`)
  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch payments")
  }

  cacheStore.payments[queryKey] = { data, timestamp: Date.now() }
  return data
}

