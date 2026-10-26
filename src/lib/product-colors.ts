export interface ProductColor {
  name: string
  hex: string
}

export const PRODUCT_COLORS: ProductColor[] = [
  { name: "Red", hex: "#dc2626" },
  { name: "Black", hex: "#171717" },
  { name: "Matte Black", hex: "#18181b" },
  { name: "Gloss Black", hex: "#0a0a0a" },
  { name: "Silver", hex: "#cbd5e1" },
  { name: "Chrome", hex: "#e2e8f0" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Green", hex: "#16a34a" },
  { name: "Dark Green", hex: "#15803d" },
  { name: "White", hex: "#ffffff" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Charcoal", hex: "#374151" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Gold", hex: "#ca8a04" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Maroon", hex: "#881337" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Bronze", hex: "#78350f" },
]

export function getColorHex(colorName: string): string {
  const match = PRODUCT_COLORS.find(
    (c) => c.name.toLowerCase() === colorName.trim().toLowerCase()
  )
  return match?.hex || "#71717a"
}
