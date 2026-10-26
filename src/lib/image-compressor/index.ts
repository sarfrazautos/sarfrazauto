import imageCompression from "browser-image-compression"

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  savedPercent: number
  previewUrl: string
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export async function compressImage(
  file: File,
  customOptions: Record<string, any> = {}
): Promise<CompressionResult> {
  const originalSize = file.size

  if (!file.type.startsWith("image/")) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      previewUrl: URL.createObjectURL(file),
    }
  }

  const defaultOptions = {
    maxSizeMB: 0.15,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.82,
    ...customOptions,
  }

  try {
    const compressedBlob = await imageCompression(file, defaultOptions)
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name
    const compressedFileName = `${baseName}.webp`

    const compressedFile = new File([compressedBlob], compressedFileName, {
      type: "image/webp",
      lastModified: Date.now(),
    })

    const compressedSize = compressedFile.size
    const savedPercent =
      originalSize > 0
        ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
        : 0

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      savedPercent,
      previewUrl: URL.createObjectURL(compressedFile),
    }
  } catch {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      previewUrl: URL.createObjectURL(file),
    }
  }
}

export async function compressImages(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = []
  const total = files.length

  for (let i = 0; i < total; i++) {
    const res = await compressImage(files[i])
    results.push(res)
    if (onProgress) {
      onProgress(i + 1, total)
    }
  }

  return results
}
