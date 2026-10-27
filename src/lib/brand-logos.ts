const BRAND_LOGOS: Record<string, string> = {
  crown: "/brands-logo/crown.png",
  honda: "/brands-logo/honda.png",
  yamaha: "/brands-logo/yamaha.png",
  suzuki: "/brands-logo/suzuki.png",
  united: "/brands-logo/united.png",
  "super-star": "/brands-logo/super-star.png",
  "super star": "/brands-logo/super-star.png",
  superstar: "/brands-logo/super-star.png",
  unique: "/brands-logo/unique.png",
}

export function getBrandLogo(brand?: string | null, name?: string | null): string | null {
  const b = (brand || "").trim().toLowerCase()
  if (b && BRAND_LOGOS[b]) {
    return BRAND_LOGOS[b]
  }

  const n = (name || "").toLowerCase()
  for (const [key, logo] of Object.entries(BRAND_LOGOS)) {
    if (n.includes(key)) {
      return logo
    }
  }

  return BRAND_LOGOS["crown"] || null
}
