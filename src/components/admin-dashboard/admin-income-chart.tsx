"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowUpRight, DollarSign } from "lucide-react"

const monthlyData = [
  { period: "May", wholesale: 1800000, retail: 450000, total: 2250000 },
  { period: "Jun", wholesale: 2100000, retail: 520000, total: 2620000 },
  { period: "Jul", wholesale: 2400000, retail: 610000, total: 3010000 },
  { period: "Aug", wholesale: 2650000, retail: 680000, total: 3330000 },
  { period: "Sep", wholesale: 2950000, retail: 750000, total: 3700000 },
  { period: "Oct", wholesale: 2850000, retail: 690000, total: 3540000 },
]

const weeklyData = [
  { period: "Mon", wholesale: 420000, retail: 85000, total: 505000 },
  { period: "Tue", wholesale: 510000, retail: 92000, total: 602000 },
  { period: "Wed", wholesale: 380000, retail: 78000, total: 458000 },
  { period: "Thu", wholesale: 620000, retail: 110000, total: 730000 },
  { period: "Fri", wholesale: 580000, retail: 125000, total: 705000 },
  { period: "Sat", wholesale: 750000, retail: 160000, total: 910000 },
  { period: "Sun", wholesale: 210000, retail: 65000, total: 275000 },
]

const thirtyDaysData = [
  { period: "01 Oct", wholesale: 110000, retail: 24000, total: 134000 },
  { period: "04 Oct", wholesale: 240000, retail: 45000, total: 285000 },
  { period: "07 Oct", wholesale: 180000, retail: 38000, total: 218000 },
  { period: "10 Oct", wholesale: 350000, retail: 62000, total: 412000 },
  { period: "13 Oct", wholesale: 290000, retail: 55000, total: 345000 },
  { period: "16 Oct", wholesale: 420000, retail: 74000, total: 494000 },
  { period: "19 Oct", wholesale: 380000, retail: 68000, total: 448000 },
  { period: "22 Oct", wholesale: 460000, retail: 81000, total: 541000 },
  { period: "25 Oct", wholesale: 520000, retail: 95000, total: 615000 },
  { period: "28 Oct", wholesale: 410000, retail: 76000, total: 486000 },
  { period: "31 Oct", wholesale: 360000, retail: 69000, total: 429000 },
]

export function AdminIncomeChart() {
  const [timeRange, setTimeRange] = useState("6m")
  const [metricView, setMetricView] = useState("breakdown")

  const currentData =
    timeRange === "7d"
      ? weeklyData
      : timeRange === "30d"
      ? thirtyDaysData
      : monthlyData

  const totalPeriodEarned = currentData.reduce((acc, curr) => acc + curr.total, 0)
  const wholesaleTotal = currentData.reduce((acc, curr) => acc + curr.wholesale, 0)
  const retailTotal = currentData.reduce((acc, curr) => acc + curr.retail, 0)

  const formatPKR = (val: number) => {
    if (val >= 10000000) return `Rs. ${(val / 10000000).toFixed(2)} Cr`
    if (val >= 100000) return `Rs. ${(val / 100000).toFixed(1)}L`
    return `Rs. ${val.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-neutral-200 bg-white/95 backdrop-blur-xs p-3 shadow-md text-xs space-y-1.5 min-w-44">
          <p className="font-semibold text-neutral-900 border-b border-neutral-100 pb-1">
            Timeline: {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-neutral-600 capitalize">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-mono font-semibold text-neutral-900">
                Rs. {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="px-4 lg:px-6">
      <Card className="border-neutral-200 shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-neutral-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-neutral-900">
                Income &amp; Revenue Analytics
              </CardTitle>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1">
                <TrendingUp className="size-3" />
                +14.8% vs Last Period
              </Badge>
            </div>
            <CardDescription className="text-xs text-neutral-500 mt-1">
              Interactive revenue breakdown from wholesale master cartons and retail counter sales.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50/80 p-0.5">
              <Button
                type="button"
                size="sm"
                variant={metricView === "total" ? "default" : "ghost"}
                onClick={() => setMetricView("total")}
                className="h-7 px-2.5 text-xs cursor-pointer"
              >
                Total Income
              </Button>
              <Button
                type="button"
                size="sm"
                variant={metricView === "breakdown" ? "default" : "ghost"}
                onClick={() => setMetricView("breakdown")}
                className="h-7 px-2.5 text-xs cursor-pointer"
              >
                Wholesale vs Retail
              </Button>
            </div>

            <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50/80 p-0.5">
              <Button
                type="button"
                size="sm"
                variant={timeRange === "7d" ? "default" : "ghost"}
                onClick={() => setTimeRange("7d")}
                className="h-7 px-2.5 text-xs cursor-pointer"
              >
                7 Days
              </Button>
              <Button
                type="button"
                size="sm"
                variant={timeRange === "30d" ? "default" : "ghost"}
                onClick={() => setTimeRange("30d")}
                className="h-7 px-2.5 text-xs cursor-pointer"
              >
                30 Days
              </Button>
              <Button
                type="button"
                size="sm"
                variant={timeRange === "6m" ? "default" : "ghost"}
                onClick={() => setTimeRange("6m")}
                className="h-7 px-2.5 text-xs cursor-pointer"
              >
                6 Months
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-neutral-50/70 border border-neutral-100">
            <div>
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                Period Revenue
              </span>
              <div className="text-xl font-bold font-mono text-neutral-900 mt-0.5">
                {formatPKR(totalPeriodEarned)}
              </div>
              <span className="text-[11px] text-neutral-400">Total Cleared Earnings</span>
            </div>

            <div>
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-red-600" />
                Wholesale Cartons
              </span>
              <div className="text-xl font-bold font-mono text-red-600 mt-0.5">
                {formatPKR(wholesaleTotal)}
              </div>
              <span className="text-[11px] text-neutral-400">
                {Math.round((wholesaleTotal / totalPeriodEarned) * 100)}% of Total Revenue
              </span>
            </div>

            <div>
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-neutral-800" />
                Retail Counter
              </span>
              <div className="text-xl font-bold font-mono text-neutral-800 mt-0.5">
                {formatPKR(retailTotal)}
              </div>
              <span className="text-[11px] text-neutral-400">
                {Math.round((retailTotal / totalPeriodEarned) * 100)}% of Total Revenue
              </span>
            </div>
          </div>

          <div className="h-72 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="wholesaleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="retailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#262626" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#262626" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={12}
                  stroke="#737373"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={11}
                  stroke="#737373"
                  tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip content={<CustomTooltip />} />
                {metricView === "total" ? (
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Income"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#totalGrad)"
                  />
                ) : (
                  <>
                    <Area
                      type="monotone"
                      dataKey="wholesale"
                      name="Wholesale"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#wholesaleGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="retail"
                      name="Retail"
                      stroke="#262626"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#retailGrad)"
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
