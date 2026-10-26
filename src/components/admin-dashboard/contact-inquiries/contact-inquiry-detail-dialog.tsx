"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Building2, Calendar, MessageSquare, CheckCircle2, Clock } from "lucide-react"

export function ContactInquiryDetailDialog({ inquiry, open, onOpenChange, onStatusChange }: any) {
  if (!inquiry) return null

  const isNew = (inquiry.status || "").toLowerCase() === "new"

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
      return String(dateVal)
    }
  }

  const cleanPhone = inquiry.phone ? inquiry.phone.replace(/[^0-9]/g, "") : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border border-neutral-200 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-neutral-900 flex items-center justify-between pr-6">
            <span className="flex items-center gap-2">
              <MessageSquare className="size-4 text-red-600" />
              Contact Inquiry
            </span>
            {isNew ? (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium gap-1">
                <Clock className="size-3" />
                New Message
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium gap-1">
                <CheckCircle2 className="size-3" />
                Replied
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-xs mt-2">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
            <div>
              <span className="text-neutral-500">Sender Name</span>
              <p className="font-semibold text-neutral-900 text-sm mt-0.5">{inquiry.name}</p>
            </div>
            <div>
              <span className="text-neutral-500">Shop / Business</span>
              <p className="font-medium text-neutral-900 mt-0.5 flex items-center gap-1">
                <Building2 className="size-3 text-neutral-400" />
                {inquiry.shopName || "Individual / Mechanic"}
              </p>
            </div>
            <div>
              <span className="text-neutral-500">Phone Number</span>
              <p className="font-semibold text-neutral-900 mt-0.5 flex items-center gap-1">
                <Phone className="size-3 text-neutral-400" />
                {inquiry.phone ? (
                  <a href={`tel:${inquiry.phone}`} className="hover:underline hover:text-red-600">
                    {inquiry.phone}
                  </a>
                ) : (
                  <span className="text-neutral-400 font-normal">Not provided</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-neutral-500">Email Address</span>
              <p className="font-medium text-neutral-900 mt-0.5 flex items-center gap-1 truncate">
                <Mail className="size-3 text-neutral-400 shrink-0" />
                <a href={`mailto:${inquiry.email}`} className="hover:underline hover:text-red-600 truncate">
                  {inquiry.email}
                </a>
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-neutral-500">Received Date & Time</span>
              <p className="font-medium text-neutral-700 mt-0.5 flex items-center gap-1">
                <Calendar className="size-3 text-neutral-400" />
                {formatDate(inquiry.createdAt || inquiry.date)}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-neutral-500 font-medium">Message Content</span>
            <div className="p-3.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 leading-relaxed whitespace-pre-wrap min-h-24">
              {inquiry.message}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
            <div>
              {isNew ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 cursor-pointer text-xs"
                  onClick={() => onStatusChange(inquiry.id, "replied")}
                >
                  <CheckCircle2 className="size-3.5 mr-1" /> Mark as Replied
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-neutral-600 cursor-pointer text-xs"
                  onClick={() => onStatusChange(inquiry.id, "new")}
                >
                  Mark as Unread
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {cleanPhone && (
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs"
                  >
                    Reply via WhatsApp
                  </Button>
                </a>
              )}
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer text-xs"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ContactInquiryDetailDialog
