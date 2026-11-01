"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Trash2,
  Power,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

interface Offer {
  id: number
  title: string
  subtitle: string
  tagText: string
  discountPercent: number
  targetCategory: "all" | "retail" | "wholesale"
  startDate: string
  endDate: string
  buttonText: string
  buttonLink: string
  isActive: boolean
  createdAt: string
}

export function AdminOffersSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const [title, setTitle] = useState("Special Deal!")
  const [subtitle, setSubtitle] = useState("Get 10% OFF on all products")
  const [tagText, setTagText] = useState("10% OFF")
  const [discountPercent, setDiscountPercent] = useState("10")
  const [targetCategory, setTargetCategory] = useState<"all" | "retail" | "wholesale">("all")
  const [startDate, setStartDate] = useState(() => {
    const now = new Date()
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  })
  const [endDate, setEndDate] = useState(() => {
    const future = new Date(Date.now() + 48 * 60 * 60 * 1000)
    return new Date(future.getTime() - future.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  })
  const [isActive, setIsActive] = useState(true)

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/offers")
      const data = await res.json()
      if (data.success) {
        setOffers(data.offers || [])
      } else {
        toast.error("Failed to load offers")
      }
    } catch {
      toast.error("Network error while loading offers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!endDate) {
      toast.error("Please specify an end date and time")
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          tagText,
          discountPercent: Number(discountPercent) || 10,
          targetCategory,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          buttonText: "Shop Now",
          buttonLink: "/retail",
          isActive,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Special offer created successfully")
        setDialogOpen(false)
        fetchOffers()
      } else {
        toast.error(data.error || "Failed to create offer")
      }
    } catch {
      toast.error("Error creating special offer")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (offer: Offer) => {
    if (togglingId !== null) return
    try {
      setTogglingId(offer.id)
      const res = await fetch("/api/admin/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: offer.id,
          isActive: !offer.isActive,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(`Offer ${!offer.isActive ? "activated" : "deactivated"}`)
        setOffers((prev) =>
          prev.map((o) => (o.id === offer.id ? { ...o, isActive: !offer.isActive } : o))
        )
      } else {
        toast.error("Failed to update status")
      }
    } catch {
      toast.error("Error updating status")
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Offer deleted")
        setOffers((prev) => prev.filter((o) => o.id !== id))
      } else {
        toast.error("Failed to delete offer")
      }
    } catch {
      toast.error("Error deleting offer")
    }
  }

  const activeOffer = offers.find((o) => {
    if (!o.isActive) return false
    const now = new Date()
    return now >= new Date(o.startDate) && now <= new Date(o.endDate)
  })

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 bg-white min-h-[calc(100vh-theme(spacing.14))]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <Sparkles className="size-6 text-red-600" />
            Special Offers &amp; Flash Deals
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create promotional discount popups with live countdown timers for retail and wholesale customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOffers}
            className="cursor-pointer gap-1.5"
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="cursor-pointer gap-1.5 bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="size-4" />
            Create Offer
          </Button>
        </div>
      </div>

      {activeOffer ? (
        <Card className="border-red-200 bg-red-50/40 rounded-2xl overflow-hidden shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-semibold">
                  Live on Website
                </Badge>
                <Badge variant="outline" className="border-red-300 text-red-700 uppercase">
                  {activeOffer.targetCategory === "all"
                    ? "All Customers"
                    : `${activeOffer.targetCategory} only`}
                </Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={togglingId === activeOffer.id}
                onClick={() => handleToggle(activeOffer)}
                className="cursor-pointer text-xs h-8 border-red-200 hover:bg-red-100 text-red-700 disabled:opacity-60"
              >
                {togglingId === activeOffer.id ? (
                  <Loader2 className="size-3.5 mr-1 animate-spin" />
                ) : (
                  <Power className="size-3.5 mr-1" />
                )}
                {togglingId === activeOffer.id ? "Updating..." : "Deactivate"}
              </Button>
            </div>
            <CardTitle className="text-lg font-bold text-neutral-900 mt-2">
              {activeOffer.title} — {activeOffer.discountPercent}% Discount
            </CardTitle>
            <CardDescription className="text-neutral-600">
              {activeOffer.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-700 bg-white p-4 rounded-xl border border-red-100">
              <div>
                <span className="font-semibold block text-neutral-500">Discount Rate:</span>
                <span className="text-base font-bold text-red-600">{activeOffer.discountPercent}% OFF</span>
              </div>
              <div>
                <span className="font-semibold block text-neutral-500">Target Audience:</span>
                <span className="capitalize font-semibold text-neutral-900">{activeOffer.targetCategory}</span>
              </div>
              <div>
                <span className="font-semibold block text-neutral-500">Expires At:</span>
                <span className="font-semibold text-neutral-900">
                  {new Date(activeOffer.endDate).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-neutral-300 bg-neutral-50/50 rounded-2xl">
          <CardContent className="py-8 text-center space-y-3">
            <AlertCircle className="size-8 text-neutral-400 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-neutral-800">No Active Offer Running</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Create an offer to display the promotional popup with countdown timer to your visitors.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-xs"
            >
              <Plus className="size-3.5 mr-1" />
              Launch First Offer
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <CardHeader className="py-4 px-6 border-b border-neutral-100 bg-neutral-50/50">
          <CardTitle className="text-base font-semibold text-neutral-900">
            All Promotional Deals ({offers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No promotional deals found. Click &quot;Create Offer&quot; above.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-neutral-50">
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Deal Headline</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((item) => {
                  const now = new Date()
                  const isExpired = now > new Date(item.endDate)

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs text-neutral-500">#{item.id}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-neutral-900 text-xs sm:text-sm">
                          {item.title}
                        </div>
                        <div className="text-xs text-neutral-500 line-clamp-1">{item.subtitle}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-700 font-bold border-none text-xs">
                          {item.discountPercent}% OFF
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-xs font-semibold text-neutral-700">
                          {item.targetCategory}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-neutral-600">
                        {new Date(item.endDate).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        {isExpired ? (
                          <Badge variant="outline" className="border-neutral-300 text-neutral-500 text-[10px]">
                            Expired
                          </Badge>
                        ) : item.isActive ? (
                          <Badge className="bg-emerald-600 text-white text-[10px]">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-neutral-300 text-neutral-400 text-[10px]">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={togglingId === item.id}
                            onClick={() => handleToggle(item)}
                            title={item.isActive ? "Deactivate" : "Activate"}
                            className="size-8 p-0 cursor-pointer disabled:opacity-50"
                          >
                            {togglingId === item.id ? (
                              <Loader2 className="size-4 animate-spin text-neutral-600" />
                            ) : (
                              <Power
                                className={`size-4 ${item.isActive ? "text-emerald-600" : "text-neutral-400"}`}
                              />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            title="Delete offer"
                            className="size-8 p-0 text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-neutral-900">Create Special Offer</DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Configure the promotional popup offer, percentage discount, and countdown schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Title Headline</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Special Deal!"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tag Text (On Red Tag)</Label>
                <Input
                  value={tagText}
                  onChange={(e) => setTagText(e.target.value)}
                  placeholder="e.g. 10% OFF"
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Subtitle / Message</Label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Get 10% OFF on all products"
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Discount Percentage (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="10"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target Audience</Label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-neutral-200 bg-white px-2.5 text-xs text-neutral-900 outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="all">All Products (Both)</option>
                  <option value="retail">Retail Only</option>
                  <option value="wholesale">Wholesale Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Date &amp; Time</Label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Date &amp; Time</Label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_active_checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded accent-red-600 cursor-pointer"
              />
              <Label htmlFor="is_active_checkbox" className="text-xs font-medium cursor-pointer">
                Activate immediately on website
              </Label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
                className="cursor-pointer text-xs bg-red-600 hover:bg-red-700 text-white"
              >
                {submitting ? "Saving..." : "Create & Launch Deal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminOffersSection

