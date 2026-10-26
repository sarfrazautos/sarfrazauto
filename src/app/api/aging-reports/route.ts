import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { agingReports } from "@/db/schema/aging-reports"
import { eq, ilike, and, or, desc, count, sum } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    const search = searchParams.get("search")?.trim() || ""

    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(agingReports.dealerName, `%${search}%`),
          ilike(agingReports.dealerCode, `%${search}%`),
          ilike(agingReports.city, `%${search}%`),
          ilike(agingReports.phone, `%${search}%`)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(agingReports)
      .where(whereClause)

    const [statsRow] = await db
      .select({
        totalOutstanding: sum(agingReports.totalDue),
        days0_30: sum(agingReports.days0_30),
        days31_60: sum(agingReports.days31_60),
        days61_90: sum(agingReports.days61_90),
        days90Plus: sum(agingReports.days90Plus),
        count: count(),
      })
      .from(agingReports)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(agingReports)
      .where(whereClause)
      .orderBy(desc(agingReports.totalDue))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      agingData: items,
      stats: {
        totalOutstanding: Number(statsRow?.totalOutstanding || 0),
        days0_30: Number(statsRow?.days0_30 || 0),
        days31_60: Number(statsRow?.days31_60 || 0),
        days61_90: Number(statsRow?.days61_90 || 0),
        days90Plus: Number(statsRow?.days90Plus || 0),
        totalDealers: Number(statsRow?.count || 0),
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
      { success: false, error: error.message || "Failed to fetch aging reports" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.dealerName || !body.city) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (dealerName, city)" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const dealerCode = body.dealerCode || `DLR-${randomSuffix}`

    const [created] = await db
      .insert(agingReports)
      .values({
        dealerCode,
        dealerName: body.dealerName.trim(),
        city: body.city.trim(),
        creditLimit: parseInt(body.creditLimit, 10) || 0,
        totalDue: parseInt(body.totalDue, 10) || 0,
        days0_30: parseInt(body.days0_30, 10) || 0,
        days31_60: parseInt(body.days31_60, 10) || 0,
        days61_90: parseInt(body.days61_90, 10) || 0,
        days90Plus: parseInt(body.days90Plus, 10) || 0,
        lastPayment: body.lastPayment ? body.lastPayment.trim() : null,
        status: body.status || "Healthy",
        phone: body.phone ? body.phone.trim() : null,
      })
      .returning()

    return NextResponse.json(
      { success: true, agingReport: created },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create aging report" },
      { status: 500 }
    )
  }
}
