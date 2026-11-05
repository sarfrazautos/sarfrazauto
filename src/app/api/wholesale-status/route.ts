import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { wholesaleStatuses } from "@/db/schema/wholesale-status"
import { eq, desc, and, lte, gte } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get("all") === "true"

    if (all) {
      const statuses = await db
        .select()
        .from(wholesaleStatuses)
        .orderBy(desc(wholesaleStatuses.createdAt))

      return NextResponse.json({ success: true, statuses })
    }

    const now = new Date()
    const [active] = await db
      .select()
      .from(wholesaleStatuses)
      .where(
        and(
          eq(wholesaleStatuses.status, "Active"),
          lte(wholesaleStatuses.startTime, now),
          gte(wholesaleStatuses.endTime, now)
        )
      )
      .orderBy(desc(wholesaleStatuses.createdAt))
      .limit(1)

    return NextResponse.json({ success: true, activeStatus: active || null })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch statuses" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, title, content, imageUrl, startTime, endTime, status } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Status heading is required" },
        { status: 400 }
      )
    }

    const start = startTime ? new Date(startTime) : new Date()
    const end = endTime ? new Date(endTime) : new Date(Date.now() + 24 * 60 * 60 * 1000)

    const [inserted] = await db
      .insert(wholesaleStatuses)
      .values({
        type: type || "text",
        title: title.trim(),
        content: content ? content.trim() : null,
        imageUrl: imageUrl || null,
        startTime: start,
        endTime: end,
        status: status || "Active",
      })
      .returning()

    return NextResponse.json({ success: true, status: inserted })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create status" },
      { status: 500 }
    )
  }
}

