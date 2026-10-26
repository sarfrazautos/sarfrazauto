import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { payments } from "@/db/schema/payments"
import { eq, ilike, and, or, desc, count, sql } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    const search = searchParams.get("search")?.trim() || ""
    const statusParam = searchParams.get("status")?.trim().toLowerCase() || ""

    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(payments.paymentNumber, `%${search}%`),
          ilike(payments.customerName, `%${search}%`),
          ilike(payments.orderNumber, `%${search}%`),
          ilike(payments.method, `%${search}%`),
          ilike(payments.notes, `%${search}%`)
        )
      )
    }

    if (statusParam && statusParam !== "all") {
      if (statusParam === "cleared" || statusParam === "approved") {
        conditions.push(
          or(
            ilike(payments.status, "cleared"),
            ilike(payments.status, "approved")
          )
        )
      } else if (statusParam === "in processing" || statusParam === "pending") {
        conditions.push(
          or(
            ilike(payments.status, "in processing"),
            ilike(payments.status, "pending")
          )
        )
      } else if (statusParam === "failed" || statusParam === "rejected") {
        conditions.push(
          or(
            ilike(payments.status, "failed"),
            ilike(payments.status, "rejected")
          )
        )
      } else {
        conditions.push(ilike(payments.status, statusParam))
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(payments)
      .where(whereClause)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(payments)
      .where(whereClause)
      .orderBy(desc(payments.submittedAt), desc(payments.createdAt))
      .limit(limit)
      .offset(offset)

    const allPayments = await db.select().from(payments)

    const totalClearedAmount = allPayments
      .filter((p) => {
        const s = (p.status || "").toLowerCase()
        return s === "approved" || s === "cleared"
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0)

    const totalInProcessingAmount = allPayments
      .filter((p) => {
        const s = (p.status || "").toLowerCase()
        return s === "pending" || s === "in processing"
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0)

    const pendingCount = allPayments.filter((p) => {
      const s = (p.status || "").toLowerCase()
      return s === "pending" || s === "in processing"
    }).length

    const formattedPayments = items.map((p) => {
      const s = (p.status || "").toLowerCase()
      let statusFormatted: "Cleared" | "In Processing" | "Failed" = "In Processing"
      if (s === "approved" || s === "cleared") {
        statusFormatted = "Cleared"
      } else if (s === "rejected" || s === "failed") {
        statusFormatted = "Failed"
      }

      const dateStr = p.submittedAt
        ? new Date(p.submittedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Recently"

      const bankName =
        p.notes ||
        (p.method === "EasyPaisa"
          ? "Telenor Microfinance"
          : p.method === "JazzCash"
          ? "Mobilink Microfinance"
          : "Bank Alfalah (Raast)")

      const invoiceNumber = p.orderNumber
        ? p.orderNumber.replace("ORD", "INV")
        : `INV-${p.paymentNumber}`

      return {
        id: String(p.id),
        txnId: p.paymentNumber,
        date: dateStr,
        method: p.method || "Bank Transfer",
        bankName,
        invoiceNumber,
        amount: p.amount || 0,
        status: statusFormatted,
        customerName: p.customerName,
        screenshotUrl: p.screenshotUrl,
        notes: p.notes,
      }
    })

    return NextResponse.json({
      success: true,
      payments: formattedPayments,
      stats: {
        totalCleared: `Rs. ${totalClearedAmount.toLocaleString()}`,
        inProcessing: `Rs. ${totalInProcessingAmount.toLocaleString()}`,
        totalTransactions: allPayments.length,
        pendingCount,
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
