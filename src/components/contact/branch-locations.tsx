"use client";

import { useState } from "react";
import {
  LuArrowUpRight,
  LuHandshake,
  LuMail,
  LuMapPin,
  LuMegaphone,
  LuPhone,
  LuWrench,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

interface BranchData {
  id: string;
  name: string;
  shortName: string;
  city: string;
  badge?: string;
  address: string;
  phone: string;
  email: string;
  mapQuery: string;
}

const branches: BranchData[] = [
  {
    id: "saddar",
    name: "Saddar Head Office",
    shortName: "Saddar HQ",
    city: "Karachi, Pakistan",
    badge: "HQ",
    address: "Shop #23, Taj Mehal Qasim Auto Market, Saddar, Karachi",
    phone: "+92 300 1234567",
    email: "saddar@sarfrazautos.com",
    mapQuery: "Taj+Mehal+Qasim+Auto+Market+Saddar+Karachi",
  },
  {
    id: "tibet",
    name: "Tibet Centre Plaza",
    shortName: "Tibet Centre",
    city: "Karachi, Pakistan",
    badge: "Wholesale",
    address: "Shop #12, Tibet Centre, M.A. Jinnah Road, Karachi",
    phone: "+92 300 7654321",
    email: "tibet@sarfrazautos.com",
    mapQuery: "Tibet+Centre+M.A.+Jinnah+Road+Karachi",
  },
  {
    id: "site",
    name: "SITE Logistics Hub",
    shortName: "SITE Hub",
    city: "Karachi, Pakistan",
    badge: "Warehouse",
    address: "Plot 45-B, SITE Industrial Area, Karachi",
    phone: "+92 333 1285556",
    email: "warehouse@sarfrazautos.com",
    mapQuery: "SITE+Industrial+Area+Karachi",
  },
];

const inquiryCards = [
  {
    icon: LuHandshake,
    title: "Wholesale Partnerships",
    description:
      "Interested in bulk purchasing, becoming a retailer partner, or stocking our spare parts? Let's talk.",
    actionText: "Start a partnership",
    href: "tel:+923001234567",
  },
  {
    icon: LuWrench,
    title: "Parts & Compatibility",
    description:
      "Need help verifying engine models, cylinder kits, or finding the exact genuine motorcycle part? We're here.",
    actionText: "Inquire about parts",
    href: "tel:+923007654321",
  },
  {
    icon: LuMegaphone,
    title: "Fleet & Bulk Supply",
    description:
      "Managing delivery bike fleets, government tenders, or corporate workshops across Pakistan? Reach out.",
    actionText: "Contact corporate desk",
    href: "mailto:info@sarfrazautos.com",
  },
];

export function BranchLocations({ className = "" }: { className?: string }) {
  const [selectedId, setSelectedId] = useState("saddar");

  const currentBranch =
    branches.find((b) => b.id === selectedId) || branches[0];

  return (
    <section className={cn("w-full bg-white text-neutral-900 pb-20 md:pb-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-14 md:space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inquiryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-neutral-300 transition-colors shadow-xs"
              >
                <div>
                  <div className="size-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-950 mt-4 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <a
                  href={card.href}
                  className="mt-6 text-sm font-medium text-neutral-950 hover:text-red-600 transition-colors inline-flex items-center gap-1.5"
                >
                  {card.actionText}
                </a>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              Our branches
            </h2>
            <div className="inline-flex p-1 rounded-full bg-neutral-100 border border-neutral-200/70 self-start sm:self-auto">
              {branches.map((b) => {
                const isActive = b.id === selectedId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedId(b.id)}
                    className={cn(
                      "px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer",
                      isActive
                        ? "bg-white text-neutral-950 shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    {b.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-neutral-950 tracking-tight">
                      {currentBranch.name}
                    </h3>
                    {currentBranch.badge && (
                      <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                        {currentBranch.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    {currentBranch.city}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0 mt-0.5">
                      <LuMapPin className="size-4" />
                    </div>
                    <p className="text-sm text-neutral-700 leading-snug">
                      {currentBranch.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                      <LuPhone className="size-4" />
                    </div>
                    <a
                      href={`tel:${currentBranch.phone}`}
                      className="text-sm font-medium text-neutral-900 hover:text-red-600 transition-colors"
                    >
                      {currentBranch.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                      <LuMail className="size-4" />
                    </div>
                    <a
                      href={`mailto:${currentBranch.email}`}
                      className="text-sm font-medium text-neutral-900 hover:text-red-600 transition-colors truncate"
                    >
                      {currentBranch.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100">
                <a
                  href={`https://maps.google.com/?q=${currentBranch.mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-950 hover:text-red-600 transition-colors"
                >
                  Get directions
                  <LuArrowUpRight className="size-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 relative min-h-[350px] lg:min-h-[420px] bg-neutral-100 border-t lg:border-t-0 lg:border-l border-neutral-200">
              <iframe
                title={`${currentBranch.name} Google Map`}
                src={`https://maps.google.com/maps?q=${currentBranch.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BranchLocations;
