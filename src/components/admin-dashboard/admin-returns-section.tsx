"use client"

import { useState } from "react"
import {
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
  Package,
  Boxes,
  Truck,
  RotateCcwIcon,
  Loader2,
} from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
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
import { getReturns, updateReturnStatus } from "@/lib/api/returns"

export function AdminReturnsSection() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedReturn, setSelectedReturn] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | number | null>(null)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "returns",
      {
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      },
    ],
    queryFn: () =>
      getReturns({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      }),
  })

  const returnsList = data?.returns || []
  const stats = data?.stats || { total: 0, inbound: 0, restocked: 0, totalValue: 0, efficiency: "98.5%" }
  const totalPages = data?.pagination?.totalPages || 1

  const handleUpdateStatus = async (id: string | number, newStatus: string) => {
    try {
      setUpdatingId(id)
      await updateReturnStatus(id, newStatus)
      queryClient.invalidateQueries({ queryKey: ["returns"] })
      toast.success(`Return status updated to ${newStatus}`)
      if (selectedReturn && (selectedReturn.id === id || selectedReturn.returnId === id)) {
        setSelectedReturn((prev: any) => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update return status")
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "restocked" || s === "refunded") {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium gap-1">
          <CheckCircle2 className="size-3" />
          {status}
        </Badge>
      )
    }
    if (s === "received") {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium gap-1">
          <Truck className="size-3" />
          Goods Received
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium gap-1">
        <Clock className="size-3" />
        Pending Receipt
      </Badge>
    )
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
      return String(dateVal)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 w-full bg-white">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Product Returns & RMA
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track customer and wholesale dealer returns, warehouse intake, and inventory restocking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Inbound Returns</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-3">{stats.inbound}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 inline-block">
            Goods in transit or awaiting intake
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Restocked to Inventory</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Boxes className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-3">{stats.restocked}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            Available back in stock
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Value Processed</span>
            <div className="p-2 rounded-xl bg-neutral-100 text-neutral-800">
              <RotateCcwIcon className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-3">
            Rs. {Number(stats.totalValue || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-500 font-medium mt-1 inline-block">
            Managed across Saddar & Hub branches
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Restock Efficiency</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Package className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-3">{stats.efficiency || "98.5%"}</p>
          <span className="text-[11px] text-blue-600 font-medium mt-1 inline-block">
            Resellable mint condition returns
          </span>
        </Card>
      </div>

      <Card className="rounded-2xl border bg-white pb-0">
        <CardHeader className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 px-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <Input
              placeholder="Search return ID, order, client..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["All", "Pending Receipt", "Received", "Restocked", "Refunded"].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={statusFilter === st ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter(st)
                  setCurrentPage(1)
                }}
                className="h-8 text-xs cursor-pointer rounded-xl"
              >
                {st}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-6 pt-0">
          <div className="overflow-x-auto rounded-xl border border-neutral-200/80">
            <Table>
              <TableHeader className="bg-neutral-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-neutral-700">Return ID & Date</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Order Ref</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Client / Dealer</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Product & Qty</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Return Value</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-xs text-neutral-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span>Loading return orders...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : returnsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-xs text-neutral-500">
                      No return orders found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  returnsList.map((r: any) => (
                    <TableRow key={r.id} className="text-xs hover:bg-neutral-50/50">
                      <TableCell>
                        <div className="font-semibold text-neutral-900">{r.returnId || r.id}</div>
                        <div className="text-[11px] text-neutral-400">{formatDate(r.submittedAt || r.createdAt)}</div>
                      </TableCell>
                      <TableCell className="font-mono text-neutral-700 font-medium">
                        {r.orderId}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-neutral-900">{r.client}</div>
                        <div className="text-[11px] text-neutral-500">{r.city} • {r.type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-neutral-800">{r.product}</div>
                        <div className="text-[11px] text-neutral-500">Qty: {r.quantity}</div>
                      </TableCell>
                      <TableCell className="font-bold text-neutral-900">
                        Rs. {Number(r.returnAmount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(r.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedReturn(r)}
                            className="h-7 px-2 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer"
                          >
                            Details
                          </Button>
                          {(r.status || "").toLowerCase() === "pending receipt" && (
                            <Button
                              size="sm"
                              disabled={updatingId === r.id}
                              onClick={() => handleUpdateStatus(r.id, "Received")}
                              className="h-7 px-2.5 text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                              Mark Received
                            </Button>
                          )}
                          {(r.status || "").toLowerCase() === "received" && (
                            <Button
                              size="sm"
                              disabled={updatingId === r.id}
                              onClick={() => handleUpdateStatus(r.id, "Restocked")}
                              className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                            >
                              Restock
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="py-4">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedReturn} onOpenChange={(open) => !open && setSelectedReturn(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-neutral-900">
              <RotateCcw className="size-5 text-red-600" />
              Return Details & Inspection
            </DialogTitle>
          </DialogHeader>

          {selectedReturn && (
            <div className="flex flex-col gap-4 mt-2 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm">{selectedReturn.product}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">{selectedReturn.returnId || selectedReturn.id} • Order: {selectedReturn.orderId}</p>
                </div>
                {getStatusBadge(selectedReturn.status)}
              </div>

              <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                <span className="text-neutral-400 text-[11px]">Client / Dealer</span>
                <p className="font-semibold text-neutral-900 mt-0.5">{selectedReturn.client} ({selectedReturn.city || "—"})</p>
                <p className="text-neutral-500 text-[11px]">Date Logged: {formatDate(selectedReturn.submittedAt || selectedReturn.createdAt)}</p>
              </div>

              <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                <span className="text-neutral-400 text-[11px]">Reason for Return</span>
                <p className="font-medium text-neutral-900 mt-1 leading-relaxed">{selectedReturn.reason || "No reason specified"}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/70">
                  <Package className="size-3" />
                  Condition: {selectedReturn.condition || "Inspection Pending"}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 font-semibold">
                <span className="text-neutral-600">Restock Credit Amount:</span>
                <span className="text-neutral-900 text-sm">Rs. {Number(selectedReturn.returnAmount || 0).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                {(selectedReturn.status || "").toLowerCase() === "pending receipt" && (
                  <Button
                    size="sm"
                    disabled={updatingId === selectedReturn.id}
                    onClick={() => handleUpdateStatus(selectedReturn.id, "Received")}
                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    Confirm Goods Received
                  </Button>
                )}
                {(selectedReturn.status || "").toLowerCase() === "received" && (
                  <Button
                    size="sm"
                    disabled={updatingId === selectedReturn.id}
                    onClick={() => handleUpdateStatus(selectedReturn.id, "Restocked")}
                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Restock To Inventory & Credit Account
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedReturn(null)}
                  className="h-8 text-xs cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminReturnsSection
