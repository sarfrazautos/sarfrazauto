"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Eye, Loader2 } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { getPayments, updatePaymentStatus } from "@/lib/api/payments"

export function AdminPaymentManagementSection() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | string | null>(null)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "payments",
      {
        page: currentPage,
        limit,
        search: searchQuery,
        status: filter === "All" ? "" : filter.toLowerCase(),
      },
    ],
    queryFn: () =>
      getPayments({
        page: currentPage,
        limit,
        search: searchQuery,
        status: filter === "All" ? "" : filter.toLowerCase(),
      }),
  })

  const payments = data?.payments || []
  const stats = data?.stats || { total: 0, pending: 0, approved: 0, rejected: 0 }
  const totalPages = data?.pagination?.totalPages || 1

  const updateStatus = async (id: number | string, newStatus: "Approved" | "Rejected") => {
    try {
      setUpdatingId(id)
      await updatePaymentStatus(id, newStatus)
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      toast.success(`Payment marked as ${newStatus}`)
      if (selectedPayment && (selectedPayment.id === id || selectedPayment.paymentNumber === id)) {
        setSelectedPayment((prev: any) => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment status")
    } finally {
      setUpdatingId(null)
    }
  }

  const statusBadge = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "approved") return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">Approved</Badge>
    if (s === "rejected") return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Rejected</Badge>
    return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Pending</Badge>
  }

  const formatDate = (dateVal: any) => {
    if (!dateVal) return "—"
    try {
      const d = new Date(dateVal)
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "—"
    }
  }

  return (
    <div className="flex flex-col gap-5 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Payment Management</h2>
          <p className="text-sm text-neutral-500 mt-1">Review payment screenshots and approve or reject customer payments.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span className="font-semibold text-amber-700">
            {stats.pending} payments awaiting review
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-64">
          <Input
            placeholder="Search by customer, payment ID, order..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-1">
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f)
                setCurrentPage(1)
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${filter === f ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-neutral-200 rounded-xl bg-white shadow-xs overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-neutral-700">Payment ID</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Customer Name</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Order ID</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Method</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Submitted</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Status</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading payments...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-xs text-neutral-500">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment: any) => (
                <TableRow key={payment.id} className="text-xs hover:bg-neutral-50/70">
                  <TableCell className="font-mono text-neutral-600">{payment.paymentNumber || payment.id}</TableCell>
                  <TableCell className="font-medium text-neutral-900">{payment.customerName}</TableCell>
                  <TableCell className="font-mono text-neutral-600">{payment.orderNumber || "—"}</TableCell>
                  <TableCell className="font-semibold text-neutral-900 whitespace-nowrap">
                    Rs. {Number(payment.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-neutral-600">{payment.method}</TableCell>
                  <TableCell className="text-neutral-600 whitespace-nowrap">{formatDate(payment.submittedAt || payment.createdAt)}</TableCell>
                  <TableCell>{statusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 cursor-pointer"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <Eye className="size-3.5 text-neutral-500" />
                      </Button>
                      {(payment.status || "").toLowerCase() === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={updatingId === payment.id}
                            className="h-7 w-7 p-0 cursor-pointer"
                            onClick={() => updateStatus(payment.id, "Approved")}
                          >
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={updatingId === payment.id}
                            className="h-7 w-7 p-0 cursor-pointer"
                            onClick={() => updateStatus(payment.id, "Rejected")}
                          >
                            <XCircle className="size-3.5 text-red-500" />
                          </Button>
                        </>
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
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-neutral-900">Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="flex flex-col gap-3">
              <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-200">
                {selectedPayment.screenshotUrl ? (
                  <img
                    src={selectedPayment.screenshotUrl}
                    alt="Payment Screenshot"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-xs text-neutral-500 font-medium">Payment Screenshot</p>
                    <p className="text-[11px] text-neutral-400">{selectedPayment.method || "Bank Transfer"}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-neutral-500">Payment ID</span>
                  <p className="font-mono font-medium mt-0.5">{selectedPayment.paymentNumber || selectedPayment.id}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Amount</span>
                  <p className="font-semibold text-neutral-900 mt-0.5">
                    Rs. {Number(selectedPayment.amount || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Customer Name</span>
                  <p className="font-medium text-neutral-900 mt-0.5">{selectedPayment.customerName}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Method</span>
                  <p className="font-medium text-neutral-900 mt-0.5">{selectedPayment.method}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">Submitted At</span>
                  <p className="font-medium text-neutral-900 mt-0.5">{formatDate(selectedPayment.submittedAt || selectedPayment.createdAt)}</p>
                </div>
              </div>
              {(selectedPayment.status || "").toLowerCase() === "pending" && (
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    disabled={updatingId === selectedPayment.id}
                    className="flex-1 h-8 text-xs cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => updateStatus(selectedPayment.id, "Approved")}
                  >
                    <CheckCircle2 className="size-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === selectedPayment.id}
                    className="flex-1 h-8 text-xs cursor-pointer text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => updateStatus(selectedPayment.id, "Rejected")}
                  >
                    <XCircle className="size-3.5 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminPaymentManagementSection
