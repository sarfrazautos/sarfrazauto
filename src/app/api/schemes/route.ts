import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { schemes } from "@/db/schema/schemes"
import { products } from "@/db/schema/products"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  try {
    const allDbSchemes = await db
      .select()
      .from(schemes)
      .orderBy(desc(schemes.updatedAt))

    const allWholesaleProducts = await db
      .select()
      .from(products)
      .where(eq(products.type, "wholesale"))
      .orderBy(desc(products.createdAt))

    const schemeMap = new Map<string, typeof schemes.$inferSelect>()
    for (const s of allDbSchemes) {
      schemeMap.set(s.productId.toString(), s)
    }

    const mergedProducts = allWholesaleProducts.map((p) => {
      const pid = p.id.toString()
      const existingScheme = schemeMap.get(pid)

      if (existingScheme && existingScheme.status !== "None") {
        return {
          id: `P-00${p.id}`,
          productId: pid,
          name: p.name,
          category: p.category,
          brand: p.brand,
          cartonPrice: p.price,
          hasScheme: true,
          buyQty: existingScheme.buyQty,
          freeQty: existingScheme.freeQty,
          schemeStatus: existingScheme.status,
          schemeId: existingScheme.id,
        }
      }

      return {
        id: `P-00${p.id}`,
        productId: pid,
        name: p.name,
        category: p.category,
        brand: p.brand,
        cartonPrice: p.price,
        hasScheme: false,
        buyQty: 10,
        freeQty: 1,
        schemeStatus: "None",
        schemeId: existingScheme?.id || null,
      }
    })

    for (const s of allDbSchemes) {
      const alreadyIncluded = mergedProducts.some((mp) => mp.productId === s.productId)
      if (!alreadyIncluded && s.status !== "None") {
        mergedProducts.push({
          id: `P-${s.productId}`,
          productId: s.productId,
          name: s.productName,
          category: s.category || "General",
          brand: s.brand || "Sarfraz Autos",
          cartonPrice: s.cartonPrice || 0,
          hasScheme: true,
          buyQty: s.buyQty,
          freeQty: s.freeQty,
          schemeStatus: s.status,
          schemeId: s.id,
        })
      }
    }

    const activeCount = mergedProducts.filter((p) => p.hasScheme && p.schemeStatus === "Active").length
    const pausedCount = mergedProducts.filter((p) => p.hasScheme && p.schemeStatus === "Paused").length

    return NextResponse.json({
      success: true,
      products: mergedProducts,
      stats: {
        activeSchemes: activeCount,
        pausedSchemes: pausedCount,
        totalProducts: mergedProducts.length,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch schemes" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, productName, category, brand, cartonPrice, buyQty, freeQty, status } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      )
    }

    const cleanProductId = productId.toString().replace(/^P-00/, "").replace(/^P-0/, "").replace(/^P-/, "")
    const cleanBuyQty = Math.max(1, parseInt(buyQty, 10) || 10)
    const cleanFreeQty = Math.max(1, parseInt(freeQty, 10) || 1)
    const schemeStatus = status || "Active"

    const existing = await db
      .select()
      .from(schemes)
      .where(eq(schemes.productId, cleanProductId))
      .limit(1)

    let result
    if (existing && existing.length > 0) {
      const [updated] = await db
        .update(schemes)
        .set({
          productName: productName || existing[0].productName,
          category: category || existing[0].category,
          brand: brand || existing[0].brand,
          cartonPrice: cartonPrice !== undefined ? parseInt(cartonPrice, 10) : existing[0].cartonPrice,
          buyQty: cleanBuyQty,
          freeQty: cleanFreeQty,
          status: schemeStatus,
          updatedAt: new Date(),
        })
        .where(eq(schemes.id, existing[0].id))
        .returning()
      result = updated
    } else {
      const [inserted] = await db
        .insert(schemes)
        .values({
          productId: cleanProductId,
          productName: productName || "Product",
          category: category || "General",
          brand: brand || "Crown Genuine",
          cartonPrice: cartonPrice ? parseInt(cartonPrice, 10) : 0,
          buyQty: cleanBuyQty,
          freeQty: cleanFreeQty,
          status: schemeStatus,
        })
        .returning()
      result = inserted
    }

    return NextResponse.json({
      success: true,
      scheme: result,
      message: "Scheme saved successfully",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save scheme" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")
    const id = searchParams.get("id")

    if (id) {
      await db
        .update(schemes)
        .set({ status: "None", updatedAt: new Date() })
        .where(eq(schemes.id, parseInt(id, 10)))
    } else if (productId) {
      const cleanProductId = productId.replace(/^P-00/, "").replace(/^P-0/, "").replace(/^P-/, "")
      await db
        .update(schemes)
        .set({ status: "None", updatedAt: new Date() })
        .where(eq(schemes.productId, cleanProductId))
    } else {
      return NextResponse.json(
        { success: false, error: "Missing id or productId parameter" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Scheme removed successfully",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove scheme" },
      { status: 500 }
    )
  }
}
