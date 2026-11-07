"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter/counter";
import { WholesaleStatusDialog, type WholesaleStatusItem } from "./wholesale-status-dialog";

export function WholesaleStatusBanner() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["active-wholesale-status"],
    queryFn: async () => {
      const res = await fetch("/api/wholesale-status");
      if (!res.ok) return null;
      const json = await res.json();
      return json.activeStatus as WholesaleStatusItem | null;
    },
    staleTime: 60 * 1000,
  });

  const activeStatus = data;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!activeStatus?.endTime) {
      setTimeLeft(null);
      return;
    }

    const updateRemaining = () => {
      const end = new Date(activeStatus.endTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [activeStatus?.endTime]);

  if (isLoading || !activeStatus) return null;

  const tileStyle = isMobile
    ? {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "6px",
        padding: "2px 4px",
        margin: "0 1px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
      }
    : {
        backgroundColor: "rgba(255, 255, 255, 0.09)",
        borderRadius: "10px",
        padding: "4px 8px",
        margin: "0 2px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
      };

  const counterFontSize = isMobile ? 20 : 34;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-0">
      <div className="relative rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950 text-white py-4 px-4 sm:py-6 sm:px-8 shadow-lg border border-red-500/20 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
        <div className="absolute top-0 right-1/4 w-96 h-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-2 relative z-10 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-red-400 tracking-wider uppercase">
            <span className="size-2 rounded-full bg-red-500 animate-pulse" />
            <span>Wholesale Status Active</span>
          </div>

          {timeLeft && (
            <div className="flex items-center gap-1 sm:gap-3.5 max-w-full overflow-hidden justify-between sm:justify-start">
              <div className="flex flex-col items-center shrink-0">
                <Counter
                  value={timeLeft.days}
                  minDigits={2}
                  fontSize={counterFontSize}
                  fontWeight="700"
                  textColor="#ffffff"
                  digitStyle={tileStyle}
                />
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400 mt-0.5 sm:mt-1 uppercase tracking-wider">
                  Days
                </span>
              </div>

              <span className="text-lg sm:text-3xl font-bold text-neutral-500 self-center -mt-3.5 sm:-mt-4 shrink-0">:</span>

              <div className="flex flex-col items-center shrink-0">
                <Counter
                  value={timeLeft.hours}
                  minDigits={2}
                  fontSize={counterFontSize}
                  fontWeight="700"
                  textColor="#ffffff"
                  digitStyle={tileStyle}
                />
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400 mt-0.5 sm:mt-1 uppercase tracking-wider">
                  Hours
                </span>
              </div>

              <span className="text-lg sm:text-3xl font-bold text-neutral-500 self-center -mt-3.5 sm:-mt-4 shrink-0">:</span>

              <div className="flex flex-col items-center shrink-0">
                <Counter
                  value={timeLeft.minutes}
                  minDigits={2}
                  fontSize={counterFontSize}
                  fontWeight="700"
                  textColor="#ffffff"
                  digitStyle={tileStyle}
                />
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400 mt-0.5 sm:mt-1 uppercase tracking-wider">
                  Minutes
                </span>
              </div>

              <span className="text-lg sm:text-3xl font-bold text-neutral-500 self-center -mt-3.5 sm:-mt-4 shrink-0">:</span>

              <div className="flex flex-col items-center shrink-0">
                <Counter
                  value={timeLeft.seconds}
                  minDigits={2}
                  fontSize={counterFontSize}
                  fontWeight="700"
                  textColor="#ffffff"
                  digitStyle={tileStyle}
                />
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400 mt-0.5 sm:mt-1 uppercase tracking-wider">
                  Seconds
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 shrink-0 self-start md:self-center">
          <Button
            type="button"
            onClick={() => setDialogOpen(true)}
            size="lg"
            className="h-10 sm:h-12 px-5 sm:px-7 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <Eye className="size-3.5 sm:size-4" />
            <span>View Status</span>
          </Button>
        </div>
      </div>

      <WholesaleStatusDialog
        status={activeStatus}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

export default WholesaleStatusBanner;
