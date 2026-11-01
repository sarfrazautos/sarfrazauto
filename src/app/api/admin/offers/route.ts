import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { specialOffers } from "@/db/schema/offers"
import { desc, eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const list = await db
      .select()
      .from(specialOffers)
      .orderBy(desc(specialOffers.id))

    return NextResponse.json({
      success: true,
      offers: list,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch offers" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title = "Special Deal!",
      subtitle = "Get 10% OFF on all products",
      tagText = "10% OFF",
      discountPercent = 10,
      targetCategory = "all",
      startDate,
      endDate,
      buttonText = "Shop Now",
      buttonLink = "/retail",
      isActive = true,
    } = body

    if (!endDate) {
      return NextResponse.json(
        { success: false, error: "End date is required" },
        { status: 400 }
      )
    }

    const inserted = await db
      .insert(specialOffers)
      .values({
        title,
        subtitle,
        tagText,
        discountPercent: Number(discountPercent) || 10,
        targetCategory,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        buttonText,
        buttonLink,
        isActive: Boolean(isActive),
      })
      .returning()

    return NextResponse.json({
      success: true,
      offer: inserted[0],
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create offer" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Offer ID is required" },
        { status: 400 }
      )
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (data.title !== undefined) updatePayload.title = data.title
    if (data.subtitle !== undefined) updatePayload.subtitle = data.subtitle
    if (data.tagText !== undefined) updatePayload.tagText = data.tagText
    if (data.discountPercent !== undefined) updatePayload.discountPercent = Number(data.discountPercent)
    if (data.targetCategory !== undefined) updatePayload.targetCategory = data.targetCategory
    if (data.startDate !== undefined) updatePayload.startDate = new Date(data.startDate)
    if (data.endDate !== undefined) updatePayload.endDate = new Date(data.endDate)
    if (data.buttonText !== undefined) updatePayload.buttonText = data.buttonText
    if (data.buttonLink !== undefined) updatePayload.buttonLink = data.buttonLink
    if (data.isActive !== undefined) updatePayload.isActive = Boolean(data.isActive)

    const updated = await db
      .update(specialOffers)
      .set(updatePayload)
      .where(eq(specialOffers.id, Number(id)))
      .returning()

    return NextResponse.json({
      success: true,
      offer: updated[0],
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update offer" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Offer ID is required" },
        { status: 400 }
      )
    }

    await db
      .delete(specialOffers)
      .where(eq(specialOffers.id, Number(id)))

    return NextResponse.json({
      success: true,
      message: "Offer deleted",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete offer" },
      { status: 500 }
    )
  }
}

