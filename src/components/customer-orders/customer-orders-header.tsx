"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { PackagePlus, TrendingUp, Boxes, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PiCoinsLight } from "react-icons/pi"

export function CustomerOrdersHeader() {
  const { data, isLoading } = useQuery({
    queryKey: ["customer-dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/customer/dashboard")
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch dashboard stats")
      }
      return json
    },
  })

  const stats = data?.stats

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            My Orders
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Track all your retail spare parts purchases, wholesale bookings, and delivery status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/retail">
            <Button variant="outline" className="h-10 px-4 font-medium cursor-pointer shadow-2xs">
              Retail Catalog
            </Button>
          </Link>
          <Link href="/wholesale">
            <Button className="h-10 px-4 font-medium cursor-pointer shadow-2xs bg-neutral-900 hover:bg-neutral-800 text-white">
              <PackagePlus className="w-4 h-4 mr-2" />
              Wholesale Portal
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="@container/card">
          <CardHeader>
            <PiCoinsLight className="size-10 opacity-80" />
            <CardDescription className="pt-5">Total Money Spent</CardDescription>
            <div className="mt-1">
              {isLoading ? (
                <Skeleton className="h-8 w-32 rounded-lg" />
              ) : (
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {stats?.totalMoneySpent || "Rs. 0"}
                </CardTitle>
              )}
            </div>
            <CardAction>
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <TrendingUp className="size-3 text-emerald-600" />
                <span>Active Ledger</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <Boxes className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Total Orders</CardDescription>
            <div className="mt-1">
              {isLoading ? (
                <Skeleton className="h-8 w-24 rounded-lg" />
              ) : (
                <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
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

        <Card className="@container/card">
          <CardHeader>
            <Clock className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Orders In Processing</CardDescription>
            <div className="mt-1">
              {isLoading ? (
                <Skeleton className="h-8 w-24 rounded-lg" />
              ) : (
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
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
    </div>
  )
}
