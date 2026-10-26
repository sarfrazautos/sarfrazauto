import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { eq, ilike, and, or, inArray, desc, count } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status")?.trim().toLowerCase() || ""
    const orderType = searchParams.get("orderType")?.trim().toLowerCase() || ""

    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(orders.orderNumber, `%${search}%`),
          ilike(orders.customerName, `%${search}%`),
          ilike(orders.customerCity, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      conditions.push(eq(orders.status, status))
    }

    if (orderType && orderType !== "all") {
      conditions.push(eq(orders.orderType, orderType))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(orders)
      .where(whereClause)

    const [deliveredRow] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "delivered"))

    const [inProgressRow] = await db
      .select({ count: count() })
      .from(orders)
      .where(inArray(orders.status, ["pending", "processing"]))

    const [cancelledReturnedRow] = await db
      .select({ count: count() })
      .from(orders)
      .where(inArray(orders.status, ["cancelled", "returned"]))

    const [allOrdersRow] = await db.select({ count: count() }).from(orders)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      orders: items,
      stats: {
        total: Number(allOrdersRow?.count || 0),
        delivered: Number(deliveredRow?.count || 0),
        inProgress: Number(inProgressRow?.count || 0),
        cancelledReturned: Number(cancelledReturnedRow?.count || 0),
      },
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const customerName = (body.customerName && body.customerName.trim())
      ? body.customerName.trim()
      : "Valued Customer"

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const orderNumber =
      body.orderNumber || `ORD-${new Date().getFullYear()}-${randomSuffix}`

    const [created] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName,
        customerPhone: body.customerPhone ? body.customerPhone.trim() : null,
        customerCity: body.customerCity ? body.customerCity.trim() : null,
        orderType: (body.orderType || "retail").toLowerCase(),
        items: Array.isArray(body.items) ? body.items : [],
        totalAmount: parseInt(String(body.totalAmount ?? 0), 10) || 0,
        status: (body.status || "pending").toLowerCase(),
        paymentStatus: (body.paymentStatus || "pending").toLowerCase(),
        notes: body.notes ? body.notes.trim() : null,
      } as any)
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
