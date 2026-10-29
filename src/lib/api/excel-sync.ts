export async function parseExcelSync(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/admin/excel-sync", {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to analyze Excel file")
  }

  return data
}

export async function applyExcelSync(payload: {
  updates: any[]
  newItems: any[]
  updateSchemes?: boolean
}) {
  const res = await fetch("/api/admin/excel-sync", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to apply Excel changes")
  }

  return data
}

