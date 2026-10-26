"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Pencil, Trash2, Eye, Loader2, PackageOpen, AlertTriangle } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdminPagination } from "@/components/admin-dashboard/admin-pagination"
import { getProducts, deleteProduct } from "@/lib/api/products"

export function AdminProductsTable() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [productToDelete, setProductToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const limit = 20

  const { data, isLoading } = useQuery({
    queryKey: [
      "products",
      {
        page: currentPage,
        limit,
        search: searchQuery,
        type: typeFilter === "All" ? "" : typeFilter.toLowerCase(),
      },
    ],
    queryFn: () =>
      getProducts({
        page: currentPage,
        limit,
        search: searchQuery,
        type: typeFilter === "All" ? "" : typeFilter.toLowerCase(),
      }),
  })

  const products = data?.products || []
  const totalPages = data?.pagination?.totalPages || 1

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    try {
      setIsDeleting(true)
      await deleteProduct(productToDelete.id)
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products-stats"] })
      toast.success("Product deleted successfully")
      setProductToDelete(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product")
    } finally {
      setIsDeleting(false)
    }
  }

  const getStockBadge = (stock: string) => {
    const s = (stock || "").toLowerCase()
    if (s === "instock" || s === "in stock") {
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">In Stock</Badge>
    }
    if (s === "lowstock" || s === "low stock") {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Low Stock</Badge>
    }
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Out of Stock</Badge>
  }

  const formatDate = (dateVal: any) => {
    if (!dateVal) return "—"
    try {
      const d = new Date(dateVal)
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    } catch {
      return "—"
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">All Products</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Manage retail and wholesale product listings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8 h-8 text-xs bg-white"
            />
          </div>
          <div className="flex items-center gap-1">
            {["All", "Retail", "Wholesale"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTypeFilter(t)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  typeFilter === t
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Link href="/admin/products/upload">
            <Button size="sm" className="h-8 text-xs cursor-pointer">
              + Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-xl bg-white shadow-xs overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-neutral-700">Product</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Category</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Type</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Price</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Stock</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700">Added</TableHead>
              <TableHead className="text-xs font-semibold text-neutral-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-5 animate-spin text-neutral-400" />
                    <span className="text-xs">Loading products...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageOpen className="size-8 text-neutral-300" />
                    <p className="text-xs font-medium text-neutral-700">No products found</p>
                    <p className="text-[11px] text-neutral-400">
                      {searchQuery ? "Try a different search query" : "Upload your first product to get started"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: any) => {
                const primaryImage =
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[product.mainImageIndex || 0] || product.images[0]
                    : null

                const isWholesale = (product.type || "").toLowerCase() === "wholesale"

                return (
                  <TableRow key={product.id} className="text-xs hover:bg-neutral-50/70">
                    <TableCell className="max-w-[240px]">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={product.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <PackageOpen className="size-4 text-neutral-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 truncate">{product.name}</p>
                          <p className="font-mono text-[10px] text-neutral-400">P-{String(product.id).padStart(3, "0")}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-600">{product.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isWholesale
                            ? "bg-blue-50 text-blue-700 border-blue-200 text-xs"
                            : "bg-purple-50 text-purple-700 border-purple-200 text-xs"
                        }
                      >
                        {isWholesale ? "Wholesale" : "Retail"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-900 whitespace-nowrap">
                      Rs. {Number(product.price || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStockBadge(product.stockStatus)}</TableCell>
                    <TableCell className="text-neutral-600 whitespace-nowrap">{formatDate(product.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={product.slug ? `/product-overview/${product.slug}` : `/product-overview?id=${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer">
                            <Eye className="size-3.5 text-neutral-500" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/edit?id=${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer">
                            <Pencil className="size-3.5 text-blue-600" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setProductToDelete(product)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
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
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <AlertDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setProductToDelete(null)
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-red-600">
              <AlertTriangle className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-neutral-900">{productToDelete?.name}</span>? This will permanently remove it from the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setProductToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="flex items-center gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminProductsTable
