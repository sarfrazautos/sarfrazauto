import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { auth } from "@/lib/auth"
import { sendOrderWhatsAppAlerts } from "@/lib/whatsapp"

export async function POST(req: Request) {
  try {
    let session = null
    try {
      session = await auth.api.getSession({ headers: req.headers })
    } catch {}

    const body = await req.json()
    const { customerName, customerPhone, customerCity, items, notes } = body

    if (!customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Phone number and items are required" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `AI-ORD-${new Date().getFullYear()}-${randomSuffix}`

    const userId = session?.user?.id || null
    const customerEmail = session?.user?.email ? session.user.email.trim().toLowerCase() : null

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    )

    const [created] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId,
        customerEmail,
        customerName: customerName?.trim() || "AI Voice Customer",
        customerPhone: customerPhone.trim(),
        customerCity: customerCity?.trim() || "Karachi",
        orderType: "retail",
        items: items.map((i: any) => ({
          id: i.id,
          name: i.name,
          title: i.name,
          price: i.price,
          quantity: i.quantity || 1,
          image: i.images?.[0] || "/bike-engine.png",
        })),
        totalAmount,
        status: "pending",
        paymentStatus: "pending",
        notes: notes ? `[AI Voice Assistant Order] ${notes}` : "[AI Voice Assistant Order]",
      } as any)
      .returning()

    try {
      await sendOrderWhatsAppAlerts({
        orderNumber: created.orderNumber,
        customerName: created.customerName,
        customerPhone: created.customerPhone,
        customerCity: created.customerCity,
        totalAmount: created.totalAmount,
        orderType: "retail",
        items: created.items as any[],
        notes: created.notes,
      })
    } catch {}

    return NextResponse.json({
      success: true,
      order: created,
      message: "Order placed successfully! Our team will contact you on WhatsApp shortly.",
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create AI voice order" },
      { status: 500 }
    )
  }
}

