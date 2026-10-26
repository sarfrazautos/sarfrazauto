"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, CalendarDays, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminStatisticsBlock() {
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

  const stats = data?.stats

  const mainMetrics = [
    {
      label: "Total Earned",
      value: stats?.totalEarned || "Rs. 0",
      percentage: stats?.earnedBadge || "+18%",
      isPositive: true,
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || "0 Orders",
      percentage: stats?.ordersBadge || "0 total",
      isPositive: true,
    },
  ]

  const secondaryStats = [
    {
      title: "Weekly Sales",
      value: stats?.weeklySales || "Rs. 0",
      percentage: stats?.weeklyBadge || "Active",
      icon: CalendarDays,
      href: "/admin/orders",
      isPositive: true,
    },
    {
      title: "Orders Delivered",
      value: stats?.ordersDelivered || "0",
      percentage: stats?.deliveredBadge || "0% rate",
      icon: ShoppingBag,
      href: "/admin/orders",
      isPositive: true,
    },
  ]

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-12 xl:col-span-6 h-full">
        <Card className="p-0 ring-0 border rounded-2xl relative h-full">
          <CardContent className="p-0">
            <div className="ps-6 py-4 flex flex-col gap-9 justify-between">
              <div>
                <p className="text-lg font-medium text-card-foreground">
                  Revenue Overview
                </p>
                <p className="text-xs font-normal text-muted-foreground">
                  Live store performance and order revenue
                </p>
              </div>
              <div className="flex items-center gap-6">
                {mainMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <div>
                      <p className="text-xs font-normal text-muted-foreground">
                        {metric.label}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {isLoading ? (
                          <>
                            <Skeleton className="h-8 w-32 rounded-lg" />
                            <Skeleton className="h-5 w-12 rounded-full" />
                          </>
                        ) : (
                          <>
                            <p className="text-2xl font-medium text-card-foreground">
                              {metric.value}
                            </p>
                            <Badge
                              className={cn(
                                "font-normal text-muted-foreground",
                                metric.isPositive
                                  ? "bg-teal-400/10 text-teal-600"
                                  : "bg-red-500/10 text-red-600"
                              )}
                            >
                              {metric.percentage}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    {index < mainMetrics.length - 1 && (
                      <Separator orientation="vertical" className="h-12" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <img
              src="https://images.shadcnspace.com/assets/backgrounds/stats-01.webp"
              alt="Revenue Illustration"
              width={211}
              height={168}
              className="absolute bottom-0 right-0 hidden sm:block"
            />
          </CardContent>
        </Card>
      </div>

      {secondaryStats.map((stat, index) => (
        <div key={index} className="col-span-12 sm:col-span-6 xl:col-span-3">
          <Card className="py-6 ring-0 border rounded-2xl h-full">
            <CardContent className="px-6 flex items-start justify-between">
              <div className="flex flex-col gap-5 justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium text-card-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-8 w-28 rounded-lg" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-medium text-card-foreground">
                          {stat.value}
                        </p>
                        <Badge
                          className={cn(
                            "font-normal text-muted-foreground",
                            stat.isPositive
                              ? "bg-teal-400/10 text-teal-600"
                              : "bg-red-500/10 text-red-600"
                          )}
                        >
                          {stat.percentage}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <Link
                  href={stat.href}
                  className="inline-flex items-center gap-1.5 w-fit rounded-xl border border-input bg-background hover:bg-neutral-100 text-foreground text-sm font-medium px-3 h-9 shadow-2xs transition-colors"
                >
                  <span>See Report</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="p-3 rounded-full outline outline-muted-foreground/20 text-neutral-800">
                <stat.icon size={16} />
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
