"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Search,
  Trash2,
  EyeOff,
  Eye,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  SlidersHorizontal,
  Tag,
  Bike,
  Layers,
  RefreshCw,
  Play,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdminPagination } from "@/components/admin-dashboard/admin-pagination"
import { ALL_CATEGORIES } from "@/lib/category-mapper"

const BIKE_MODEL_PRESETS = [
  "All",
  "CD70",
  "CG125",
  "70cc",
  "100cc",
  "110cc",
  "125cc",
  "150cc",
  "200cc",
]

const PAGE_SIZE = 50

export function AdminBulkManageProductsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOperating, setIsOperating] = useState(false)

  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  const [brand, setBrand] = useState("all")
  const [bike, setBike] = useState("all")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [datePreset, setDatePreset] = useState("today")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    type: "all",
    brand: "all",
    bike: "all",
    category: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
    datePreset: "today",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  })

  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [stats, setStats] = useState({
    totalMatching: 0,
    wholesaleCount: 0,
    retailCount: 0,
    hiddenCount: 0,
    totalValue: 0,
  })

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectAllMatchingDb, setSelectAllMatchingDb] = useState(false)

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    action: "hide" | "unhide" | "delete"
    targetIds: number[]
    isAllMatching: boolean
  }>({
    open: false,
    action: "hide",
    targetIds: [],
    isAllMatching: false,
  })

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (appliedFilters.search) params.set("search", appliedFilters.search)
      if (appliedFilters.type !== "all") params.set("type", appliedFilters.type)
      if (appliedFilters.brand !== "all") params.set("brand", appliedFilters.brand)
      if (appliedFilters.bike !== "all") params.set("bike", appliedFilters.bike)
      if (appliedFilters.category !== "all") params.set("category", appliedFilters.category)
      if (appliedFilters.status !== "all") params.set("status", appliedFilters.status)

      if (appliedFilters.minPrice) params.set("minPrice", appliedFilters.minPrice)
      if (appliedFilters.maxPrice) params.set("maxPrice", appliedFilters.maxPrice)

      if (appliedFilters.datePreset !== "all") params.set("datePreset", appliedFilters.datePreset)
      if (appliedFilters.startDate) params.set("startDate", appliedFilters.startDate)
      if (appliedFilters.endDate) params.set("endDate", appliedFilters.endDate)
      if (appliedFilters.startTime) params.set("startTime", appliedFilters.startTime)
      if (appliedFilters.endTime) params.set("endTime", appliedFilters.endTime)

      params.set("page", String(currentPage))
      params.set("limit", String(PAGE_SIZE))

      const res = await fetch(`/api/admin/products/bulk-manage?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setProducts(data.products || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setStats(data.stats || {
          totalMatching: 0,
          wholesaleCount: 0,
          retailCount: 0,
          hiddenCount: 0,
          totalValue: 0,
        })
        if (data.brands && data.brands.length > 0) {
          setAvailableBrands(data.brands)
        }
      } else {
        toast.error(data.error || "Failed to load products")
      }
    } catch {
      toast.error("Failed to query catalog items")
    } finally {
      setIsLoading(false)
    }
  }, [appliedFilters, currentPage])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      type,
      brand,
      bike,
      category,
      status,
      minPrice,
      maxPrice,
      datePreset,
      startDate,
      endDate,
      startTime,
      endTime,
    })
    setCurrentPage(1)
    setSelectedIds([])
    setSelectAllMatchingDb(false)
    toast.info("Filter applied. Results updated.")
  }

  const toggleSelectAllPage = (checked: boolean) => {
    setSelectAllMatchingDb(false)
    if (checked) {
      setSelectedIds(products.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const toggleSelectProduct = (id: number) => {
    setSelectAllMatchingDb(false)
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleApplyAction = async (
    action: "hide" | "unhide" | "delete",
    targetIds: number[],
    allMatching = false
  ) => {
    if (!allMatching && targetIds.length === 0) {
      toast.error("Please select at least one product")
      return
    }

    try {
      setIsOperating(true)
      const payload: any = { action }

      if (allMatching) {
        payload.applyToAllMatching = true
        payload.filters = appliedFilters
      } else {
        payload.productIds = targetIds
      }

      const res = await fetch("/api/admin/products/bulk-manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        setSelectedIds([])
        setSelectAllMatchingDb(false)
        fetchProducts()
      } else {
        toast.error(data.error || "Operation failed")
      }
    } catch {
      toast.error("Error connecting to server")
    } finally {
      setIsOperating(false)
      setConfirmDialog({
        open: false,
        action: "hide",
        targetIds: [],
        isAllMatching: false,
      })
    }
  }

  const resetAllFilters = () => {
    const defaultState = {
      search: "",
      type: "all",
      brand: "all",
      bike: "all",
      category: "all",
      status: "all",
      minPrice: "",
      maxPrice: "",
      datePreset: "all",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    }
    setSearch("")
    setType("all")
    setBrand("all")
    setBike("all")
    setCategory("all")
    setStatus("all")
    setMinPrice("")
    setMaxPrice("")
    setDatePreset("all")
    setStartDate("")
    setEndDate("")
    setStartTime("")
    setEndTime("")
    setSelectedIds([])
    setSelectAllMatchingDb(false)
    setCurrentPage(1)
    setAppliedFilters(defaultState)
    toast.info("All filters reset")
  }

  const setPriceRangePreset = (min: string, max: string) => {
    setMinPrice(min)
    setMaxPrice(max)
  }

  const quickHideBikeModels = async (models: string[]) => {
    const matching = products.filter((p) => {
      const bikeName = (p.compatibleBike || "").toLowerCase()
      const pName = (p.name || "").toLowerCase()
      return models.some((m) => bikeName.includes(m.toLowerCase()) || pName.includes(m.toLowerCase()))
    })

    if (matching.length === 0) {
      toast.info(`No products in the current list match ${models.join(" or ")}`)
      return
    }

    setConfirmDialog({
      open: true,
      action: "hide",
      targetIds: matching.map((p) => p.id),
      isAllMatching: false,
    })
  }

  const quickHideBrand = async (targetBrand: string) => {
    const matching = products.filter((p) =>
      (p.brand || "").toLowerCase().includes(targetBrand.toLowerCase())
    )

    if (matching.length === 0) {
      toast.info(`No products in the current list match brand ${targetBrand}`)
      return
    }

    setConfirmDialog({
      open: true,
      action: "hide",
      targetIds: matching.map((p) => p.id),
      isAllMatching: false,
    })
  }

  const activeSelectedCount = selectAllMatchingDb ? stats.totalMatching : selectedIds.length

  const startIdx = stats.totalMatching === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const endIdx = Math.min(currentPage * PAGE_SIZE, stats.totalMatching)

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-neutral-900 transition-colors">Admin Panel</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/admin/products" className="hover:text-neutral-900 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">Bulk Operations &amp; Visibility</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Catalog Operations &amp; Visibility Manager
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Configure criteria and click Preview to view, hide, or bulk delete products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => quickHideBikeModels(["CD70", "125", "CG125"])}
            className="h-8 text-xs font-medium cursor-pointer rounded-lg bg-white hover:bg-neutral-100"
          >
            <EyeOff className="size-3.5 mr-1 text-neutral-600" />
            Hide CD70 &amp; 125 Models
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => quickHideBrand("Crown")}
            className="h-8 text-xs font-medium cursor-pointer rounded-lg bg-white hover:bg-neutral-100"
          >
            <EyeOff className="size-3.5 mr-1 text-neutral-600" />
            Hide Crown Products
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={resetAllFilters}
            className="h-8 text-xs font-medium cursor-pointer rounded-lg"
          >
            <RotateCcw className="size-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 lg:p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-neutral-700" />
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Multi-Criteria Search &amp; Filter Station
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-medium">
            {stats.totalMatching} items found across database
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="size-3.5 text-neutral-500" />
                Price Range (Rs.)
              </span>
              {(minPrice || maxPrice) && (
                <button
                  type="button"
                  onClick={() => setPriceRangePreset("", "")}
                  className="text-[10px] text-neutral-400 hover:text-neutral-900 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-8 text-xs bg-white"
              />
              <span className="text-xs text-neutral-400">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-8 text-xs bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              <button
                type="button"
                onClick={() => setPriceRangePreset("100", "500")}
                className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                  minPrice === "100" && maxPrice === "500" ? "bg-neutral-900 text-white font-medium" : "bg-white border text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                100 - 500
              </button>
              <button
                type="button"
                onClick={() => setPriceRangePreset("500", "2000")}
                className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                  minPrice === "500" && maxPrice === "2000" ? "bg-neutral-900 text-white font-medium" : "bg-white border text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                500 - 2k
              </button>
              <button
                type="button"
                onClick={() => setPriceRangePreset("2000", "10000")}
                className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                  minPrice === "2000" && maxPrice === "10000" ? "bg-neutral-900 text-white font-medium" : "bg-white border text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                2k - 10k
              </button>
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="size-3.5 text-neutral-500" />
                Upload Date &amp; Timing
              </span>
            </div>

            <Select value={datePreset} onValueChange={(val: any) => setDatePreset(val)}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Date range..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Uploaded Today</SelectItem>
                <SelectItem value="yesterday">Uploaded Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>

            {datePreset === "custom" && (
              <div className="flex items-center gap-1 pt-1">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-7 text-[11px] bg-white px-1.5"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-7 text-[11px] bg-white px-1.5"
                />
              </div>
            )}

            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-neutral-500 shrink-0">Hour:</span>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-7 text-[11px] bg-white px-1"
                title="Start hour (e.g. 14:00 for 2 PM)"
              />
              <span className="text-[10px] text-neutral-400">to</span>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-7 text-[11px] bg-white px-1"
                title="End hour (e.g. 17:00 for 5 PM)"
              />
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="size-3.5 text-neutral-500" />
              Type &amp; Storefront Visibility
            </span>

            <div className="space-y-1.5">
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Product type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types (Wholesale &amp; Retail)</SelectItem>
                  <SelectItem value="wholesale">Wholesale Products Only</SelectItem>
                  <SelectItem value="retail">Retail Products Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Visibility status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility States</SelectItem>
                  <SelectItem value="visible">Visible on Storefront</SelectItem>
                  <SelectItem value="hidden">Hidden from Storefront</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <Bike className="size-3.5 text-neutral-500" />
              Brand &amp; Bike Model
            </span>

            <div className="space-y-1.5">
              <Select value={brand} onValueChange={(val: any) => setBrand(val)}>
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Select brand..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {availableBrands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={bike} onValueChange={(val: any) => setBike(val)}>
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Select bike model..." />
                </SelectTrigger>
                <SelectContent>
                  {BIKE_MODEL_PRESETS.map((m) => (
                    <SelectItem key={m} value={m === "All" ? "all" : m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <Input
              placeholder="Search by part title, keyword, or part number (Press Enter or click Preview)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyFilters()
              }}
              className="h-9 pl-9 text-xs bg-neutral-50 border-neutral-200 w-full"
            />
          </div>

          <Button
            size="sm"
            onClick={handleApplyFilters}
            className="h-9 px-5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer rounded-xl gap-2 shrink-0 shadow-xs w-full sm:w-auto"
          >
            <Play className="size-3.5 fill-current" />
            <span>Preview Matching Products</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
          <span className="text-[11px] text-neutral-500 font-medium">Matching in Database</span>
          <p className="text-xl font-bold text-neutral-900 mt-0.5">{stats.totalMatching}</p>
          <span className="text-[10px] text-neutral-400">Total matching criteria</span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
          <span className="text-[11px] text-neutral-500 font-medium">Wholesale / Retail</span>
          <p className="text-xl font-bold text-neutral-900 mt-0.5">
            {stats.wholesaleCount} <span className="text-xs font-normal text-neutral-400">/</span> {stats.retailCount}
          </p>
          <span className="text-[10px] text-neutral-400">Full database count</span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
          <span className="text-[11px] text-neutral-500 font-medium">Hidden from Store</span>
          <p className="text-xl font-bold text-neutral-900 mt-0.5">
            {stats.hiddenCount}{" "}
            {stats.hiddenCount > 0 && (
              <span className="text-xs font-medium text-amber-600">(Invisible)</span>
            )}
          </p>
          <span className="text-[10px] text-neutral-400">Not visible on customer site</span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 bg-white">
          <span className="text-[11px] text-neutral-500 font-medium">Total Inventory Value</span>
          <p className="text-xl font-bold text-neutral-900 mt-0.5">
            Rs. {stats.totalValue.toLocaleString()}
          </p>
          <span className="text-[10px] text-neutral-400">Across all matching products</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={products.length > 0 && selectedIds.length === products.length}
              onCheckedChange={(c) => toggleSelectAllPage(Boolean(c))}
            />
            <label htmlFor="select-all" className="text-xs font-semibold text-neutral-900 cursor-pointer">
              Select Page ({selectedIds.length} of {products.length} shown)
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              disabled={activeSelectedCount === 0 || isOperating}
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  action: "hide",
                  targetIds: selectedIds,
                  isAllMatching: selectAllMatchingDb,
                })
              }
              className="h-8 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer rounded-lg gap-1.5 shadow-2xs"
            >
              <EyeOff className="size-3.5" />
              <span>Hide from Store ({activeSelectedCount})</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={activeSelectedCount === 0 || isOperating}
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  action: "unhide",
                  targetIds: selectedIds,
                  isAllMatching: selectAllMatchingDb,
                })
              }
              className="h-8 text-xs font-medium cursor-pointer rounded-lg gap-1.5"
            >
              <Eye className="size-3.5 text-neutral-700" />
              <span>Make Visible ({activeSelectedCount})</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={activeSelectedCount === 0 || isOperating}
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  action: "delete",
                  targetIds: selectedIds,
                  isAllMatching: selectAllMatchingDb,
                })
              }
              className="h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 cursor-pointer rounded-lg gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Delete ({activeSelectedCount})</span>
            </Button>
          </div>
        </div>

        {stats.totalMatching > products.length && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5 px-3 bg-neutral-50 rounded-lg border border-neutral-200 gap-1.5">
            <span className="text-neutral-600 text-[11px]">
              Showing {startIdx} - {endIdx} of {stats.totalMatching} matching products (Page {currentPage} of {totalPages}, {PAGE_SIZE} per page).
            </span>
            {!selectAllMatchingDb ? (
              <button
                type="button"
                onClick={() => setSelectAllMatchingDb(true)}
                className="text-[11px] font-semibold text-neutral-900 hover:underline cursor-pointer text-left"
              >
                Select all {stats.totalMatching} products across database &rarr;
              </button>
            ) : (
              <span className="text-[11px] font-semibold text-neutral-900 flex items-center gap-1.5">
                <CheckCircle2 className="size-3 text-neutral-900" />
                All {stats.totalMatching} products in database selected for action
                <button
                  type="button"
                  onClick={() => setSelectAllMatchingDb(false)}
                  className="text-neutral-400 hover:text-neutral-700 underline ml-2 cursor-pointer"
                >
                  Clear
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-xs flex flex-col">
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-neutral-50 sticky top-0 z-10">
              <TableRow className="text-xs">
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-xs font-semibold">Product Name</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">Brand / Model</TableHead>
                <TableHead className="text-xs font-semibold">Price</TableHead>
                <TableHead className="text-xs font-semibold">Storefront Status</TableHead>
                <TableHead className="text-xs font-semibold">Uploaded Date &amp; Time</TableHead>
                <TableHead className="text-xs font-semibold text-right">Quick Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center text-xs text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="size-5 animate-spin text-neutral-400" />
                      <span>Loading matching catalog items...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center text-xs text-neutral-500">
                    No products match your active search and filter criteria. Click &quot;Preview Matching Products&quot; to refresh.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((item) => {
                  const isChecked = selectAllMatchingDb || selectedIds.includes(item.id)
                  const isHidden = item.stockStatus === "hidden"
                  const createdDate = item.createdAt ? new Date(item.createdAt) : null

                  return (
                    <TableRow key={item.id} className="text-xs hover:bg-neutral-50/80">
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSelectProduct(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col max-w-xs">
                          <span className="font-semibold text-neutral-900 truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {item.category || "General"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-neutral-50 text-neutral-700 border-neutral-200 text-[10px] font-medium uppercase"
                        >
                          {item.type || "wholesale"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-neutral-800">
                        {item.brand || "—"} {item.compatibleBike ? `• ${item.compatibleBike}` : ""}
                      </TableCell>
                      <TableCell className="font-bold text-neutral-900">
                        Rs. {Number(item.price || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {isHidden ? (
                          <Badge
                            variant="outline"
                            className="bg-neutral-100 text-neutral-600 border-neutral-300 text-[10px] font-medium gap-1"
                          >
                            <EyeOff className="size-3" />
                            Hidden from Store
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-neutral-900 text-white border-neutral-900 text-[10px] font-medium gap-1"
                          >
                            <CheckCircle2 className="size-3" />
                            Visible in Store
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-neutral-500 text-[11px] whitespace-nowrap">
                        {createdDate ? (
                          <div className="flex flex-col">
                            <span>
                              {createdDate.toLocaleDateString("en-PK", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-neutral-400 font-mono text-[10px]">
                              {createdDate.toLocaleTimeString("en-PK", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleApplyAction(isHidden ? "unhide" : "hide", [item.id], false)
                            }
                            title={isHidden ? "Restore to storefront" : "Hide from storefront"}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            {isHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                action: "delete",
                                targetIds: [item.id],
                                isAllMatching: false,
                              })
                            }
                            title="Delete permanently"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="p-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50/40">
            <span className="text-xs text-neutral-500">
              Showing page {currentPage} of {totalPages} ({stats.totalMatching} total products)
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setCurrentPage(p)
                setSelectedIds([])
              }}
              className="py-0 justify-end w-auto"
            />
          </div>
        )}
      </div>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-neutral-900 flex items-center gap-2">
              {confirmDialog.action === "delete" && (
                <>
                  <AlertTriangle className="size-5 text-red-600" />
                  Confirm Permanent Deletion
                </>
              )}
              {confirmDialog.action === "hide" && (
                <>
                  <EyeOff className="size-5 text-neutral-800" />
                  Hide Products from Storefront
                </>
              )}
              {confirmDialog.action === "unhide" && (
                <>
                  <Eye className="size-5 text-neutral-800" />
                  Restore Products to Storefront
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-neutral-600 leading-relaxed">
              {confirmDialog.action === "delete" && (
                <>
                  Are you sure you want to permanently delete{" "}
                  <strong>
                    {confirmDialog.isAllMatching
                      ? `${stats.totalMatching} products across the entire database`
                      : `${confirmDialog.targetIds.length} selected product(s)`}
                  </strong>
                  ? This action cannot be undone and will also remove related trade schemes.
                </>
              )}
              {confirmDialog.action === "hide" && (
                <>
                  You are about to hide{" "}
                  <strong>
                    {confirmDialog.isAllMatching
                      ? `${stats.totalMatching} products across the entire database`
                      : `${confirmDialog.targetIds.length} product(s)`}
                  </strong>{" "}
                  from customer storefront listings, searches, and retail catalogs.
                  They will remain in your database and can be unhidden at any time.
                </>
              )}
              {confirmDialog.action === "unhide" && (
                <>
                  Restore{" "}
                  <strong>
                    {confirmDialog.isAllMatching
                      ? `${stats.totalMatching} products across the entire database`
                      : `${confirmDialog.targetIds.length} product(s)`}
                  </strong>{" "}
                  back to the live customer catalog so customers can view and purchase them.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleApplyAction(
                  confirmDialog.action,
                  confirmDialog.targetIds,
                  confirmDialog.isAllMatching
                )
              }
              className={`h-8 text-xs font-semibold cursor-pointer ${
                confirmDialog.action === "delete"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              }`}
            >
              {confirmDialog.action === "delete"
                ? `Delete (${confirmDialog.isAllMatching ? stats.totalMatching : confirmDialog.targetIds.length})`
                : confirmDialog.action === "hide"
                ? `Hide (${confirmDialog.isAllMatching ? stats.totalMatching : confirmDialog.targetIds.length})`
                : `Restore (${confirmDialog.isAllMatching ? stats.totalMatching : confirmDialog.targetIds.length})`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminBulkManageProductsSection
