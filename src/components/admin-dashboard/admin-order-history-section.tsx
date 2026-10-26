"use client"

import { useState } from "react"
import {
  PackageCheck,
  Clock,
  XCircle,
  Truck,
  RefreshCw,
  RotateCcw,
  Ban,
  Trash2,
  Loader2,
  PackageOpen,
  Search,
  AlertTriangle,
} from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdminPagination } from "@/components/admin-dashboard/admin-pagination"
import { getOrders, updateOrderStatus, deleteOrder } from "@/lib/api/orders"

export function AdminOrderHistorySection() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [orderToDelete, setOrderToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "orders",
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
  const stats = data?.stats || { delivered: 0, inProgress: 0, cancelledReturned: 0 }
  const totalPages = data?.pagination?.totalPages || 1

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingId(orderId)
      await updateOrderStatus(orderId, newStatus)
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success(`Order marked as ${newStatus}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return
    try {
      setIsDeleting(true)
      await deleteOrder(orderToDelete.id)
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Order deleted successfully")
      setOrderToDelete(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete order")
    } finally {
      setIsDeleting(false)
    }
  }

  const statusBadge = (status: string) => {
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
      return items.map((i: any) => `${i.name || "Part"} x${i.quantity || 1}`).join(", ")
    }
    return "Auto Parts Package"
  }

  const formatDate = (dateVal: any) => {
    if (!dateVal) return "—"
    try {
      const d = new Date(dateVal)
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    } catch {
      return "—"
    }
  }

  return (
    <div className="flex flex-col gap-5 px-4 lg:px-6 py-4 md:py-6 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Orders</h2>
          <p className="text-sm text-neutral-500 mt-1">Manage and track all retail and wholesale orders in real time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <Card className="@container/card border-neutral-200 shadow-2xs bg-white">
          <CardHeader>
            <PackageCheck className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Delivered Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
              {stats.delivered}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Successfully Completed
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card border-neutral-200 shadow-2xs bg-white">
          <CardHeader>
            <Clock className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Pending / Processing Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
              {stats.inProgress}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                In Progress
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card border-neutral-200 shadow-2xs bg-white">
          <CardHeader>
            <XCircle className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Cancelled / Returned</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
              {stats.cancelledReturned}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                Cancelled / Returned
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-8 h-8 text-xs bg-white"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {["All", "Delivered", "Processing", "Pending", "Cancelled", "Returned"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s)
                setCurrentPage(1)
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-neutral-700">Order ID</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Dealer / Customer</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Product</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Type</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Status</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Date</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700 text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-5 animate-spin text-neutral-400" />
                    <span className="text-xs">Loading orders...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageOpen className="size-8 text-neutral-300" />
                    <p className="text-xs font-medium text-neutral-700">No orders found</p>
                    <p className="text-[11px] text-neutral-400">
                      {searchQuery ? "Try a different search query" : "New customer and wholesale orders will appear here"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => {
                const isWholesale = (order.orderType || "").toLowerCase() === "wholesale"
                const isThisUpdating = updatingId === order.id

                return (
                  <TableRow key={order.id} className="text-xs hover:bg-neutral-50/70">
                    <TableCell className="font-mono text-neutral-600 font-medium">{order.orderNumber}</TableCell>
                    <TableCell className="font-medium text-neutral-900">
                      <div>
                        <p>{order.customerName}</p>
                        {order.customerCity && (
                          <p className="text-[10px] text-neutral-400">{order.customerCity}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-600 max-w-[180px] truncate">
                      {formatItems(order.items)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isWholesale
                            ? "bg-blue-50 text-blue-700 border-blue-200 text-xs"
                            : "bg-purple-50 text-purple-700 border-purple-200 text-xs"
                        }
                      >
                        {isWholesale ? "Wholesale" : "Retail"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-900 whitespace-nowrap">
                      Rs. {Number(order.totalAmount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>{statusBadge(order.status)}</TableCell>
                    <TableCell className="text-neutral-600 whitespace-nowrap">{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          disabled={isThisUpdating}
                          onClick={() => handleUpdateStatus(order.id, "delivered")}
                          title="Mark Delivered"
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            (order.status || "").toLowerCase() === "delivered"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                              : "hover:bg-emerald-50 text-neutral-500 hover:text-emerald-700 border-neutral-200 hover:border-emerald-300"
                          }`}
                        >
                          <Truck className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={isThisUpdating}
                          onClick={() => handleUpdateStatus(order.id, "processing")}
                          title="Mark Processing"
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            (order.status || "").toLowerCase() === "processing"
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                              : "hover:bg-blue-50 text-neutral-500 hover:text-blue-700 border-neutral-200 hover:border-blue-300"
                          }`}
                        >
                          <RefreshCw className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={isThisUpdating}
                          onClick={() => handleUpdateStatus(order.id, "cancelled")}
                          title="Mark Cancelled"
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            (order.status || "").toLowerCase() === "cancelled"
                              ? "bg-red-600 text-white border-red-600 shadow-2xs"
                              : "hover:bg-red-50 text-neutral-500 hover:text-red-700 border-neutral-200 hover:border-red-300"
                          }`}
                        >
                          <Ban className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={isThisUpdating}
                          onClick={() => handleUpdateStatus(order.id, "returned")}
                          title="Mark Returned"
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            (order.status || "").toLowerCase() === "returned"
                              ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                              : "hover:bg-purple-50 text-neutral-500 hover:text-purple-700 border-neutral-200 hover:border-purple-300"
                          }`}
                        >
                          <RotateCcw className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrderToDelete(order)}
                          title="Delete Order"
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <AlertDialog
        open={Boolean(orderToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setOrderToDelete(null)
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-red-600">
              <AlertTriangle className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order <span className="font-semibold text-neutral-900">{orderToDelete?.orderNumber}</span> ({orderToDelete?.customerName})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setOrderToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="flex items-center gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminOrderHistorySection
