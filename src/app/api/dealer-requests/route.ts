import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { dealerRequests } from "@/db/schema/dealer-requests"
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
          ilike(dealerRequests.requestId, `%${search}%`),
          ilike(dealerRequests.shopName, `%${search}%`),
          ilike(dealerRequests.ownerName, `%${search}%`),
          ilike(dealerRequests.city, `%${search}%`),
          ilike(dealerRequests.phone, `%${search}%`),
          ilike(dealerRequests.email, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      conditions.push(ilike(dealerRequests.status, status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(dealerRequests)
      .where(whereClause)

    const [allRequestsRow] = await db.select({ count: count() }).from(dealerRequests)
    const [pendingRow] = await db.select({ count: count() }).from(dealerRequests).where(ilike(dealerRequests.status, "pending"))
    const [approvedRow] = await db.select({ count: count() }).from(dealerRequests).where(ilike(dealerRequests.status, "approved"))
    const [rejectedRow] = await db.select({ count: count() }).from(dealerRequests).where(ilike(dealerRequests.status, "rejected"))

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(dealerRequests)
      .where(whereClause)
      .orderBy(desc(dealerRequests.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      requests: items,
      stats: {
        total: Number(allRequestsRow?.count || 0),
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
      { success: false, error: error.message || "Failed to fetch dealer requests" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.shopName || !body.ownerName || !body.phone || !body.email || !body.city) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (shopName, ownerName, phone, email, city)" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900)
    const requestId = body.requestId || `REQ-${randomSuffix}`

    const [created] = await db
      .insert(dealerRequests)
      .values({
        requestId,
        shopName: body.shopName.trim(),
        ownerName: body.ownerName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        city: body.city.trim(),
        address: body.address ? body.address.trim() : null,
        cnic: body.cnic ? body.cnic.trim() : null,
        ntn: body.ntn ? body.ntn.trim() : null,
        status: body.status || "Pending",
        notes: body.notes ? body.notes.trim() : null,
        submittedAt: body.submittedAt ? new Date(body.submittedAt) : new Date(),
      })
      .returning()

    return NextResponse.json(
      { success: true, request: created },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create dealer request" },
      { status: 500 }
    )
  }
}
