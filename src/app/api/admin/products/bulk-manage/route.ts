import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { schemes } from "@/db/schema/schemes"
import { eq, or, and, ne, gte, lte, ilike, inArray, count, desc, sql } from "drizzle-orm"

function buildConditions(params: any) {
  const conditions = []

  const search = params.search?.trim() || ""
  const type = params.type?.trim().toLowerCase() || "all"
  const brand = params.brand?.trim() || ""
  const bike = params.bike?.trim() || ""
  const category = params.category?.trim() || ""
  const status = params.status?.trim().toLowerCase() || "all"

  const minPrice = params.minPrice ? parseInt(String(params.minPrice), 10) : null
  const maxPrice = params.maxPrice ? parseInt(String(params.maxPrice), 10) : null

  const datePreset = params.datePreset || "all"
  const startDate = params.startDate?.trim() || ""
  const endDate = params.endDate?.trim() || ""
  const startTime = params.startTime?.trim() || ""
  const endTime = params.endTime?.trim() || ""

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

  if (minPrice !== null && !isNaN(minPrice)) {
    conditions.push(gte(products.price, minPrice))
  }
  if (maxPrice !== null && !isNaN(maxPrice)) {
    conditions.push(lte(products.price, maxPrice))
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

  if (category && category !== "all") {
    conditions.push(ilike(products.category, `%${category}%`))
  }

  if (status === "hidden") {
    conditions.push(eq(products.stockStatus, "hidden"))
  } else if (status === "instock") {
    conditions.push(eq(products.stockStatus, "instock"))
  } else if (status === "outofstock") {
    conditions.push(or(eq(products.stockStatus, "outofstock"), eq(products.stockStatus, "out_of_stock")))
  } else if (status === "visible") {
    conditions.push(ne(products.stockStatus, "hidden"))
  }

  if (datePreset === "today") {
    conditions.push(sql`DATE(${products.createdAt}) = CURRENT_DATE`)
  } else if (datePreset === "yesterday") {
    conditions.push(sql`DATE(${products.createdAt}) = CURRENT_DATE - INTERVAL '1 day'`)
  } else if (datePreset === "last7days") {
    conditions.push(sql`${products.createdAt} >= CURRENT_DATE - INTERVAL '7 days'`)
  } else if (datePreset === "last30days") {
    conditions.push(sql`${products.createdAt} >= CURRENT_DATE - INTERVAL '30 days'`)
  } else if (datePreset === "custom") {
    if (startDate) {
      conditions.push(sql`DATE(${products.createdAt}) >= ${startDate}::date`)
    }
    if (endDate) {
      conditions.push(sql`DATE(${products.createdAt}) <= ${endDate}::date`)
    }
  }

  if (startTime && endTime) {
    conditions.push(sql`${products.createdAt}::time >= ${startTime}::time AND ${products.createdAt}::time <= ${endTime}::time`)
  } else if (startTime) {
    conditions.push(sql`${products.createdAt}::time >= ${startTime}::time`)
  } else if (endTime) {
    conditions.push(sql`${products.createdAt}::time <= ${endTime}::time`)
  }

  return conditions
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "50", 10))

    const paramsObj: any = {}
    searchParams.forEach((val, key) => {
      paramsObj[key] = val
    })

    const conditions = buildConditions(paramsObj)
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [statsRow] = await db
      .select({
        totalMatching: count(),
        wholesaleCount: sql<number>`count(CASE WHEN ${products.type} IN ('wholesale', 'both') THEN 1 END)`,
        retailCount: sql<number>`count(CASE WHEN ${products.type} IN ('retail', 'both') THEN 1 END)`,
        hiddenCount: sql<number>`count(CASE WHEN ${products.stockStatus} = 'hidden' THEN 1 END)`,
        totalValue: sql<number>`COALESCE(SUM(${products.price}), 0)`,
      })
      .from(products)
      .where(whereClause)

    const total = Number(statsRow?.totalMatching || 0)
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset)

    const allBrandsRaw = await db
      .select({ brand: products.brand })
      .from(products)
      .groupBy(products.brand)

    const distinctBrands = Array.from(
      new Set(
        allBrandsRaw
          .flatMap((b) => (b.brand ? b.brand.split(",").map((s) => s.trim()) : []))
          .filter(Boolean)
      )
    ).sort()

    return NextResponse.json({
      success: true,
      products: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats: {
        totalMatching: total,
        returnedCount: items.length,
        wholesaleCount: Number(statsRow?.wholesaleCount || 0),
        retailCount: Number(statsRow?.retailCount || 0),
        hiddenCount: Number(statsRow?.hiddenCount || 0),
        totalValue: Number(statsRow?.totalValue || 0),
      },
      brands: distinctBrands,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to query products" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, productIds = [], applyToAllMatching = false, filters = {} } = body

    let targetIds: number[] = []

    if (applyToAllMatching) {
      const conditions = buildConditions(filters)
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined
      const matchingRows = await db
        .select({ id: products.id })
        .from(products)
        .where(whereClause)

      targetIds = matchingRows.map((r) => r.id)
    } else {
      targetIds = (productIds || []).map((id: any) => parseInt(id, 10)).filter((id: number) => !isNaN(id))
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "No products matched to perform this operation" },
        { status: 400 }
      )
    }

    if (action === "hide") {
      await db
        .update(products)
        .set({
          stockStatus: "hidden",
          updatedAt: new Date(),
        })
        .where(inArray(products.id, targetIds))

      return NextResponse.json({
        success: true,
        message: `Successfully hid ${targetIds.length} products from customer storefront.`,
        action: "hide",
        affectedCount: targetIds.length,
      })
    }

    if (action === "unhide") {
      await db
        .update(products)
        .set({
          stockStatus: "instock",
          updatedAt: new Date(),
        })
        .where(inArray(products.id, targetIds))

      return NextResponse.json({
        success: true,
        message: `Successfully unhid and restored ${targetIds.length} products to customer storefront.`,
        action: "unhide",
        affectedCount: targetIds.length,
      })
    }

    if (action === "delete") {
      await db
        .delete(schemes)
        .where(inArray(schemes.productId, targetIds.map(String)))

      const deleted = await db
        .delete(products)
        .where(inArray(products.id, targetIds))
        .returning({ id: products.id })

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${deleted.length} products from catalog.`,
        action: "delete",
        affectedCount: deleted.length,
      })
    }

    return NextResponse.json(
      { success: false, error: `Invalid action '${action}'. Allowed: hide, unhide, delete.` },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to perform bulk operation" },
      { status: 500 }
    )
  }
}
