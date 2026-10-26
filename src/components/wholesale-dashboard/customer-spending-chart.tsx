"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  spend: {
    label: "Spending (PKR)",
    color: "#dc2626",
  },
} satisfies ChartConfig

export function CustomerSpendingChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["customer-dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/customer/dashboard")
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch dashboard data")
      }
      return json
    },
  })

  const charts = data?.charts
  const chartData = charts?.monthlySpending || []
  const totalSpentDisplay = charts?.totalSpentDisplay || "Rs. 0"

  return (
    <Card className="w-full py-6 gap-6 rounded-2xl border bg-white shadow-2xs">
      <CardHeader className="flex sm:flex-row flex-col justify-between sm:items-center items-start gap-3 px-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold text-neutral-900">
            Monthly Purchase Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-neutral-900">
                  {totalSpentDisplay}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium"
                >
                  +14.8% vs last year
                </Badge>
                <span className="text-xs text-neutral-500 hidden sm:inline">
                  cumulative purchases
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-red-600" />
          <span className="text-xs font-medium text-neutral-600">Monthly Spending</span>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-xl" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full min-h-[280px]">
            <AreaChart accessibilityLayer data={chartData}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(144, 164, 174, 0.2)"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                tickFormatter={(value) => `${value}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(val) => `Rs. ${(Number(val) * 1000).toLocaleString()}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#dc2626"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendGradient)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
