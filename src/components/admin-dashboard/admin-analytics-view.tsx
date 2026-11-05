"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Eye,
  MousePointerClick,
  ShoppingCart,
  Wallet,
  Calendar,
  ChevronDown,
  TrendingUp,
  PieChart as PieChartIcon,
  FileText,
  Smartphone,
  Zap,
  Users,
  ArrowUpRight,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const visitorsData = [
  { date: "Sep 29", visitors: 6800 },
  { date: "Oct 02", visitors: 8200 },
  { date: "Oct 05", visitors: 10400 },
  { date: "Oct 08", visitors: 9100 },
  { date: "Oct 11", visitors: 7800 },
  { date: "Oct 14", visitors: 8900 },
  { date: "Oct 17", visitors: 11200 },
  { date: "Oct 20", visitors: 10600 },
  { date: "Oct 23", visitors: 12400 },
  { date: "Oct 26", visitors: 14100 },
  { date: "Oct 28", visitors: 17200 },
]

const sparklineVisitors = [
  { v: 10 }, { v: 14 }, { v: 12 }, { v: 18 }, { v: 16 }, { v: 24 }, { v: 22 }, { v: 28 }, { v: 32 }
]
const sparklineSessions = [
  { v: 15 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 26 }, { v: 21 }, { v: 29 }, { v: 35 }, { v: 38 }
]
const sparklinePurchases = [
  { v: 8 }, { v: 12 }, { v: 15 }, { v: 11 }, { v: 19 }, { v: 16 }, { v: 22 }, { v: 25 }, { v: 30 }
]
const sparklineRevenue = [
  { v: 12 }, { v: 16 }, { v: 14 }, { v: 20 }, { v: 18 }, { v: 28 }, { v: 26 }, { v: 34 }, { v: 40 }
]
const sparklineRealtime = [
  { v: 18 }, { v: 24 }, { v: 19 }, { v: 28 }, { v: 22 }, { v: 35 }, { v: 27 }, { v: 42 }, { v: 38 }, { v: 45 }
]

const trafficData = [
  { name: "Organic Search", value: 70.0, color: "#dc2626" },
  { name: "Direct", value: 18.5, color: "#f87171" },
  { name: "Referral", value: 7.5, color: "#991b1b" },
  { name: "Social Media", value: 3.0, color: "#fca5a5" },
]

const deviceData = [
  { name: "Desktop", value: 62.0, color: "#dc2626" },
  { name: "Mobile", value: 34.5, color: "#f87171" },
  { name: "Tablet", value: 3.5, color: "#fca5a5" },
]

const topPages = [
  { path: "/", views: "8,420" },
  { path: "/products", views: "5,210" },
  { path: "/about", views: "3,760" },
  { path: "/contact", views: "2,980" },
  { path: "/shop", views: "2,750" },
]

