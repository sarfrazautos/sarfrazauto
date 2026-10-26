"use client"

import { useState } from "react"
import {
  Clock,
  UserCheck,
  XCircle,
  Search,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Eye,
  Mail,
  Loader2,
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
import { AdminPagination } from "@/components/admin-dashboard/admin-pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getDealerRequests, updateDealerRequestStatus } from "@/lib/api/dealer-requests"

export function AdminDealerRequestsSection() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedDealer, setSelectedDealer] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | string | null>(null)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "dealer-requests",
      {
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      },
    ],
    queryFn: () =>
      getDealerRequests({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      }),
  })

  const requests = data?.requests || []
  const stats = data?.stats || { total: 0, pending: 0, approved: 0, rejected: 0 }
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
    <div className="flex flex-col gap-5 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Wholesale Dealer Requests
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Review and approve dealer registration applications for wholesale pricing access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <Clock className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Pending Approvals</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.pending}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                Requires Action
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <UserCheck className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Approved Dealers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.approved}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Active Wholesalers
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <XCircle className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Rejected Applications</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.rejected}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-200 text-xs">
                Declined
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-4 border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <Input
              placeholder="Search shop, owner, city, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="flex items-center gap-1">
            {["All", "Pending", "Approved", "Rejected"].map((st) => (
              <Button
                key={st}
                type="button"
                size="sm"
                variant={statusFilter === st ? "default" : "outline"}
                onClick={() => {
                  setStatusFilter(st)
                  setCurrentPage(1)
                }}
                className="h-8 text-xs cursor-pointer"
              >
                {st}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
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
                  <TableCell colSpan={7} className="text-center py-8 text-neutral-500 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Loading dealer requests...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-neutral-500 text-xs">
                    No dealer applications match your search.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((r: any) => (
                  <TableRow key={r.id} className="text-xs hover:bg-neutral-50/70">
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
                        {(r.status || "").toLowerCase() === "approved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === r.id}
                            className="h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={() => updateStatus(r.id, "Rejected")}
                          >
                            Revoke
                          </Button>
                        )}
                        {(r.status || "").toLowerCase() === "rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === r.id}
                            className="h-7 px-2 text-[11px] text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            onClick={() => updateStatus(r.id, "Approved")}
                          >
                            Re-Approve
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
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <Dialog open={!!selectedDealer} onOpenChange={(open: boolean) => !open && setSelectedDealer(null)}>
        <DialogContent className="sm:max-w-lg border border-neutral-200 shadow-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-neutral-900 flex items-center justify-between pr-6">
              <span>Dealer Application Details</span>
              {selectedDealer && getStatusBadge(selectedDealer.status)}
            </DialogTitle>
          </DialogHeader>
          {selectedDealer && (
            <div className="flex flex-col gap-4 text-xs mt-2">
              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100 flex items-start gap-3">
                <div className="size-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{selectedDealer.shopName}</h4>
                  <p className="text-neutral-500">Owner: {selectedDealer.ownerName}</p>
                  <p className="text-neutral-400 font-mono text-[11px]">Application ID: {selectedDealer.requestId || selectedDealer.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-neutral-100">
                <div>
                  <span className="text-neutral-500">Phone / WhatsApp</span>
                  <p className="font-semibold text-neutral-900 mt-0.5 flex items-center gap-1">
                    <Phone className="size-3 text-neutral-400" />
                    {selectedDealer.phone}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Email Address</span>
                  <p className="font-medium text-neutral-900 mt-0.5 flex items-center gap-1 truncate">
                    <Mail className="size-3 text-neutral-400 shrink-0" />
                    {selectedDealer.email}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">City / District</span>
                  <p className="font-semibold text-neutral-900 mt-0.5 flex items-center gap-1">
                    <MapPin className="size-3 text-neutral-400" />
                    {selectedDealer.city}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Submitted Date</span>
                  <p className="font-medium text-neutral-900 mt-0.5">{formatDate(selectedDealer.submittedAt || selectedDealer.createdAt)}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Owner CNIC</span>
                  <p className="font-mono font-medium text-neutral-900 mt-0.5">{selectedDealer.cnic || "—"}</p>
                </div>
                <div>
                  <span className="text-neutral-500">FBR NTN Number</span>
                  <p className="font-mono font-medium text-neutral-900 mt-0.5">{selectedDealer.ntn || "Unregistered"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">Shop Physical Address</span>
                  <p className="font-medium text-neutral-800 mt-0.5">{selectedDealer.address || "—"}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                {(selectedDealer.status || "").toLowerCase() === "pending" ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === selectedDealer.id}
                      className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer text-xs"
                      onClick={() => updateStatus(selectedDealer.id, "Rejected")}
                    >
                      <XCircle className="size-3.5 mr-1" /> Reject Request
                    </Button>
                    <Button
                      size="sm"
                      disabled={updatingId === selectedDealer.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs"
                      onClick={() => updateStatus(selectedDealer.id, "Approved")}
                    >
                      <CheckCircle2 className="size-3.5 mr-1" /> Approve Dealer
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer text-xs"
                    onClick={() => setSelectedDealer(null)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminDealerRequestsSection
