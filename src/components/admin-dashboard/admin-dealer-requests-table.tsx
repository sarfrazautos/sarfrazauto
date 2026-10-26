"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Eye,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
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
import { getDealerRequests, updateDealerRequestStatus } from "@/lib/api/dealer-requests"

export function AdminDealerRequestsTable() {
  const queryClient = useQueryClient()
  const [selectedDealer, setSelectedDealer] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | number | null>(null)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "dealer-requests",
      {
        page: currentPage,
        limit,
      },
    ],
    queryFn: () =>
      getDealerRequests({
        page: currentPage,
        limit,
      }),
  })

  const requests = data?.requests || []
  const totalPages = data?.pagination?.totalPages || 1

  const updateStatus = async (id: string | number, newStatus: "Approved" | "Rejected") => {
    try {
      setUpdatingId(id)
      await updateDealerRequestStatus(id, newStatus)
      queryClient.invalidateQueries({ queryKey: ["dealer-requests"] })
      toast.success(`Dealer request marked as ${newStatus}`)
      if (selectedDealer && (selectedDealer.id === id || selectedDealer.requestId === id)) {
        setSelectedDealer((prev: any) => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update dealer request status")
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "approved") {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium gap-1">
          <CheckCircle2 className="size-3" />
          Approved
        </Badge>
      )
    }
    if (s === "pending") {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium gap-1">
          <Clock className="size-3" />
          Pending
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium gap-1">
        <XCircle className="size-3" />
        Rejected
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
    <>
      <Card className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
          <div>
            <CardTitle className="text-base font-semibold text-neutral-900">
              Dealer Verification Requests
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500 mt-0.5">
              Wholesale applicants awaiting validation for trade discount accounts.
            </CardDescription>
          </div>
          <Link href="/admin/dealer-requests">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              View All Requests
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto border-t border-neutral-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50/50 hover:bg-neutral-50/50">
                  <TableHead className="text-xs font-semibold text-neutral-700">Shop / Business</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Owner Name</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Contact & City</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">CNIC / NTN</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Date</TableHead>
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
                        <span>Loading dealer requests...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-xs text-neutral-500">
                      No dealer verification requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((r: any) => (
                    <TableRow key={r.id} className="text-xs hover:bg-neutral-50/50">
                      <TableCell>
                        <div className="font-semibold text-neutral-900">{r.shopName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{r.requestId || r.id}</div>
                      </TableCell>
                      <TableCell className="text-neutral-700 font-medium">
                        {r.ownerName}
                      </TableCell>
                      <TableCell>
                        <div className="text-neutral-800 font-medium">{r.phone}</div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3" />
                          {r.city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-neutral-700 text-[11px]">{r.cnic || "—"}</div>
                        <div className="text-[11px] text-neutral-400">NTN: {r.ntn || "Unregistered"}</div>
                      </TableCell>
                      <TableCell className="text-neutral-600 whitespace-nowrap">
                        {formatDate(r.submittedAt || r.createdAt)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(r.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer"
                            onClick={() => setSelectedDealer(r)}
                          >
                            <Eye className="size-3.5 mr-1" />
                            View
                          </Button>
                          {(r.status || "").toLowerCase() === "pending" && (
                            <>
                              <Button
                                size="sm"
                                disabled={updatingId === r.id}
                                className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                onClick={() => updateStatus(r.id, "Approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={updatingId === r.id}
                                className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                                onClick={() => updateStatus(r.id, "Rejected")}
                              >
                                Reject
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
            <div className="py-2">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedDealer} onOpenChange={(open) => !open && setSelectedDealer(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-neutral-900">
              <Building2 className="size-5 text-neutral-700" />
              Dealer Application Details
            </DialogTitle>
          </DialogHeader>

          {selectedDealer && (
            <div className="space-y-4 pt-2">
              <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-neutral-900 text-sm">{selectedDealer.shopName}</h4>
                    <p className="text-xs text-neutral-500">Applicant: {selectedDealer.ownerName}</p>
                  </div>
                  {getStatusBadge(selectedDealer.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-neutral-200/60">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Phone className="size-3.5 text-neutral-400" />
                    <span>{selectedDealer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <MapPin className="size-3.5 text-neutral-400" />
                    <span>{selectedDealer.city}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-neutral-600">
                    <Mail className="size-3.5 text-neutral-400" />
                    <span className="truncate">{selectedDealer.email}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-100 p-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">CNIC Number:</span>
                  <span className="font-mono text-neutral-800">{selectedDealer.cnic || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">NTN Registration:</span>
                  <span className="font-mono text-neutral-800">{selectedDealer.ntn || "Unregistered"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Application Date:</span>
                  <span className="text-neutral-800">{formatDate(selectedDealer.submittedAt || selectedDealer.createdAt)}</span>
                </div>
                <div className="flex flex-col py-1">
                  <span className="text-neutral-500 mb-0.5">Physical Address:</span>
                  <span className="text-neutral-800 font-medium">{selectedDealer.address || "—"}</span>
                </div>
              </div>

              {(selectedDealer.status || "").toLowerCase() === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    disabled={updatingId === selectedDealer.id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs"
                    onClick={() => updateStatus(selectedDealer.id, "Approved")}
                  >
                    <CheckCircle2 className="size-3.5 mr-1" />
                    Approve Dealer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === selectedDealer.id}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50 cursor-pointer text-xs"
                    onClick={() => updateStatus(selectedDealer.id, "Rejected")}
                  >
                    <XCircle className="size-3.5 mr-1" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AdminDealerRequestsTable
