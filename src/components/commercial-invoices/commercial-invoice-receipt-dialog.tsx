"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, CheckCircle2, Clock, Building2 } from "lucide-react"

export function CommercialInvoiceReceiptDialog({ invoice, open, onOpenChange }: any) {
  if (!invoice) return null

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "Paid":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium gap-1">
            <CheckCircle2 className="size-3" />
            Paid & Cleared
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium gap-1">
            <Clock className="size-3" />
            Payment Pending
          </Badge>
        )
      case "Overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const subtotal = Math.round(invoice.amount * 0.85)
  const gstTax = invoice.amount - subtotal

  const handlePrintOrDownload = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border border-neutral-200 shadow-md">
        <DialogHeader className="p-6 pb-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-neutral-900">
                  SARFRAZ AUTOS
                </span>
                <span className="text-xs bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded">
                  WHOLESALE
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Motorcycle Genuine & Aftermarket Spare Parts
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                NTN: 4182931-7 • FBR Sales Tax Registered
              </p>
            </div>

            <div className="text-left sm:text-right flex flex-col sm:items-end gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Commercial Tax Invoice
              </span>
              <p className="text-base font-bold font-mono text-neutral-900">
                {invoice.invoiceNumber}
              </p>
              <div>{getStatusBadge(invoice.status)}</div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
            <div className="space-y-1">
              <span className="text-neutral-400 font-medium uppercase tracking-wider text-[10px]">
                Billed To (Dealer)
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                <Building2 className="size-3.5 text-neutral-500" />
                {invoice.customerName || "Registered Dealer"}
              </div>
              <p className="text-neutral-600">Dealer Code: {invoice.dealerCode || "DLR-5021"}</p>
              <p className="text-neutral-600">{invoice.customerCity || "Karachi, Pakistan"}</p>
              <p className="text-neutral-500 text-[11px]">FBR Verified Account</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-neutral-400 font-medium uppercase tracking-wider text-[10px]">
                Invoice Details
              </span>
              <p className="text-neutral-600">
                <span className="text-neutral-400">Order ID:</span>{" "}
                <span className="font-mono font-medium text-neutral-800">{invoice.orderNumber}</span>
              </p>
              <p className="text-neutral-600">
                <span className="text-neutral-400">Issue Date:</span> {invoice.issueDate}
              </p>
              <p className="text-neutral-600">
                <span className="text-neutral-400">Due Date:</span> {invoice.dueDate}
              </p>
              <p className="text-neutral-600">
                <span className="text-neutral-400">Terms:</span> 15 Days Commercial Credit
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Itemized Summary
            </h4>
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Description</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Packing</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Taxable Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-3 px-3">
                      <p className="font-medium text-neutral-900">{invoice.itemsSummary}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        High grade OEM replacement bulk carton packaging
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center text-neutral-600">
                      Standard Master Cartons
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-neutral-900 font-mono">
                      Rs. {subtotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-2">
            <div className="text-[11px] text-neutral-500 max-w-xs space-y-1">
              <p className="font-medium text-neutral-700">Bank Transfer Account:</p>
              <p>Meezan Bank Ltd (Commercial Branch)</p>
              <p className="font-mono">IBAN: PK42MEZN000100982341901</p>
              <p className="text-neutral-400 mt-1">
                Please quote invoice #{invoice.invoiceNumber} in the transaction reference.
              </p>
            </div>

            <div className="w-full sm:w-60 border border-neutral-100 bg-neutral-50/60 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal (Excl. Tax)</span>
                <span className="font-mono">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>GST / Sales Tax (15%)</span>
                <span className="font-mono">Rs. {gstTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Freight / Bilty</span>
                <span className="font-mono text-emerald-600">Free Booking</span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-sm text-neutral-900">
                <span>Total Amount</span>
                <span className="font-mono">Rs. {invoice.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-400">
            Official receipt generated by Sarfraz Autos Wholesale Portal
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrintOrDownload}
              className="h-8 text-xs cursor-pointer gap-1.5"
            >
              <Printer className="size-3.5" />
              Print
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handlePrintOrDownload}
              className="h-8 text-xs cursor-pointer gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              <Download className="size-3.5" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
