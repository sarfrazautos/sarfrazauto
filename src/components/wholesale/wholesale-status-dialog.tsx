"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xl">
        <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950 text-white p-5 pr-12">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-600 text-white shadow-xs">
              <Megaphone className="size-3.5" />
            </span>
            <Badge variant="outline" className="text-[10px] tracking-wide font-semibold text-red-200 border-red-500/40 bg-red-600/20">
              Wholesale Announcement
            </Badge>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
            {status.title}
          </DialogTitle>
          <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-1">
            <Clock className="size-3 text-red-400" />
            <span>Valid until {formattedEndTime}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {isImage ? (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                <img
                  src={status.imageUrl!}
                  alt={status.title}
                  className="w-full max-h-[500px] object-contain rounded-xl"
                />
              </div>
              {status.content && (
                <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200/60">
                  <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
                    {status.content}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-neutral-50/80 p-5 border border-neutral-200/70 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                <Sparkles className="size-3.5" />
                <span>Notice for Dealership Partners</span>
              </div>
              <p className="text-sm sm:text-base text-neutral-800 whitespace-pre-line leading-relaxed font-normal">
                {status.content || status.title}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WholesaleStatusDialog;

