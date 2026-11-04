import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { eq, or, and, ilike, inArray, count, desc, sql } from "drizzle-orm"

function buildFilterConditions(params: {
  filter?: string
  search?: string
  type?: string
  brand?: string
  bike?: string
}) {
  const conditions = []

  const search = params.search?.trim() || ""
  const type = params.type?.trim().toLowerCase() || "all"
  const brand = params.brand?.trim() || ""
  const bike = params.bike?.trim() || ""
  const filter = params.filter?.trim().toLowerCase() || "anomalies"

  if (search) {
    conditions.push(
      or(
        ilike(products.name, `%${search}%`),
        ilike(products.brand, `%${search}%`),
        ilike(products.category, `%${search}%`),
        ilike(products.compatibleBike, `%${search}%`)
      )
    )
  }

  if (type === "wholesale") {
    conditions.push(or(eq(products.type, "wholesale"), eq(products.type, "both")))
  } else if (type === "retail") {
    conditions.push(or(eq(products.type, "retail"), eq(products.type, "both")))
  }

  if (brand && brand !== "all") {
    conditions.push(ilike(products.brand, `%${brand}%`))
  }

  if (bike && bike !== "all") {
    const lower = bike.toLowerCase()
    if (lower === "cd70") {
      conditions.push(
        or(
          ilike(products.compatibleBike, "%70%"),
          ilike(products.name, "%CD70%"),
          ilike(products.name, "%CD 70%"),
          ilike(products.name, "%70cc%")
        )
      )
    } else if (lower === "cg125") {
      conditions.push(
        or(
          ilike(products.compatibleBike, "%125%"),
          ilike(products.name, "%CG125%"),
          ilike(products.name, "%CG 125%"),
          ilike(products.name, "%125cc%")
        )
      )
    } else {
      conditions.push(
        or(
          ilike(products.compatibleBike, `%${bike}%`),
          ilike(products.name, `%${bike}%`)
        )
      )
    }
  }

  if (filter === "anomalies") {
    conditions.push(
      sql`${products.originalPrice} IS NOT NULL AND ${products.originalPrice} > 0 AND ${products.originalPrice} < ${products.price}`
    )
  } else if (filter === "healthy") {
    conditions.push(
      sql`${products.originalPrice} IS NOT NULL AND ${products.originalPrice} >= ${products.price}`
    )
  } else if (filter === "missing_cut") {
    conditions.push(
      sql`(${products.originalPrice} IS NULL OR ${products.originalPrice} = 0)`
    )
  }

  return conditions
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const search = url.searchParams.get("search") || ""
    const filter = url.searchParams.get("filter") || "anomalies"
    const type = url.searchParams.get("type") || "all"
    const brand = url.searchParams.get("brand") || ""
    const bike = url.searchParams.get("bike") || ""
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const limit = Math.max(1, Math.min(200, parseInt(url.searchParams.get("limit") || "50", 10)))
    const offset = (page - 1) * limit

    const conditions = buildFilterConditions({ filter, search, type, brand, bike })
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [countResult] = await db
      .select({ count: count() })
      .from(products)
      .where(whereClause)

    const totalMatching = Number(countResult?.count || 0)
    const totalPages = Math.ceil(totalMatching / limit) || 1

    const orderByClause =
      filter === "anomalies"
        ? [desc(sql`${products.price} - ${products.originalPrice}`), desc(products.id)]
        : [desc(products.id)]

    const items = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        type: products.type,
        category: products.category,
        brand: products.brand,
        price: products.price,
        originalPrice: products.originalPrice,
        compatibleBike: products.compatibleBike,
        stockStatus: products.stockStatus,
        images: products.images,
        mainImageIndex: products.mainImageIndex,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(whereClause)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset)

    const [statsResult] = await db
      .select({
        totalCount: count(),
        anomaliesCount: sql<number>`count(*) FILTER (WHERE ${products.originalPrice} IS NOT NULL AND ${products.originalPrice} > 0 AND ${products.originalPrice} < ${products.price})`,
        healthyCount: sql<number>`count(*) FILTER (WHERE ${products.originalPrice} IS NOT NULL AND ${products.originalPrice} >= ${products.price})`,
        missingCutCount: sql<number>`count(*) FILTER (WHERE ${products.originalPrice} IS NULL OR ${products.originalPrice} = 0)`,
      })
      .from(products)

    const brandsResult = await db
      .selectDistinct({ brand: products.brand })
      .from(products)
      .where(sql`${products.brand} IS NOT NULL AND ${products.brand} != ''`)
      .orderBy(products.brand)

    return NextResponse.json({
      success: true,
      products: items,
      brands: brandsResult.map((b) => b.brand).filter(Boolean),
      pagination: {
        page,
        limit,
        totalMatching,
        totalPages,
      },
      stats: {
        totalProducts: Number(statsResult?.totalCount || 0),
        anomalyCount: Number(statsResult?.anomaliesCount || 0),
        healthyCount: Number(statsResult?.healthyCount || 0),
        missingCutCount: Number(statsResult?.missingCutCount || 0),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to query price comparison" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, updates, formula, filterParams, singleItem } = body

    if (action === "quick-fix-single" && singleItem) {
      const { id, newOriginalPrice } = singleItem
      if (!id) {
        return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 })
      }

      await db
        .update(products)
        .set({
          originalPrice: newOriginalPrice !== null ? Math.round(Number(newOriginalPrice)) : null,
          updatedAt: new Date(),
        })
        .where(eq(products.id, Number(id)))

      return NextResponse.json({
        success: true,
        updatedCount: 1,
        message: "Product cut price updated successfully.",
      })
    }

    if (action === "apply-updates" && Array.isArray(updates) && updates.length > 0) {
      const batchSize = 50
      let updatedCount = 0

      for (let i = 0; i < updates.length; i += batchSize) {
        const chunk = updates.slice(i, i + batchSize)
        await Promise.all(
          chunk.map((item) =>
            db
              .update(products)
              .set({
                originalPrice: item.newOriginalPrice !== null ? Math.round(Number(item.newOriginalPrice)) : null,
                updatedAt: new Date(),
              })
              .where(eq(products.id, Number(item.id)))
          )
        )
        updatedCount += chunk.length
      }

      return NextResponse.json({
        success: true,
        updatedCount,
        message: `Updated cut prices for ${updatedCount} products.`,
      })
    }

    if (action === "apply-formula-filtered") {
      const mode = formula?.mode || "selling_base"
      const markupPercent = Number(formula?.markupPercent) || 0
      const conditions = buildFilterConditions(filterParams || { filter: "anomalies" })
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const matched = await db
        .select({
          id: products.id,
          price: products.price,
          originalPrice: products.originalPrice,
        })
        .from(products)
        .where(whereClause)

      if (matched.length === 0) {
        return NextResponse.json({
          success: true,
          updatedCount: 0,
          message: "No products matched the given criteria.",
        })
      }

      const batchSize = 50
      let updatedCount = 0

      for (let i = 0; i < matched.length; i += batchSize) {
        const chunk = matched.slice(i, i + batchSize)
        await Promise.all(
          chunk.map((p) => {
            const sellingPrice = Number(p.price) || 0
            const currentCut = Number(p.originalPrice) || 0
            let calculatedCut = sellingPrice

            if (mode === "selling_base") {
              calculatedCut = Math.round(sellingPrice * (1 + markupPercent / 100))
            } else if (mode === "cut_base") {
              calculatedCut = Math.round((currentCut || sellingPrice) * (1 + markupPercent / 100))
            }

            return db
              .update(products)
              .set({
                originalPrice: calculatedCut,
                updatedAt: new Date(),
              })
              .where(eq(products.id, p.id))
          })
        )
        updatedCount += chunk.length
      }

      return NextResponse.json({
        success: true,
        updatedCount,
        message: `Successfully updated cut prices for ${updatedCount} products using ${mode === "selling_base" ? "Selling Price + Markup" : "Cut Price Direct Markup"}.`,
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action or empty payload" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute price comparison operation" },
      { status: 500 }
    )
  }
}

