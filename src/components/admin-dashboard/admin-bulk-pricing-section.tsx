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
  const [operation, setOperation] = useState("increase")
  const [adjustmentType, setAdjustmentType] = useState("percentage")
  const [adjustmentValue, setAdjustmentValue] = useState("10")

  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [hasPreviewed, setHasPreviewed] = useState(false)
  const [previewProducts, setPreviewProducts] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const fetchPreview = async () => {
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
          operation,
          adjustmentType,
          adjustmentValue: Number(adjustmentValue) || 0,
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
          operation,
          adjustmentType,
          adjustmentValue: Number(adjustmentValue) || 0,
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
    setOperation("increase")
    setAdjustmentType("percentage")
    setAdjustmentValue("10")
    setPreviewProducts([])
    setSummary(null)
    setSelectedIds([])
    setHasPreviewed(false)
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
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
            <span>2. Set Price Adjustment</span>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                Adjustment Action
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={operation === "increase" ? "default" : "outline"}
                  onClick={() => setOperation("increase")}
                  className={`h-9 text-xs font-semibold cursor-pointer gap-1.5 ${
                    operation === "increase"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <TrendingUp className="size-3.5" />
                  <span>Increase (+)</span>
                </Button>

                <Button
                  type="button"
                  variant={operation === "decrease" ? "default" : "outline"}
                  onClick={() => setOperation("decrease")}
                  className={`h-9 text-xs font-semibold cursor-pointer gap-1.5 ${
                    operation === "decrease"
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
              <Select value={adjustmentType} onValueChange={(val) => setAdjustmentType(val || "percentage")}>
                <SelectTrigger className="h-9 text-sm w-full">
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
                {adjustmentType === "percentage" ? "Percentage Value (%)" : "Fixed Amount (Rs.)"}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    min="1"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(e.target.value)}
                    placeholder="e.g. 10"
                    className="h-9 text-sm pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">
                    {adjustmentType === "percentage" ? "%" : "Rs."}
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={fetchPreview}
                  disabled={isLoadingPreview}
                  className="h-9 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg cursor-pointer shrink-0 gap-1.5"
                >
                  <Search className="size-3.5" />
                  <span>{isLoadingPreview ? "Loading..." : "Preview"}</span>
                </Button>
              </div>
            </div>
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
              Avg Old Price
            </span>
            <span className="text-xl font-bold text-neutral-900 mt-1 block">
              Rs. {summary.avgPrice?.toLocaleString()}
            </span>
          </Card>

          <Card className="p-3.5 bg-neutral-50 border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Avg Projected Price
            </span>
            <span className="text-xl font-bold text-red-600 mt-1 block">
              Rs. {summary.avgNewPrice?.toLocaleString()}
            </span>
          </Card>

          <Card className="p-3.5 bg-neutral-50 border-neutral-200">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Avg Change
            </span>
            <span
              className={`text-xl font-bold mt-1 block ${
                summary.totalDifference >= 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {summary.totalDifference >= 0 ? "+" : ""}
              Rs. {Math.round(summary.totalDifference / (summary.totalCount || 1)).toLocaleString()}
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
                      This will update the live catalog prices for <strong>{selectedIds.length}</strong> products by{" "}
                      <strong>
                        {operation === "increase" ? "+" : "-"}
                        {adjustmentValue}
                        {adjustmentType === "percentage" ? "%" : " Rs."}
                      </strong>
                      . The previous prices will be preserved in the original price field.
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
                      <TableHead className="text-xs font-semibold text-neutral-700 text-right">Current Price</TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700 text-center">Change</TableHead>
                      <TableHead className="text-xs font-semibold text-neutral-700 text-right">New Price</TableHead>
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

                          <TableCell className="text-right text-xs font-medium text-neutral-600">
                            Rs. {p.currentPrice.toLocaleString()}
                          </TableCell>

                          <TableCell className="text-center">
                            <Badge
                              className={`text-[10px] font-semibold ${
                                p.difference >= 0
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                              variant="outline"
                            >
                              {p.percentChange}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right text-xs font-bold text-neutral-900">
                            <span className="text-red-600">Rs. {p.newPrice.toLocaleString()}</span>
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
