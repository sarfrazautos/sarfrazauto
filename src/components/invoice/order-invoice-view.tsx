"use client"

import React from "react"
import Link from "next/link"
import { Printer, ArrowLeft, User, ShoppingCart, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function OrderInvoiceView({ order, backUrl = "/admin/orders" }: { order: any; backUrl?: string }) {
  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-neutral-900">Order Not Found</h2>
        <p className="text-sm text-neutral-500 mt-1">The requested order or invoice could not be located.</p>
        <Link href={backUrl} className="mt-4">
          <Button variant="outline" size="sm">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const items = Array.isArray(order.items) ? order.items : []
  const subtotal = items.reduce(
    (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity || it.qty) || 1),
    0
  )
  const grandTotal = Number(order.totalAmount) || subtotal
  const shippingCharges = grandTotal > subtotal ? grandTotal - subtotal : 0
  const discountAmount = subtotal + shippingCharges > grandTotal ? subtotal + shippingCharges - grandTotal : 0

  const notes = order.notes || ""
  let paymentMethod = "Cash on Delivery"
  if (notes.toLowerCase().includes("bank") || notes.toLowerCase().includes("ubl") || notes.toLowerCase().includes("meezan")) {
    paymentMethod = "Bank Transfer"
  } else if (order.paymentStatus === "paid") {
    paymentMethod = "Paid / Online"
  }

  let customerAddress = order.customerCity || "Karachi, Pakistan"
  if (notes.includes("Address:")) {
    const parts = notes.split("|")
    const addrPart = parts.find((p: string) => p.trim().startsWith("Address:"))
    if (addrPart) {
      customerAddress = addrPart.replace("Address:", "").trim() + (order.customerCity ? `, ${order.customerCity}` : "")
    }
  }

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date()
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const formattedDateTime = orderDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " - " + orderDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  const cleanOrderNum = (order.orderNumber || "").replace(/^#/, "")
  const invoiceNumber = `INV-${cleanOrderNum}`

  const status = (order.status || "pending").toLowerCase()

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-neutral-100/70 py-6 sm:py-10 px-2 sm:px-4 print:p-0 print:m-0 print:bg-white text-neutral-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print,
          .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}} />

      <div className="max-w-[850px] mx-auto mb-4 flex items-center justify-between no-print print:hidden px-2">
        <Link href={backUrl}>
          <Button variant="ghost" size="sm" className="gap-2 text-neutral-600 hover:text-neutral-900">
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            size="sm"
            className="gap-2 bg-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer"
          >
            <Printer className="size-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div
        className="max-w-[850px] mx-auto bg-white rounded-2xl shadow-xl border border-neutral-200/80 overflow-hidden relative print:shadow-none print:border-none print:rounded-none print:max-w-full print:w-full"
        style={{
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <div className="relative pt-8 pb-6 px-8 sm:px-10 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-44 h-24 rounded-br-[100px] pointer-events-none"
            style={{
              backgroundColor: "#b91c1c",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          />
          <div
            className="absolute top-0 left-0 w-48 h-20 rounded-br-[120px] pointer-events-none opacity-30"
            style={{
              backgroundColor: "#ef4444",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5 pl-4 sm:pl-6">
              <img
                src="/logo.png"
                alt="Sarfraz Autos"
                className="size-14 sm:size-16 object-contain drop-shadow-md"
              />
              <div className="border-l-2 border-neutral-300 pl-3.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 uppercase">
                  SARFRAZ AUTOS
                </h1>
                <p className="text-xs font-medium text-neutral-500 tracking-wide">
                  Quality Auto Parts, Better Ride
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 sm:px-10 pb-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 uppercase">
              INVOICE
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Thank you for your purchase!
            </p>
          </div>

          <div
            className="border border-neutral-200/80 rounded-xl px-4 py-2.5 flex items-center gap-6"
            style={{
              backgroundColor: "#f9fafb",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                Invoice #
              </span>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 font-mono">
                {invoiceNumber}
              </span>
            </div>
            <div className="border-l border-neutral-200 pl-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                Date
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 sm:px-10 grid grid-cols-2 print:grid-cols-2 gap-4">
          <div
            className="rounded-xl border border-neutral-200/80 p-4"
            style={{
              backgroundColor: "#fcfcfc",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100">
              <User className="size-4 text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Customer Details
              </h3>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex">
                <span className="w-20 text-neutral-500 shrink-0">Name:</span>
                <span className="font-semibold text-neutral-900">{order.customerName || "Valued Customer"}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-neutral-500 shrink-0">Phone:</span>
                <span className="font-medium text-neutral-800">{order.customerPhone || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-neutral-500 shrink-0">Email:</span>
                <span className="font-medium text-neutral-800">{order.customerEmail || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-neutral-500 shrink-0">Address:</span>
                <span className="font-medium text-neutral-800 leading-snug">{customerAddress}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl border border-neutral-200/80 p-4"
            style={{
              backgroundColor: "#fcfcfc",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100">
              <ShoppingCart className="size-4 text-red-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Order Information
              </h3>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center">
                <span className="w-28 text-neutral-500 shrink-0">Order Status:</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-2 py-0.5 capitalize font-semibold ${
                    status === "delivered" || order.paymentStatus === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : status === "processing"
                      ? "bg-blue-50 text-blue-700 border-blue-300"
                      : status === "cancelled"
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-amber-50 text-amber-700 border-amber-300"
                  }`}
                  style={{
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                >
                  {status}
                </Badge>
              </div>
              <div className="flex">
                <span className="w-28 text-neutral-500 shrink-0">Payment Method:</span>
                <span className="font-medium text-neutral-800">{paymentMethod}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-neutral-500 shrink-0">Order Date:</span>
                <span className="font-medium text-neutral-800">{formattedDateTime}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-neutral-500 shrink-0">Order Type:</span>
                <span className="font-medium capitalize text-neutral-800">{order.orderType || "retail"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 sm:px-10 pb-6">
          <div className="rounded-xl border border-neutral-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead
                style={{
                  backgroundColor: "#991b1b",
                  color: "#ffffff",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <tr>
                  <th className="py-2.5 px-3 font-semibold w-10 text-center text-white">#</th>
                  <th className="py-2.5 px-3 font-semibold text-white">Product</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-20 text-white">Quantity</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-28 text-white">Unit Price</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-32 text-white">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-neutral-400">
                      No item details recorded for this order.
                    </td>
                  </tr>
                ) : (
                  items.map((item: any, idx: number) => {
                    const qty = Number(item.quantity || item.qty) || 1
                    const unitPrice = Number(item.price) || 0
                    const lineTotal = qty * unitPrice
                    const imgUrl = item.image || item.images?.[0] || "/bike-engine.png"

                    return (
                      <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3 px-3 text-center text-neutral-400 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={imgUrl}
                              alt={item.name || item.title || "Spare Part"}
                              className="size-10 object-contain rounded-md border border-neutral-200 bg-neutral-50 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-neutral-900 leading-tight">
                                {item.name || item.title || "Motorcycle Spare Part"}
                              </p>
                              {item.specs && (
                                <p className="text-[11px] text-neutral-500 mt-0.5">
                                  {item.specs}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-neutral-800">
                          {qty}
                        </td>
                        <td className="py-3 px-3 text-right text-neutral-700">
                          Rs. {unitPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-neutral-900">
                          Rs. {lineTotal.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-8 sm:px-10 pb-8 flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-semibold text-neutral-800">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between py-1 border-b border-neutral-100 text-emerald-600">
                <span>Discount</span>
                <span className="font-semibold">- Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Shipping Charges</span>
              <span className="font-semibold text-neutral-800">
                {shippingCharges > 0 ? `Rs. ${shippingCharges.toLocaleString()}` : "Rs. 0"}
              </span>
            </div>
            <div
              className="flex justify-between items-center py-2.5 px-3 rounded-lg font-bold text-sm shadow-xs"
              style={{
                backgroundColor: "#991b1b",
                color: "#ffffff",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            >
              <span className="text-white">Grand Total</span>
              <span className="text-base tracking-tight text-white">Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="px-8 sm:px-10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-neutral-100 pt-6">
          <div className="max-w-md space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <span
                className="size-4 rounded-full text-white flex items-center justify-center text-[10px]"
                style={{
                  backgroundColor: "#171717",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                i
              </span>
              Terms &amp; Conditions
            </h4>
            <div className="space-y-1 text-xs text-neutral-600">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-red-600 shrink-0" />
                <span>Products once sold are not refundable.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-red-600 shrink-0" />
                <span>Please check the package before accepting delivery.</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-red-600 shrink-0" />
                <span>For any issue, contact customer care within 7 days.</span>
              </p>
            </div>
          </div>
        </div>

        <div
          className="py-4 px-8 sm:px-10 flex flex-row items-center justify-between gap-3 text-xs relative overflow-hidden"
          style={{
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <div className="flex items-center gap-4 flex-wrap text-neutral-300">
            <span>+92 333 1285556</span>
            <span className="text-neutral-500">|</span>
            <span>info@sarfrazautos.com</span>
            <span className="text-neutral-500">|</span>
            <span>Karachi, Pakistan</span>
          </div>

          <div className="text-right">
            <span className="font-bold text-sm block tracking-wide text-white">Thank You!</span>
            <span className="text-[11px] text-neutral-300">For Shopping With Us</span>
          </div>
        </div>
      </div>
    </div>
  )
}
