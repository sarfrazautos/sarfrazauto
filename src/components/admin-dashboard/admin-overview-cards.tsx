"use client"

import { TrendingUp, PackageCheck, Clock } from "lucide-react"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function AdminOverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <TrendingUp className="size-8 text-neutral-700 stroke-[1.5]" />
          <CardDescription className="pt-7">Total Payment Earned</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rs. 18.4L
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              +Rs. 2.1L This Month
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <PackageCheck className="size-8 text-neutral-700 stroke-[1.5]" />
          <CardDescription className="pt-7">Orders Delivered</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            231
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              81% Completion Rate
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <Clock className="size-8 text-neutral-700 stroke-[1.5]" />
          <CardDescription className="pt-7">Pending Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            18
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
              Needs Attention
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}

export { AdminOverviewCards }
