import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("files") as File[]
    const singleFile = formData.get("file") as File | null

    const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : []

    if (allFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    for (const file of allFiles) {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filename = `products/${Date.now()}-${sanitizedName}`

      const blob = await put(filename, file, {
        access: "public",
      })

      uploadedUrls.push(blob.url)
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    )
  }
}
