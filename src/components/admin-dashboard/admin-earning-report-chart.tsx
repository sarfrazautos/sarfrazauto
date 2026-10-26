"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Label, Pie, PieChart } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartConfig = {
  sales: {
    label: "Sales",
  },
  "Retail Store": {
    label: "Retail Store",
    color: "#dc2626",
  },
  "Wholesale Portal": {
    label: "Wholesale Portal",
    color: "#f87171",
  },
} satisfies ChartConfig

export function AdminEarningReportChart() {
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

  const earningReport = data?.earningReport
  const chartData = earningReport?.chartData || [
    { channel: "Retail Store", sales: 50, fill: "#dc2626" },
    { channel: "Wholesale Portal", sales: 50, fill: "#f87171" },
  ]
  const totalRevenue = earningReport?.totalRevenue || "Rs. 0"

  const customerBreakdown = [
    {
      id: 1,
      channel: "Retail Store",
      borderColor: "bg-red-600",
      earning: earningReport?.retailAmount || "Rs. 0",
      growthPercentage: "+4.7%",
      isPositive: true,
    },
    {
      id: 2,
      channel: "Wholesale Portal",
      borderColor: "bg-red-400",
      earning: earningReport?.wholesaleAmount || "Rs. 0",
      growthPercentage: "+12.4%",
      isPositive: true,
    },
  ]

  return (
    <Card className="h-full w-full py-6 gap-6 rounded-2xl border bg-white">
      <CardHeader className="px-6">
        <CardTitle>
          <h4 className="text-lg font-semibold text-card-foreground">Earning Reports</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 flex-1 px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[250px] w-full">
            <Skeleton className="size-48 rounded-full" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-[250px] min-h-[220px] mx-auto w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="sales"
                nameKey="channel"
                innerRadius={65}
                strokeWidth={50}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 10}
                            className="fill-muted-foreground text-xs"
                          >
                            Total Revenue
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 15}
                            className="fill-foreground text-lg font-semibold"
                          >
                            {totalRevenue}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
        <div className="flex flex-col gap-3 pt-2">
          {customerBreakdown.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(item.borderColor, "w-1.5 h-4 rounded-full")}
                />
                <span className="text-sm font-medium text-foreground leading-tight">
                  {item.channel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Skeleton className="h-4 w-20 rounded-md" />
                ) : (
                  <>
                    <span className="text-sm font-semibold text-foreground">
                      {item.earning}
                    </span>
                    <Badge
                      className={cn(
                        "shadow-none font-normal text-xs",
                        item.isPositive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      )}
                    >
                      {item.growthPercentage}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
