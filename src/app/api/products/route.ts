import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { schemes } from "@/db/schema/schemes"
import { eq, or, ilike, and, desc, count } from "drizzle-orm"
import { createSlug } from "@/lib/slug"
import { auth } from "@/lib/auth"
import { normalizeCategory } from "@/lib/category-mapper"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    const search = searchParams.get("search")?.trim() || ""
    const type = searchParams.get("type")?.trim().toLowerCase() || ""
    const category = searchParams.get("category")?.trim() || ""
    const brand = searchParams.get("brand")?.trim() || ""
    const exact = searchParams.get("exact") === "true" || searchParams.get("exactType") === "true"

    const conditions = []

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`))
    }

    if (exact) {
      if (type && type !== "all") {
        conditions.push(eq(products.type, type))
      }
    } else if (type === "wholesale") {
      let session = null
      try {
        session = await auth.api.getSession({ headers: req.headers })
      } catch {}

      if (!session || !session.user) {
        return NextResponse.json(
          {
            success: false,
            error: "Authentication required to access wholesale inventory",
            products: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
            stats: { total: 0, retail: 0, wholesale: 0 },
          },
          { status: 401 }
        )
      }
      conditions.push(or(eq(products.type, "wholesale"), eq(products.type, "both")))
    } else if (type === "retail") {
      conditions.push(or(eq(products.type, "retail"), eq(products.type, "both")))
    } else if (!type || type === "all") {
      let session = null
      try {
        session = await auth.api.getSession({ headers: req.headers })
      } catch {}

      if (!session || !session.user) {
        conditions.push(or(eq(products.type, "retail"), eq(products.type, "both")))
      }
    } else {
      conditions.push(eq(products.type, type))
    }
    if (category && category !== "all") {
      const lowerCat = category.toLowerCase().trim()
      if (lowerCat === "cd70" || lowerCat === "cd-70") {
        conditions.push(or(ilike(products.name, "%CD70%"), ilike(products.compatibleBike, "%70cc%")))
      } else if (lowerCat === "cg125" || lowerCat === "cg-125") {
        conditions.push(or(ilike(products.name, "%CG125%"), ilike(products.compatibleBike, "%125cc%")))
      } else if (lowerCat === "brakes" || lowerCat === "brake") {
        conditions.push(or(ilike(products.name, "%Brake%"), ilike(products.name, "%Cable%")))
      } else {
        const normalized = normalizeCategory(category)
        if (normalized && normalized !== "All") {
          conditions.push(ilike(products.category, normalized))
        } else {
          conditions.push(ilike(products.category, `%${category}%`))
        }
      }
    }
    if (brand && brand !== "all") {
      conditions.push(ilike(products.brand, brand))
    }
    const isFeaturedParam = searchParams.get("isFeatured")
    if (isFeaturedParam !== null && isFeaturedParam !== undefined && isFeaturedParam !== "") {
      conditions.push(eq(products.isFeatured, isFeaturedParam === "true" || isFeaturedParam === "1"))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(products)
      .where(whereClause)

    const [allCountRow] = await db.select({ count: count() }).from(products)
    const [retailCountRow] = await db.select({ count: count() }).from(products).where(or(eq(products.type, "retail"), eq(products.type, "both")))
    const [wholesaleCountRow] = await db.select({ count: count() }).from(products).where(or(eq(products.type, "wholesale"), eq(products.type, "both")))

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset)

    const activeSchemes = await db
      .select()
      .from(schemes)
      .where(eq(schemes.status, "Active"))

    const schemeMap = new Map()
    for (const s of activeSchemes) {
      const schemeObj = {
        id: s.id,
        buyQty: s.buyQty,
        freeQty: s.freeQty,
        status: s.status,
        title: `Buy ${s.buyQty} + ${s.freeQty} Free`,
      }
      if (s.productId) schemeMap.set(String(s.productId).trim().toLowerCase(), schemeObj)
      if (s.productName) schemeMap.set(String(s.productName).trim().toLowerCase(), schemeObj)
    }

    const itemsWithScheme = items.map((p) => {
      const matchedScheme =
        schemeMap.get(String(p.id)) ||
        schemeMap.get(String(p.name || "").trim().toLowerCase()) ||
        (p.slug ? schemeMap.get(String(p.slug).trim().toLowerCase()) : null) ||
        null

      return {
        ...p,
        scheme: matchedScheme,
      }
    })

    return NextResponse.json({
      success: true,
      products: itemsWithScheme,
      stats: {
        total: Number(allCountRow?.count || 0),
        retail: Number(retailCountRow?.count || 0),
        wholesale: Number(wholesaleCountRow?.count || 0),
      },
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.name || !body.price || !body.type || !body.category || !body.brand) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, price, type, category, brand)" },
        { status: 400 }
      )
    }

    const name = body.name.trim()
    const targetSlug = body.slug ? body.slug.trim() : createSlug(name)

    const [existing] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, targetSlug))
      .limit(1)

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "A product with this name is already available. Please choose a different name.",
        },
        { status: 409 }
      )
    }

    const [created] = await db
      .insert(products)
      .values({
        name,
        slug: targetSlug,
        type: body.type.trim().toLowerCase(),
        category: body.category.trim(),
        brand: body.brand.trim(),
        price: parseInt(body.price, 10),
        originalPrice: body.originalPrice ? parseInt(body.originalPrice, 10) : null,
        stockStatus: body.stockStatus || "instock",
        compatibleBike: body.compatibleBike || null,
        description: body.description || null,
        colors: Array.isArray(body.colors) ? body.colors : [],
        images: Array.isArray(body.images) ? body.images : [],
        mainImageIndex: typeof body.mainImageIndex === "number" ? body.mainImageIndex : 0,
        badge: body.badge || null,
        isFeatured: Boolean(body.isFeatured),
        rating: body.rating || "5.0",
        reviewsCount: typeof body.reviewsCount === "number" ? body.reviewsCount : 0,
      } as any)
      .returning()

    return NextResponse.json(
      { success: true, product: created },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    )
  }
}
