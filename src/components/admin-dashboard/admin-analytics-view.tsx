"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Eye,
  Calendar,
  ChevronDown,
  PieChart as PieChartIcon,
  FileText,
  Smartphone,
  Zap,
  Users,
  ArrowUpRight,
  RefreshCw,
  MapPin,
  Activity,
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
import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function DynamicSparkline({ data }: { data: { v: number }[] }) {
  const safeData = data && data.length > 0 ? data : [{ v: 0 }, { v: 0 }, { v: 0 }]
  return (
    <div className="w-28 h-11">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id="miniRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.35} />
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

  const {
    data: analyticsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-google-analytics", activeRange],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics?range=${activeRange}`)
      if (!res.ok) throw new Error("Failed to load analytics")
      return res.json()
    },
    refetchInterval: 15000,
  })

  const activeLiveUsers = Number(analyticsData?.activeUsers || 0)
  const displayViews = analyticsData?.totalViews !== undefined
    ? Number(analyticsData.totalViews).toLocaleString()
    : "0"

  const chartTimeline = Array.isArray(analyticsData?.timeline)
    ? analyticsData.timeline
    : []

  const chartTraffic = Array.isArray(analyticsData?.trafficSources)
    ? analyticsData.trafficSources
    : []

  const chartDevices = Array.isArray(analyticsData?.deviceBreakdown)
    ? analyticsData.deviceBreakdown
    : []

  const listTopPages = Array.isArray(analyticsData?.topPages)
    ? analyticsData.topPages
    : []

  const liveLocations = Array.isArray(analyticsData?.liveLocations)
    ? analyticsData.liveLocations
    : []

  const visitorsSpark = chartTimeline.length > 0
    ? chartTimeline.map((t: any) => ({ v: Number(t.visitors || 0) }))
    : [{ v: 0 }, { v: activeLiveUsers }]

  const handleRangeChange = (range: string, label: string) => {
    setActiveRange(range)
    setSelectedPreset(label)
    setDateDropdownOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 w-full max-w-[1600px] mx-auto">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
          <span className="font-bold text-emerald-950">Google Analytics 4 Live Connected</span>
          <span className="text-emerald-700 hidden sm:inline">
            Stream: <code className="font-mono font-semibold">G-JRPRF3GZD4</code> • Property: <code className="font-mono font-semibold">562957269</code>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold text-[10px]">
            Real-Time Syncing (15s)
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="h-7 px-2 text-xs text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 cursor-pointer"
          >
            <RefreshCw className={`size-3 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

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
                Real-time website traffic and visitor data from Google Analytics 4
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
                  {[
                    { label: "Today", value: "today" },
                    { label: "Last 7 Days", value: "7D" },
                    { label: "Last 14 Days", value: "14D" },
                    { label: "Last 30 Days", value: "30D" },
                    { label: "Last 90 Days", value: "90D" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRangeChange(option.value, option.label)}
                      className={`w-full text-left px-3.5 py-2.5 transition-colors cursor-pointer ${
                        selectedPreset === option.label
                          ? "bg-red-600 text-white font-semibold"
                          : "text-neutral-200 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Eye className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500">Total Visitors</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-0.5">
                  {isLoading ? "..." : displayViews}
                </h3>
              </div>
            </div>
            <DynamicSparkline data={visitorsSpark} />
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500 font-medium pt-2 border-t border-neutral-100">
            <Activity className="size-3.5 text-red-600" />
            <span>Google Analytics 4 • {selectedPreset}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Visitor Growth Overview
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Daily website visitors and page traffic over time from GA4
              </p>
            </div>

            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl self-start sm:self-auto">
              {[
                { r: "7D", l: "Last 7 Days" },
                { r: "14D", l: "Last 14 Days" },
                { r: "30D", l: "Last 30 Days" },
                { r: "90D", l: "Last 90 Days" },
              ].map(({ r, l }) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRangeChange(r, l)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeRange === r
                      ? "bg-white text-neutral-950 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartTimeline}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#a3a3a3"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e5e5" }}
                />
                <YAxis
                  stroke="#a3a3a3"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-neutral-900 text-white text-xs rounded-xl p-2.5 shadow-lg border border-neutral-800">
                          <p className="text-neutral-400 font-medium">
                            {payload[0].payload.date}
                          </p>
                          <p className="font-bold text-white mt-1">
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
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <PieChartIcon className="size-4 text-red-600" />
                Traffic Sources
              </h2>
              <span className="text-xs text-neutral-500">{selectedPreset}</span>
            </div>

            {chartTraffic.length > 0 ? (
              <>
                <div className="relative size-44 mx-auto my-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartTraffic}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartTraffic.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-neutral-900">
                      {chartTraffic[0]?.value || 0}%
                    </span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                      {chartTraffic[0]?.name || "Source"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-neutral-100 text-xs">
                  {chartTraffic.map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-neutral-600 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-neutral-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-neutral-400 text-xs">
                <PieChartIcon className="size-8 text-neutral-300 mb-2" />
                <p className="font-medium text-neutral-600">No traffic sources recorded yet</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Traffic channels will appear here as visitors browse your store.
                </p>
              </div>
            )}
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
                Top Active Pages
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-0.5"
            >
              View Products <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {listTopPages.length > 0 ? (
            <div className="divide-y divide-neutral-100 text-xs">
              <div className="flex justify-between py-2 text-neutral-400 font-medium">
                <span>Page / Screen</span>
                <span>Views</span>
              </div>
              {listTopPages.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between py-2.5 items-center gap-3">
                  <span className="font-mono text-neutral-700 font-medium truncate" title={p.path}>
                    {p.path}
                  </span>
                  <span className="font-bold text-neutral-900 shrink-0">{p.views}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400 text-xs">
              No page view records yet for this period.
            </div>
          )}
        </Card>

        <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Smartphone className="size-4" />
                </div>
                <h2 className="text-base font-bold text-neutral-900">
                  Device Breakdown
                </h2>
              </div>
              <span className="text-xs text-neutral-400">Google Analytics</span>
            </div>

            {chartDevices.length > 0 ? (
              <div className="flex items-center justify-around gap-4 my-auto pt-2">
                <div className="relative size-36 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartDevices}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartDevices.map((entry: any, index: number) => (
                          <Cell key={`device-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-2.5 text-xs">
                  {chartDevices.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-neutral-600">{item.name}</span>
                      <span className="font-bold text-neutral-900 ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No device data recorded yet.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <Activity className="size-3 text-red-600" />
            <span>Real-time and batch device classification</span>
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

            <div className="flex items-center justify-between mt-4">
              <div>
                <h3 className="text-4xl font-black text-neutral-900 tracking-tight">
                  {activeLiveUsers}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Active Users Right Now
                </p>
              </div>

              <div className="size-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                <Users className="size-6" />
              </div>
            </div>

            {liveLocations.length > 0 && (
              <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-3">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Live Locations
                </p>
                {liveLocations.map((loc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs text-neutral-700">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3 text-red-500" />
                      {loc.location}
                    </span>
                    <span className="font-semibold text-neutral-900">{loc.users} user</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-red-50/80 border border-red-100 p-2.5 flex items-center gap-2 text-xs text-red-700 font-medium">
            <Users className="size-4 shrink-0 text-red-600" />
            <span>Direct live stream from Google Analytics Data API</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminAnalyticsView
