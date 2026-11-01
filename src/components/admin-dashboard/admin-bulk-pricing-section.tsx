"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  TrendingUp,
  TrendingDown,
  Percent,
  Search,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ALL_CATEGORIES } from "@/lib/category-mapper"
import { BRANDS, BIKES } from "@/components/retail/retail-hero"

export function AdminBulkPricingSection() {
  const [minPrice, setMinPrice] = useState("100")
  const [maxPrice, setMaxPrice] = useState("500")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All Brands")
  const [bike, setBike] = useState("All Bikes")
  const [productType, setProductType] = useState("all")
  const [modifySellingPrice, setModifySellingPrice] = useState(true)
  const [sellingOperation, setSellingOperation] = useState("increase")
  const [sellingAdjustmentType, setSellingAdjustmentType] = useState("percentage")
  const [sellingAdjustmentValue, setSellingAdjustmentValue] = useState("10")
  const [modifyCutPrice, setModifyCutPrice] = useState(true)
  const [cutOperation, setCutOperation] = useState("increase")
  const [cutAdjustmentType, setCutAdjustmentType] = useState("percentage")
  const [cutAdjustmentValue, setCutAdjustmentValue] = useState("10")

  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [hasPreviewed, setHasPreviewed] = useState(false)
  const [previewProducts, setPreviewProducts] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const fetchPreview = async () => {
    if (!modifySellingPrice && !modifyCutPrice) {
      toast.error("Please enable at least one adjustment (Selling Price or Cut Price)")
      return
    }

    setIsLoadingPreview(true)
    try {
      const res = await fetch("/api/admin/bulk-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minPrice: minPrice ? Number(minPrice) : null,
          maxPrice: maxPrice ? Number(maxPrice) : null,
          category: category !== "All" ? category : null,
          brand: brand !== "All Brands" ? brand : null,
          bike: bike !== "All Bikes" ? bike : null,
          type: productType !== "all" ? productType : null,
          modifySellingPrice,
          sellingOperation,
          sellingAdjustmentType,
          sellingAdjustmentValue: Number(sellingAdjustmentValue) || 0,
          modifyCutPrice,
          cutOperation,
          cutAdjustmentType,
          cutAdjustmentValue: Number(cutAdjustmentValue) || 0,
          action: "preview",
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch preview")
      }

      setPreviewProducts(data.products || [])
      setSummary(data.summary || null)
      setSelectedIds((data.products || []).map((p: any) => p.id))
      setHasPreviewed(true)

      if (data.products?.length === 0) {
        toast.info("No products match the selected criteria")
      } else {
        toast.success(`Found ${data.products.length} products matching filters`)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load product preview")
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleApplyUpdates = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one product to update")
      return
    }

    if (!modifySellingPrice && !modifyCutPrice) {
      toast.error("Please enable at least one adjustment (Selling Price or Cut Price)")
      return
    }

    setIsApplying(true)
    try {
      const res = await fetch("/api/admin/bulk-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minPrice: minPrice ? Number(minPrice) : null,
          maxPrice: maxPrice ? Number(maxPrice) : null,
          category: category !== "All" ? category : null,
          brand: brand !== "All Brands" ? brand : null,
          bike: bike !== "All Bikes" ? bike : null,
          type: productType !== "all" ? productType : null,
          modifySellingPrice,
          sellingOperation,
          sellingAdjustmentType,
          sellingAdjustmentValue: Number(sellingAdjustmentValue) || 0,
          modifyCutPrice,
          cutOperation,
          cutAdjustmentType,
          cutAdjustmentValue: Number(cutAdjustmentValue) || 0,
          action: "apply",
          selectedIds,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to apply price updates")
      }

      toast.success(data.message || `Updated prices for ${data.updatedCount} products!`)
      await fetchPreview()
    } catch (err: any) {
      toast.error(err.message || "Failed to apply bulk price changes")
    } finally {
      setIsApplying(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === previewProducts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(previewProducts.map((p) => p.id))
    }
  }

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleReset = () => {
    setMinPrice("100")
    setMaxPrice("500")
    setCategory("All")
    setBrand("All Brands")
    setBike("All Bikes")
    setProductType("all")
    setModifySellingPrice(true)
    setSellingOperation("increase")
    setSellingAdjustmentType("percentage")
    setSellingAdjustmentValue("10")
    setModifyCutPrice(true)
    setCutOperation("increase")
    setCutAdjustmentType("percentage")
    setCutAdjustmentValue("10")
    setPreviewProducts([])
    setSummary(null)
    setSelectedIds([])
    setHasPreviewed(false)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Bulk Price Adjustment
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Filter inventory by price range, brand, or category, and adjust prices by a percentage or fixed amount.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="text-xs h-9 gap-1.5 cursor-pointer text-neutral-600"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      <Card className="border border-neutral-200 shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
              <Layers className="size-4 text-red-600" />
              <span>1. Filter Target Products</span>
            </div>
            <span className="text-xs text-neutral-500">Specify criteria</span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                Min Price (Rs.)
              </label>
              <Input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="e.g. 100"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                Max Price (Rs.)
              </label>
              <Input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 500"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                Category
              </label>
              <Select value={category} onValueChange={(val) => setCategory(val || "All")}>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {ALL_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                Brand
              </label>
              <Select value={brand} onValueChange={(val) => setBrand(val || "All Brands")}>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Brands</SelectLabel>
                    {BRANDS.map((b) => (
                      <SelectItem key={b.id} value={b.label}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                Bike Model
              </label>
              <Select value={bike} onValueChange={(val) => setBike(val || "All Bikes")}>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Bike Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bike Models</SelectLabel>
                    {BIKES.map((b) => (
                      <SelectItem key={b.id} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                Catalog Scope
              </label>
              <Select value={productType} onValueChange={(val) => setProductType(val || "all")}>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Catalog Scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products (Retail & Wholesale)</SelectItem>
                  <SelectItem value="retail">Retail Only</SelectItem>
                  <SelectItem value="wholesale">Wholesale Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-neutral-200 shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
            <Percent className="size-4 text-red-600" />
            <span>2. Set Price Adjustments</span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={modifySellingPrice}
                  onChange={(e) => setModifySellingPrice(e.target.checked)}
                  className="size-4 rounded border-neutral-300 text-red-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-neutral-900">
                  Adjust Selling Price (Normal Price)
                </span>
              </label>
              <Badge
                variant="outline"
                className={
                  modifySellingPrice
                    ? "bg-red-50 text-red-700 border-red-200 text-[10px]"
                    : "text-neutral-400 text-[10px]"
                }
              >
                {modifySellingPrice ? "Enabled" : "Skipped"}
              </Badge>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-3 items-end transition-opacity ${
                !modifySellingPrice ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Action
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={sellingOperation === "increase" ? "default" : "outline"}
                    onClick={() => setSellingOperation("increase")}
                    className={`h-9 text-xs font-semibold cursor-pointer gap-1.5 ${
                      sellingOperation === "increase"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <TrendingUp className="size-3.5" />
                    <span>Increase (+)</span>
                  </Button>

                  <Button
                    type="button"
                    variant={sellingOperation === "decrease" ? "default" : "outline"}
                    onClick={() => setSellingOperation("decrease")}
                    className={`h-9 text-xs font-semibold cursor-pointer gap-1.5 ${
                      sellingOperation === "decrease"
                        ? "bg-neutral-900 hover:bg-neutral-800 text-white"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <TrendingDown className="size-3.5" />
                    <span>Decrease (-)</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Adjustment Type
                </label>
                <Select
                  value={sellingAdjustmentType}
                  onValueChange={(val) => setSellingAdjustmentType(val || "percentage")}
                >
                  <SelectTrigger className="h-9 text-sm w-full bg-white">
                    <SelectValue placeholder="Adjustment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (Rs.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  {sellingAdjustmentType === "percentage"
                    ? "Percentage Value (%)"
                    : "Fixed Amount (Rs.)"}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    value={sellingAdjustmentValue}
                    onChange={(e) => setSellingAdjustmentValue(e.target.value)}
                    placeholder="e.g. 10"
                    className="h-9 text-sm pr-8 bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">
                    {sellingAdjustmentType === "percentage" ? "%" : "Rs."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={modifyCutPrice}
                  onChange={(e) => setModifyCutPrice(e.target.checked)}
                  className="size-4 rounded border-neutral-300 text-red-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-neutral-900">
                  Adjust Cut Price (Original Strikethrough Price)
                </span>
              </label>
              <Badge
                variant="outline"
                className={
                  modifyCutPrice
                    ? "bg-red-50 text-red-700 border-red-200 text-[10px]"
                    : "text-neutral-400 text-[10px]"
                }
              >
                {modifyCutPrice ? "Enabled" : "Skipped"}
              </Badge>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-3 items-end transition-opacity ${
                !modifyCutPrice ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Action
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={cutOperation === "increase" ? "default" : "outline"}
                    onClick={() => setCutOperation("increase")}
                    className={`h-9 text-xs font-semibold cursor-pointer gap-1.5 ${
                      cutOperation === "increase"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <TrendingUp className="size-3.5" />
                    <span>Increase (+)</span>
                  </Button>

                  <Button
                    type="button"
                    variant={cutOperation === "decrease" ? "default" : "outline"}
                    onClick={() => setCutOperation("decrease")}
                    className={`h-9 text-xs font-semibold cursor-pointer gap-1.5 ${
                      cutOperation === "decrease"
                        ? "bg-neutral-900 hover:bg-neutral-800 text-white"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <TrendingDown className="size-3.5" />
                    <span>Decrease (-)</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  Adjustment Type
                </label>
                <Select
                  value={cutAdjustmentType}
                  onValueChange={(val) => setCutAdjustmentType(val || "percentage")}
                >
                  <SelectTrigger className="h-9 text-sm w-full bg-white">
                    <SelectValue placeholder="Adjustment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (Rs.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  {cutAdjustmentType === "percentage"
                    ? "Percentage Value (%)"
                    : "Fixed Amount (Rs.)"}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    value={cutAdjustmentValue}
                    onChange={(e) => setCutAdjustmentValue(e.target.value)}
                    placeholder="e.g. 10"
                    className="h-9 text-sm pr-8 bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">
                    {cutAdjustmentType === "percentage" ? "%" : "Rs."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-neutral-100">
            <Button
              type="button"
              onClick={fetchPreview}
              disabled={isLoadingPreview}
              className="h-9 px-5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg cursor-pointer gap-2"
            >
              <Search className="size-3.5" />
              <span>{isLoadingPreview ? "Loading..." : "Preview Adjustments"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3.5 bg-neutral-50 border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Matching Products
            </span>
            <span className="text-xl font-bold text-neutral-900 mt-1 block">
              {summary.totalCount}
            </span>
          </Card>

          <Card className="p-3.5 bg-neutral-50 border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Avg Selling Price
            </span>
            <div className="text-sm sm:text-base font-bold text-neutral-900 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Rs. {summary.avgOldSelling?.toLocaleString()}</span>
              {modifySellingPrice && (
                <>
                  <ArrowRight className="size-3 text-neutral-400" />
                  <span className="text-red-600">Rs. {summary.avgNewSelling?.toLocaleString()}</span>
                </>
              )}
            </div>
          </Card>

          <Card className="p-3.5 bg-neutral-50 border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Avg Cut Price
            </span>
            <div className="text-sm sm:text-base font-bold text-neutral-900 mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="line-through text-neutral-400 font-medium">
                Rs. {summary.avgOldCut?.toLocaleString()}
              </span>
              {modifyCutPrice && (
                <>
                  <ArrowRight className="size-3 text-neutral-400" />
                  <span className="line-through text-neutral-800">
                    Rs. {summary.avgNewCut?.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </Card>

          <Card className="p-3.5 bg-neutral-50 border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Selected Products
            </span>
            <span className="text-xl font-bold text-neutral-900 mt-1 block">
              {selectedIds.length}
            </span>
          </Card>
        </div>
      )}

      {hasPreviewed && (
        <Card className="border border-neutral-200 shadow-2xs bg-white">
          <CardHeader className="py-3 px-4 border-b border-neutral-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-neutral-700" />
              <CardTitle className="text-sm font-semibold text-neutral-900">
                Products Preview ({selectedIds.length} of {previewProducts.length} selected)
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                className="text-xs h-8 cursor-pointer"
              >
                {selectedIds.length === previewProducts.length ? "Deselect All" : "Select All"}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      disabled={selectedIds.length === 0 || isApplying}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold h-8 px-4 cursor-pointer gap-1.5"
                    />
                  }
                >
                  <Sparkles className="size-3.5" />
                  <span>
                    {isApplying ? "Applying..." : `Apply Updates (${selectedIds.length})`}
                  </span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Bulk Price Update</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will update prices for {selectedIds.length} products:
                      {modifySellingPrice && (
                        <span>
                          {" "}
                          Selling Price ({sellingOperation === "increase" ? "+" : "-"}
                          {sellingAdjustmentValue}
                          {sellingAdjustmentType === "percentage" ? "%" : " Rs."})
                        </span>
                      )}
                      {modifySellingPrice && modifyCutPrice && " and"}
                      {modifyCutPrice && (
                        <span>
                          {" "}
                          Cut Price ({cutOperation === "increase" ? "+" : "-"}
                          {cutAdjustmentValue}
                          {cutAdjustmentType === "percentage" ? "%" : " Rs."})
                        </span>
                      )}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleApplyUpdates}
                      className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                    >
                      Confirm &amp; Update Live Prices
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {previewProducts.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-sm">
                No products found matching the criteria. Try expanding the price range or changing filters.
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-neutral-50/70 sticky top-0 z-10">
                    <TableRow className="border-b border-neutral-200">
                      <TableHead className="w-[50px] text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === previewProducts.length && previewProducts.length > 0}
                          onChange={toggleSelectAll}
                          className="size-4 rounded border-neutral-300 text-red-600 cursor-pointer"
                        />
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700">Product</TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700">Category &amp; Brand</TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700">Model / Type</TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700 text-right">Selling Price</TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700 text-right">Cut Price</TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700 text-right">New Price</TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700 text-right">New Cut Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewProducts.map((p) => {
                      const isSelected = selectedIds.includes(p.id)
                      const img = p.images?.[p.mainImageIndex || 0] || p.images?.[0] || "/bike-engine.png"

                      return (
                        <TableRow
                          key={p.id}
                          className={`hover:bg-neutral-50 transition-colors ${
                            !isSelected ? "opacity-40" : ""
                          }`}
                        >
                          <TableCell className="text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(p.id)}
                              className="size-4 rounded border-neutral-300 text-red-600 cursor-pointer"
                            />
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={img}
                                alt={p.name}
                                className="size-9 rounded-md object-contain border border-neutral-200 bg-white shrink-0 p-0.5"
                              />
                              <div className="truncate max-w-[280px]">
                                <span className="text-xs font-medium text-neutral-900 block truncate">
                                  {p.name}
                                </span>
                                <span className="text-[10px] text-neutral-400 block">ID: #{p.id}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-xs">
                              <span className="font-medium text-neutral-800 block truncate max-w-[150px]">
                                {p.category}
                              </span>
                              <span className="text-[11px] text-neutral-500">{p.brand}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                                {p.compatibleBike || "Universal"}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 capitalize font-normal">
                                {p.type}
                              </Badge>
                            </div>
                          </TableCell>

                          <TableCell className="text-right text-xs font-medium text-neutral-700">
                            Rs. {p.currentPrice.toLocaleString()}
                          </TableCell>

                          <TableCell className="text-right text-xs">
                            {p.originalPrice ? (
                              <span
                                className={`line-through font-medium ${
                                  Number(p.originalPrice) < Number(p.currentPrice)
                                    ? "text-amber-600 font-semibold"
                                    : "text-neutral-400"
                                }`}
                              >
                                Rs. {Number(p.originalPrice).toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-neutral-400 text-xs">None</span>
                            )}
                          </TableCell>

                          <TableCell className="text-right text-xs font-bold">
                            {modifySellingPrice ? (
                              <div>
                                <span className="text-red-600 block">
                                  Rs. {p.newPrice.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-normal block">
                                  {p.sellingPercentChange}
                                </span>
                              </div>
                            ) : (
                              <span className="text-neutral-400 font-normal text-xs">Unchanged</span>
                            )}
                          </TableCell>

                          <TableCell className="text-right text-xs font-bold">
                            {modifyCutPrice ? (
                              <div>
                                <span className="line-through text-neutral-800 block">
                                  Rs. {Number(p.newOriginalPrice).toLocaleString()}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-normal block">
                                  {p.cutPercentChange}
                                </span>
                              </div>
                            ) : (
                              <span className="text-neutral-400 font-normal text-xs">Unchanged</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdminBulkPricingSection
