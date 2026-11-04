"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdminPagination } from "@/components/admin-dashboard/admin-pagination"
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Package,
  Search,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Percent,
  SlidersHorizontal,
  Check,
  RefreshCw,
} from "lucide-react"

export function AdminPriceComparisonSection() {
  const [filterType, setFilterType] = useState("anomalies")
  const [catalogType, setCatalogType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedBike, setSelectedBike] = useState("all")

  const [products, setProducts] = useState<any[]>([])
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    anomalyCount: 0,
    healthyCount: 0,
    missingCutCount: 0,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(50)
  const [totalMatching, setTotalMatching] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])

  const [calculationMode, setCalculationMode] = useState<"selling_base" | "cut_base">("selling_base")
  const [markupPercent, setMarkupPercent] = useState<number>(10)
  const [rowOverrides, setRowOverrides] = useState<Record<number, number>>({})

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmActionType, setConfirmActionType] = useState<"selected" | "all_anomalies" | "reset_to_selling">("selected")
  const [actionLoading, setActionLoading] = useState(false)

  const fetchProducts = useCallback(async (pageToLoad = currentPage) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("filter", filterType)
      params.set("type", catalogType)
      if (searchQuery.trim()) params.set("search", searchQuery.trim())
      if (selectedBrand && selectedBrand !== "all") params.set("brand", selectedBrand)
      if (selectedBike && selectedBike !== "all") params.set("bike", selectedBike)
      params.set("page", String(pageToLoad))
      params.set("limit", String(limit))

      const res = await fetch(`/api/admin/products/price-comparison?${params.toString()}`)
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load products")
      }

      setProducts(data.products || [])
      setTotalMatching(data.pagination?.totalMatching || 0)
      setTotalPages(data.pagination?.totalPages || 1)
      setCurrentPage(data.pagination?.page || pageToLoad)
      if (data.brands) setAvailableBrands(data.brands)
      if (data.stats) setStats(data.stats)
      setSelectedProductIds([])
      setRowOverrides({})
    } catch (err: any) {
      toast.error(err.message || "Failed to query price comparison")
    } finally {
      setLoading(false)
    }
  }, [filterType, catalogType, searchQuery, selectedBrand, selectedBike, currentPage, limit])

  useEffect(() => {
    fetchProducts(1)
  }, [filterType, catalogType, selectedBrand, selectedBike])

  const calculatePreviewCutPrice = useCallback(
    (product: any): number => {
      if (rowOverrides[product.id] !== undefined) {
        return rowOverrides[product.id]
      }
      const selling = Number(product.price) || 0
      const currentCut = Number(product.originalPrice) || 0
      const pct = Number(markupPercent) || 0

      if (calculationMode === "selling_base") {
        return Math.round(selling * (1 + pct / 100))
      } else {
        const base = currentCut > 0 ? currentCut : selling
        return Math.round(base * (1 + pct / 100))
      }
    },
    [calculationMode, markupPercent, rowOverrides]
  )

  const handleSelectAllOnPage = (checked: boolean) => {
    if (checked) {
      const pageIds = products.map((p) => p.id)
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      const pageIdsSet = new Set(products.map((p) => p.id))
      setSelectedProductIds((prev) => prev.filter((id) => !pageIdsSet.has(id)))
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProductIds((prev) => [...prev, id])
    } else {
      setSelectedProductIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const isAllPageSelected = useMemo(() => {
    if (products.length === 0) return false
    return products.every((p) => selectedProductIds.includes(p.id))
  }, [products, selectedProductIds])

  const handleRowOverrideChange = (id: number, val: string) => {
    const num = parseInt(val, 10)
    setRowOverrides((prev) => ({
      ...prev,
      [id]: isNaN(num) ? 0 : num,
    }))
  }

  const handleQuickFixSingle = async (product: any) => {
    const newPrice = calculatePreviewCutPrice(product)
    try {
      const res = await fetch("/api/admin/products/price-comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quick-fix-single",
          singleItem: {
            id: product.id,
            newOriginalPrice: newPrice,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update cut price")
      }
      toast.success(`Updated cut price for "${product.name}" to Rs. ${newPrice.toLocaleString()}`)
      fetchProducts(currentPage)
    } catch (err: any) {
      toast.error(err.message || "Failed to update product")
    }
  }

  const handleExecuteBatch = async () => {
    setActionLoading(true)
    try {
      if (confirmActionType === "selected") {
        const updates = selectedProductIds.map((id) => {
          const product = products.find((p) => p.id === id)
          const newPrice = product ? calculatePreviewCutPrice(product) : 0
          return { id, newOriginalPrice: newPrice }
        })

        const res = await fetch("/api/admin/products/price-comparison", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "apply-updates",
            updates,
          }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update")
        toast.success(data.message || `Updated cut prices for ${updates.length} products`)
      } else if (confirmActionType === "all_anomalies") {
        const res = await fetch("/api/admin/products/price-comparison", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "apply-formula-filtered",
            formula: {
              mode: calculationMode,
              markupPercent,
            },
            filterParams: {
              filter: "anomalies",
              type: catalogType,
              search: searchQuery,
              brand: selectedBrand,
              bike: selectedBike,
            },
          }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to auto-fix")
        toast.success(data.message || "All matching anomalies resolved")
      } else if (confirmActionType === "reset_to_selling") {
        const updates = selectedProductIds.map((id) => {
          const product = products.find((p) => p.id === id)
          return { id, newOriginalPrice: product ? Number(product.price) || 0 : 0 }
        })

        const res = await fetch("/api/admin/products/price-comparison", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "apply-updates",
            updates,
          }),
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to reset")
        toast.success(`Reset cut price equal to selling price for ${updates.length} products`)
      }

      setConfirmModalOpen(false)
      fetchProducts(currentPage)
    } catch (err: any) {
      toast.error(err.message || "Operation failed")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>Admin Panel</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-neutral-900 font-medium">Price Comparison</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Price Comparison &amp; Audit
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Audit and rectify cut prices that are lower than selling prices, or batch adjust product discount markups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProducts(currentPage)}
            disabled={loading}
            className="h-9 gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {stats.anomalyCount > 0 && (
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                setCalculationMode("selling_base")
                setMarkupPercent(10)
                setConfirmActionType("all_anomalies")
                setConfirmModalOpen(true)
              }}
              className="h-9 gap-1.5 bg-neutral-900 text-white hover:bg-neutral-800"
            >
              <Sparkles className="size-3.5" />
              1-Click Fix All {stats.anomalyCount} Anomalies
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card
          onClick={() => setFilterType("anomalies")}
          className={`cursor-pointer transition-all border ${
            filterType === "anomalies"
              ? "border-amber-400 bg-amber-50/30 ring-1 ring-amber-400/50"
              : "border-border hover:border-neutral-300"
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Price Anomalies
              </span>
              <AlertTriangle className="size-4 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-neutral-900 mt-1">
              {stats.anomalyCount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
              Cut Price &lt; Selling Price
            </span>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilterType("healthy")}
          className={`cursor-pointer transition-all border ${
            filterType === "healthy"
              ? "border-emerald-400 bg-emerald-50/30 ring-1 ring-emerald-400/50"
              : "border-border hover:border-neutral-300"
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Healthy Pricing
              </span>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-neutral-900 mt-1">
              {stats.healthyCount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-emerald-700 font-medium">
              Cut Price &ge; Selling Price
            </span>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilterType("missing_cut")}
          className={`cursor-pointer transition-all border ${
            filterType === "missing_cut"
              ? "border-neutral-400 bg-neutral-100 ring-1 ring-neutral-400"
              : "border-border hover:border-neutral-300"
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                No Cut Price
              </span>
              <HelpCircle className="size-4 text-neutral-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-neutral-900 mt-1">
              {stats.missingCutCount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-neutral-500 font-medium">
              Regular Price (No Cut)
            </span>
          </CardContent>
        </Card>

        <Card
          onClick={() => setFilterType("all")}
          className={`cursor-pointer transition-all border ${
            filterType === "all"
              ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
              : "border-border hover:border-neutral-300"
          }`}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Total Products
              </span>
              <Package className="size-4 text-neutral-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-neutral-900 mt-1">
              {stats.totalProducts.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-[11px] text-neutral-500 font-medium">
              All Catalog Items
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardHeader className="p-4 pb-3 border-b border-border/70">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-neutral-600" />
              <CardTitle className="text-sm font-semibold text-neutral-900">
                Filter &amp; Search Station
              </CardTitle>
            </div>
            <span className="text-xs text-neutral-500">
              Showing {totalMatching.toLocaleString()} matching products
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
              <Label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                Search Part / Title / Code
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-neutral-400" />
                <Input
                  placeholder="Search by product name, brand, code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchProducts(1)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                Filter State
              </Label>
              <Select value={filterType} onValueChange={(val) => val && setFilterType(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anomalies" className="text-xs">
                    Price Anomalies (Cut &lt; Selling)
                  </SelectItem>
                  <SelectItem value="all" className="text-xs">
                    All Products
                  </SelectItem>
                  <SelectItem value="healthy" className="text-xs">
                    Healthy (Cut &ge; Selling)
                  </SelectItem>
                  <SelectItem value="missing_cut" className="text-xs">
                    Missing Cut Price
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                Catalog Type
              </Label>
              <Select value={catalogType} onValueChange={(val) => val && setCatalogType(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Types</SelectItem>
                  <SelectItem value="wholesale" className="text-xs">Wholesale Only</SelectItem>
                  <SelectItem value="retail" className="text-xs">Retail Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-neutral-700 mb-1.5 block">
                Brand
              </Label>
              <Select value={selectedBrand} onValueChange={(val) => val && setSelectedBrand(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Brands</SelectItem>
                  {availableBrands.map((b) => (
                    <SelectItem key={b} value={b} className="text-xs">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-neutral-500 font-medium">Quick Bike Filter:</span>
              <Button
                variant={selectedBike === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBike("all")}
                className="h-7 text-xs px-2.5"
              >
                All Bikes
              </Button>
              <Button
                variant={selectedBike === "cd70" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBike("cd70")}
                className="h-7 text-xs px-2.5"
              >
                CD70
              </Button>
              <Button
                variant={selectedBike === "cg125" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBike("cg125")}
                className="h-7 text-xs px-2.5"
              >
                CG125
              </Button>
            </div>

            <Button
              onClick={() => fetchProducts(1)}
              disabled={loading}
              size="sm"
              className="h-8 gap-1.5 text-xs bg-neutral-900 text-white hover:bg-neutral-800"
            >
              <Search className="size-3.5" />
              Preview Matching Products
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-neutral-200 bg-neutral-50/40">
        <CardHeader className="p-4 pb-3 border-b border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <Percent className="size-4 text-neutral-700" />
                Cut Price Calculation &amp; Adjustment Station
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 mt-0.5">
                Choose how new cut prices should be computed, preview real-time calculations, and apply in bulk.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRowOverrides({})}
                className="h-8 text-xs gap-1.5"
              >
                <RotateCcw className="size-3" />
                Reset Overrides
              </Button>
              {selectedProductIds.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConfirmActionType("reset_to_selling")
                      setConfirmModalOpen(true)
                    }}
                    className="h-8 text-xs"
                  >
                    Match Selling Price ({selectedProductIds.length})
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setConfirmActionType("selected")
                      setConfirmModalOpen(true)
                    }}
                    className="h-8 text-xs gap-1.5 bg-neutral-900 text-white hover:bg-neutral-800"
                  >
                    <Check className="size-3.5" />
                    Apply New Cut Prices to Selected ({selectedProductIds.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setCalculationMode("selling_base")}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                calculationMode === "selling_base"
                  ? "border-neutral-900 bg-white ring-1 ring-neutral-900"
                  : "border-neutral-200 bg-white/60 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-neutral-900">
                    Option 1: Base on Selling Price + Markup %
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-300 bg-emerald-50 text-emerald-800">
                    Recommended to Fix Anomalies
                  </Badge>
                </div>
                <div
                  className={`size-3.5 rounded-full border flex items-center justify-center ${
                    calculationMode === "selling_base" ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                  }`}
                >
                  {calculationMode === "selling_base" && <div className="size-1.5 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Sets the cut price equal to the discounted selling price, then increases it by <strong>{markupPercent}%</strong>.
                Guarantees the cut price is always higher than the selling price.
              </p>
              <div className="mt-2 text-[11px] font-mono text-neutral-600 bg-neutral-100 p-1.5 rounded">
                Formula: New Cut Price = Selling Price &times; (1 + {markupPercent}%)
              </div>
            </div>

            <div
              onClick={() => setCalculationMode("cut_base")}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                calculationMode === "cut_base"
                  ? "border-neutral-900 bg-white ring-1 ring-neutral-900"
                  : "border-neutral-200 bg-white/60 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-neutral-900">
                  Option 2: Direct Markup on Current Cut Price %
                </span>
                <div
                  className={`size-3.5 rounded-full border flex items-center justify-center ${
                    calculationMode === "cut_base" ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                  }`}
                >
                  {calculationMode === "cut_base" && <div className="size-1.5 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Directly applies <strong>{markupPercent}%</strong> onto the existing cut price, without comparing against the selling price.
              </p>
              <div className="mt-2 text-[11px] font-mono text-neutral-600 bg-neutral-100 p-1.5 rounded">
                Formula: New Cut Price = Current Cut Price &times; (1 + {markupPercent}%)
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <Label className="text-xs font-medium text-neutral-700 whitespace-nowrap">
                Markup Percentage:
              </Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min="0"
                  max="500"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value) || 0)}
                  className="w-20 h-8 text-xs font-semibold text-neutral-900 bg-white text-center"
                />
                <span className="text-xs text-neutral-500 font-medium">%</span>
              </div>
              <div className="flex items-center gap-1">
                {[5, 10, 15, 20, 25, 30].map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant={markupPercent === val ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMarkupPercent(val)}
                    className="h-7 text-xs px-2"
                  >
                    +{val}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              {calculationMode === "selling_base"
                ? `Example: Rs. 150 selling price + ${markupPercent}% markup = Rs. ${Math.round(150 * (1 + markupPercent / 100))} cut price`
                : `Example: Rs. 100 current cut price + ${markupPercent}% markup = Rs. ${Math.round(100 * (1 + markupPercent / 100))} cut price`}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="p-4 pb-3 border-b border-border/70">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllPageSelected}
                onCheckedChange={handleSelectAllOnPage}
                id="select-all-header"
              />
              <label
                htmlFor="select-all-header"
                className="text-xs font-medium text-neutral-700 cursor-pointer"
              >
                Select All on Page ({selectedProductIds.length} of {products.length} selected)
              </label>
            </div>
            <span className="text-xs text-neutral-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10 px-4"></TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 min-w-[240px]">
                    Product
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 min-w-[130px]">
                    Selling Price (Rs.)
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 min-w-[170px]">
                    Current Cut Price
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 min-w-[180px]">
                    New Cut Price Preview
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 min-w-[120px]">
                    Customer Discount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 text-right pr-4 min-w-[100px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                        <RefreshCw className="size-5 animate-spin text-neutral-400" />
                        <span className="text-xs">Loading comparison data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                        <CheckCircle2 className="size-8 text-emerald-500 stroke-[1.5]" />
                        <span className="text-sm font-medium text-neutral-900">
                          {filterType === "anomalies"
                            ? "No price anomalies detected!"
                            : "No products found matching filters"}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {filterType === "anomalies"
                            ? "All catalog products have valid cut prices higher than or equal to selling prices."
                            : "Try adjusting search query or brand filters."}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id)
                    const selling = Number(p.price) || 0
                    const currentCut = Number(p.originalPrice) || 0
                    const hasCut = currentCut > 0
                    const isAnomaly = hasCut && currentCut < selling
                    const previewCut = calculatePreviewCutPrice(p)
                    const previewDiff = previewCut - selling
                    const previewPercentOff =
                      previewCut > selling
                        ? Math.round(((previewCut - selling) / previewCut) * 100)
                        : 0

                    return (
                      <TableRow
                        key={p.id}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-neutral-50"
                            : isAnomaly
                            ? "bg-amber-50/20 hover:bg-amber-50/40"
                            : "hover:bg-neutral-50/50"
                        }`}
                      >
                        <TableCell className="px-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectRow(p.id, Boolean(checked))}
                          />
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <span className="font-medium text-xs text-neutral-900 block leading-tight">
                              {p.name}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                                {p.brand}
                              </Badge>
                              {p.compatibleBike && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal bg-neutral-100">
                                  {p.compatibleBike}
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 font-normal ${
                                  p.type === "wholesale"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : p.type === "retail"
                                    ? "bg-blue-50 text-blue-800 border-blue-200"
                                    : "bg-purple-50 text-purple-800 border-purple-200"
                                }`}
                              >
                                {p.type}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs font-semibold text-neutral-900">
                            Rs. {selling.toLocaleString()}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              {hasCut ? (
                                <span className={`text-xs ${isAnomaly ? "line-through text-amber-700 font-medium" : "text-neutral-600 line-through"}`}>
                                  Rs. {currentCut.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-xs text-neutral-400 italic">None</span>
                              )}
                            </div>
                            {isAnomaly && (
                              <div className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                                <AlertTriangle className="size-3 shrink-0" />
                                <span>Rs. {(selling - currentCut).toLocaleString()} lower than selling</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="relative w-28">
                              <span className="absolute left-2.5 top-1.5 text-xs text-neutral-400 font-medium">Rs.</span>
                              <Input
                                type="number"
                                value={previewCut || ""}
                                onChange={(e) => handleRowOverrideChange(p.id, e.target.value)}
                                className={`h-8 pl-8 pr-2 text-xs font-semibold ${
                                  previewCut < selling
                                    ? "border-amber-400 bg-amber-50/50 text-amber-900"
                                    : "border-neutral-300 text-neutral-900 bg-white"
                                }`}
                              />
                            </div>
                            {previewDiff > 0 && (
                              <span className="text-[11px] text-emerald-700 font-medium whitespace-nowrap">
                                +Rs. {previewDiff.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          {previewPercentOff > 0 ? (
                            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold">
                              {previewPercentOff}% OFF
                            </Badge>
                          ) : (
                            <span className="text-xs text-neutral-400">-</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right pr-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickFixSingle(p)}
                            className="h-7 text-xs px-2.5 gap-1 hover:bg-neutral-900 hover:text-white"
                          >
                            <Check className="size-3" />
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Showing {products.length} of {totalMatching.toLocaleString()} items
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchProducts(page)}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              {confirmActionType === "all_anomalies"
                ? `1-Click Auto Fix All ${stats.anomalyCount} Anomalies`
                : confirmActionType === "reset_to_selling"
                ? `Match Selling Price for ${selectedProductIds.length} Products`
                : `Apply New Cut Prices to ${selectedProductIds.length} Selected Products`}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 pt-1 leading-relaxed">
              {confirmActionType === "all_anomalies" ? (
                <>
                  This will update all detected anomalies in the database using the active formula:
                  <br />
                  <strong>
                    {calculationMode === "selling_base"
                      ? `New Cut Price = Selling Price + ${markupPercent}%`
                      : `New Cut Price = Current Cut Price + ${markupPercent}%`}
                  </strong>
                  . This will make all cut prices strictly higher than selling prices.
                </>
              ) : confirmActionType === "reset_to_selling" ? (
                <>
                  This will set the cut price equal to the current selling price for the {selectedProductIds.length} selected products, effectively clearing the discount strikethrough.
                </>
              ) : (
                <>
                  This will apply the previewed cut prices to the {selectedProductIds.length} selected products in the catalog.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleExecuteBatch}
              disabled={actionLoading}
              className="bg-neutral-900 text-white hover:bg-neutral-800"
            >
              {actionLoading ? "Updating..." : "Confirm & Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

