import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { wholesaleStatuses } from "@/db/schema/wholesale-status"
import { eq, sql } from "drizzle-orm"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const statusId = parseInt(id, 10)
    if (isNaN(statusId)) {
      return NextResponse.json({ success: false, error: "Invalid status ID" }, { status: 400 })
    }

    const body = await req.json()

    if (body.incrementView) {
      await db
        .update(wholesaleStatuses)
        .set({
          views: sql`${wholesaleStatuses.views} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(wholesaleStatuses.id, statusId))

      return NextResponse.json({ success: true })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (body.status !== undefined) updateData.status = body.status
    if (body.title !== undefined) updateData.title = body.title
    if (body.content !== undefined) updateData.content = body.content
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.startTime !== undefined) updateData.startTime = new Date(body.startTime)
    if (body.endTime !== undefined) updateData.endTime = new Date(body.endTime)

    const [updated] = await db
      .update(wholesaleStatuses)
      .set(updateData)
      .where(eq(wholesaleStatuses.id, statusId))
      .returning()

    return NextResponse.json({ success: true, status: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status" },
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
    const statusId = parseInt(id, 10)
    if (isNaN(statusId)) {
      return NextResponse.json({ success: false, error: "Invalid status ID" }, { status: 400 })
    }

    await db.delete(wholesaleStatuses).where(eq(wholesaleStatuses.id, statusId))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete status" },
      { status: 500 }
    )
  }
}

