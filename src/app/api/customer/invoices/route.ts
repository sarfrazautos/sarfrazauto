import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { invoices } from "@/db/schema/invoices"
import { orders } from "@/db/schema/orders"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
import { auth } from "@/lib/auth"
import { eq, ilike, and, or, inArray, desc, count } from "drizzle-orm"

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
        invoices: [],
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

    const userOrders = userScopeConditions.length > 0
      ? await db
          .select({ orderNumber: orders.orderNumber })
          .from(orders)
          .where(userScopeConditions.length > 1 ? or(...userScopeConditions) : userScopeConditions[0])
      : []

    const userOrderNumbers = userOrders.map((o) => o.orderNumber).filter(Boolean)

    const invoiceScopeConditions = []
    if (userOrderNumbers.length > 0) {
      invoiceScopeConditions.push(inArray(invoices.orderNumber, userOrderNumbers))
    }
    if (rawPhone && rawPhone.length >= 7) {
      invoiceScopeConditions.push(ilike(invoices.customerPhone, `%${rawPhone.slice(-7)}%`))
    }

    if (invoiceScopeConditions.length === 0) {
      return NextResponse.json({
        success: true,
        invoices: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
        },
      })
    }

    const invoiceWhere = invoiceScopeConditions.length > 1 ? or(...invoiceScopeConditions) : invoiceScopeConditions[0]
    const filterConditions = [invoiceWhere]

    if (search) {
      filterConditions.push(
        or(
          ilike(invoices.invoiceNumber, `%${search}%`),
          ilike(invoices.orderNumber, `%${search}%`),
          ilike(invoices.customerName, `%${search}%`),
          ilike(invoices.itemsSummary, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      filterConditions.push(ilike(invoices.status, status))
    }

    const finalWhere = and(...filterConditions)

    const [totalRow] = await db
      .select({ count: count() })
      .from(invoices)
      .where(finalWhere)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(invoices)
      .where(finalWhere)
      .orderBy(desc(invoices.issueDate))
      .limit(limit)
      .offset(offset)

    const formattedInvoices = items.map((inv) => {
      const issueStr = inv.issueDate
        ? new Date(inv.issueDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Recently"

      const dueStr = inv.dueDate
        ? new Date(inv.dueDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "14 Days"

      return {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        orderNumber: inv.orderNumber,
        customerName: inv.customerName,
        customerPhone: inv.customerPhone,
        customerCity: inv.customerCity,
        dealerCode: inv.dealerCode,
        itemsSummary: inv.itemsSummary,
        items: inv.items || [],
        amount: inv.amount,
        status: inv.status,
        issueDate: issueStr,
        dueDate: dueStr,
        rawIssueDate: inv.issueDate,
        rawDueDate: inv.dueDate,
      }
    })

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch invoices" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.orderNumber || !body.customerName || !body.amount) {
      return NextResponse.json(
        { success: false, error: "Missing required invoice fields (orderNumber, customerName, amount)" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const invoiceNumber = body.invoiceNumber || `INV-${new Date().getFullYear()}-${randomSuffix}`

    const [created] = await db
      .insert(invoices)
      .values({
        invoiceNumber,
        orderNumber: body.orderNumber,
        customerName: body.customerName,
        customerPhone: body.customerPhone || null,
        customerCity: body.customerCity || null,
        dealerCode: body.dealerCode || null,
        itemsSummary: body.itemsSummary || "Motorcycle Spare Parts Order",
        items: Array.isArray(body.items) ? body.items : [],
        amount: parseInt(String(body.amount), 10) || 0,
        status: body.status || "Pending",
        issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      })
      .returning()

    return NextResponse.json({ success: true, invoice: created }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create invoice" },
      { status: 500 }
    )
  }
}
