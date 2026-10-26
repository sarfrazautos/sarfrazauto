import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { schemes } from "@/db/schema/schemes"
import { eq } from "drizzle-orm"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status, buyQty, freeQty } = body

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (status !== undefined) {
      updatePayload.status = status
    }
    if (buyQty !== undefined) {
      updatePayload.buyQty = Math.max(1, parseInt(buyQty, 10))
    }
    if (freeQty !== undefined) {
      updatePayload.freeQty = Math.max(1, parseInt(freeQty, 10))
    }

    const schemeId = parseInt(id, 10)
    if (isNaN(schemeId)) {
      const cleanProductId = id.replace(/^P-00/, "").replace(/^P-0/, "").replace(/^P-/, "")
      const [updated] = await db
        .update(schemes)
        .set(updatePayload)
        .where(eq(schemes.productId, cleanProductId))
        .returning()

      return NextResponse.json({
        success: true,
        scheme: updated,
      })
    }

    const [updated] = await db
      .update(schemes)
      .set(updatePayload)
      .where(eq(schemes.id, schemeId))
      .returning()

    return NextResponse.json({
      success: true,
      scheme: updated,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update scheme" },
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
    const schemeId = parseInt(id, 10)

    if (isNaN(schemeId)) {
      const cleanProductId = id.replace(/^P-00/, "").replace(/^P-0/, "").replace(/^P-/, "")
      await db
        .update(schemes)
        .set({ status: "None", updatedAt: new Date() })
        .where(eq(schemes.productId, cleanProductId))
    } else {
      await db
        .update(schemes)
        .set({ status: "None", updatedAt: new Date() })
        .where(eq(schemes.id, schemeId))
    }

    return NextResponse.json({
      success: true,
      message: "Scheme removed successfully",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete scheme" },
      { status: 500 }
    )
  }
}
