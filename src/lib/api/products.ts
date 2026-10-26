export async function uploadProductImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to upload image")
  }

  return data.url as string
}

export async function uploadProductImages(
  files: File[],
  onProgress?: (progress: number, current: number, total: number) => void
) {
  const urls: string[] = []
  const total = files.length

  for (let i = 0; i < total; i++) {
    const file = files[i]
    const url = await uploadProductImage(file)
    urls.push(url)

    if (onProgress) {
      const progressPercent = Math.round(((i + 1) / total) * 100)
      onProgress(progressPercent, i + 1, total)
    }
  }

  return urls
}

export async function createProduct(payload: Record<string, any>) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create product")
  }

  return data.product
}

export async function getProducts(params: Record<string, string | number | undefined | null> = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })

  const res = await fetch(`/api/products?${searchParams.toString()}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch products")
  }

  return data
}

export async function getProductById(id: string | number) {
  const res = await fetch(`/api/products/${id}`)
  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch product")
  }

  return data.product
}

export async function updateProduct(id: string | number, payload: Record<string, any>) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update product")
  }

  return data.product
}

export async function deleteProduct(id: string | number) {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete product")
  }

  return data
}
