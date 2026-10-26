import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { agingReports } from "@/db/schema/aging-reports"
import { eq, or } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(agingReports.id, numId), eq(agingReports.dealerCode, id))
      : eq(agingReports.dealerCode, id)

    const [item] = await db.select().from(agingReports).where(condition)

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Aging report record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, agingReport: item })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch aging report" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(agingReports.id, numId), eq(agingReports.dealerCode, id))
      : eq(agingReports.dealerCode, id)

    const body = await req.json()
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (body.dealerName !== undefined) updateData.dealerName = body.dealerName
    if (body.city !== undefined) updateData.city = body.city
    if (body.creditLimit !== undefined) updateData.creditLimit = parseInt(body.creditLimit, 10) || 0
    if (body.totalDue !== undefined) updateData.totalDue = parseInt(body.totalDue, 10) || 0
    if (body.days0_30 !== undefined) updateData.days0_30 = parseInt(body.days0_30, 10) || 0
    if (body.days31_60 !== undefined) updateData.days31_60 = parseInt(body.days31_60, 10) || 0
    if (body.days61_90 !== undefined) updateData.days61_90 = parseInt(body.days61_90, 10) || 0
    if (body.days90Plus !== undefined) updateData.days90Plus = parseInt(body.days90Plus, 10) || 0
    if (body.lastPayment !== undefined) updateData.lastPayment = body.lastPayment
    if (body.status !== undefined) updateData.status = body.status
    if (body.phone !== undefined) updateData.phone = body.phone

    const [updated] = await db
      .update(agingReports)
      .set(updateData)
      .where(condition)
      .returning()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Aging report record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, agingReport: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update aging report" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  return PUT(req, props)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(agingReports.id, numId), eq(agingReports.dealerCode, id))
      : eq(agingReports.dealerCode, id)

    const [deleted] = await db.delete(agingReports).where(condition).returning()

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Aging report record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, agingReport: deleted })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete aging report" },
      { status: 500 }
    )
  }
}
