"use client"

import { useState, useRef } from "react"
import { Upload, X, Star, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export interface UploadedProductImage {
  id: string
  url: string
  name: string
  file?: File
}

export function AdminProductImageUploader({
  initialImages,
  initialMainIndex = 0,
  images: controlledImages,
  mainIndex: controlledMainIndex,
  disabled = false,
  onChange,
}: {
  initialImages?: UploadedProductImage[]
  initialMainIndex?: number
  images?: UploadedProductImage[]
  mainIndex?: number
  disabled?: boolean
  onChange?: (images: UploadedProductImage[], mainIndex: number) => void
}) {
  const [internalImages, setInternalImages] = useState<UploadedProductImage[]>(() => initialImages || [])
  const [internalMainIndex, setInternalMainIndex] = useState(initialMainIndex)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const isControlled = controlledImages !== undefined
  const images = isControlled ? controlledImages : internalImages
  const mainIndex = controlledMainIndex !== undefined ? controlledMainIndex : internalMainIndex

  const updateState = (newImages: UploadedProductImage[], newMainIndex: number) => {
    if (!isControlled) {
      setInternalImages(newImages)
      setInternalMainIndex(newMainIndex)
    }
    if (onChange) {
      onChange(newImages, newMainIndex)
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const newItems: UploadedProductImage[] = []
    let processed = 0

    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          url: reader.result as string,
          name: file.name,
          file,
        })
        processed++
        if (processed === fileArray.length) {
          const updated = [...images, ...newItems]
          updateState(updated, mainIndex)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSetMain = (index: number) => {
    updateState(images, index)
  }

  const handleRemove = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove)
    let nextMain = mainIndex
    if (indexToRemove === mainIndex) {
      nextMain = 0
    } else if (indexToRemove < mainIndex) {
      nextMain = Math.max(0, mainIndex - 1)
    }
    updateState(updated, nextMain)
  }

  const activeMainImage = images[mainIndex] || images[0]

  return (
    <Card className="border-neutral-200 shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-neutral-900">
            Product Images
          </CardTitle>
          {images.length > 0 && (
            <Badge variant="outline" className="text-[11px] font-normal border-neutral-200 text-neutral-600 bg-neutral-50">
              {images.length} {images.length === 1 ? "Image" : "Images"}
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs text-neutral-500">
          Upload multiple angles. The main image will display on the storefront.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ""
          }}
          className="hidden"
        />

        {images.length === 0 ? (
          <div
            onClick={() => {
              if (!disabled) fileInputRef.current?.click()
            }}
            className={`border-2 border-dashed border-neutral-200 rounded-xl aspect-square flex flex-col items-center justify-center gap-3 relative overflow-hidden p-4 text-center ${
              disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-neutral-400 hover:bg-neutral-50/50 transition-colors"
            }`}
          >
            <div className="size-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
              <Upload className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-800">
                Click to upload multiple images
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Select one or multiple photos (PNG, JPG, WEBP up to 5MB)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs pointer-events-none"
            >
              Choose from Storage
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="border border-neutral-200 rounded-xl aspect-square relative overflow-hidden bg-neutral-50 flex items-center justify-center group">
              <img
                src={activeMainImage.url}
                alt={activeMainImage.name || "Main Preview"}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-neutral-900 text-white hover:bg-neutral-900 text-[10px] font-semibold gap-1 px-2 py-0.5 shadow-sm">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  Main Image
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(mainIndex)}
                className="absolute top-2 right-2 size-6 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center z-10 cursor-pointer transition-colors"
                title="Remove main image"
              >
                <X className="size-3.5 text-neutral-700" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-600">
                  Gallery Thumbnails
                </span>
                <span className="text-[10px] text-neutral-400">
                  Click a thumbnail to set as main
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => {
                  const isMain = idx === mainIndex
                  return (
                    <div
                      key={img.id || idx}
                      onClick={() => handleSetMain(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all group ${
                        isMain
                          ? "border-neutral-900 ring-2 ring-neutral-900/10 shadow-xs"
                          : "border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />

                      {isMain && (
                        <div className="absolute top-1 left-1">
                          <span className="bg-neutral-900 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow-xs leading-none">
                            MAIN
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(idx)
                        }}
                        className="absolute top-1 right-1 size-4 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove"
                      >
                        <X className="size-2.5" />
                      </button>
                    </div>
                  )
                })}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
                  title="Add more images"
                >
                  <Plus className="size-4" />
                  <span className="text-[9px] font-medium mt-0.5">Add</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminProductImageUploader
