"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Search, ChevronDown, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminProductImageUploader, type UploadedProductImage } from "@/components/admin-dashboard/admin-product-image-uploader"
import { AdminProductColorSelector } from "@/components/admin-dashboard/admin-product-color-selector"

const bikeBrands = [
  "Honda",
  "Yamaha",
  "Suzuki",
  "United",
  "Super Power",
  "Unique",
  "Super Star",
  "Road Prince",
  "Hi-Speed",
  "Crown",
  "Ravi",
  "Metro",
  "Habib",
  "Benelli",
  "Other",
]

const compatibleBikeOptions = [
  "70cc",
  "100cc",
  "110cc",
  "125cc",
  "150cc",
  "200cc",
  "220cc",
  "250cc",
  "All Models",
]

export function AdminEditProductSection() {
  const [brandName, setBrandName] = useState("Honda")
  const [brandSearch, setBrandSearch] = useState("")
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [compatibleBike, setCompatibleBike] = useState("70cc")
  const [selectedColors, setSelectedColors] = useState<string[]>(["Matte Black", "Red"])
  const [productImages, setProductImages] = useState<UploadedProductImage[]>([
    { id: "img-1", url: "/wholesale-bulk.png", name: "wholesale-bulk.png" },
    { id: "img-2", url: "/hero-parts-boxes.png", name: "hero-parts-boxes.png" },
    { id: "img-3", url: "/wheel-rim.png", name: "wheel-rim.png" },
  ])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  const filteredBrands = bikeBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-neutral-900 transition-colors">Admin Panel</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/admin/products" className="hover:text-neutral-900 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">Edit Product</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Product</h2>
          <p className="text-sm text-neutral-500 mt-1">Update the product details below. Changes will reflect on the storefront immediately.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-5">
            <AdminProductImageUploader
              images={productImages}
              mainIndex={mainImageIndex}
              onChange={(imgs, mIdx) => {
                setProductImages(imgs)
                setMainImageIndex(mIdx)
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <Card className="border-neutral-200 shadow-xs">
              <CardHeader className="p-5 pb-4 border-b border-neutral-100">
                <CardTitle className="text-base font-semibold text-neutral-900">Product Details</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Editing: CD70 Complete Cylinder Head (P-001)</CardDescription>
              </CardHeader>

              <CardContent className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="productName" className="text-xs font-medium text-neutral-700">Product Name *</Label>
                    <Input id="productName" defaultValue="CD70 Complete Cylinder Head" className="h-9 text-xs" required />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-700">Listing Type *</Label>
                    <Select defaultValue="wholesale">
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail (Single Unit)</SelectItem>
                        <SelectItem value="wholesale">Wholesale (Bulk)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-700">Category *</Label>
                    <Select defaultValue="cylinders">
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cylinders">Cylinders & Heads</SelectItem>
                        <SelectItem value="engine">Engine Blocks</SelectItem>
                        <SelectItem value="crankshafts">Crankshafts</SelectItem>
                        <SelectItem value="clutch">Clutch Plates</SelectItem>
                        <SelectItem value="carburetors">Carburetors</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 relative">
                    <Label className="text-xs font-medium text-neutral-700">Brand Name *</Label>
                    <button
                      type="button"
                      onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                      className="w-full flex items-center justify-between h-9 px-3 rounded-lg border border-input bg-white text-left text-xs transition-colors hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
                    >
                      <span className={brandName ? "text-neutral-900 font-medium" : "text-neutral-500"}>
                        {brandName || "Select or search brand..."}
                      </span>
                      <ChevronDown className="size-3.5 text-neutral-400 shrink-0" />
                    </button>

                    {isBrandDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95">
                        <div className="p-2 border-b border-neutral-100 bg-neutral-50/70">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
                            <Input
                              placeholder="Search brand (Honda, Super Power, Unique...)"
                              value={brandSearch}
                              onChange={(e) => setBrandSearch(e.target.value)}
                              className="pl-7 h-8 text-xs bg-white"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-1 divide-y divide-neutral-50">
                          {filteredBrands.length === 0 ? (
                            <div className="p-3 text-center">
                              <p className="text-xs text-neutral-400">No matching brand found</p>
                              {brandSearch && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBrandName(brandSearch)
                                    setIsBrandDropdownOpen(false)
                                    setBrandSearch("")
                                  }}
                                  className="mt-1 text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                                >
                                  Use &quot;{brandSearch}&quot;
                                </button>
                              )}
                            </div>
                          ) : (
                            filteredBrands.map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => {
                                  setBrandName(b)
                                  setIsBrandDropdownOpen(false)
                                  setBrandSearch("")
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                                  brandName === b
                                    ? "bg-red-50 text-red-700 font-medium"
                                    : "hover:bg-neutral-50 text-neutral-800"
                                }`}
                              >
                                <span>{b}</span>
                                {brandName === b && <Check className="size-3.5 text-red-600" />}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <AdminProductColorSelector
                    selectedColors={selectedColors}
                    onChange={setSelectedColors}
                  />

                  <div className="space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-medium text-neutral-700">Selling Price (Rs.) *</Label>
                    <Input id="price" type="number" defaultValue="84000" className="h-9 text-xs" required />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="originalPrice" className="text-xs font-medium text-neutral-700">Original / Cut Price (Rs.)</Label>
                    <Input id="originalPrice" type="number" defaultValue="105000" className="h-9 text-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="stock" className="text-xs font-medium text-neutral-700">Stock Status *</Label>
                    <Select defaultValue="instock">
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instock">In Stock</SelectItem>
                        <SelectItem value="lowstock">Low Stock</SelectItem>
                        <SelectItem value="outofstock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="compatibleBikes" className="text-xs font-medium text-neutral-700">Compatible Bikes</Label>
                    <Select value={compatibleBike} onValueChange={(val: any) => setCompatibleBike(val || "")}>
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Select bike model / engine size..." />
                      </SelectTrigger>
                      <SelectContent>
                        {compatibleBikeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="description" className="text-xs font-medium text-neutral-700">Product Description</Label>
                    <textarea
                      id="description"
                      rows={4}
                      defaultValue="Genuine Crown CD70 complete cylinder head assembly. Compatible with standard 70cc engines. Includes valves, springs, and rocker arms."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-5 border-t border-neutral-100 flex items-center justify-end gap-3">
                <Link href="/admin/products">
                  <Button type="button" variant="outline" className="h-9 px-4 text-xs cursor-pointer">Cancel</Button>
                </Link>
                <Button type="submit" className="h-9 px-4 text-xs cursor-pointer">
                  {isSaved ? "✓ Changes Saved" : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
