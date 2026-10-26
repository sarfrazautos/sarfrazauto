"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, Eye, Loader2, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminPagination } from "@/components/admin-dashboard/admin-pagination"
import { getOrders } from "@/lib/api/orders"

export function CustomerOrdersTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "customer-orders",
      {
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      },
    ],
    queryFn: () =>
      getOrders({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      }),
  })

  const orders = data?.orders || []
  const totalPages = data?.pagination?.totalPages || 1
  const total = data?.pagination?.total || 0

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "delivered") {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
          Delivered
        </Badge>
      )
    }
    if (s === "processing") {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
          Processing
        </Badge>
      )
    }
    if (s === "pending") {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium">
          Pending
        </Badge>
      )
    }
    if (s === "returned") {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-medium">
          Returned
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
        Cancelled
      </Badge>
    )
  }

  const formatItems = (items: any) => {
    if (Array.isArray(items) && items.length > 0) {
      return items.map((i: any) => `${i.name || i.title || "Part"} x${i.quantity || i.qty || 1}`).join(", ")
    }
    return "Motorcycle Spare Parts"
  }

  const formatDate = (dateVal: any) => {
    if (!dateVal) return "—"
    try {
      const d = new Date(dateVal)
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } catch {
      return "—"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input
            placeholder="Search order number or product..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "Delivered", "Processing", "Pending", "Cancelled"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s)
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-neutral-200 rounded-xl bg-white shadow-2xs overflow-x-auto">
        <Table>
          <TableHeader className="bg-neutral-50/70">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-neutral-700">Order ID</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Type</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Items / Description</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Total Amount</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Status</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Date</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-5 animate-spin text-neutral-400" />
                    <span className="text-xs text-neutral-500">Loading orders...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-xs text-neutral-500">
                  No orders found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((ord: any) => (
                <TableRow key={ord.id} className="text-xs hover:bg-neutral-50/50">
                  <TableCell className="font-mono font-medium text-neutral-900">
                    {ord.orderNumber}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-semibold tracking-wider ${
                        ord.orderType === "wholesale"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-neutral-100 text-neutral-700 border-neutral-200"
                      }`}
                    >
                      {ord.orderType || "retail"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[260px] truncate text-neutral-800">
                    {formatItems(ord.items)}
                  </TableCell>
                  <TableCell className="font-bold text-neutral-900 whitespace-nowrap">
                    Rs. {Number(ord.totalAmount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(ord.status)}</TableCell>
                  <TableCell className="text-neutral-500 whitespace-nowrap">
                    {formatDate(ord.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(ord)}
                      className="h-7 px-2.5 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer"
                    >
                      <Eye className="size-3.5 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-neutral-900">
              <Package className="size-5 text-red-600" />
              Order Details & Receipt
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="flex flex-col gap-4 mt-2 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm font-mono">{selectedOrder.orderNumber}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              <div className="p-3 bg-neutral-50/50 rounded-xl border border-neutral-100 flex flex-col gap-2">
                <span className="font-semibold text-neutral-800">Ordered Items:</span>
                {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-neutral-200/50 last:border-0">
                      <span className="text-neutral-700">{item.name || item.title || "Spare Part"}</span>
                      <span className="font-medium text-neutral-900">
                        x{item.quantity || item.qty || 1} — Rs. {Number(item.price || 0).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-neutral-500">Motorcycle Spare Parts Package</span>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                <span className="font-semibold text-neutral-700">Total Bill:</span>
                <span className="font-bold text-lg text-neutral-900">
                  Rs. {Number(selectedOrder.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
