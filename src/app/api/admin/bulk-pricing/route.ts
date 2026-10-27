import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { gte, lte, eq, or, and, ilike } from "drizzle-orm"
import { normalizeCategory } from "@/lib/category-mapper"

function calculateNewPrice(currentPrice: number, operation: string, adjustmentType: string, adjustmentValue: number) {
  const val = Math.max(0, Number(adjustmentValue) || 0)
  if (operation === "increase") {
    if (adjustmentType === "percentage") {
      return Math.round(currentPrice * (1 + val / 100))
    }
    return Math.round(currentPrice + val)
  }
  if (adjustmentType === "percentage") {
    return Math.max(1, Math.round(currentPrice * (1 - val / 100)))
  }
  return Math.max(1, Math.round(currentPrice - val))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      minPrice,
      maxPrice,
      category,
      brand,
      bike,
      type,
      operation = "increase",
      adjustmentType = "percentage",
      adjustmentValue = 10,
      action = "preview",
      selectedIds,
    } = body

    const conditions = []

    const min = minPrice !== undefined && minPrice !== "" && minPrice !== null ? Number(minPrice) : null
    const max = maxPrice !== undefined && maxPrice !== "" && maxPrice !== null ? Number(maxPrice) : null

    if (min !== null && !isNaN(min)) {
      conditions.push(gte(products.price, min))
    }
    if (max !== null && !isNaN(max)) {
      conditions.push(lte(products.price, max))
    }

    if (category && category !== "all" && category !== "All") {
      const normalized = normalizeCategory(category)
      if (normalized && normalized !== "All") {
        conditions.push(ilike(products.category, normalized))
      } else {
        conditions.push(ilike(products.category, `%${category}%`))
      }
    }

    if (brand && brand !== "all" && brand !== "All Brands" && brand !== "All") {
      conditions.push(ilike(products.brand, brand))
    }

    if (bike && bike !== "all" && bike !== "All Bikes" && bike !== "All") {
      const lowerBike = bike.toLowerCase().trim()
      if (lowerBike.includes("70")) {
        conditions.push(or(ilike(products.compatibleBike, "%70%"), ilike(products.name, "%CD70%")))
      } else if (lowerBike.includes("100")) {
        conditions.push(or(ilike(products.compatibleBike, "%100%"), ilike(products.name, "%100%")))
      } else if (lowerBike.includes("125")) {
        conditions.push(or(ilike(products.compatibleBike, "%125%"), ilike(products.name, "%CG125%")))
      } else if (lowerBike.includes("150")) {
        conditions.push(or(ilike(products.compatibleBike, "%150%"), ilike(products.name, "%150%")))
      } else {
        conditions.push(ilike(products.compatibleBike, `%${bike}%`))
      }
    }

    if (type && type !== "all" && type !== "All") {
      conditions.push(or(eq(products.type, type), eq(products.type, "both")))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const matchedProducts = await db
      .select({
        id: products.id,
        name: products.name,
        category: products.category,
        brand: products.brand,
        price: products.price,
        originalPrice: products.originalPrice,
        type: products.type,
        compatibleBike: products.compatibleBike,
        images: products.images,
        mainImageIndex: products.mainImageIndex,
      })
      .from(products)
      .where(whereClause)

    const filteredProducts = Array.isArray(selectedIds) && selectedIds.length > 0
      ? matchedProducts.filter((p) => selectedIds.includes(p.id))
      : matchedProducts

    const previewList = filteredProducts.map((p) => {
      const currentPrice = Number(p.price) || 0
      const newPrice = calculateNewPrice(currentPrice, operation, adjustmentType, adjustmentValue)
      const difference = newPrice - currentPrice
      const percentChange = currentPrice > 0 ? ((difference / currentPrice) * 100).toFixed(1) : "0"

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        type: p.type,
        compatibleBike: p.compatibleBike,
        images: p.images,
        mainImageIndex: p.mainImageIndex,
        currentPrice,
        newPrice,
        difference,
        percentChange: `${difference >= 0 ? "+" : ""}${percentChange}%`,
      }
    })

    if (action === "apply") {
      let updatedCount = 0
      const batchSize = 50

      for (let i = 0; i < previewList.length; i += batchSize) {
        const chunk = previewList.slice(i, i + batchSize)
        await Promise.all(
          chunk.map((item) =>
            db
              .update(products)
              .set({
                originalPrice: item.currentPrice,
                price: item.newPrice,
                updatedAt: new Date(),
              })
              .where(eq(products.id, item.id))
          )
        )
        updatedCount += chunk.length
      }

      return NextResponse.json({
        success: true,
        updatedCount,
        message: `Successfully updated prices for ${updatedCount} products.`,
      })
    }

    const totalOld = previewList.reduce((acc, curr) => acc + curr.currentPrice, 0)
    const totalNew = previewList.reduce((acc, curr) => acc + curr.newPrice, 0)

    return NextResponse.json({
      success: true,
      totalCount: previewList.length,
      products: previewList,
      summary: {
        totalCount: previewList.length,
        totalOldPrice: totalOld,
        totalNewPrice: totalNew,
        totalDifference: totalNew - totalOld,
        avgPrice: previewList.length ? Math.round(totalOld / previewList.length) : 0,
        avgNewPrice: previewList.length ? Math.round(totalNew / previewList.length) : 0,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process bulk pricing request" },
      { status: 500 }
    )
  }
}
