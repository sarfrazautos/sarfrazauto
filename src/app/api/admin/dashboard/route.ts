import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { desc } from "drizzle-orm"

export async function GET() {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt))

    const totalOrdersCount = allOrders.length
    const deliveredCount = allOrders.filter(
      (o) => o.status.toLowerCase() === "delivered"
    ).length

    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklySales = allOrders
      .filter((o) => o.createdAt && new Date(o.createdAt) >= oneWeekAgo)
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)

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

    const monthlySalesMap: Record<string, { retail: number; wholesale: number }> = {}
    months.forEach((m) => {
      monthlySalesMap[m] = { retail: 0, wholesale: 0 }
    })

    let retailTotal = 0
    let wholesaleTotal = 0

    allOrders.forEach((o) => {
      const type = (o.orderType || "retail").toLowerCase()
      const amount = o.totalAmount || 0

      if (type === "wholesale") {
        wholesaleTotal += amount
      } else {
        retailTotal += amount
      }

      if (o.createdAt) {
        const d = new Date(o.createdAt)
        const monthName = months[d.getMonth()]
        if (monthName && monthlySalesMap[monthName]) {
          const kAmount = Math.round(amount / 1000)
          if (type === "wholesale") {
            monthlySalesMap[monthName].wholesale += kAmount
          } else {
            monthlySalesMap[monthName].retail += kAmount
          }
        }
      }
    })

    const monthlyChartData = months.map((m) => ({
      month: m,
      retail: monthlySalesMap[m].retail,
      wholesale: monthlySalesMap[m].wholesale,
    }))

    const totalRevenueDisplay =
      totalRevenue >= 1000000
        ? `Rs. ${(totalRevenue / 1000000).toFixed(2)}M`
        : `Rs. ${totalRevenue.toLocaleString()}`

    const retailPercent = totalRevenue > 0 ? Math.round((retailTotal / totalRevenue) * 100) : 50
    const wholesalePercent = totalRevenue > 0 ? 100 - retailPercent : 50

    const deliveredRate = totalOrdersCount > 0 ? Math.round((deliveredCount / totalOrdersCount) * 100) : 100
    const weeklyRate = totalRevenue > 0 ? Math.round((weeklySales / totalRevenue) * 100) : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalEarned: `Rs. ${totalRevenue.toLocaleString()}`,
        totalOrders: `${totalOrdersCount} Orders`,
        weeklySales: `Rs. ${weeklySales.toLocaleString()}`,
        ordersDelivered: String(deliveredCount),
        earnedBadge: "+18%",
        ordersBadge: `${totalOrdersCount} total`,
        weeklyBadge: weeklyRate > 0 ? `${weeklyRate}% wk` : "Active",
        deliveredBadge: `${deliveredRate}% rate`,
        rawTotalEarned: totalRevenue,
        rawTotalOrders: totalOrdersCount,
        rawWeeklySales: weeklySales,
        rawDelivered: deliveredCount,
      },
      salesOverview: {
        totalVolume: totalRevenueDisplay,
        monthly: monthlyChartData,
      },
      earningReport: {
        totalRevenue: totalRevenueDisplay,
        retailAmount: `Rs. ${retailTotal.toLocaleString()}`,
        wholesaleAmount: `Rs. ${wholesaleTotal.toLocaleString()}`,
        retailPercent,
        wholesalePercent,
        chartData: [
          { channel: "Retail Store", sales: retailPercent, fill: "#dc2626" },
          { channel: "Wholesale Portal", sales: wholesalePercent, fill: "#f87171" },
        ],
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch admin dashboard stats" },
      { status: 500 }
    )
  }
}
