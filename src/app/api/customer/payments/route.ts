import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { payments } from "@/db/schema/payments"
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
    const statusParam = searchParams.get("status")?.trim().toLowerCase() || ""

    if (!userId && !email) {
      return NextResponse.json({
        success: true,
        payments: [],
        stats: {
          totalCleared: "Rs. 0",
          inProcessing: "Rs. 0",
          totalTransactions: 0,
          pendingCount: 0,
        },
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
        },
      })
    }

    let profilePhone = ""
    let profileName = ""
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
      if (prof?.contactPerson || prof?.businessName) {
        profileName = (prof.contactPerson || prof.businessName).trim()
      }
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

    const paymentScopeConditions = []
    if (userOrderNumbers.length > 0) {
      paymentScopeConditions.push(inArray(payments.orderNumber, userOrderNumbers))
    }
    const customerDisplayName = session?.user?.name || profileName
    if (customerDisplayName) {
      paymentScopeConditions.push(ilike(payments.customerName, `%${customerDisplayName}%`))
    }

    if (paymentScopeConditions.length === 0) {
      return NextResponse.json({
        success: true,
        payments: [],
        stats: {
          totalCleared: "Rs. 0",
          inProcessing: "Rs. 0",
          totalTransactions: 0,
          pendingCount: 0,
        },
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
        },
      })
    }

    const paymentWhere = paymentScopeConditions.length > 1 ? or(...paymentScopeConditions) : paymentScopeConditions[0]
    const filterConditions = [paymentWhere]

    if (search) {
      filterConditions.push(
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
        filterConditions.push(
          or(
            ilike(payments.status, "cleared"),
            ilike(payments.status, "approved")
          )
        )
      } else if (statusParam === "in processing" || statusParam === "pending") {
        filterConditions.push(
          or(
            ilike(payments.status, "in processing"),
            ilike(payments.status, "pending")
          )
        )
      } else if (statusParam === "failed" || statusParam === "rejected") {
        filterConditions.push(
          or(
            ilike(payments.status, "failed"),
            ilike(payments.status, "rejected")
          )
        )
      } else {
        filterConditions.push(ilike(payments.status, statusParam))
      }
    }

    const finalWhere = and(...filterConditions)

    const [totalRow] = await db
      .select({ count: count() })
      .from(payments)
      .where(finalWhere)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(payments)
      .where(finalWhere)
      .orderBy(desc(payments.submittedAt), desc(payments.createdAt))
      .limit(limit)
      .offset(offset)

    const allPayments = await db
      .select()
      .from(payments)
      .where(paymentWhere)

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

      return {
        id: p.id,
        paymentNumber: p.paymentNumber,
        customerName: p.customerName,
        orderNumber: p.orderNumber || "-",
        amount: p.amount,
        method: p.method,
        status: statusFormatted,
        date: dateStr,
        screenshotUrl: p.screenshotUrl,
        notes: p.notes,
        submittedAt: p.submittedAt,
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
