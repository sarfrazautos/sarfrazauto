import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { eq, ilike, and, or, desc, count } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status")?.trim().toLowerCase() || ""

    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(orders.orderNumber, `%${search}%`),
          ilike(orders.customerName, `%${search}%`),
          ilike(orders.customerCity, `%${search}%`),
          ilike(orders.customerPhone, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      conditions.push(ilike(orders.status, status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(orders)
      .where(whereClause)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const dbOrders = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)

    const formattedOrders = dbOrders.map((o) => {
      const firstItem = Array.isArray(o.items) && o.items.length > 0 ? o.items[0] : null
      const productName = firstItem?.name || firstItem?.title || "Motorcycle Spare Parts"
      const totalQty = Array.isArray(o.items)
        ? o.items.reduce((sum: number, it: any) => sum + (it.quantity || it.qty || 1), 0)
        : 1
      const dateStr = o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Recently"

      const statusCapitalized =
        o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()

      return {
        id: o.orderNumber,
        numericId: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerCity: o.customerCity,
        orderType: o.orderType || "retail",
        product: productName,
        items: o.items || [],
        qty: totalQty,
        amount: `Rs. ${o.totalAmount.toLocaleString()}`,
        rawAmount: o.totalAmount,
        status: statusCapitalized,
        paymentStatus: o.paymentStatus || "pending",
        notes: o.notes,
        date: dateStr,
        createdAt: o.createdAt,
      }
    })

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customer orders" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.customerName) {
      return NextResponse.json(
        { success: false, error: "Missing customer name" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000)
    const orderNumber = body.orderNumber || `#SA-${randomSuffix}`

    const [created] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone ? body.customerPhone.trim() : null,
        customerCity: body.customerCity ? body.customerCity.trim() : "Karachi",
        orderType: body.orderType || "retail",
        items: Array.isArray(body.items) ? body.items : [],
        totalAmount: parseInt(body.totalAmount, 10) || 0,
        status: body.status || "pending",
        paymentStatus: body.paymentStatus || "pending",
        notes: body.notes || null,
      })
      .returning()

    return NextResponse.json(
      { success: true, order: created },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}
