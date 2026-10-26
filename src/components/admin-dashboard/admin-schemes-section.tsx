"use client"

import { useState, useEffect } from "react"
import {
  Tag,
  Search,
  Pencil,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Package,
  Sparkles,
  Calculator,
  Trash2,
  Plus,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const catalogueProducts = [
  {
    id: "P-001",
    name: "CD70 Complete Cylinder Head",
    category: "Cylinders & Heads",
    brand: "Crown Genuine",
    cartonPrice: 84000,
    hasScheme: true,
    buyQty: 10,
    freeQty: 1,
    schemeStatus: "Active",
  },
  {
    id: "P-002",
    name: "Crown Heavy Duty Clutch Plates",
    category: "Clutch Plates",
    brand: "Crown Lifan",
    cartonPrice: 135000,
    hasScheme: true,
    buyQty: 15,
    freeQty: 1,
    schemeStatus: "Active",
  },
  {
    id: "P-003",
    name: "125cc Complete Piston Kit",
    category: "Pistons",
    brand: "Sarfraz Genuine",
    cartonPrice: 42000,
    hasScheme: true,
    buyQty: 20,
    freeQty: 2,
    schemeStatus: "Paused",
  },
  {
    id: "P-004",
    name: "4-Stroke Engine Block Assembly",
    category: "Engine Blocks",
    brand: "Sarfraz Genuine",
    cartonPrice: 92000,
    hasScheme: false,
    buyQty: 10,
    freeQty: 1,
    schemeStatus: "None",
  },
  {
    id: "P-005",
    name: "Performance Crankshaft Assembly",
    category: "Crankshafts",
    brand: "Crown Lifan",
    cartonPrice: 85000,
    hasScheme: false,
    buyQty: 10,
    freeQty: 1,
    schemeStatus: "None",
  },
  {
    id: "P-006",
    name: "Japanese Standard 70cc Carburetor",
    category: "Carburetors",
    brand: "Keihin Standard",
    cartonPrice: 48000,
    hasScheme: false,
    buyQty: 12,
    freeQty: 1,
    schemeStatus: "None",
  },
  {
    id: "P-007",
    name: "Complete Overhaul Gasket Set",
    category: "Gaskets",
    brand: "Sarfraz Genuine",
    cartonPrice: 35000,
    hasScheme: true,
    buyQty: 15,
    freeQty: 2,
    schemeStatus: "Active",
  },
  {
    id: "P-008",
    name: "Camshaft & Rocker Arm Kit",
    category: "Cylinders & Heads",
    brand: "Crown Genuine",
    cartonPrice: 92000,
    hasScheme: false,
    buyQty: 10,
    freeQty: 1,
    schemeStatus: "None",
  },
]

export function AdminSchemesSection() {
  const [products, setProducts] = useState<any[]>(catalogueProducts)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState("")
  const [schemeTitle, setSchemeTitle] = useState("")
  const [buyQty, setBuyQty] = useState("10")
  const [freeQty, setFreeQty] = useState("1")

  const [productSearch, setProductSearch] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const fetchSchemes = async () => {
    try {
      const res = await fetch("/api/schemes")
      const data = await res.json()
      if (data?.success && Array.isArray(data.products)) {
        setProducts(data.products)
        if (!selectedProductId && data.products.length > 0) {
          setSelectedProductId(data.products[0].id)
        }
      }
    } catch (e) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSchemes()
  }, [])

  const activeSchemesCount = products.filter((p) => p.hasScheme && p.schemeStatus === "Active").length
  const pausedSchemesCount = products.filter((p) => p.hasScheme && p.schemeStatus === "Paused").length

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0]

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    if (filterType === "With Scheme") return matchesSearch && p.hasScheme
    if (filterType === "Active") return matchesSearch && p.hasScheme && p.schemeStatus === "Active"
    if (filterType === "Paused") return matchesSearch && p.hasScheme && p.schemeStatus === "Paused"
    if (filterType === "No Scheme") return matchesSearch && !p.hasScheme
    return matchesSearch
  })

  const pageSize = 20
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const dropdownFilteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  })

  const openCreateModal = () => {
    const firstWithoutScheme = products.find((p) => !p.hasScheme) || products[0]
    selectProductForScheme(firstWithoutScheme)
    setIsModalOpen(true)
  }

  const openEditModal = (product: any) => {
    selectProductForScheme(product)
    setIsModalOpen(true)
  }

  const selectProductForScheme = (prod: any) => {
    if (!prod) return
    setSelectedProductId(prod.id)
    if (prod.hasScheme) {
      setBuyQty(prod.buyQty.toString())
      setFreeQty(prod.freeQty.toString())
      setSchemeTitle(`Buy ${prod.buyQty} + ${prod.freeQty} Free ${prod.name}`)
    } else {
      setBuyQty("10")
      setFreeQty("1")
      setSchemeTitle(`Buy 10 + 1 Free ${prod.name}`)
    }
    setIsDropdownOpen(false)
    setProductSearch("")
  }

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    const buy = Math.max(1, parseInt(buyQty) || 1)
    const free = Math.max(1, parseInt(freeQty) || 1)
    setIsSubmitting(true)

    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProductId
          ? {
              ...p,
              hasScheme: true,
              buyQty: buy,
              freeQty: free,
              schemeStatus: "Active",
            }
          : p
      )
    )

    try {
      const res = await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.productId || selectedProduct.id,
          productName: selectedProduct.name,
          category: selectedProduct.category,
          brand: selectedProduct.brand,
          cartonPrice: selectedProduct.cartonPrice,
          buyQty: buy,
          freeQty: free,
          status: "Active",
        }),
      })
      const data = await res.json()
      if (data?.success) {
        await fetchSchemes()
        setIsModalOpen(false)
      }
    } catch (e) {
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePauseScheme = async (id: string) => {
    const prod = products.find((p) => p.id === id)
    if (!prod) return
    const nextStatus = prod.schemeStatus === "Active" ? "Paused" : "Active"

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, schemeStatus: nextStatus }
        }
        return p
      })
    )

    try {
      await fetch(`/api/schemes/${prod.schemeId || prod.productId || id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
    } catch (e) {
      await fetchSchemes()
    }
  }

  const handleRemoveScheme = async (id: string) => {
    const prod = products.find((p) => p.id === id)
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, hasScheme: false, schemeStatus: "None" }
          : p
      )
    )
    if (selectedProductId === id) {
      setIsModalOpen(false)
    }

    try {
      await fetch(`/api/schemes?id=${prod?.schemeId || ""}&productId=${prod?.productId || id}`, {
        method: "DELETE",
      })
      await fetchSchemes()
    } catch (e) {
      await fetchSchemes()
    }
  }

  const calculateNetPrice = (cPrice: number, buy: number, free: number) => {
    const totalCost = cPrice * buy
    const totalCartons = buy + free
    return Math.round(totalCost / totalCartons)
  }

  const currentNetPrice = calculateNetPrice(
    selectedProduct?.cartonPrice || 0,
    parseInt(buyQty) || 1,
    parseInt(freeQty) || 0
  )

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 w-full bg-white">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Wholesale Trade Schemes
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Configure volume schemes for each product (e.g. Buy 15, 20 + Get 1, 2, 3 Free) with automatic net rate calculation.
          </p>
        </div>
        <Button
          size="sm"
          onClick={openCreateModal}
          className="h-9 text-xs bg-red-600 hover:bg-red-700 text-white gap-1.5 cursor-pointer rounded-xl shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Add New Scheme</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Products</span>
            <div className="p-2 rounded-xl bg-neutral-100 text-neutral-700">
              <Package className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-3">{products.length}</p>
          <span className="text-[11px] text-neutral-500 font-medium mt-1 inline-block">
            In store catalogue
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Active Schemes</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Sparkles className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-3">{activeSchemesCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            Live on wholesale portal
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Paused Schemes</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <PauseCircle className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-3">{pausedSchemesCount}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 inline-block">
            Temporarily paused offers
          </span>
        </Card>

        <Card className="rounded-2xl border bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Without Scheme</span>
            <div className="p-2 rounded-xl bg-neutral-100 text-neutral-700">
              <Tag className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-3">
            {products.length - (activeSchemesCount + pausedSchemesCount)}
          </p>
          <span className="text-[11px] text-neutral-500 font-medium mt-1 inline-block">
            Standard carton pricing
          </span>
        </Card>
      </div>

      <Card className="rounded-2xl border bg-white pb-0">
        <CardHeader className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 px-6 ">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <Input
              placeholder="Search product name, category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["All", "Active", "Paused", "No Scheme"].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={filterType === st ? "default" : "outline"}
                onClick={() => {
                  setFilterType(st)
                  setCurrentPage(1)
                }}
                className="h-8 text-xs cursor-pointer rounded-xl"
              >
                {st}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-6 pt-0">
          <div className="overflow-x-auto rounded-xl border border-neutral-200/80">
            <Table>
              <TableHeader className="bg-neutral-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-neutral-700">Product Name & Code</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Category & Brand</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Carton Price</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Configured Scheme</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Calculated Net Price</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-neutral-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin text-red-600" />
                        <span>Loading schemes & products...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                      No products or schemes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((p) => {
                    const hasScheme = p.hasScheme
                    const netPrice = hasScheme ? calculateNetPrice(p.cartonPrice, p.buyQty, p.freeQty) : p.cartonPrice

                    return (
                      <TableRow key={p.id} className="text-xs hover:bg-neutral-50/50">
                      <TableCell>
                        <div className="font-semibold text-neutral-900">{p.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{p.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-neutral-800">{p.category}</div>
                        <div className="text-[11px] text-neutral-500">{p.brand}</div>
                      </TableCell>
                      <TableCell className="font-medium text-neutral-900">
                        Rs. {p.cartonPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {hasScheme ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-600 font-semibold text-xs">
                            <Sparkles className="size-3" />
                            <span>Buy {p.buyQty} + {p.freeQty} Free</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-xs">No Scheme Active</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasScheme ? (
                          <div>
                            <span className="font-bold text-neutral-900 text-xs">
                              Rs. {netPrice.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-neutral-400 ml-1">/ carton</span>
                            <div className="text-[10px] text-emerald-600 font-medium">
                              Saves Rs. {(p.cartonPrice - netPrice).toLocaleString()} / ctn
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-500 font-medium text-xs">
                            Rs. {p.cartonPrice.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasScheme && p.schemeStatus === "Active" && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1">
                            <CheckCircle2 className="size-3" />
                            Active
                          </Badge>
                        )}
                        {hasScheme && p.schemeStatus === "Paused" && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs gap-1">
                            <PauseCircle className="size-3" />
                            Paused
                          </Badge>
                        )}
                        {!hasScheme && (
                          <Badge variant="outline" className="bg-neutral-100 text-neutral-500 border-neutral-200 text-xs">
                            None
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(p)}
                            className="h-7 px-2.5 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer gap-1"
                          >
                            <Pencil className="size-3" />
                            <span>{hasScheme ? "Edit Scheme" : "Add Scheme"}</span>
                          </Button>

                          {hasScheme && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePauseScheme(p.id)}
                              className={`h-7 px-2.5 text-xs cursor-pointer gap-1 ${
                                p.schemeStatus === "Active"
                                  ? "text-amber-700 border-amber-200 hover:bg-amber-50"
                                  : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                              }`}
                            >
                              {p.schemeStatus === "Active" ? (
                                <>
                                  <PauseCircle className="size-3" />
                                  <span>Pause Scheme</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="size-3" />
                                  <span>Activate Scheme</span>
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }))}
              </TableBody>
            </Table>
          </div>
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg p-6 rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              Configure Wholesale Trade Scheme
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveScheme} className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-neutral-700">Scheme Title</label>
              <Input
                placeholder="e.g. 10 + 1 Free CD70 Piston Cartons"
                value={schemeTitle}
                onChange={(e) => setSchemeTitle(e.target.value)}
                className="h-9 text-xs mt-1"
                required
              />
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-neutral-700">
                Target Product (Select from Catalogue)
              </label>
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-input bg-white text-left text-xs hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-neutral-900 truncate">
                      {selectedProduct ? selectedProduct.name : "Select a product..."}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {selectedProduct?.category} • {selectedProduct?.brand} ({selectedProduct?.id})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-neutral-800 text-xs">
                      Rs. {selectedProduct?.cartonPrice.toLocaleString()}
                    </span>
                    <ChevronDown className="size-4 text-neutral-400" />
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95">
                    <div className="p-2 border-b border-neutral-100 bg-neutral-50/70">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
                        <Input
                          placeholder="Search product name or code..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="pl-8 h-8 text-xs bg-white"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto p-1 divide-y divide-neutral-50">
                      {dropdownFilteredProducts.length === 0 ? (
                        <div className="p-4 text-center text-xs text-neutral-400">
                          No matching product found
                        </div>
                      ) : (
                        dropdownFilteredProducts.map((p) => {
                          const isSelected = p.id === selectedProductId
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => selectProductForScheme(p)}
                              className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-red-50/80 text-red-900 font-medium"
                                  : "hover:bg-neutral-50 text-neutral-800"
                              }`}
                            >
                              <div className="flex flex-col min-w-0 pr-2">
                                <span className="font-medium truncate">{p.name}</span>
                                <span className="text-[11px] text-neutral-400">
                                  {p.category} • {p.id}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-xs font-semibold text-neutral-700">
                                  Rs. {p.cartonPrice.toLocaleString()}
                                </span>
                                {isSelected && <Check className="size-3.5 text-red-600" />}
                              </div>
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700">
                  Buy Quantity (Cartons)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={buyQty}
                  onChange={(e) => {
                    setBuyQty(e.target.value)
                    setSchemeTitle(`Buy ${e.target.value} + ${freeQty} Free ${selectedProduct?.name || ""}`)
                  }}
                  placeholder="10"
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700">
                  Free Bonus Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  value={freeQty}
                  onChange={(e) => {
                    setFreeQty(e.target.value)
                    setSchemeTitle(`Buy ${buyQty} + ${e.target.value} Free ${selectedProduct?.name || ""}`)
                  }}
                  placeholder="1"
                  className="h-9 text-xs mt-1"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-red-900">
                <Calculator className="size-4" />
                <span>Net Rate Preview</span>
              </div>
              <div className="mt-2 space-y-1 text-red-800">
                <p>
                  • Scheme: <span className="font-bold">Buy {buyQty || 0} + {freeQty || 0} Free Cartons</span>
                </p>
                <p>
                  • Dealer Pays for {buyQty || 0} Cartons:{" "}
                  <span className="font-bold">
                    Rs. {((selectedProduct?.cartonPrice || 0) * (parseInt(buyQty) || 0)).toLocaleString()}
                  </span>
                </p>
                <p>
                  • Total Cartons Delivered:{" "}
                  <span className="font-bold">
                    {(parseInt(buyQty) || 0) + (parseInt(freeQty) || 0)} Cartons
                  </span>
                </p>
                <p className="pt-1">
                  • Effective Net Rate:{" "}
                  <span className="font-bold text-sm text-red-600">
                    Rs. {currentNetPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-neutral-500 line-through ml-2">
                    (Standard: Rs. {(selectedProduct?.cartonPrice || 0).toLocaleString()})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              {selectedProduct?.hasScheme ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveScheme(selectedProductId)}
                  className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 cursor-pointer gap-1"
                >
                  <Trash2 className="size-3" />
                  <span>Remove Scheme</span>
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3 animate-spin mr-1.5" />
                      Saving Scheme...
                    </>
                  ) : (
                    "Save & Launch Scheme"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
