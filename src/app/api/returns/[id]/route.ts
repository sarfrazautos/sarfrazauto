import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { returns } from "@/db/schema/returns"
import { eq, or } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(returns.id, numId), eq(returns.returnId, id))
      : eq(returns.returnId, id)

    const [item] = await db.select().from(returns).where(condition)

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Return record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, return: item })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch return record" },
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
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(returns.id, numId), eq(returns.returnId, id))
      : eq(returns.returnId, id)

    const body = await req.json()
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (body.status !== undefined) updateData.status = body.status
    if (body.reason !== undefined) updateData.reason = body.reason
    if (body.condition !== undefined) updateData.condition = body.condition
    if (body.quantity !== undefined) updateData.quantity = parseInt(body.quantity, 10) || 1
    if (body.returnAmount !== undefined) updateData.returnAmount = parseInt(body.returnAmount, 10) || 0

    const [updated] = await db
      .update(returns)
      .set(updateData)
      .where(condition)
      .returning()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Return record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, return: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update return record" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  return PUT(req, props)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(returns.id, numId), eq(returns.returnId, id))
      : eq(returns.returnId, id)

    const [deleted] = await db.delete(returns).where(condition).returning()

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Return record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, return: deleted })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete return record" },
      { status: 500 }
    )
  }
}
