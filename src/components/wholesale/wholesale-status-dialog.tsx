"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Megaphone, Sparkles, X } from "lucide-react";

export interface WholesaleStatusItem {
  id: number;
  type: "text" | "image" | string;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  startTime: string | Date;
  endTime: string | Date;
  status: string;
  views?: number;
}

export function WholesaleStatusDialog({
  status,
  open,
  onOpenChange,
}: {
  status: WholesaleStatusItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  useEffect(() => {
    if (open && status?.id) {
      fetch(`/api/wholesale-status/${status.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incrementView: true }),
      }).catch(() => {});
    }
  }, [open, status?.id]);

  if (!status) return null;

  const endDate = new Date(status.endTime);
  const formattedEndTime = endDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isImage = status.type === "image" && Boolean(status.imageUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[94vw] max-w-lg max-h-[82vh] p-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xl flex flex-col"
      >
        <div className="relative shrink-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950 text-white p-4 sm:p-5 pr-14">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 z-20 size-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-4 text-white stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-600 text-white shadow-xs">
              <Megaphone className="size-3.5" />
            </span>
            <Badge variant="outline" className="text-[10px] tracking-wide font-semibold text-red-200 border-red-500/40 bg-red-600/20">
              Wholesale Announcement
            </Badge>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
            {status.title}
          </DialogTitle>
          <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-1">
            <Clock className="size-3 text-red-400" />
            <span>Valid until {formattedEndTime}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[48vh] sm:max-h-[55vh] p-4 sm:p-6 space-y-3 sm:space-y-4">
          {isImage ? (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                <img
                  src={status.imageUrl!}
                  alt={status.title}
                  className="w-full max-h-[360px] sm:max-h-[480px] object-contain rounded-xl"
                />
              </div>
              {status.content && (
                <div className="rounded-xl bg-neutral-50 p-3.5 sm:p-4 border border-neutral-200/60">
                  <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
                    {status.content}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-neutral-50/80 p-4 sm:p-5 border border-neutral-200/70 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                <Sparkles className="size-3.5" />
                <span>Notice for Dealership Partners</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 whitespace-pre-line leading-relaxed font-normal">
                {status.content || status.title}
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-between p-3.5 sm:p-4 bg-neutral-50/90 border-t border-neutral-100 text-xs text-neutral-500">
          <span>Sarfraz Autos Wholesale Desk</span>
          <a
            href="https://wa.me/923331285556"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Inquire on WhatsApp →
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WholesaleStatusDialog;
