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

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig

export function CustomerCategoryChart() {
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
  const categoryBreakdown = charts?.categoryBreakdown || [
    { category: "Engine & Cylinder", percentage: 40, amount: "Rs. 0", fill: "#dc2626" },
    { category: "Clutch & Transmission", percentage: 30, amount: "Rs. 0", fill: "#ea580c" },
    { category: "Wheel & Brakes", percentage: 15, amount: "Rs. 0", fill: "#eab308" },
    { category: "Electrical & Accessories", percentage: 15, amount: "Rs. 0", fill: "#2563eb" },
  ]
  const totalSpentDisplay = charts?.totalSpentDisplay || "Rs. 0"

  return (
    <Card className="h-full w-full py-6 gap-6 rounded-2xl border bg-white shadow-2xs">
      <CardHeader className="px-6">
        <CardTitle>
          <h4 className="text-lg font-semibold text-neutral-900">Purchase Categories</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 flex-1 px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[230px] w-full">
            <Skeleton className="size-44 rounded-full" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-square max-h-[230px] min-h-[200px] mx-auto w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={categoryBreakdown}
                dataKey="percentage"
                nameKey="category"
                innerRadius={60}
                strokeWidth={35}
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
                            className="fill-neutral-500 text-xs"
                          >
                            Total Spent
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 15}
                            className="fill-neutral-900 text-lg font-bold"
                          >
                            {totalSpentDisplay}
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
        <div className="flex flex-col gap-2.5 pt-2">
          {categoryBreakdown.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="font-medium text-neutral-800 truncate max-w-[140px]">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Skeleton className="h-4 w-16 rounded-md" />
                ) : (
                  <>
                    <span className="font-semibold text-neutral-900">
                      {item.amount}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-neutral-200">
                      {item.percentage}%
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
