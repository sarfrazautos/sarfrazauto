const BRAND_LOGOS: Record<string, string> = {
  crown: "/brands-logo/crown.png",
  honda: "/brands-logo/honda.png",
  yamaha: "/brands-logo/yamaha.png",
  suzuki: "/brands-logo/suzuki.png",
  united: "/brands-logo/united.png",
  "super-star": "/brands-logo/super-star.png",
  "super star": "/brands-logo/super-star.png",
  superstar: "/brands-logo/super-star.png",
  "super-power": "/brands-logo/super-power.png",
  "super power": "/brands-logo/super-power.png",
  superpower: "/brands-logo/super-power.png",
  sp: "/brands-logo/super-power.png",
  unique: "/brands-logo/unique.png",
  servis: "/brands-logo/servis.png",
  service: "/brands-logo/servis.png",
  "servis tyres": "/brands-logo/servis.png",
  "servis-tyres": "/brands-logo/servis.png",
  panther: "/brands-logo/panther.png",
  "panther tyres": "/brands-logo/panther.png",
  "panther-tyres": "/brands-logo/panther.png",
  diamond: "/brands-logo/diamond-tyres.png",
  "diamond tyres": "/brands-logo/diamond-tyres.png",
  "diamond-tyres": "/brands-logo/diamond-tyres.png",
  general: "/brands-logo/general-tyre.png",
  "general tyre": "/brands-logo/general-tyre.png",
  "general-tyre": "/brands-logo/general-tyre.png",
  "general tire": "/brands-logo/general-tyre.png",
  "general-tire": "/brands-logo/general-tyre.png",
}

export function parseBrands(brandStr?: string | null): string[] {
  if (!brandStr) return []
  return brandStr
    .split(/[,/|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function getBrandLogos(
  brand?: string | null,
  name?: string | null
): { name: string; logo: string }[] {
  const brands = parseBrands(brand)
  const results: { name: string; logo: string }[] = []
  const seenLogos = new Set<string>()

  for (const b of brands) {
    const key = b.toLowerCase()
    const logo = BRAND_LOGOS[key] || BRAND_LOGOS[key.replace(/\s+/g, "-")]
    if (logo && !seenLogos.has(logo)) {
      seenLogos.add(logo)
      results.push({ name: b, logo })
    }
  }

  if (results.length === 0 && name) {
    const n = name.toLowerCase()
    for (const [key, logo] of Object.entries(BRAND_LOGOS)) {
      if (n.includes(key) && !seenLogos.has(logo)) {
        seenLogos.add(logo)
        results.push({ name: key, logo })
      }
    }
  }

  if (results.length === 0 && BRAND_LOGOS["crown"]) {
    results.push({ name: "Crown", logo: BRAND_LOGOS["crown"] })
  }

  return results
}

export function getBrandLogo(brand?: string | null, name?: string | null): string | null {
  const logos = getBrandLogos(brand, name)
  return logos.length > 0 ? logos[0].logo : null
}
