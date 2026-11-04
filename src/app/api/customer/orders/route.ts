import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
import { auth } from "@/lib/auth"
import { eq, ilike, and, or, desc, count } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    let session = null
    try {
      session = await auth.api.getSession({ headers: req.headers })
    } catch {}

    const email = session?.user?.email?.trim().toLowerCase()
    const userId = session?.user?.id
    const sessionPhone = (session?.user as any)?.phone?.trim()

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status")?.trim().toLowerCase() || ""

    if (!userId && !email) {
      return NextResponse.json({
        success: true,
        orders: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
        },
      })
    }

    let profilePhone = ""
    if (userId || email) {
      const profConditions = []
      if (userId) profConditions.push(eq(customerPortalProfiles.userId, userId))
      if (email) profConditions.push(eq(customerPortalProfiles.email, email))
      const [prof] = await db
        .select()
        .from(customerPortalProfiles)
        .where(profConditions.length > 1 ? or(...profConditions) : profConditions[0])
        .limit(1)
      if (prof?.phone) profilePhone = prof.phone.trim()
    }

    const userScopeConditions = []
    if (userId) userScopeConditions.push(eq(orders.userId, userId))
    if (email) userScopeConditions.push(eq(orders.customerEmail, email))

    const rawPhone = (sessionPhone || profilePhone || "").replace(/[^0-9]/g, "")
    if (rawPhone && rawPhone.length >= 7) {
      const phoneTail = rawPhone.slice(-7)
      userScopeConditions.push(ilike(orders.customerPhone, `%${phoneTail}%`))
    }

    if (userScopeConditions.length === 0) {
      return NextResponse.json({
        success: true,
        orders: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
        },
      })
    }

    const userWhere = userScopeConditions.length > 1 ? or(...userScopeConditions) : userScopeConditions[0]

    const filterConditions = [userWhere]

    if (search) {
      filterConditions.push(
        or(
          ilike(orders.orderNumber, `%${search}%`),
          ilike(orders.customerName, `%${search}%`),
          ilike(orders.customerCity, `%${search}%`),
          ilike(orders.customerPhone, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      filterConditions.push(ilike(orders.status, status))
    }

    const finalWhere = and(...filterConditions)

    const [totalRow] = await db
      .select({ count: count() })
      .from(orders)
      .where(finalWhere)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const dbOrders = await db
      .select()
      .from(orders)
      .where(finalWhere)
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
    let session = null
    try {
      session = await auth.api.getSession({ headers: req.headers })
    } catch {}

    const body = await req.json()

    if (!body.customerName) {
      return NextResponse.json(
        { success: false, error: "Missing customer name" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000)
    const orderNumber = body.orderNumber || `#SA-${randomSuffix}`

    const userId = body.userId || session?.user?.id || null
    const customerEmail = (body.customerEmail || body.email || session?.user?.email || "")?.trim().toLowerCase() || null

    const [created] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId,
        customerEmail,
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
