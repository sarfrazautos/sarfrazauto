import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { payments } from "@/db/schema/payments"
import { eq, or } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(payments.id, numId), eq(payments.paymentNumber, id))
      : eq(payments.paymentNumber, id)

    const [payment] = await db.select().from(payments).where(condition)

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, payment })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch payment" },
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
      ? or(eq(payments.id, numId), eq(payments.paymentNumber, id))
      : eq(payments.paymentNumber, id)

    const body = await req.json()
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (body.status !== undefined) updateData.status = body.status
    if (body.customerName !== undefined) updateData.customerName = body.customerName
    if (body.amount !== undefined) updateData.amount = parseInt(body.amount, 10) || 0
    if (body.method !== undefined) updateData.method = body.method
    if (body.screenshotUrl !== undefined) updateData.screenshotUrl = body.screenshotUrl
    if (body.notes !== undefined) updateData.notes = body.notes

    const [updated] = await db
      .update(payments)
      .set(updateData)
      .where(condition)
      .returning()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, payment: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update payment" },
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
      ? or(eq(payments.id, numId), eq(payments.paymentNumber, id))
      : eq(payments.paymentNumber, id)

    const [deleted] = await db.delete(payments).where(condition).returning()

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, payment: deleted })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete payment" },
      { status: 500 }
    )
  }
}
