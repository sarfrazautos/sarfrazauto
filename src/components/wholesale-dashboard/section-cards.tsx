"use client"

import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingBag, Clock } from "lucide-react"
import { PiCoinsLight } from "react-icons/pi"

export function SectionCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["customer-dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/customer/dashboard")
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch stats")
      }
      return json
    },
  })

  const stats = data?.stats

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card bg-white shadow-2xs">
        <CardHeader>
          <PiCoinsLight className="size-8 text-neutral-700 opacity-80" />
          <CardDescription className="pt-7">Total Money Spent</CardDescription>
          <div className="mt-1">
            {isLoading ? (
              <Skeleton className="h-8 w-32 rounded-lg" />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
                {stats?.totalMoneySpent || "Rs. 0"}
              </CardTitle>
            )}
          </div>
          <CardAction>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              {stats?.monthlyIncrease || "+14.8% This Month"}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-white shadow-2xs">
        <CardHeader>
          <ShoppingBag className="size-8 text-neutral-700 stroke-[1.5]" />
          <CardDescription className="pt-7">Total Purchases</CardDescription>
          <div className="mt-1">
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
                {stats?.totalPurchases || "0 Orders"}
              </CardTitle>
            )}
          </div>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              Retail + Wholesale
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card bg-white shadow-2xs">
        <CardHeader>
          <Clock className="size-8 text-neutral-700 stroke-[1.5]" />
          <CardDescription className="pt-7">Orders In Processing</CardDescription>
          <div className="mt-1">
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
                {stats?.ordersInProcessing || "0 Orders"}
              </CardTitle>
            )}
          </div>
          <CardAction>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
              Processing
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
