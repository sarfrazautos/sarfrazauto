"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NotchedCardProps {
  image: string;
  imageAlt: string;
  description: string;
  buttonLabel?: string;
  variant?: "white" | "red";
  href?: string;
  className?: string;
}

const NOTCHED_CLIP_PATH =
  "polygon(14px 0, 15% 0, calc(15% + 12px) 10px, calc(85% - 12px) 10px, 85% 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 85% 100%, calc(85% - 12px) calc(100% - 10px), calc(15% + 12px) calc(100% - 10px), 15% 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)";

export function NotchedCard({
  image,
  imageAlt,
  description,
  buttonLabel = "Get Started",
  variant = "white",
  href,
  className = "",
}: NotchedCardProps) {
  const isRed = variant === "red";

  const buttonElement = (
    <Button
      className={cn(
        "relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer",
        isRed
          ? "bg-white text-red-600 hover:bg-neutral-100"
          : "bg-red-600 text-white hover:bg-red-700"
      )}
    >
      <span className="relative z-10 transition-all duration-500">
        {buttonLabel}
      </span>
      <span
        className={cn(
          "absolute right-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 shrink-0",
          isRed ? "bg-red-600 text-white" : "bg-white text-red-600"
        )}
      >
        <ArrowUpRight size={16} />
      </span>
    </Button>
  );

  return (
    <div
      className={cn(
        "relative transition-all duration-300 w-full",
        !isRed && "drop-shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <div
        className={cn(
          "w-full flex flex-col p-3.5 sm:p-5 pt-4 sm:pt-5 transition-colors duration-300 min-h-[400px] md:min-h-[460px]",
          isRed ? "bg-red-600 text-white" : "bg-white text-neutral-900"
        )}
        style={{ clipPath: NOTCHED_CLIP_PATH }}
      >
        <div className="relative aspect-[16/10] w-full rounded-2xl sm:rounded-[20px] overflow-hidden shrink-0 bg-neutral-100">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between pt-4 sm:pt-5 pb-1 sm:pb-2 px-1">
          <p
            className={cn(
              "text-sm md:text-base leading-relaxed line-clamp-2",
              isRed ? "text-white/90" : "text-neutral-600"
            )}
          >
            {description}
          </p>

          <div className="pt-4 sm:pt-5">
            {href ? (
              <Link href={href} className="inline-block">
                {buttonElement}
              </Link>
            ) : (
              buttonElement
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotchedCard;
