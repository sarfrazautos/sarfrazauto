"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, Search, ChevronDown, Check, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
import { uploadProductImage, createProduct } from "@/lib/api/products"
import { createSlug } from "@/lib/slug"

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
  "Servis",
  "Panther",
  "Diamond Tyres",
  "General Tyre",
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

const categoryOptions = [
  "Tyres & Tubes",
  "Fuel & Oils",
  "Cylinders & Heads",
  "Engine Blocks",
  "Crankshafts",
  "Clutch Plates",
  "Carburetors",
  "Alloy Rims & Wheels",
  "Shock Absorbers",
  "Backlights",
  "Headlights",
  "Fuel Tanks",
  "Silencers",
  "Others",
]

export function AdminUploadProductSection() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [name, setName] = useState("")
  const [productType, setProductType] = useState("")
  const [category, setCategory] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [brandSearch, setBrandSearch] = useState("")
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [compatibleBike, setCompatibleBike] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [productImages, setProductImages] = useState<UploadedProductImage[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [stockStatus, setStockStatus] = useState("instock")
  const [badge, setBadge] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [description, setDescription] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [progressStage, setProgressStage] = useState("")

  const toggleBrand = (b: string) => {
    const trimmed = b.trim()
    if (!trimmed) return
    setSelectedBrands((prev) =>
      prev.includes(trimmed) ? prev.filter((x) => x !== trimmed) : [...prev, trimmed]
    )
  }

  const removeBrand = (b: string) => {
    setSelectedBrands((prev) => prev.filter((x) => x !== b))
  }

  const filteredBrands = bikeBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter a product name")
      return
    }
    if (!productType) {
      toast.error("Please select a listing type")
      return
    }
    if (!category) {
      toast.error("Please select a category")
      return
    }
    if (selectedBrands.length === 0) {
      toast.error("Please select at least one brand (e.g. Honda, Super Power)")
      return
    }
    if (!price || isNaN(Number(price))) {
      toast.error("Please enter a valid selling price")
      return
    }

    const targetSlug = createSlug(name)
    if (!targetSlug) {
      toast.error("Please enter a valid product name")
      return
    }

    try {
      const checkRes = await fetch(`/api/products/${encodeURIComponent(targetSlug)}`)
      const checkData = await checkRes.json()
      if (checkRes.ok && checkData.success && checkData.product) {
        toast.error("This product with this name is already available, please choose a different name")
        return
      }
    } catch {
    }

    try {
      setIsSubmitting(true)
      setUploadProgress(10)
      setProgressStage("Preparing upload...")

      const finalImageUrls: string[] = []
      const imagesToUpload = productImages.filter((img) => img.file)

      if (imagesToUpload.length > 0) {
        let uploaded = 0
        for (const item of productImages) {
          if (item.file) {
            setProgressStage(`Uploading image ${uploaded + 1} of ${imagesToUpload.length}...`)
            const url = await uploadProductImage(item.file)
            finalImageUrls.push(url)
            uploaded++
            const progress = Math.round(10 + (uploaded / imagesToUpload.length) * 65)
            setUploadProgress(progress)
          } else {
            finalImageUrls.push(item.url)
          }
        }
      } else {
        finalImageUrls.push(...productImages.map((img) => img.url))
      }

      setUploadProgress(85)
      setProgressStage("Saving product details...")

      await createProduct({
        name: name.trim(),
        slug: targetSlug,
        type: productType,
        category,
        brand: selectedBrands.join(", "),
        price: parseInt(price, 10),
        originalPrice: originalPrice ? parseInt(originalPrice, 10) : null,
        stockStatus,
        compatibleBike: compatibleBike || null,
        description: description.trim() || null,
        colors: selectedColors,
        images: finalImageUrls,
        mainImageIndex: Math.min(mainImageIndex, Math.max(0, finalImageUrls.length - 1)),
        badge: badge || null,
        isFeatured,
      })

      setUploadProgress(100)
      setProgressStage("Product uploaded successfully!")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product uploaded successfully!")

      setTimeout(() => {
        router.push("/admin/products")
      }, 1000)
    } catch (err: any) {
      toast.error(err.message || "Failed to upload product")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setUploadProgress(0)
        setProgressStage("")
      }, 1500)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-neutral-900 transition-colors">Admin Panel</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/admin/products" className="hover:text-neutral-900 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">Upload Product</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Upload New Product</h2>
          <p className="text-sm text-neutral-500 mt-1">Fill in the product details and upload photos to list it on the store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-5">
            <AdminProductImageUploader
              images={productImages}
              mainIndex={mainImageIndex}
              disabled={isSubmitting}
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
                <CardDescription className="text-xs text-neutral-500">All fields marked with * are required.</CardDescription>
              </CardHeader>

              <CardContent className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="productName" className="text-xs font-medium text-neutral-700">Product Name *</Label>
                    <Input
                      id="productName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. CD70 Complete Cylinder Head"
                      className="h-9 text-xs"
                      required
                    />
                    {name.trim() && (
                      <p className="text-[11px] text-neutral-400 font-mono tracking-tight opacity-60">
                        slug: /{createSlug(name)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-700">Listing Type *</Label>
                    <Select
                      value={productType}
                      onValueChange={(val: any) => setProductType(val || "")}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail (Single Unit)</SelectItem>
                        <SelectItem value="wholesale">Wholesale (Bulk)</SelectItem>
                        <SelectItem value="both">Both (Retail & Wholesale)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-700">Category *</Label>
                    <Select
                      value={category}
                      onValueChange={(val: any) => setCategory(val || "")}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 relative">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-neutral-700">Brands / Companies *</Label>
                      {selectedBrands.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedBrands([])}
                          className="text-[11px] text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                      className="w-full flex items-center justify-between min-h-9 py-1 px-3 rounded-lg border border-input bg-white text-left text-xs transition-colors hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer disabled:opacity-50"
                    >
                      <span className={selectedBrands.length > 0 ? "text-neutral-900 font-medium truncate pr-2" : "text-neutral-500"}>
                        {selectedBrands.length > 0
                          ? `${selectedBrands.length} selected: ${selectedBrands.join(", ")}`
                          : "Select brands (e.g. Honda, Super Power)..."}
                      </span>
                      <ChevronDown className="size-3.5 text-neutral-400 shrink-0" />
                    </button>

                    {selectedBrands.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedBrands.map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-[11px] font-medium border border-neutral-200"
                          >
                            <span>{b}</span>
                            <button
                              type="button"
                              onClick={() => removeBrand(b)}
                              className="text-neutral-400 hover:text-red-600 cursor-pointer"
                            >
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {isBrandDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
                        <div className="p-2 border-b border-neutral-100 bg-neutral-50/70">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
                            <Input
                              placeholder="Search or add brand..."
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
                              <p className="text-xs text-neutral-400">No preset brand matching &quot;{brandSearch}&quot;</p>
                              {brandSearch.trim() && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleBrand(brandSearch.trim())
                                    setBrandSearch("")
                                  }}
                                  className="mt-1.5 text-xs text-red-600 hover:underline font-medium cursor-pointer"
                                >
                                  + Add &quot;{brandSearch.trim()}&quot;
                                </button>
                              )}
                            </div>
                          ) : (
                            <>
                              {filteredBrands.map((b) => {
                                const isChecked = selectedBrands.includes(b)
                                return (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => toggleBrand(b)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                                      isChecked
                                        ? "bg-red-50 text-red-700 font-medium"
                                        : "hover:bg-neutral-50 text-neutral-800"
                                    }`}
                                  >
                                    <span>{b}</span>
                                    {isChecked && <Check className="size-3.5 text-red-600" />}
                                  </button>
                                )
                              })}
                              {brandSearch.trim() && !filteredBrands.some((b) => b.toLowerCase() === brandSearch.trim().toLowerCase()) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleBrand(brandSearch.trim())
                                    setBrandSearch("")
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 font-medium rounded-lg cursor-pointer"
                                >
                                  + Add &quot;{brandSearch.trim()}&quot;
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <div className="p-1.5 bg-neutral-50 border-t border-neutral-100 flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsBrandDropdownOpen(false)}
                            className="h-7 text-xs font-medium text-neutral-700 cursor-pointer"
                          >
                            Done
                          </Button>
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
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. 84000"
                      className="h-9 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="originalPrice" className="text-xs font-medium text-neutral-700">Original / Cut Price (Rs.)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. 105000"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="stock" className="text-xs font-medium text-neutral-700">Stock Status *</Label>
                    <Select
                      value={stockStatus}
                      onValueChange={(val: any) => setStockStatus(val || "instock")}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Select status..." />
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
                    <Select
                      value={compatibleBike}
                      onValueChange={(val: any) => setCompatibleBike(val || "")}
                      disabled={isSubmitting}
                    >
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

                  <div className="space-y-1.5">
                    <Label htmlFor="badge" className="text-xs font-medium text-neutral-700">Product Badge</Label>
                    <Select
                      value={badge}
                      onValueChange={(val: any) => setBadge(val || "")}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Optional badge..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="Best Seller">Best Seller</SelectItem>
                        <SelectItem value="New Arrival">New Arrival</SelectItem>
                        <SelectItem value="Popular">Popular</SelectItem>
                        <SelectItem value="Discount">Discount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 mt-auto">
                    <div>
                      <Label htmlFor="isFeatured" className="text-xs font-medium text-neutral-900 cursor-pointer">Feature on Storefront</Label>
                      <p className="text-[11px] text-neutral-500">Show this item in the featured products showcase</p>
                    </div>
                    <input
                      id="isFeatured"
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      disabled={isSubmitting}
                      className="size-4 accent-red-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="description" className="text-xs font-medium text-neutral-700">Product Description</Label>
                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Describe the product, its key specs and compatibility..."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {isSubmitting && (
                  <div className="w-full space-y-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-700">{progressStage}</span>
                      <span className="font-semibold text-neutral-900">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2 w-full" />
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-5 border-t border-neutral-100 flex items-center justify-end gap-3">
                <Link href="/admin/products">
                  <Button type="button" variant="outline" disabled={isSubmitting} className="h-9 px-4 text-xs cursor-pointer">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-4 text-xs cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Uploading ({uploadProgress}%)...</span>
                    </>
                  ) : (
                    "Upload Product"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminUploadProductSection
