import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { payments } from "@/db/schema/payments"
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
          ilike(payments.paymentNumber, `%${search}%`),
          ilike(payments.customerName, `%${search}%`),
          ilike(payments.orderNumber, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      conditions.push(ilike(payments.status, status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(payments)
      .where(whereClause)

    const [allPaymentsRow] = await db.select({ count: count() }).from(payments)
    const [pendingRow] = await db.select({ count: count() }).from(payments).where(ilike(payments.status, "pending"))
    const [approvedRow] = await db.select({ count: count() }).from(payments).where(ilike(payments.status, "approved"))
    const [rejectedRow] = await db.select({ count: count() }).from(payments).where(ilike(payments.status, "rejected"))

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(payments)
      .where(whereClause)
      .orderBy(desc(payments.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      payments: items,
      stats: {
        total: Number(allPaymentsRow?.count || 0),
        pending: Number(pendingRow?.count || 0),
        approved: Number(approvedRow?.count || 0),
        rejected: Number(rejectedRow?.count || 0),
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
      { success: false, error: error.message || "Failed to fetch payments" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.customerName || body.amount === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (customerName, amount)" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900)
    const paymentNumber = body.paymentNumber || `PAY-${randomSuffix}`

    const [created] = await db
      .insert(payments)
      .values({
        paymentNumber,
        customerName: body.customerName.trim(),
        orderNumber: body.orderNumber ? body.orderNumber.trim() : null,
        amount: parseInt(body.amount, 10) || 0,
        method: body.method || "Bank Transfer",
        screenshotUrl: body.screenshotUrl || null,
        status: body.status || "Pending",
        notes: body.notes ? body.notes.trim() : null,
        submittedAt: body.submittedAt ? new Date(body.submittedAt) : new Date(),
      })
      .returning()

    return NextResponse.json(
      { success: true, payment: created },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment" },
      { status: 500 }
    )
  }
}