function Sparkline({ data }: { data: { v: number }[] }) {
  return (
    <div className="w-24 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id="miniRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke="#dc2626"
            strokeWidth={1.8}
            fill="url(#miniRed)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AdminAnalyticsView() {
  const [activeRange, setActiveRange] = useState("30D")
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState("Last 30 Days")

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 w-full max-w-[1600px] mx-auto">
      <div className="relative rounded-2xl bg-neutral-950 text-white p-6 sm:p-8 shadow-sm border border-neutral-800">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-red-600/30 via-red-950/20 to-transparent" />
          <div className="absolute -top-12 -right-12 size-48 rounded-full bg-red-600/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <svg viewBox="0 0 24 24" className="size-7 fill-white" aria-hidden="true">
                <path d="M4 19h3v-6H4v6zm7 0h3V5h-3v14zm7 0h3v-9h-3v9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Google Analytics
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                Track your website performance and understand your audience
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 h-9 text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer shadow-sm focus:outline-none"
            >
              <Calendar className="size-3.5 text-neutral-400" />
              <span>{selectedPreset}</span>
              <ChevronDown className="size-3.5 text-neutral-400 ml-1" />
            </button>

            {dateDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDateDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl py-1 z-50 text-xs overflow-hidden">
                  {["Today", "Last 7 Days", "Last 30 Days", "Last 90 Days"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(option)
                        setDateDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3.5 py-2.5 transition-colors cursor-pointer ${
                        selectedPreset === option
                          ? "bg-red-600 text-white font-semibold"
                          : "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Eye className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">Total Visitors</p>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
                  24,780
                </h3>
              </div>
            </div>
            <Sparkline data={sparklineVisitors} />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span>↑ +12.5%</span>
            <span className="text-neutral-400 font-normal">vs last month</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <MousePointerClick className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">Total Sessions</p>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
                  32,410
                </h3>
              </div>
            </div>
            <Sparkline data={sparklineSessions} />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span>↑ +14.2%</span>
            <span className="text-neutral-400 font-normal">vs last month</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <ShoppingCart className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">Total Purchases</p>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
                  1,248
                </h3>
              </div>
            </div>
            <Sparkline data={sparklinePurchases} />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span>↑ +18.7%</span>
            <span className="text-neutral-400 font-normal">vs last month</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Wallet className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">Total Revenue</p>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
                  Rs. 498,320
                </h3>
              </div>
            </div>
            <Sparkline data={sparklineRevenue} />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span>↑ +20.1%</span>
            <span className="text-neutral-400 font-normal">vs last month</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <Card className="xl:col-span-8 rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <TrendingUp className="size-4" />
              </div>
              <h2 className="text-base font-bold text-neutral-900">
                Visitors Overview
              </h2>
            </div>

            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
              {["1D", "7D", "30D", "90D"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveRange(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeRange === tab
                      ? "bg-red-600 text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="mainVisitorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-neutral-200 bg-white p-2.5 shadow-md text-xs">
                          <p className="font-semibold text-neutral-900">{payload[0].payload.date}</p>
                          <p className="text-red-600 font-bold mt-0.5">
                            {Number(payload[0].value).toLocaleString()} Visitors
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  fill="url(#mainVisitorsGradient)"
                  dot={{ r: 3.5, fill: "#dc2626", stroke: "#ffffff", strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: "#dc2626", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-4 rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <PieChartIcon className="size-4" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              Traffic Sources
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
            <div className="relative size-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-neutral-900">70%</span>
                <span className="text-[10px] text-neutral-500 font-medium">Organic</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full sm:w-auto">
              {trafficData.map((item) => (
                <div key={item.name} className="flex items-center justify-between sm:justify-start gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-neutral-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-neutral-900 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <FileText className="size-4" />
              </div>
              <h2 className="text-base font-bold text-neutral-900">
                Top Pages
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-0.5"
            >
              View All <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            <div className="flex justify-between py-2 text-neutral-400 font-medium">
              <span>Page</span>
              <span>Views</span>
            </div>
            {topPages.map((p) => (
              <div key={p.path} className="flex justify-between py-2.5 items-center">
                <span className="font-mono text-neutral-700 font-medium">{p.path}</span>
                <span className="font-bold text-neutral-900">{p.views}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <Smartphone className="size-4" />
              </div>
              <h2 className="text-base font-bold text-neutral-900">
                Device Breakdown
              </h2>
            </div>
            <span className="text-xs text-red-600 font-medium cursor-pointer">
              View All →
            </span>
          </div>

          <div className="flex items-center justify-around gap-4 my-auto">
            <div className="relative size-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`device-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              {deviceData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-neutral-600">{item.name}</span>
                  <span className="font-bold text-neutral-900 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Zap className="size-4" />
                </div>
                <h2 className="text-base font-bold text-neutral-900">
                  Real-Time Overview
                </h2>
              </div>
              <Badge variant="outline" className="gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200 text-[11px] font-semibold py-0.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div>
                <h3 className="text-4xl font-black text-neutral-900 tracking-tight">
                  245
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Active Users Right Now
                </p>
              </div>

              <div className="w-28 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineRealtime}>
                    <defs>
                      <linearGradient id="liveRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fill="url(#liveRed)"
                      dot={{ r: 2.5, fill: "#dc2626" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-red-50/80 border border-red-100 p-2.5 flex items-center gap-2 text-xs text-red-700 font-medium">
            <Users className="size-4 shrink-0 text-red-600" />
            <span>+12% from previous hour</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

