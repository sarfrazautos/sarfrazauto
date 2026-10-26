import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { eq, or, and, ne } from "drizzle-orm"
import { createSlug } from "@/lib/slug"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const trimmedId = id?.trim()

    if (!trimmedId) {
      return NextResponse.json(
        { success: false, error: "Invalid product identifier" },
        { status: 400 }
      )
    }

    const isNumeric = /^\d+$/.test(trimmedId)
    const condition = isNumeric
      ? or(eq(products.id, parseInt(trimmedId, 10)), eq(products.slug, trimmedId))
      : eq(products.slug, trimmedId)

    const [product] = await db
      .select()
      .from(products)
      .where(condition)
      .limit(1)

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id, 10)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (body.name !== undefined) {
      const name = body.name.trim()
      updateData.name = name
      const targetSlug = body.slug ? body.slug.trim() : createSlug(name)
      const [existing] = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.slug, targetSlug), ne(products.id, productId)))
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
      updateData.slug = targetSlug
    }
    if (body.type !== undefined) updateData.type = body.type.trim().toLowerCase()
    if (body.category !== undefined) updateData.category = body.category.trim()
    if (body.brand !== undefined) updateData.brand = body.brand.trim()
    if (body.price !== undefined) updateData.price = parseInt(body.price, 10)
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice ? parseInt(body.originalPrice, 10) : null
    if (body.stockStatus !== undefined) updateData.stockStatus = body.stockStatus
    if (body.compatibleBike !== undefined) updateData.compatibleBike = body.compatibleBike
    if (body.description !== undefined) updateData.description = body.description
    if (body.colors !== undefined) updateData.colors = body.colors
    if (body.images !== undefined) updateData.images = body.images
    if (body.mainImageIndex !== undefined) updateData.mainImageIndex = body.mainImageIndex
    if (body.badge !== undefined) updateData.badge = body.badge
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured)
    if (body.rating !== undefined) updateData.rating = body.rating
    if (body.reviewsCount !== undefined) updateData.reviewsCount = body.reviewsCount

    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, product: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id, 10)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID" },
        { status: 400 }
      )
    }

    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning()

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      id: productId,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    )
  }
}
