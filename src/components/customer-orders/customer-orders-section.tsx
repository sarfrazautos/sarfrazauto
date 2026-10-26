"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CustomerOrdersHeader } from "./customer-orders-header"
import { CustomerOrdersTable } from "./customer-orders-table"

export function CustomerOrdersSection() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/customer-portal" className="hover:text-neutral-900 transition-colors">
          Customer Portal
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">My Orders</span>
      </div>

      <CustomerOrdersHeader />
      <CustomerOrdersTable />
    </div>
  )
}
