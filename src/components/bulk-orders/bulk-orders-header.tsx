"use client"

import Link from "next/link"
import { PackagePlus, TrendingUp, Boxes, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiCoinsLight } from "react-icons/pi"

export function BulkOrdersHeader() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            My Bulk Purchases
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Track all master cartons bought from the wholesale portal, pending shipments, and commercial invoices.
          </p>
        </div>
        <Link href="/wholesale">
          <Button className="h-10 px-4 font-medium cursor-pointer shadow-xs">
            <PackagePlus className="w-4 h-4 mr-2" />
            Buy New Cartons
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="@container/card">
          <CardHeader>
            <PiCoinsLight className="size-10 opacity-80" />
            <CardDescription className="pt-5">Total Money Spent</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              Rs. 3.11M
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <TrendingUp className="size-3 text-emerald-600" />
                <span>+14.2%</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <Boxes className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Total Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
              24
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-xs">
                24 Orders
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <Clock className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Orders In Processing</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              2 Orders
            </CardTitle>
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
