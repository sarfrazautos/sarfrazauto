import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
import { auth } from "@/lib/auth"
import { eq, or, ilike, and, desc } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    let session = null
    try {
      session = await auth.api.getSession({ headers: req.headers })
    } catch {}

    const email = session?.user?.email?.trim().toLowerCase()
    const userId = session?.user?.id
    const sessionPhone = (session?.user as any)?.phone?.trim()

    if (!userId && !email) {
      return NextResponse.json({
        success: true,
        bulkOrders: [],
        totalCount: 0,
      })
    }

    let profilePhone = ""
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
    }

    const userScopeConditions = []
    if (userId) userScopeConditions.push(eq(orders.userId, userId))
    if (email) userScopeConditions.push(eq(orders.customerEmail, email))

    const rawPhone = (sessionPhone || profilePhone || "").replace(/[^0-9]/g, "")
    if (rawPhone && rawPhone.length >= 7) {
      const phoneTail = rawPhone.slice(-7)
      userScopeConditions.push(ilike(orders.customerPhone, `%${phoneTail}%`))
    }

    if (userScopeConditions.length === 0) {
      return NextResponse.json({
        success: true,
        bulkOrders: [],
        totalCount: 0,
      })
    }

    const userWhere = userScopeConditions.length > 1 ? or(...userScopeConditions) : userScopeConditions[0]

    const dbOrders = await db
      .select()
      .from(orders)
      .where(and(userWhere, eq(orders.orderType, "wholesale")))
      .orderBy(desc(orders.createdAt))

    const formatted = dbOrders.map((o) => {
      const itemsList = Array.isArray(o.items) ? o.items : []
      const itemsSummary = itemsList.map((i: any) => i.name || i.title || "Carton").join(", ") || "Wholesale Spare Parts"
      const cartonCount = itemsList.reduce((acc: number, item: any) => acc + (item.quantity || item.qty || 1), 0)

      const statusMap: Record<string, "In Transit" | "Processing" | "Delivered"> = {
        delivered: "Delivered",
        processing: "Processing",
        pending: "Processing",
      }

      return {
        id: o.orderNumber,
        numericId: o.id,
        date: o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Recently",
        items: itemsSummary,
        cartonCount,
        totalAmount: o.totalAmount,
        status: statusMap[o.status.toLowerCase()] || "Processing",
      }
    })

    return NextResponse.json({
      success: true,
      bulkOrders: formatted,
      totalCount: formatted.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bulk orders" },
      { status: 500 }
    )
  }
}
