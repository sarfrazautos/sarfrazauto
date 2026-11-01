import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { specialOffers } from "@/db/schema/offers"
import { eq, and, lte, gte, desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const now = new Date()

    const activeList = await db
      .select()
      .from(specialOffers)
      .where(
        and(
          eq(specialOffers.isActive, true),
          lte(specialOffers.startDate, now),
          gte(specialOffers.endDate, now)
        )
      )
      .orderBy(desc(specialOffers.id))
      .limit(1)

    const offer = activeList.length > 0 ? activeList[0] : null

    return NextResponse.json({
      success: true,
      offer,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch active offer", offer: null },
      { status: 500 }
    )
  }
}

