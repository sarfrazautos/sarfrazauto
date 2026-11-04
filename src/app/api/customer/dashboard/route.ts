import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { customerPortalProfiles } from "@/db/schema/customer-portal"
import { auth } from "@/lib/auth"
import { desc, eq, or, ilike } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    let session = null
    try {
      session = await auth.api.getSession({ headers: req.headers })
    } catch {}

    const email = session?.user?.email?.trim().toLowerCase()
    const userId = session?.user?.id
    const sessionPhone = (session?.user as any)?.phone?.trim()

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    const emptyMonthly = months.map((m) => ({
      month: m,
      spend: 0,
      orders: 0,
    }))

    const defaultCategories = [
      { category: "Engine & Cylinder", percentage: 0, amount: "Rs. 0", fill: "#dc2626" },
      { category: "Clutch & Transmission", percentage: 0, amount: "Rs. 0", fill: "#ea580c" },
      { category: "Wheel & Brakes", percentage: 0, amount: "Rs. 0", fill: "#eab308" },
      { category: "Electrical & Accessories", percentage: 0, amount: "Rs. 0", fill: "#2563eb" },
    ]

    if (!userId && !email) {
      return NextResponse.json({
        success: true,
        stats: {
          totalMoneySpent: "Rs. 0",
          totalPurchases: "0 Orders",
          ordersInProcessing: "0 Orders",
          monthlyIncrease: "0% This Month",
          rawSpent: 0,
          totalSpentDisplay: "Rs. 0",
        },
        charts: {
          monthlySpending: emptyMonthly,
          categoryBreakdown: defaultCategories,
          totalSpentDisplay: "Rs. 0",
          hasData: false,
          growthDisplay: "0% this year",
        },
        orders: [],
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

    const orderConditions = []
    if (userId) orderConditions.push(eq(orders.userId, userId))
    if (email) orderConditions.push(eq(orders.customerEmail, email))

    const rawPhone = (sessionPhone || profilePhone || "").replace(/[^0-9]/g, "")
    if (rawPhone && rawPhone.length >= 7) {
      const phoneTail = rawPhone.slice(-7)
      orderConditions.push(ilike(orders.customerPhone, `%${phoneTail}%`))
    }

    if (orderConditions.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          totalMoneySpent: "Rs. 0",
          totalPurchases: "0 Orders",
          ordersInProcessing: "0 Orders",
          monthlyIncrease: "0% This Month",
          rawSpent: 0,
          totalSpentDisplay: "Rs. 0",
        },
        charts: {
          monthlySpending: emptyMonthly,
          categoryBreakdown: defaultCategories,
          totalSpentDisplay: "Rs. 0",
          hasData: false,
          growthDisplay: "0% this year",
        },
        orders: [],
      })
    }

    const dbOrders = await db
      .select()
      .from(orders)
      .where(orderConditions.length > 1 ? or(...orderConditions) : orderConditions[0])
      .orderBy(desc(orders.createdAt))

    if (dbOrders.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          totalMoneySpent: "Rs. 0",
          totalPurchases: "0 Orders",
          ordersInProcessing: "0 Orders",
          monthlyIncrease: "0% This Month",
          rawSpent: 0,
          totalSpentDisplay: "Rs. 0",
        },
        charts: {
          monthlySpending: emptyMonthly,
          categoryBreakdown: defaultCategories,
          totalSpentDisplay: "Rs. 0",
          hasData: false,
          growthDisplay: "0% this year",
        },
        orders: [],
      })
    }

    const monthlyMap: Record<string, { spend: number; ordersCount: number }> = {}
    months.forEach((m) => {
      monthlyMap[m] = { spend: 0, ordersCount: 0 }
    })

    const categoryMap: Record<string, number> = {
      "Engine & Cylinder": 0,
      "Clutch & Transmission": 0,
      "Wheel & Brakes": 0,
      "Electrical & Accessories": 0,
    }

    let totalMoneySpent = 0

    const formattedOrders = dbOrders.map((o) => {
      const firstItem = Array.isArray(o.items) && o.items.length > 0 ? o.items[0] : null
      const productName = firstItem?.name || firstItem?.title || "Motorcycle Spare Parts"
      const totalQty = Array.isArray(o.items)
        ? o.items.reduce((sum: number, it: any) => sum + (it.quantity || it.qty || 1), 0)
        : 1
      const dateStr = o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Recently"

      const statusCapitalized =
        o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()

      totalMoneySpent += o.totalAmount || 0

      if (o.createdAt) {
        const d = new Date(o.createdAt)
        const m = months[d.getMonth()]
        if (m && monthlyMap[m]) {
          monthlyMap[m].spend += Math.round((o.totalAmount || 0) / 1000)
          monthlyMap[m].ordersCount += 1
        }
      }

      const pLower = productName.toLowerCase()
      if (pLower.includes("cylinder") || pLower.includes("engine") || pLower.includes("piston") || pLower.includes("gasket")) {
        categoryMap["Engine & Cylinder"] += o.totalAmount || 0
      } else if (pLower.includes("clutch") || pLower.includes("crankshaft") || pLower.includes("camshaft")) {
        categoryMap["Clutch & Transmission"] += o.totalAmount || 0
      } else if (pLower.includes("wheel") || pLower.includes("rim") || pLower.includes("brake") || pLower.includes("shock")) {
        categoryMap["Wheel & Brakes"] += o.totalAmount || 0
      } else {
        categoryMap["Electrical & Accessories"] += o.totalAmount || 0
      }

      return {
        id: o.orderNumber,
        product: productName,
        qty: totalQty,
        amount: `Rs. ${o.totalAmount.toLocaleString()}`,
        rawAmount: o.totalAmount,
        status: statusCapitalized,
        date: dateStr,
      }
    })

    const totalPurchases = formattedOrders.length
    const ordersInProcessing = formattedOrders.filter(
      (o) => o.status === "Processing" || o.status === "Pending"
    ).length

    const monthlySpending = months.map((m) => ({
      month: m,
      spend: monthlyMap[m].spend,
      orders: monthlyMap[m].ordersCount,
    }))

    const catTotal = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1
    const categoryColors = ["#dc2626", "#ea580c", "#eab308", "#2563eb"]

    const categoryBreakdown = Object.entries(categoryMap).map(([name, val], idx) => ({
      category: name,
      amount: `Rs. ${val.toLocaleString()}`,
      percentage: totalMoneySpent > 0 ? Math.round((val / catTotal) * 100) : 0,
      fill: categoryColors[idx % categoryColors.length],
    }))

    const totalSpentDisplay =
      totalMoneySpent >= 1000000
        ? `Rs. ${(totalMoneySpent / 1000000).toFixed(2)}M`
        : `Rs. ${totalMoneySpent.toLocaleString()}`

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalMoneySpent: `Rs. ${totalMoneySpent.toLocaleString()}`,
          totalPurchases: `${totalPurchases} Orders`,
          ordersInProcessing: `${ordersInProcessing} Orders`,
          monthlyIncrease: totalPurchases > 0 ? "+100% Active" : "0% This Month",
          rawSpent: totalMoneySpent,
          totalSpentDisplay,
        },
        charts: {
          monthlySpending,
          categoryBreakdown,
          totalSpentDisplay,
          hasData: totalMoneySpent > 0,
          growthDisplay: totalMoneySpent > 0 ? "Active Purchases" : "0% this year",
        },
        orders: formattedOrders,
      },
      {
        headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=300" },
      }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customer dashboard data" },
      { status: 500 }
    )
  }
}
