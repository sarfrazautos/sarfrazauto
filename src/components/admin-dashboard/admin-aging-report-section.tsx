"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Clock,
  Search,
  Send,
  FileSpreadsheet,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
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
import { getAgingReports } from "@/lib/api/aging-reports"

export function AdminAgingReportSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReminder, setSelectedReminder] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["aging-reports", currentPage, searchQuery],
    queryFn: () =>
      getAgingReports({
        page: currentPage,
        limit: 20,
        search: searchQuery,
      }),
  })

  const agingData = data?.agingData || []
  const stats = data?.stats || {
    totalOutstanding: 0,
    days0_30: 0,
    days31_60: 0,
    days61_90: 0,
    days90Plus: 0,
    totalDealers: 0,
  }
  const totalPages = data?.pagination?.totalPages || 1
  const total = data?.pagination?.total || 0

  const handleCopyReminder = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportCSV = () => {
    if (!agingData.length) return
    const headers = [
      "Dealer Code",
      "Dealer Name",
      "City",
      "Credit Limit",
      "Total Due",
      "0-30 Days",
      "31-60 Days",
      "61-90 Days",
      "90+ Days",
      "Last Payment",
      "Status",
      "Phone",
    ]
    const rows = agingData.map((d: any) => [
      `"${d.dealerCode || ""}"`,
      `"${d.dealerName || ""}"`,
      `"${d.city || ""}"`,
      d.creditLimit || 0,
      d.totalDue || 0,
      d.days0_30 || 0,
      d.days31_60 || 0,
      d.days61_90 || 0,
      d.days90Plus || 0,
      `"${d.lastPayment || ""}"`,
      `"${d.status || ""}"`,
      `"${d.phone || ""}"`,
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e: any) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `aging_report_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 w-full bg-white">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Accounts Receivable Aging Report
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Track overdue dealer credit balances, payment cycles (30, 60, 90+ days), and cashflow risk.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="h-9 text-xs gap-1.5 cursor-pointer rounded-xl border-neutral-300"
        >
          <FileSpreadsheet className="size-3.5 text-neutral-600" />
          <span>Export Ledger Aging</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <Card className="rounded-2xl border bg-white p-4.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Total Outstanding
          </span>
          <p className="text-2xl font-bold text-neutral-900 mt-2">
            Rs. {Number(stats.totalOutstanding || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-500 font-medium mt-1 inline-block">
            Across active wholesale accounts
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-4.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            0 – 30 Days (Current)
          </span>
          <p className="text-xl font-bold text-neutral-900 mt-2">
            Rs. {Number(stats.days0_30 || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            Standard payment credit cycle
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-4.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-amber-500" />
            31 – 60 Days (Due)
          </span>
          <p className="text-xl font-bold text-neutral-900 mt-2">
            Rs. {Number(stats.days31_60 || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 inline-block">
            First reminder notice zone
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-4.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-orange-500" />
            61 – 90 Days (Overdue)
          </span>
          <p className="text-xl font-bold text-neutral-900 mt-2">
            Rs. {Number(stats.days61_90 || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-orange-600 font-medium mt-1 inline-block">
            Urgent settlement required
          </span>
        </Card>

        <Card className="rounded-2xl border border-red-200 bg-red-50/30 p-4.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-red-600 animate-pulse" />
            90+ Days (Critical)
          </span>
          <p className="text-xl font-bold text-red-600 mt-2">
            Rs. {Number(stats.days90Plus || 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-red-600 font-medium mt-1 inline-block">
            Credit hold / Stop dispatches
          </span>
        </Card>
      </div>

      <Card className="rounded-2xl border bg-white pb-0">
        <CardHeader className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 px-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <Input
              placeholder="Search dealer, city, code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <span className="text-xs text-neutral-500 font-medium">
            Showing {agingData.length} of {total} Dealers with Ledger Balances
          </span>
        </CardHeader>
        <CardContent className="px-6 pt-0">
          <div className="overflow-x-auto rounded-xl border border-neutral-200/80">
            <Table>
              <TableHeader className="bg-neutral-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-neutral-700">Dealer Name & Code</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">City</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Credit Limit</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Total Outstanding</TableHead>
                  <TableHead className="text-xs font-semibold text-emerald-700">0 – 30 Days</TableHead>
                  <TableHead className="text-xs font-semibold text-amber-700">31 – 60 Days</TableHead>
                  <TableHead className="text-xs font-semibold text-orange-700">61 – 90 Days</TableHead>
                  <TableHead className="text-xs font-semibold text-red-700">90+ Days</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="size-6 animate-spin text-neutral-400" />
                        <span className="text-xs text-neutral-500">Loading aging records...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : agingData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-40 text-center text-xs text-neutral-500">
                      No aging reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  agingData.map((d: any) => (
                    <TableRow key={d.dealerCode} className="text-xs hover:bg-neutral-50/50">
                      <TableCell>
                        <div className="font-semibold text-neutral-900">{d.dealerName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{d.dealerCode}</div>
                      </TableCell>
                      <TableCell className="text-neutral-700 font-medium">
                        {d.city}
                      </TableCell>
                      <TableCell className="text-neutral-600 font-mono">
                        Rs. {Number(d.creditLimit || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-neutral-900">
                        Rs. {Number(d.totalDue || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-emerald-700 font-medium">
                        Rs. {Number(d.days0_30 || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-amber-700 font-medium">
                        Rs. {Number(d.days31_60 || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-orange-700 font-medium">
                        Rs. {Number(d.days61_90 || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {Number(d.days90Plus || 0) > 0 ? (
                          <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                            Rs. {Number(d.days90Plus || 0).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-neutral-400">Rs. 0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReminder(d)}
                          className="h-7 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 cursor-pointer gap-1"
                        >
                          <Send className="size-3" />
                          <span>Remind</span>
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
        </CardContent>
      </Card>

      <Dialog open={!!selectedReminder} onOpenChange={(open) => !open && setSelectedReminder(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-neutral-900">
              <Clock className="size-5 text-red-600" />
              Dealer Payment Reminder Notice
            </DialogTitle>
          </DialogHeader>

          {selectedReminder && (
            <div className="flex flex-col gap-4 mt-2 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm">{selectedReminder.dealerName}</h4>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{selectedReminder.dealerCode} • {selectedReminder.city}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400">Total Outstanding</span>
                  <p className="font-bold text-neutral-900 text-sm">Rs. {Number(selectedReminder.totalDue || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/50">
                  <span className="text-neutral-400 text-[11px]">Due Over 60 Days</span>
                  <p className="font-bold text-orange-600 mt-1">Rs. {Number(selectedReminder.days61_90 || 0).toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-lg border border-red-100 bg-red-50/50">
                  <span className="text-red-600 text-[11px]">Critical (Over 90 Days)</span>
                  <p className="font-bold text-red-700 mt-1">Rs. {Number(selectedReminder.days90Plus || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                <span className="text-neutral-400 text-[11px]">Drafted WhatsApp Reminder:</span>
                <p className="font-sans text-neutral-800 mt-1.5 p-2 bg-white rounded border border-neutral-200 text-xs leading-relaxed">
                  Salam {selectedReminder.dealerName}! This is a reminder from Sarfraz Autos Wholesale regarding your outstanding ledger balance of Rs. {Number(selectedReminder.totalDue || 0).toLocaleString()} (including Rs. {Number(selectedReminder.days90Plus || 0).toLocaleString()} overdue beyond 90 days). Kindly arrange payment clearance via bank transfer to avoid dispatch delays. JazakAllah.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyReminder(`Salam ${selectedReminder.dealerName}! This is a reminder from Sarfraz Autos Wholesale regarding your outstanding ledger balance of Rs. ${Number(selectedReminder.totalDue || 0).toLocaleString()} (including Rs. ${Number(selectedReminder.days90Plus || 0).toLocaleString()} overdue beyond 90 days). Kindly arrange payment clearance via bank transfer to avoid dispatch delays. JazakAllah.`)}
                  className="h-8 text-xs cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy Message"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.open(`https://wa.me/${(selectedReminder.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Salam ${selectedReminder.dealerName}! This is a reminder from Sarfraz Autos Wholesale regarding your outstanding ledger balance of Rs. ${Number(selectedReminder.totalDue || 0).toLocaleString()} (including Rs. ${Number(selectedReminder.days90Plus || 0).toLocaleString()} overdue beyond 90 days). Kindly arrange payment clearance via bank transfer to avoid dispatch delays. JazakAllah.`)}`, "_blank")}
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Open WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
