"use client"

import { useState, useRef, useEffect } from "react"
import { X, ChevronDown, Check, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { PRODUCT_COLORS, getColorHex } from "@/lib/product-colors"

export function AdminProductColorSelector({
  selectedColors = [],
  onChange,
}: {
  selectedColors: string[]
  onChange: (colors: string[]) => void
}) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredSuggestions = PRODUCT_COLORS.filter(
    (c) =>
      !selectedColors.some((sc) => sc.toLowerCase() === c.name.toLowerCase()) &&
      c.name.toLowerCase().includes(query.toLowerCase())
  )

  const addColor = (colorName: string) => {
    const trimmed = colorName.trim()
    if (!trimmed) return

    const matched = PRODUCT_COLORS.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    )
    const finalName = matched ? matched.name : trimmed

    if (!selectedColors.some((c) => c.toLowerCase() === finalName.toLowerCase())) {
      onChange([...selectedColors, finalName])
    }
    setQuery("")
    setIsOpen(false)
    setHighlightedIndex(0)
    inputRef.current?.focus()
  }

  const removeColor = (colorToRemove: string) => {
    onChange(selectedColors.filter((c) => c !== colorToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (filteredSuggestions.length > 0 && isOpen) {
        const item = filteredSuggestions[highlightedIndex] || filteredSuggestions[0]
        if (item) {
          addColor(item.name)
          return
        }
      }
      if (query.trim()) {
        addColor(query.trim())
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      } else if (filteredSuggestions.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % filteredSuggestions.length)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (isOpen && filteredSuggestions.length > 0) {
        setHighlightedIndex((prev) =>
          prev === 0 ? filteredSuggestions.length - 1 : prev - 1
        )
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <Label htmlFor="productColors" className="text-xs font-medium text-neutral-700">
          Available Colors
        </Label>
        {selectedColors.length > 0 && (
          <span className="text-[10px] text-neutral-400">
            {selectedColors.length} {selectedColors.length === 1 ? "color" : "colors"} selected
          </span>
        )}
      </div>

      <div className="relative">
        <Input
          ref={inputRef}
          id="productColors"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setHighlightedIndex(0)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type color (e.g. Green, Red) & press Enter..."
          className="h-9 text-xs pr-8 bg-white"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
          tabIndex={-1}
        >
          <ChevronDown className="size-3.5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-neutral-200 bg-white shadow-md overflow-hidden animate-in fade-in-0 zoom-in-95">
          <div className="max-h-48 overflow-y-auto p-1 divide-y divide-neutral-50">
            {filteredSuggestions.length === 0 ? (
              <div className="p-2.5 text-center">
                <p className="text-xs text-neutral-400">No preset matching color</p>
                {query.trim() && (
                  <button
                    type="button"
                    onClick={() => addColor(query)}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                  >
                    <Plus className="size-3" />
                    Add &quot;{query.trim()}&quot; as custom color
                  </button>
                )}
              </div>
            ) : (
              filteredSuggestions.map((item, index) => {
                const isHighlighted = index === highlightedIndex
                return (
                  <button
                    key={item.name}
                    type="button"
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => addColor(item.name)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs rounded-md transition-colors cursor-pointer ${
                      isHighlighted
                        ? "bg-neutral-100 text-neutral-900"
                        : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3.5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {isHighlighted && <span className="text-[10px] text-neutral-400">Enter ↵</span>}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5 min-h-6 pt-0.5">
        {selectedColors.length === 0 ? (
          <p className="text-[11px] text-neutral-400">
            No colors added yet. Type a color name above to add.
          </p>
        ) : (
          selectedColors.map((color) => {
            const hex = getColorHex(color)
            return (
              <Badge
                key={color}
                variant="outline"
                className="h-6 gap-1.5 px-2 py-0 text-xs font-normal border-neutral-200 bg-neutral-50 text-neutral-800 rounded-md shadow-2xs"
              >
                <span
                  className="size-2.5 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <span>{color}</span>
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="size-3.5 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-700 cursor-pointer ml-0.5"
                  title={`Remove ${color}`}
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AdminProductColorSelector
