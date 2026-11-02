"use client"

import { useState, useEffect } from "react"
import { Percent, Pencil, Loader2, Check } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { updateDealerRequest } from "@/lib/api/dealer-requests"

interface DealerDiscountCellProps {
  dealerId: string | number
  currentDiscount?: number
  shopName?: string
  status?: string
}

export function DealerDiscountCell({
  dealerId,
  currentDiscount = 0,
  shopName,
  status,
}: DealerDiscountCellProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [discount, setDiscount] = useState(Number(currentDiscount) || 0)
  const [value, setValue] = useState(String(currentDiscount || 0))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDiscount(Number(currentDiscount) || 0)
    setValue(String(currentDiscount || 0))
  }, [currentDiscount])

  const presets = [0, 5, 8, 10, 12, 15]

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValue(String(discount || 0))
    }
    setOpen(nextOpen)
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const numericValue = Math.max(0, Math.min(100, parseInt(value, 10) || 0))

    try {
      setLoading(true)
      setDiscount(numericValue)
      await updateDealerRequest(dealerId, { discountPercentage: numericValue })
      await queryClient.invalidateQueries({ queryKey: ["dealer-requests"] })
      toast.success(
        numericValue > 0
          ? `Set ${numericValue}% discount for ${shopName || "dealer"}`
          : `Removed discount for ${shopName || "dealer"}`
      )
      setOpen(false)
    } catch (err: any) {
      setDiscount(Number(currentDiscount) || 0)
      toast.error(err.message || "Failed to update discount")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        type="button"
        className={
          discount > 0
            ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer group shadow-2xs"
            : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-neutral-600 bg-neutral-100/80 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors cursor-pointer group"
        }
        title={discount > 0 ? "Click to change discount" : "Click to assign discount"}
      >
        {discount > 0 ? (
          <>
            <Percent className="size-3 text-emerald-600" />
            <span>{discount}% Discount</span>
            <Pencil className="size-2.5 text-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity" />
          </>
        ) : (
          <>
            <span className="font-bold text-neutral-700">0%</span>
            <span className="text-[10px] text-neutral-500 font-medium group-hover:underline">Set</span>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent align="center" className="w-64 p-3 space-y-3 bg-white">
        <div>
          <h4 className="text-xs font-bold text-neutral-900">Dealer Discount</h4>
          <p className="text-[11px] text-neutral-500 truncate mt-0.5">
            {shopName || "Wholesale Account"}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-8 text-xs font-bold"
                placeholder="0"
                autoFocus
              />
              <span className="text-xs font-bold text-neutral-600 shrink-0">% Off</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {presets.map((preset) => {
              const isActive = String(preset) === String(value)
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setValue(String(preset))}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    isActive
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {preset}%
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-neutral-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="h-7 px-2 text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              {loading ? (
                <Loader2 className="size-3 animate-spin mr-1" />
              ) : (
                <Check className="size-3 mr-1" />
              )}
              Save
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
