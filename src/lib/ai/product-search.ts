import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { ilike, or, and } from "drizzle-orm"

const FORBIDDEN_WORDS = [
  "delete",
  "drop",
  "update",
  "insert",
  "alter",
  "truncate",
  "create",
  "grant",
  "revoke",
  "replace",
]

export function isSafeQuery(input: string): boolean {
  if (!input || typeof input !== "string") return false
  const lower = input.toLowerCase()
  for (const word of FORBIDDEN_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i")
    if (regex.test(lower)) return false
  }
  return true
}

export async function searchProductsInDb(params: {
  partName: string
  bikeModel?: string | null
  brand?: string | null
  limit?: number
}) {
  const limit = Math.min(params.limit || 6, 10)
  const conditions = []

  let cleanPart = (params.partName || "").toLowerCase().trim()
  if (cleanPart.includes("headlight") || cleanPart.includes("head light")) {
    cleanPart = "head"
  } else if (cleanPart.includes("backlight") || cleanPart.includes("back light")) {
    cleanPart = "back"
  } else if (cleanPart.includes("brake") || cleanPart.includes("break")) {
    cleanPart = "brake"
  } else if (cleanPart.includes("tyre") || cleanPart.includes("tire")) {
    cleanPart = "tyre"
  }

  const partWords = cleanPart.split(/\s+/).filter((w) => w.length > 2)
  if (partWords.length > 0) {
    const wordClauses = partWords.map((w) =>
      or(ilike(products.name, `%${w}%`), ilike(products.description, `%${w}%`))
    )
    conditions.push(and(...wordClauses))
  }

  const bikeNum = (params.bikeModel || "").match(/\d+/)?.[0]
  if (bikeNum) {
    conditions.push(
      or(
        ilike(products.name, `%${bikeNum}%`),
        ilike(products.compatibleBike, `%${bikeNum}%`)
      )
    )
  }

  if (params.brand && params.brand !== "All Brands" && params.brand !== "null") {
    conditions.push(ilike(products.brand, `%${params.brand}%`))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  let results = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      originalPrice: products.originalPrice,
      brand: products.brand,
      category: products.category,
      compatibleBike: products.compatibleBike,
      images: products.images,
      stockStatus: products.stockStatus,
      badge: products.badge,
    })
    .from(products)
    .where(whereClause)
    .limit(limit)

  if (results.length === 0 && bikeNum && partWords.length > 0) {
    const fallbackClauses = partWords.map((w) =>
      or(ilike(products.name, `%${w}%`), ilike(products.description, `%${w}%`))
    )
    results = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        originalPrice: products.originalPrice,
        brand: products.brand,
        category: products.category,
        compatibleBike: products.compatibleBike,
        images: products.images,
        stockStatus: products.stockStatus,
        badge: products.badge,
      })
      .from(products)
      .where(and(...fallbackClauses))
      .limit(limit)
  }

  return results
}
