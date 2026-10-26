import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { desc } from "drizzle-orm"

export async function GET() {
  try {
    const dbOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))

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
      percentage: Math.round((val / catTotal) * 100),
      fill: categoryColors[idx % categoryColors.length],
    }))

    const totalSpentDisplay =
      totalMoneySpent >= 1000000
        ? `Rs. ${(totalMoneySpent / 1000000).toFixed(2)}M`
        : `Rs. ${totalMoneySpent.toLocaleString()}`

    return NextResponse.json({
      success: true,
      stats: {
        totalMoneySpent: `Rs. ${totalMoneySpent.toLocaleString()}`,
        totalPurchases: `${totalPurchases} Orders`,
        ordersInProcessing: `${ordersInProcessing} Orders`,
        monthlyIncrease: "+14.8% This Month",
        rawSpent: totalMoneySpent,
        totalSpentDisplay,
      },
      charts: {
        monthlySpending,
        categoryBreakdown,
        totalSpentDisplay,
      },
      orders: formattedOrders,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customer dashboard data" },
      { status: 500 }
    )
  }
}
