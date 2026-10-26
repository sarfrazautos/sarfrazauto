"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, Eye, Search, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PaymentSlipDialog } from "./payment-slip-dialog"
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
import { getCustomerPayments } from "@/lib/api/customer-payments"

export interface PaymentRecord {
  id: string
  txnId: string
  date: string
  method: string
  bankName: string
  invoiceNumber: string
  amount: number
  status: "Cleared" | "In Processing" | "Failed"
}

export function PaymentHistorySection() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "customer-payments",
      {
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      },
    ],
    queryFn: () =>
      getCustomerPayments({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
      }),
  })

  const payments: PaymentRecord[] = data?.payments || []
  const stats = data?.stats || {
    totalCleared: "Rs. 0",
    inProcessing: "Rs. 0",
    totalTransactions: 0,
    pendingCount: 0,
  }
  const totalPages = data?.pagination?.totalPages || 1

  const getStatusBadge = (status: PaymentRecord["status"]) => {
    switch (status) {
      case "Cleared":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
            Cleared
          </Badge>
        )
      case "In Processing":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium">
            In Processing
          </Badge>
        )
      case "Failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/customer-portal" className="hover:text-neutral-900 transition-colors">
          Customer Portal
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">Payment History</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Payment History & Receipts
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Complete record of cleared bank transfers, cheques, and official payment receipts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="@container/card">
          <CardHeader>
            <CheckCircle2 className="size-8 text-emerald-600 stroke-[1.5]" />
            <CardDescription className="pt-7">Total Payments Cleared</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
              {isLoading ? <Skeleton className="h-8 w-32" /> : stats.totalCleared}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                {isLoading ? "..." : `${stats.totalTransactions} Transactions`}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <Clock className="size-8 text-neutral-700 stroke-[1.5]" />
            <CardDescription className="pt-7">Pending Verifications</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-neutral-900">
              {isLoading ? <Skeleton className="h-8 w-24" /> : `${stats.pendingCount || 0} Pending`}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-xs">
                {stats.pendingCount === 0 ? "Up to Date" : "Under Review"}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-4 border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search receipt, method, bank, invoice..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="h-8 text-xs"
            />
          </div>

          <div className="flex items-center gap-1">
            {["All", "Cleared", "In Processing"].map((st) => (
              <Button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st)
                  setCurrentPage(1)
                }}
                className={`cursor-pointer ${
                  statusFilter === st
                    ? ""
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
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
                <TableHead className="text-xs font-semibold text-neutral-700">Receipt / Txn ID</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Date</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Payment Channel & Bank</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Linked Invoice</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Amount Paid</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700">Status</TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700 text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-neutral-500">
                    No payment records found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id} className="text-xs hover:bg-neutral-50/70">
                    <TableCell className="font-semibold text-neutral-900 font-mono">
                      {payment.txnId}
                    </TableCell>
                    <TableCell className="text-neutral-600 whitespace-nowrap">
                      {payment.date}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">{payment.method}</span>
                        <span className="text-[11px] text-neutral-500">{payment.bankName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-600 font-mono text-[11px]">
                      {payment.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-700 whitespace-nowrap">
                      Rs. {payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs text-neutral-700 hover:text-neutral-900 border-neutral-200 cursor-pointer gap-1.5"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <Eye className="size-3.5" />
                        <span>View Slip</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="pt-2 border-t border-neutral-100">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <PaymentSlipDialog
        payment={selectedPayment}
        open={!!selectedPayment}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedPayment(null)
        }}
      />
    </div>
  )
}
