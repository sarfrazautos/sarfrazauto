"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, Search, ChevronDown, Check, Loader2, AlertCircle } from "lucide-react"
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
import { uploadProductImage, getProductById, updateProduct } from "@/lib/api/products"
import { createSlug } from "@/lib/slug"

const bikeBrands = [
  "Crown",
  "Honda",
  "Yamaha",
  "Suzuki",
  "United",
  "Super Power",
  "Unique",
  "Super Star",
  "Road Prince",
  "Hi-Speed",
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
  "Fuel & Oils",
  "Others",
]

export function AdminEditProductSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const productId = searchParams.get("id")

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [name, setName] = useState("")
  const [productType, setProductType] = useState("wholesale")
  const [category, setCategory] = useState("Others")
  const [brandName, setBrandName] = useState("Crown")
  const [brandSearch, setBrandSearch] = useState("")
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [compatibleBike, setCompatibleBike] = useState("70cc")
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

  useEffect(() => {
    if (!productId) {
      setLoadError("No product ID provided")
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function fetchProduct() {
      try {
        setIsLoading(true)
        setLoadError("")
        const product = await getProductById(productId as string)
        if (!isMounted) return

        setName(product.name || "")
        setProductType(product.type || "wholesale")
        setCategory(product.category || "Others")
        setBrandName(product.brand || "Crown")
        setCompatibleBike(product.compatibleBike || "70cc")
        setPrice(product.price ? String(product.price) : "")
        setOriginalPrice(product.originalPrice ? String(product.originalPrice) : "")
        setStockStatus(product.stockStatus || "instock")
        setBadge(product.badge || "")
        setIsFeatured(Boolean(product.isFeatured))
        setDescription(product.description || "")
        setSelectedColors(Array.isArray(product.colors) ? product.colors : [])
        setMainImageIndex(typeof product.mainImageIndex === "number" ? product.mainImageIndex : 0)

        const rawImgs: string[] = Array.isArray(product.images) ? product.images : []
        const formattedImgs: UploadedProductImage[] = rawImgs.map((url, idx) => ({
          id: `existing-${idx}-${Date.now()}`,
          url,
          name: url.split("/").pop() || `image-${idx + 1}`,
        }))
        setProductImages(formattedImgs)
      } catch (err: any) {
        if (!isMounted) return
        setLoadError(err.message || "Failed to load product details")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [productId])

  const filteredBrands = bikeBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productId) {
      toast.error("Missing product ID")
      return
    }
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
    if (!brandName.trim()) {
      toast.error("Please select or search a brand")
      return
    }
    if (!price || isNaN(Number(price))) {
      toast.error("Please enter a valid selling price")
      return
    }

    try {
      setIsSubmitting(true)
      setUploadProgress(15)
      setProgressStage("Processing photos...")

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
            const progress = Math.round(15 + (uploaded / imagesToUpload.length) * 60)
            setUploadProgress(progress)
          } else {
            finalImageUrls.push(item.url)
          }
        }
      } else {
        finalImageUrls.push(...productImages.map((img) => img.url))
      }

      setUploadProgress(85)
      setProgressStage("Saving changes...")

      const targetSlug = createSlug(name)

      await updateProduct(productId, {
        name: name.trim(),
        slug: targetSlug,
        type: productType,
        category,
        brand: brandName.trim(),
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
      setProgressStage("Product updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product updated successfully!")

      setTimeout(() => {
        router.push("/admin/products")
      }, 800)
    } catch (err: any) {
      toast.error(err.message || "Failed to update product")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setUploadProgress(0)
        setProgressStage("")
      }, 1200)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-neutral-500 gap-3">
        <Loader2 className="size-6 animate-spin text-neutral-700" />
        <p className="text-xs">Loading product details...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="size-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 mb-1">Product Not Found</h3>
        <p className="text-xs text-neutral-500 mb-6">{loadError}</p>
        <Link href="/admin/products">
          <Button variant="outline" className="text-xs h-9">Back to Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 md:py-6">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/admin/dashboard" className="hover:text-neutral-900 transition-colors">Admin Panel</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/admin/products" className="hover:text-neutral-900 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-medium">Edit Product #{productId}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Edit Product</h2>
          <p className="text-sm text-neutral-500 mt-1">Update product specifications, images, and pricing.</p>
        </div>
      </div>

      {isSubmitting && (
        <Card className="border-neutral-200 bg-neutral-50/60 shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-700">
              <span className="flex items-center gap-1.5">
                <Loader2 className="size-3.5 animate-spin text-neutral-900" />
                {progressStage}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5 bg-neutral-200" />
          </CardContent>
        </Card>
      )}

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
                <CardDescription className="text-xs text-neutral-500">
                  Editing: {name || `Product #${productId}`}
                </CardDescription>
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
                      onValueChange={(val: any) => setProductType(val || "wholesale")}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue />
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
                      onValueChange={(val: any) => setCategory(val || "Others")}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue />
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
                    <Label className="text-xs font-medium text-neutral-700">Brand Name *</Label>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                      className="w-full flex items-center justify-between h-9 px-3 rounded-lg border border-input bg-white text-left text-xs transition-colors hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer disabled:opacity-50"
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
                              placeholder="Search brand (Crown, Honda, Yamaha...)"
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
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={isSubmitting}
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
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="stock" className="text-xs font-medium text-neutral-700">Stock Status *</Label>
                    <Select
                      value={stockStatus}
                      onValueChange={(val: any) => setStockStatus(val || "instock")}
                      disabled={isSubmitting}
                    >
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

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="description" className="text-xs font-medium text-neutral-700">Product Description</Label>
                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isSubmitting}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-5 border-t border-neutral-100 flex items-center justify-end gap-3">
                <Link href="/admin/products">
                  <Button type="button" variant="outline" disabled={isSubmitting} className="h-9 px-4 text-xs cursor-pointer">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="h-9 px-5 text-xs cursor-pointer bg-red-600 hover:bg-red-700 text-white">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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

export default AdminEditProductSection
