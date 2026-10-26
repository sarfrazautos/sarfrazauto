import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { eq } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderId = parseInt(id, 10)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID" },
        { status: 400 }
      )
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch order" },
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
    const orderId = parseInt(id, 10)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (body.status !== undefined) updateData.status = String(body.status).toLowerCase().trim()
    if (body.paymentStatus !== undefined) updateData.paymentStatus = String(body.paymentStatus).toLowerCase().trim()
    if (body.customerName !== undefined) updateData.customerName = String(body.customerName).trim()
    if (body.customerPhone !== undefined) updateData.customerPhone = body.customerPhone
    if (body.customerCity !== undefined) updateData.customerCity = body.customerCity
    if (body.orderType !== undefined) updateData.orderType = String(body.orderType).toLowerCase()
    if (body.items !== undefined) updateData.items = body.items
    if (body.totalAmount !== undefined) updateData.totalAmount = parseInt(body.totalAmount, 10)
    if (body.notes !== undefined) updateData.notes = body.notes

    const [updated] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, order: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order" },
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
    const orderId = parseInt(id, 10)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID" },
        { status: 400 }
      )
    }

    const [deleted] = await db
      .delete(orders)
      .where(eq(orders.id, orderId))
      .returning()

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      id: orderId,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete order" },
      { status: 500 }
    )
  }
}
