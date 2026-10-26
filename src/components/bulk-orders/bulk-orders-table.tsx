"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Eye, Download, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CommercialInvoiceReceiptDialog } from "@/components/commercial-invoices/commercial-invoice-receipt-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface BulkOrder {
  id: string
  date: string
  items: string
  cartonCount: number
  totalAmount: number
  status: "In Transit" | "Processing" | "Delivered"
}

const initialOrders: BulkOrder[] = [
  {
    id: "BO-9482",
    date: "24 Sep 2026",
    items: "Complete 70cc Cylinder Head Assembly",
    cartonCount: 24,
    totalAmount: 620000,
    status: "In Transit",
  },
  {
    id: "BO-9420",
    date: "22 Sep 2026",
    items: "Crown Heavy Duty Clutch Plate Set (5 Pcs)",
    cartonCount: 40,
    totalAmount: 445000,
    status: "In Transit",
  },
  {
    id: "BO-9391",
    date: "21 Sep 2026",
    items: "125cc Piston & Ring Kits (Standard)",
    cartonCount: 60,
    totalAmount: 890000,
    status: "Processing",
  },
  {
    id: "BO-9350",
    date: "18 Sep 2026",
    items: "Heavy Duty Alloy Wheel Rim Hub Assembly",
    cartonCount: 18,
    totalAmount: 385000,
    status: "Delivered",
  },
  {
    id: "BO-9304",
    date: "15 Sep 2026",
    items: "CD70 Performance Crankshaft Assembly",
    cartonCount: 32,
    totalAmount: 768000,
    status: "Delivered",
  },
]

export function BulkOrdersTable() {
  const [orders, setOrders] = useState<BulkOrder[]>(initialOrders)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [selectedOrder, setSelectedOrder] = useState<BulkOrder | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadBulkOrders() {
      try {
        const res = await fetch("/api/customer/bulk-orders")
        const data = await res.json()
        if (data?.success && Array.isArray(data?.bulkOrders) && isMounted) {
          setOrders(data.bulkOrders)
        }
      } catch (err) {
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadBulkOrders()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "All" ? true : order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: BulkOrder["status"]) => {
    switch (status) {
      case "In Transit":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
            In Transit
          </Badge>
        )
      case "Processing":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
            Processing
          </Badge>
        )
      case "Delivered":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
            Delivered
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "In Transit", "Processing", "Delivered"].map((tab) => (
            <Button
              key={tab}
              variant={statusFilter === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab)}
              className="text-xs h-8 px-3 cursor-pointer shrink-0"
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or Product..."
            className="pl-9 h-9 text-xs sm:text-sm bg-white"
          />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/70 hover:bg-neutral-50/70">
              <TableHead className="font-semibold text-neutral-700 text-xs py-3.5">Order ID</TableHead>
              <TableHead className="font-semibold text-neutral-700 text-xs">Date</TableHead>
              <TableHead className="font-semibold text-neutral-700 text-xs">Master Cartons & Product</TableHead>
              <TableHead className="font-semibold text-neutral-700 text-xs text-right">Amount (PKR)</TableHead>
              <TableHead className="font-semibold text-neutral-700 text-xs text-center">Status</TableHead>
              <TableHead className="font-semibold text-neutral-700 text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-neutral-500 text-sm">
                  No bulk orders match your query.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-neutral-50/50">
                  <TableCell className="font-bold text-neutral-900 text-xs sm:text-sm">
                    #{order.id}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-500 whitespace-nowrap">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-xs">
                    <p className="font-semibold text-neutral-900">{order.cartonCount} Master Cartons</p>
                    <p className="text-neutral-500 line-clamp-1">{order.items}</p>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-neutral-900 text-right whitespace-nowrap">
                    Rs. {order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 text-xs text-neutral-700 hover:text-neutral-900 border-neutral-200 cursor-pointer gap-1.5"
                        onClick={() => setSelectedOrder(order)}
                        title="View Commercial Tax Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Invoice
                      </Button>
                      <Link href="/wholesale">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CommercialInvoiceReceiptDialog
        invoice={
          selectedOrder
            ? {
                id: selectedOrder.id,
                invoiceNumber: `INV-2026-${selectedOrder.id.replace("BO-", "")}`,
                orderNumber: selectedOrder.id,
                issueDate: selectedOrder.date,
                dueDate: "15 Days Credit",
                itemsSummary: `${selectedOrder.cartonCount} Master Cartons - ${selectedOrder.items}`,
                amount: selectedOrder.totalAmount,
                status: selectedOrder.status === "Delivered" ? "Paid" : "Pending",
              }
            : null
        }
        open={!!selectedOrder}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedOrder(null)
        }}
      />
    </div>
  )
}
