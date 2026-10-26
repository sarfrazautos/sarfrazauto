"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  retail: {
    label: "Retail Sales",
    color: "#dc2626",
  },
  wholesale: {
    label: "Wholesale Sales",
    color: "#f87171",
  },
} satisfies ChartConfig

export function AdminSalesOverviewChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard")
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch stats")
      }
      return json
    },
  })

  const salesOverview = data?.salesOverview
  const chartData = salesOverview?.monthly || []
  const totalVolume = salesOverview?.totalVolume || "Rs. 0"

  const legendItems = [
    {
      id: 1,
      title: "Retail Sales",
      color: "bg-red-600",
    },
    {
      id: 2,
      title: "Wholesale Sales",
      color: "bg-red-400",
    },
  ]

  return (
    <Card className="w-full py-6 gap-6 rounded-2xl border bg-white">
      <CardHeader className="flex sm:flex-row flex-col justify-between sm:items-center items-start gap-3 px-6">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-medium text-card-foreground">
            Sales Overview
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-32 rounded-lg" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </>
            ) : (
              <>
                <h3 className="text-3xl font-medium text-card-foreground">
                  {totalVolume}
                </h3>
                <Badge
                  className={cn("bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none font-normal")}
                >
                  +18%
                </Badge>
                <span className="text-xs text-muted-foreground">
                  total order volume
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {legendItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className={cn("size-2.5 rounded-full", item.color)} />
              <p className="text-sm text-muted-foreground">{item.title}</p>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-6">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-xl" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full min-h-[300px]">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(144, 164, 174, 0.25)"
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
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="retail"
                stackId="a"
                fill="var(--color-retail)"
                radius={[0, 0, 4, 4]}
                barSize={20}
              />
              <Bar
                dataKey="wholesale"
                stackId="a"
                fill="var(--color-wholesale)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
