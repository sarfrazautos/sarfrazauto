"use client"

import { useState } from "react"
import {
  Inbox,
  Clock,
  CheckCircle2,
  Search,
  Eye,
  Trash2,
  Loader2,
  Mail,
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
import { ContactInquiryDetailDialog } from "./contact-inquiry-detail-dialog"
import { getMessages, updateMessageStatus, deleteMessage } from "@/lib/api/messages"

export function AdminContactInquiriesSection() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)
  const [messageToDelete, setMessageToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "messages",
      {
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      },
    ],
    queryFn: () =>
      getMessages({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      }),
  })

  const inquiries = data?.messages || []
  const stats = data?.stats || { total: 0, newCount: 0, repliedCount: 0 }
  const totalPages = data?.pagination?.totalPages || 1

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await updateMessageStatus(id, newStatus.toLowerCase())
      queryClient.invalidateQueries({ queryKey: ["messages"] })
      toast.success(`Message marked as ${newStatus}`)
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev: any) => ({ ...prev, status: newStatus.toLowerCase() }))
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status")
    }
  }

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return
    try {
      setIsDeleting(true)
      await deleteMessage(messageToDelete.id)
      queryClient.invalidateQueries({ queryKey: ["messages"] })
      toast.success("Message deleted successfully")
      setMessageToDelete(null)
      if (selectedInquiry && selectedInquiry.id === messageToDelete.id) {
        setSelectedInquiry(null)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete message")
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "new") {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium gap-1">
          <Clock className="size-3" />
          New
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium gap-1">
        <CheckCircle2 className="size-3" />
        Replied
      </Badge>
    )
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
    <div className="flex flex-col gap-5 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Contact Messages & Inquiries
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Inquiries and parts consultation requests submitted from the website contact form.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <Card className="@container/card border-neutral-200 shadow-2xs bg-white">
          <CardHeader>
            <Inbox className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Total Messages</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
              {stats.total}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-200 text-xs">
                Inbox
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card border-neutral-200 shadow-2xs bg-white">
          <CardHeader>
            <Clock className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">New Inquiries</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
              {stats.newCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                Needs Response
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card border-neutral-200 shadow-2xs bg-white">
          <CardHeader>
            <CheckCircle2 className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Replied / Resolved</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
              {stats.repliedCount}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Completed
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
              placeholder="Search name, email, phone, message..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8 h-8 text-xs bg-white"
            />
          </div>

          <div className="flex items-center gap-1">
            {["All", "New", "Replied"].map((st) => (
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
                <TableHead className="text-xs font-semibold text-neutral-700">Sender</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Contact</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Shop Name</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Message Preview</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Received</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Status</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-5 animate-spin text-neutral-400" />
                      <span className="text-xs">Loading inquiries...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-neutral-500 text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Mail className="size-8 text-neutral-300" />
                      <p className="font-medium text-neutral-700">No contact messages found</p>
                      <p className="text-[11px] text-neutral-400">
                        {searchQuery ? "Try a different search query" : "Messages submitted via the contact form will appear here"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((m: any) => (
                  <TableRow key={m.id} className="text-xs hover:bg-neutral-50/70">
                    <TableCell>
                      <div className="font-semibold text-neutral-900">{m.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">MSG-{m.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-neutral-800">{m.phone || "—"}</div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-[150px]">{m.email}</div>
                    </TableCell>
                    <TableCell className="text-neutral-700">
                      {m.shopName || <span className="text-neutral-400">Individual</span>}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate text-neutral-600">
                      {m.message}
                    </TableCell>
                    <TableCell className="text-neutral-500 whitespace-nowrap">
                      {formatDate(m.createdAt)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(m.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-xs text-neutral-700 hover:text-neutral-900 border-neutral-200 cursor-pointer gap-1.5"
                          onClick={() => setSelectedInquiry(m)}
                        >
                          <Eye className="size-3.5" />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setMessageToDelete(m)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
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

      <ContactInquiryDetailDialog
        inquiry={selectedInquiry}
        open={Boolean(selectedInquiry)}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedInquiry(null)
        }}
        onStatusChange={updateStatus}
      />

      <AlertDialog
        open={Boolean(messageToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setMessageToDelete(null)
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-red-600">
              <AlertTriangle className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete inquiry from <span className="font-semibold text-neutral-900">{messageToDelete?.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setMessageToDelete(null)}
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

export default AdminContactInquiriesSection
