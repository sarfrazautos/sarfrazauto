"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, Eye, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CommercialInvoiceReceiptDialog } from "./commercial-invoice-receipt-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdminPagination } from "@/components/admin-dashboard/admin-pagination"
import { getInvoices } from "@/lib/api/invoices"

export function CommercialInvoicesSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "commercial-invoices",
      {
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      },
    ],
    queryFn: () =>
      getInvoices({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      }),
  })

  const invoices = data?.invoices || []
  const totalPages = data?.pagination?.totalPages || 1

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase()
    if (s === "paid") {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
          Paid
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
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
        Overdue
      </Badge>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/customer-portal" className="hover:text-neutral-900 transition-colors">
          Customer Portal
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">Commercial Invoices</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Commercial Invoices
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Download and view official sales invoices and tax billing records for wholesale and retail orders.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <Input
              placeholder="Search invoice or order #..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 h-8 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {["All", "Paid", "Pending", "Overdue"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-50/70">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-neutral-700">Invoice #</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Order #</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Issue Date</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Items Summary</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Amount</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Status</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700 text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-5 animate-spin text-neutral-400" />
                      <span className="text-xs text-neutral-500">Loading invoices...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-36 text-center text-xs text-neutral-500">
                    No commercial invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((inv: any) => (
                  <TableRow key={inv.id} className="text-xs hover:bg-neutral-50/50">
                    <TableCell className="font-semibold text-neutral-900 font-mono">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-neutral-600 font-mono text-[11px]">
                      {inv.orderNumber}
                    </TableCell>
                    <TableCell className="text-neutral-600 whitespace-nowrap">
                      {inv.issueDate}
                    </TableCell>
                    <TableCell className="text-neutral-700 font-medium max-w-[240px] truncate">
                      {inv.itemsSummary}
                    </TableCell>
                    <TableCell className="font-bold text-neutral-900 whitespace-nowrap">
                      Rs. {Number(inv.amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inv.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs text-neutral-700 hover:text-neutral-900 border-neutral-200 cursor-pointer gap-1.5"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <Eye className="size-3.5" />
                        <span>View</span>
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
      </div>

      <CommercialInvoiceReceiptDialog
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedInvoice(null)
        }}
      />
    </div>
  )
}
