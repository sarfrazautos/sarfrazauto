"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, CheckCircle2, Clock, XCircle, ArrowRightLeft, Building2 } from "lucide-react"

export function PaymentSlipDialog({ payment, open, onOpenChange }: any) {
  if (!payment) return null

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "Cleared":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium gap-1">
            <CheckCircle2 className="size-3" />
            Payment Cleared
          </Badge>
        )
      case "In Processing":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium gap-1">
            <Clock className="size-3" />
            Verification in Progress
          </Badge>
        )
      case "Failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium gap-1">
            <XCircle className="size-3" />
            Transaction Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 border border-neutral-200 shadow-md">
        <DialogHeader className="p-6 pb-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-neutral-900">
                  SARFRAZ AUTOS
                </span>
                <span className="text-[10px] bg-neutral-200 text-neutral-700 font-semibold px-1.5 py-0.5 rounded">
                  RECEIPT
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">Official Payment Deposit Voucher</p>
            </div>
            <div>{getStatusBadge(payment.status)}</div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <div className="text-center py-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-xs text-neutral-500 font-medium">Total Amount Transferred</span>
            <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">
              Rs. {payment.amount.toLocaleString()}
            </div>
            <span className="text-[11px] text-neutral-400">Pakistani Rupees (PKR)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Transaction Ref / Slip #</span>
              <span className="font-mono font-semibold text-neutral-900">{payment.txnId}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Date & Time</span>
              <span className="font-medium text-neutral-900">{payment.date}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Payment Channel</span>
              <span className="font-medium text-neutral-900">{payment.method}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Bank / Network</span>
              <span className="font-medium text-neutral-900">{payment.bankName}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Settled For Invoice</span>
              <span className="font-mono font-semibold text-neutral-800">{payment.invoiceNumber}</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-neutral-700 font-medium">
              <Building2 className="size-3.5 text-neutral-500" />
              <span>Depositor: Tariq Auto Traders (DLR-5021)</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
              <ArrowRightLeft className="size-3.5 text-neutral-400" />
              <span>Beneficiary: Sarfraz Autos Wholesale (Meezan Bank Ltd)</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-400">Electronic verification voucher</p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs cursor-pointer gap-1.5"
            >
              <Printer className="size-3.5" />
              Print
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs cursor-pointer gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              <Download className="size-3.5" />
              Download Slip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
