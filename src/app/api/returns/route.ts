import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { returns } from "@/db/schema/returns"
import { eq, ilike, and, or, inArray, desc, count, sum } from "drizzle-orm"

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
          ilike(returns.returnId, `%${search}%`),
          ilike(returns.orderId, `%${search}%`),
          ilike(returns.client, `%${search}%`),
          ilike(returns.product, `%${search}%`),
          ilike(returns.city, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      conditions.push(ilike(returns.status, status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(returns)
      .where(whereClause)

    const [allReturnsRow] = await db.select({ count: count() }).from(returns)
    const [inboundRow] = await db
      .select({ count: count() })
      .from(returns)
      .where(inArray(returns.status, ["Pending Receipt", "Received"]))
    const [restockedRow] = await db
      .select({ count: count() })
      .from(returns)
      .where(inArray(returns.status, ["Restocked", "Refunded"]))
    const [sumRow] = await db
      .select({ totalValue: sum(returns.returnAmount) })
      .from(returns)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(returns)
      .where(whereClause)
      .orderBy(desc(returns.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      returns: items,
      stats: {
        total: Number(allReturnsRow?.count || 0),
        inbound: Number(inboundRow?.count || 0),
        restocked: Number(restockedRow?.count || 0),
        totalValue: Number(sumRow?.totalValue || 0),
        efficiency: "98.5%",
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
      { success: false, error: error.message || "Failed to fetch returns" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.orderId || !body.client || !body.product) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (orderId, client, product)" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(10 + Math.random() * 90)
    const returnId = body.returnId || `RET-2026-0${randomSuffix}`

    const [created] = await db
      .insert(returns)
      .values({
        returnId,
        orderId: body.orderId.trim(),
        client: body.client.trim(),
        city: body.city ? body.city.trim() : null,
        type: body.type || "Wholesale",
        product: body.product.trim(),
        quantity: parseInt(body.quantity, 10) || 1,
        returnAmount: parseInt(body.returnAmount, 10) || 0,
        reason: body.reason ? body.reason.trim() : null,
        condition: body.condition ? body.condition.trim() : null,
        status: body.status || "Pending Receipt",
        submittedAt: body.submittedAt ? new Date(body.submittedAt) : new Date(),
      })
      .returning()

    return NextResponse.json(
      { success: true, return: created },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create return record" },
      { status: 500 }
    )
  }
}
