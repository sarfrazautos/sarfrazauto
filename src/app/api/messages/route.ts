import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { messages } from "@/db/schema/messages"
import { eq, ilike, and, or, desc, count } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status")?.trim().toLowerCase() || ""

    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(messages.name, `%${search}%`),
          ilike(messages.email, `%${search}%`),
          ilike(messages.phone, `%${search}%`),
          ilike(messages.shopName, `%${search}%`),
          ilike(messages.message, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      conditions.push(eq(messages.status, status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(messages)
      .where(whereClause)

    const [allCountRow] = await db.select({ count: count() }).from(messages)
    const [newCountRow] = await db
      .select({ count: count() })
      .from(messages)
      .where(eq(messages.status, "new"))
    const [repliedCountRow] = await db
      .select({ count: count() })
      .from(messages)
      .where(eq(messages.status, "replied"))

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(messages)
      .where(whereClause)
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      messages: items,
      stats: {
        total: Number(allCountRow?.count || 0),
        newCount: Number(newCountRow?.count || 0),
        repliedCount: Number(repliedCountRow?.count || 0),
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
      { success: false, error: error.message || "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: "Please fill all required fields (name, email, message)" },
        { status: 400 }
      )
    }

    const [created] = await db
      .insert(messages)
      .values({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone ? body.phone.trim() : null,
        shopName: body.shopName ? body.shopName.trim() : null,
        message: body.message.trim(),
        status: "new",
      } as any)
      .returning()

    return NextResponse.json(
      { success: true, message: created },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send message" },
      { status: 500 }
    )
  }
}
