"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Layers,
  ChevronRight,
  Sparkles,
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
import { parseExcelSync, applyExcelSync } from "@/lib/api/excel-sync"
import { ALL_CATEGORIES } from "@/lib/category-mapper"

const BRAND_OPTIONS = [
  "Crown",
  "Honda",
  "Super Power",
  "Yamaha",
  "Suzuki",
  "United",
  "Unique",
  "Super Star",
  "Servis",
  "Panther",
  "Diamond Tyres",
  "General Tyre",
  "Road Prince",
  "Hi-Speed",
  "Other",
]

const BIKE_OPTIONS = [
  "All Models",
  "70cc",
  "100cc",
  "110cc",
  "125cc",
  "150cc",
  "200cc",
  "220cc",
  "250cc",
]

const CATEGORY_LIST = ALL_CATEGORIES.filter((c) => c !== "All")

export function AdminExcelSyncSection() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const [syncData, setSyncData] = useState<{
    stats: {
      totalParsed: number
      priceUpdatesCount: number
      unchangedCount: number
      newProductsCount: number
      sheets?: string[]
    }
    sheets?: string[]
    priceUpdates: any[]
    unchanged: any[]
    newProducts: any[]
  } | null>(null)

  const [selectedSheet, setSelectedSheet] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"updates" | "new" | "unchanged">("updates")
  const [searchFilter, setSearchFilter] = useState("")

  const [priceUpdates, setPriceUpdates] = useState<any[]>([])
  const [newProducts, setNewProducts] = useState<any[]>([])
  const [unchanged, setUnchanged] = useState<any[]>([])

  const [bulkBrand, setBulkBrand] = useState("Crown")
  const [bulkCategory, setBulkCategory] = useState("Others")
  const [bulkBike, setBulkBike] = useState("All Models")
  const [bulkType, setBulkType] = useState("wholesale")

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)")
      return
    }

    try {
      setSelectedFile(file)
      setIsParsing(true)
      const data = await parseExcelSync(file)
      setSyncData(data)
      setPriceUpdates(data.priceUpdates || [])
      setNewProducts(data.newProducts || [])
      setUnchanged(data.unchanged || [])

      if (data.priceUpdates?.length > 0) {
        setActiveTab("updates")
      } else if (data.newProducts?.length > 0) {
        setActiveTab("new")
      } else {
        setActiveTab("unchanged")
      }

      toast.success(`Excel analyzed! ${data.stats.priceUpdatesCount} price updates, ${data.stats.newProductsCount} new items detected.`)
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze Excel file")
    } finally {
      setIsParsing(false)
    }
  }

  const toggleAllUpdates = (checked: boolean) => {
    const targetIds = new Set(filteredUpdates.map((u) => u.id))
    setPriceUpdates((prev) =>
      prev.map((item) => (targetIds.has(item.id) ? { ...item, selected: checked } : item))
    )
  }

  const toggleUpdateItem = (id: number) => {
    setPriceUpdates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    )
  }

  const toggleAllNew = (checked: boolean) => {
    const targetTempIds = new Set(filteredNew.map((n) => n.tempId))
    setNewProducts((prev) =>
      prev.map((item) => (targetTempIds.has(item.tempId) ? { ...item, selected: checked } : item))
    )
  }

  const toggleNewItem = (tempId: string) => {
    setNewProducts((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, selected: !item.selected } : item))
    )
  }

  const updateNewItemField = (tempId: string, field: string, value: any) => {
    setNewProducts((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, [field]: value } : item))
    )
  }

  const applyBulkNewFields = () => {
    setNewProducts((prev) =>
      prev.map((item) =>
        item.selected
          ? {
              ...item,
              brand: bulkBrand || item.brand,
              category: bulkCategory || item.category,
              compatibleBike: bulkBike || item.compatibleBike,
              type: bulkType || item.type,
            }
          : item
      )
    )
    toast.success("Applied global settings to selected new products!")
  }

  const handleApplyChanges = async () => {
    const selectedUpdates = priceUpdates.filter((u) => u.selected)
    const selectedNew = newProducts.filter((n) => n.selected)

    if (selectedUpdates.length === 0 && selectedNew.length === 0) {
      toast.error("Please select at least one price update or new product to apply.")
      return
    }

    try {
      setIsApplying(true)
      const res = await applyExcelSync({
        updates: selectedUpdates,
        newItems: selectedNew,
        updateSchemes: true,
      })

      toast.success(res.message || "Sync completed successfully!")
      setSyncData(null)
      setSelectedFile(null)
      setSelectedSheet("all")
      setPriceUpdates([])
      setNewProducts([])
      setUnchanged([])
    } catch (err: any) {
      toast.error(err.message || "Failed to apply changes")
    } finally {
      setIsApplying(false)
    }
  }

  const availableSheets: string[] = syncData?.sheets || []

  const sheetUpdates = selectedSheet === "all" ? priceUpdates : priceUpdates.filter((i) => i.sheet === selectedSheet)
  const sheetNew = selectedSheet === "all" ? newProducts : newProducts.filter((i) => i.sheet === selectedSheet)
  const sheetUnchanged = selectedSheet === "all" ? unchanged : unchanged.filter((i) => i.sheet === selectedSheet)
  const sheetTotal = sheetUpdates.length + sheetNew.length + sheetUnchanged.length

  const filteredUpdates = sheetUpdates.filter(
    (item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.itemCode && item.itemCode.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (item.model && item.model.toLowerCase().includes(searchFilter.toLowerCase()))
  )

  const filteredNew = sheetNew.filter(
    (item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.itemCode && item.itemCode.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (item.model && item.model.toLowerCase().includes(searchFilter.toLowerCase()))
  )

  const filteredUnchanged = sheetUnchanged.filter(
    (item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.itemCode && item.itemCode.toLowerCase().includes(searchFilter.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-neutral-900 transition-colors">Admin Panel</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/admin/products" className="hover:text-neutral-900 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">Excel Price Sync</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Excel Bulk Price &amp; Catalog Sync</h2>
          <p className="text-sm text-neutral-500 mt-1">Upload your monthly Crown or supplier Excel price list to automatically update prices and import new parts.</p>
        </div>
      </div>

      {!syncData ? (
        <div className="border-2 border-dashed border-neutral-300 rounded-3xl p-10 lg:p-14 text-center bg-white hover:bg-neutral-50/50 transition-colors flex flex-col items-center justify-center gap-4">
          <div className="size-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
            <FileSpreadsheet className="size-8" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900">Upload Monthly Price List</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              Select or drag &amp; drop your official <strong>excel.xlsx</strong> price sheet. The system will detect price increases, reductions, schemes, and brand models.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
          />

          <Button
            type="button"
            disabled={isParsing}
            onClick={() => fileInputRef.current?.click()}
            className="h-10 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm cursor-pointer shadow-xs gap-2"
          >
            {isParsing ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                <span>Reading &amp; Analyzing Excel...</span>
              </>
            ) : (
              <>
                <Upload className="size-4" />
                <span>Choose Excel File</span>
              </>
            )}
          </Button>

          <p className="text-[11px] text-neutral-400">Supported formats: .XLSX, .XLS (Crown Price List structure)</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-neutral-200 bg-white">
              <span className="text-xs text-neutral-500 font-medium">Total Sheet Items</span>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{sheetTotal}</p>
              <span className="text-[11px] text-neutral-400">
                {selectedSheet === "all" ? `All tabs in ${selectedFile?.name}` : `Tab: ${selectedSheet}`}
              </span>
            </div>

            <div
              onClick={() => setActiveTab("updates")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "updates" ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500" : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-700 font-semibold">Price Changes</span>
                <span className="size-2 rounded-full bg-amber-500" />
              </div>
              <p className="text-2xl font-bold text-amber-900 mt-1">{sheetUpdates.length}</p>
              <span className="text-[11px] text-amber-700">
                {sheetUpdates.filter((u) => u.selected).length} selected to update
              </span>
            </div>

            <div
              onClick={() => setActiveTab("new")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "new" ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500" : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-semibold">New Products</span>
                <span className="size-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{sheetNew.length}</p>
              <span className="text-[11px] text-emerald-700">
                {sheetNew.filter((n) => n.selected).length} selected to import
              </span>
            </div>

            <div
              onClick={() => setActiveTab("unchanged")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "unchanged" ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900" : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-medium">Unchanged</span>
                <span className="size-2 rounded-full bg-neutral-400" />
              </div>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{sheetUnchanged.length}</p>
              <span className="text-[11px] text-neutral-500">Same price on website</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Button
                size="sm"
                variant={activeTab === "updates" ? "default" : "ghost"}
                onClick={() => setActiveTab("updates")}
                className={`h-8 text-xs font-semibold rounded-xl cursor-pointer ${
                  activeTab === "updates" ? "bg-amber-600 hover:bg-amber-700 text-white" : "text-neutral-600"
                }`}
              >
                Price Updates ({sheetUpdates.length})
              </Button>
              <Button
                size="sm"
                variant={activeTab === "new" ? "default" : "ghost"}
                onClick={() => setActiveTab("new")}
                className={`h-8 text-xs font-semibold rounded-xl cursor-pointer ${
                  activeTab === "new" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-neutral-600"
                }`}
              >
                New Products ({sheetNew.length})
              </Button>
              <Button
                size="sm"
                variant={activeTab === "unchanged" ? "default" : "ghost"}
                onClick={() => setActiveTab("unchanged")}
                className={`h-8 text-xs font-semibold rounded-xl cursor-pointer ${
                  activeTab === "unchanged" ? "bg-neutral-900 hover:bg-neutral-800 text-white" : "text-neutral-600"
                }`}
              >
                Unchanged ({sheetUnchanged.length})
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {availableSheets.length > 0 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-neutral-500 font-medium shrink-0">Sheet:</span>
                  <Select value={selectedSheet} onValueChange={(val) => val && setSelectedSheet(val)}>
                    <SelectTrigger className="h-8 text-xs bg-white border-neutral-200 min-w-36">
                      <SelectValue placeholder="All Sheets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sheets ({syncData.stats.totalParsed})</SelectItem>
                      {availableSheets.map((s) => {
                        const count =
                          priceUpdates.filter((i) => i.sheet === s).length +
                          newProducts.filter((i) => i.sheet === s).length +
                          unchanged.filter((i) => i.sheet === s).length
                        return (
                          <SelectItem key={s} value={s}>
                            {s} ({count})
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="relative w-44 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                <Input
                  placeholder="Filter by part, code, model..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="h-8 pl-8 text-xs bg-neutral-50"
                />
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSyncData(null)
                  setSelectedFile(null)
                  setSelectedSheet("all")
                }}
                className="h-8 text-xs cursor-pointer"
              >
                Upload Different File
              </Button>

              <Button
                size="sm"
                disabled={isApplying || (priceUpdates.filter((u) => u.selected).length === 0 && newProducts.filter((n) => n.selected).length === 0)}
                onClick={handleApplyChanges}
                className="h-8 px-4 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer rounded-xl gap-1.5 shadow-xs"
              >
                {isApplying ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Applying Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    <span>Apply Selected ({priceUpdates.filter((u) => u.selected).length + newProducts.filter((n) => n.selected).length})</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {activeTab === "updates" && (
            <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-xs">
              <div className="p-3.5 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all-updates"
                    checked={filteredUpdates.length > 0 && filteredUpdates.every((u) => u.selected)}
                    onCheckedChange={(c) => toggleAllUpdates(Boolean(c))}
                  />
                  <label htmlFor="select-all-updates" className="text-xs font-semibold text-amber-900 cursor-pointer">
                    Select All ({filteredUpdates.filter((u) => u.selected).length} of {filteredUpdates.length} shown)
                  </label>
                </div>
                <span className="text-[11px] text-amber-700">Check products you wish to update in the database</span>
              </div>

              <div className="max-h-[550px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-neutral-50 sticky top-0 z-10">
                    <TableRow className="text-xs">
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="text-xs font-semibold">Product Name</TableHead>
                      <TableHead className="text-xs font-semibold">Code / Model</TableHead>
                      <TableHead className="text-xs font-semibold">Current Price</TableHead>
                      <TableHead className="text-xs font-semibold">New Excel Price</TableHead>
                      <TableHead className="text-xs font-semibold">Change</TableHead>
                      <TableHead className="text-xs font-semibold">Carton / Scheme</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUpdates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-xs text-neutral-500">
                          No price updates match the current search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUpdates.map((item) => (
                        <TableRow key={item.id} className="text-xs hover:bg-neutral-50/80">
                          <TableCell>
                            <Checkbox
                              checked={item.selected}
                              onCheckedChange={() => toggleUpdateItem(item.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium text-neutral-900 max-w-xs truncate">
                            {item.name}
                          </TableCell>
                          <TableCell className="font-mono text-[11px] text-neutral-500">
                            {item.itemCode || "—"} {item.model ? `• ${item.model}` : ""}
                          </TableCell>
                          <TableCell className="text-neutral-500 line-through">
                            Rs. {item.oldPrice.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-bold text-neutral-900">
                            Rs. {item.newPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {item.diff > 0 ? (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] gap-1">
                                <TrendingUp className="size-3" />
                                +Rs. {item.diff.toLocaleString()} (+{item.percentDiff}%)
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[11px] gap-1">
                                <TrendingDown className="size-3" />
                                -Rs. {Math.abs(item.diff).toLocaleString()} ({item.percentDiff}%)
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-neutral-500 text-[11px]">
                            {item.ctnQty ? `Ctn: ${item.ctnQty}` : ""}
                            {item.schemeQty && item.schemeFoc ? ` • Buy ${item.schemeQty}+${item.schemeFoc}` : ""}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "new" && (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Bulk Settings for Selected New Products
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Apply a common brand, category, or bike model to all checked new items before importing.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Select value={bulkBrand} onValueChange={(val) => val && setBulkBrand(val)}>
                    <SelectTrigger className="w-32 h-8 text-xs bg-white">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAND_OPTIONS.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={bulkCategory} onValueChange={(val) => val && setBulkCategory(val)}>
                    <SelectTrigger className="w-36 h-8 text-xs bg-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_LIST.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={bulkBike} onValueChange={(val) => val && setBulkBike(val)}>
                    <SelectTrigger className="w-32 h-8 text-xs bg-white">
                      <SelectValue placeholder="Bike" />
                    </SelectTrigger>
                    <SelectContent>
                      {BIKE_OPTIONS.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={bulkType} onValueChange={(val) => val && setBulkType(val)}>
                    <SelectTrigger className="w-32 h-8 text-xs bg-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    onClick={applyBulkNewFields}
                    className="h-8 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer rounded-lg"
                  >
                    Apply to Selected
                  </Button>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-xs">
                <div className="p-3.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all-new"
                      checked={filteredNew.length > 0 && filteredNew.every((n) => n.selected)}
                      onCheckedChange={(c) => toggleAllNew(Boolean(c))}
                    />
                    <label htmlFor="select-all-new" className="text-xs font-semibold text-neutral-900 cursor-pointer">
                      Select All New Products ({filteredNew.filter((n) => n.selected).length} of {filteredNew.length} shown)
                    </label>
                  </div>
                  <span className="text-[11px] text-neutral-500">Each item can also be customized individually below</span>
                </div>

                <div className="max-h-[550px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-neutral-50 sticky top-0 z-10">
                      <TableRow className="text-xs">
                        <TableHead className="w-10"></TableHead>
                        <TableHead className="text-xs font-semibold">Part Name</TableHead>
                        <TableHead className="text-xs font-semibold">Code / Model</TableHead>
                        <TableHead className="text-xs font-semibold">Price</TableHead>
                        <TableHead className="text-xs font-semibold">Brand</TableHead>
                        <TableHead className="text-xs font-semibold">Category</TableHead>
                        <TableHead className="text-xs font-semibold">Bike</TableHead>
                        <TableHead className="text-xs font-semibold">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNew.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-32 text-center text-xs text-neutral-500">
                            No new products match your filter.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNew.map((item) => (
                          <TableRow key={item.tempId} className="text-xs hover:bg-neutral-50/80">
                            <TableCell>
                              <Checkbox
                                checked={item.selected}
                                onCheckedChange={() => toggleNewItem(item.tempId)}
                              />
                            </TableCell>
                            <TableCell className="font-medium text-neutral-900 max-w-xs truncate">
                              {item.name}
                            </TableCell>
                            <TableCell className="font-mono text-[11px] text-neutral-500">
                              {item.itemCode || "—"} {item.model ? `• ${item.model}` : ""}
                            </TableCell>
                            <TableCell className="font-bold text-neutral-900">
                              Rs. {item.price.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.brand}
                                onValueChange={(val) => val && updateNewItemField(item.tempId, "brand", val)}
                              >
                                <SelectTrigger className="h-7 w-28 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {BRAND_OPTIONS.map((b) => (
                                    <SelectItem key={b} value={b}>{b}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.category}
                                onValueChange={(val) => val && updateNewItemField(item.tempId, "category", val)}
                              >
                                <SelectTrigger className="h-7 w-32 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {CATEGORY_LIST.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.compatibleBike}
                                onValueChange={(val) => val && updateNewItemField(item.tempId, "compatibleBike", val)}
                              >
                                <SelectTrigger className="h-7 w-28 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {BIKE_OPTIONS.map((b) => (
                                    <SelectItem key={b} value={b}>{b}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.type}
                                onValueChange={(val) => val && updateNewItemField(item.tempId, "type", val)}
                              >
                                <SelectTrigger className="h-7 w-24 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="wholesale">Wholesale</SelectItem>
                                  <SelectItem value="retail">Retail</SelectItem>
                                  <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "unchanged" && (
            <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-xs">
              <div className="p-3.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">
                  Products with Matching Prices ({unchanged.length})
                </span>
                <span className="text-[11px] text-neutral-400">No price updates needed for these parts</span>
              </div>

              <div className="max-h-[550px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-neutral-50 sticky top-0 z-10">
                    <TableRow className="text-xs">
                      <TableHead className="text-xs font-semibold">Product Name</TableHead>
                      <TableHead className="text-xs font-semibold">Code / Model</TableHead>
                      <TableHead className="text-xs font-semibold">Website Price</TableHead>
                      <TableHead className="text-xs font-semibold">Excel Price</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnchanged.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-xs text-neutral-500">
                          No unchanged items match your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUnchanged.map((item) => (
                        <TableRow key={item.id} className="text-xs hover:bg-neutral-50/80">
                          <TableCell className="font-medium text-neutral-900 max-w-xs truncate">
                            {item.name}
                          </TableCell>
                          <TableCell className="font-mono text-[11px] text-neutral-500">
                            {item.itemCode || "—"} {item.model ? `• ${item.model}` : ""}
                          </TableCell>
                          <TableCell className="font-bold text-neutral-900">
                            Rs. {item.oldPrice.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-neutral-600">
                            Rs. {item.newPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-neutral-100 text-neutral-700 text-[11px]">
                              Identical
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminExcelSyncSection
