import { NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { schemes } from "@/db/schema/schemes"
import { createSlug } from "@/lib/slug"
import { eq, inArray } from "drizzle-orm"

function cleanKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function normalizeBikeModel(modelStr: string): string {
  const m = modelStr.toLowerCase().trim()
  if (m.includes("70")) return "70cc"
  if (m.includes("100")) return "100cc"
  if (m.includes("110")) return "110cc"
  if (m.includes("125")) return "125cc"
  if (m.includes("150")) return "150cc"
  if (m.includes("200")) return "200cc"
  if (m.includes("220")) return "220cc"
  if (m.includes("250")) return "250cc"
  return "All Models"
}

function detectCategory(nameStr: string): string {
  const n = nameStr.toLowerCase()
  if (n.includes("rim") || n.includes("wheel") || n.includes("drum") || n.includes("spoke")) return "Alloy Rims & Wheels"
  if (n.includes("tyre") || n.includes("tire") || n.includes("tube")) return "Tyres & Tubes"
  if (n.includes("oil") || n.includes("mobil") || n.includes("lubricant")) return "Fuel & Oils"
  if (n.includes("cylinder") || n.includes("head") || n.includes("valve") || n.includes("rocker")) return "Cylinders & Heads"
  if (n.includes("block") || n.includes("piston") || n.includes("ring") || n.includes("pin")) return "Engine Blocks"
  if (n.includes("crank") || n.includes("connecting rod") || n.includes("con rod")) return "Crankshafts"
  if (n.includes("clutch") || n.includes("friction")) return "Clutch Plates"
  if (n.includes("carburetor") || n.includes("carburator")) return "Carburetors"
  if (n.includes("shock") || n.includes("damper") || n.includes("spring")) return "Shock Absorbers"
  if (n.includes("back light") || n.includes("taillight") || n.includes("tail light")) return "Backlights"
  if (n.includes("head light") || n.includes("headlight")) return "Headlights"
  if (n.includes("fuel") || n.includes("petrol") || n.includes("tank")) return "Fuel Tanks"
  if (n.includes("silencer") || n.includes("exhaust") || n.includes("muffler")) return "Silencers"
  return "Others"
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: "No Excel file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const workbook = XLSX.read(buffer, { type: "buffer" })

    const existingProducts = await db.select().from(products)

    const dbLookup = new Map<string, typeof existingProducts[0]>()
    for (const p of existingProducts) {
      const k = cleanKey(p.name)
      dbLookup.set(k, p)
      const noCrown = k.replace(/^crown/, "")
      if (noCrown && noCrown !== k) {
        dbLookup.set(noCrown, p)
      }
    }

    const priceUpdates: any[] = []
    const unchanged: any[] = []
    const newProducts: any[] = []
    const processedKeys = new Set<string>()

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      if (!worksheet) continue

      const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      let headerRowIndex = -1

      for (let r = 0; r < Math.min(15, rows.length); r++) {
        const row = rows[r]
        if (row && row.some((c: any) => typeof c === "string" && (c.includes("ITEM CODE") || c.includes("NAME")))) {
          headerRowIndex = r
          break
        }
      }

      if (headerRowIndex === -1) continue

      for (let r = headerRowIndex + 1; r < rows.length; r++) {
        const row = rows[r]
        if (!row || (!row[1] && !row[3])) continue

        const itemCode = String(row[1] || "").trim()
        const model = String(row[2] || "").trim()
        const name = String(row[3] || "").trim()
        const urduName = String(row[4] || "").trim()
        const ctnQty = parseInt(String(row[5] || "0"), 10) || 0
        const cpPrice = parseInt(String(row[6] || "0"), 10) || 0
        const schemeQty = parseInt(String(row[7] || "0"), 10) || 0
        const schemeFoc = parseInt(String(row[8] || "0"), 10) || 0

        if (!name || cpPrice <= 0) continue

        const excelFullName = model ? `${model} ${name}` : name
        const excelFullWithCrown = `Crown ${excelFullName}`
        const uniqueDedupeKey = cleanKey(`${model}_${name}`)

        if (processedKeys.has(uniqueDedupeKey)) continue
        processedKeys.add(uniqueDedupeKey)

        const candidateKeys = [
          cleanKey(excelFullWithCrown),
          cleanKey(excelFullName),
          cleanKey(name),
        ]

        let matchedDbProduct: typeof existingProducts[0] | undefined

        for (const k of candidateKeys) {
          if (dbLookup.has(k)) {
            matchedDbProduct = dbLookup.get(k)
            break
          }
        }

        if (!matchedDbProduct) {
          const excelKey = cleanKey(excelFullName)
          for (const [dbK, dbP] of dbLookup.entries()) {
            if (dbK.length >= 8 && (dbK.includes(excelKey) || excelKey.includes(dbK))) {
              matchedDbProduct = dbP
              break
            }
          }
        }

        if (matchedDbProduct) {
          const oldPrice = Number(matchedDbProduct.price || 0)
          const newPrice = cpPrice
          const diff = newPrice - oldPrice
          const percentDiff = oldPrice > 0 ? Math.round((diff / oldPrice) * 100) : 0

          const updateItem = {
            id: matchedDbProduct.id,
            productId: matchedDbProduct.id,
            name: matchedDbProduct.name,
            excelName: excelFullName,
            itemCode,
            model,
            sheet: sheetName,
            brand: matchedDbProduct.brand,
            category: matchedDbProduct.category,
            compatibleBike: matchedDbProduct.compatibleBike,
            oldPrice,
            newPrice,
            diff,
            percentDiff,
            ctnQty,
            schemeQty,
            schemeFoc,
            selected: diff !== 0,
          }

          if (diff !== 0) {
            priceUpdates.push(updateItem)
          } else {
            unchanged.push(updateItem)
          }
        } else {
          newProducts.push({
            tempId: `new-${itemCode || cleanKey(excelFullName)}-${r}`,
            name: excelFullWithCrown,
            excelName: excelFullName,
            itemCode,
            model,
            sheet: sheetName,
            brand: "Crown",
            category: detectCategory(name),
            compatibleBike: normalizeBikeModel(model),
            type: "wholesale",
            price: cpPrice,
            originalPrice: null,
            ctnQty,
            schemeQty,
            schemeFoc,
            selected: true,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalParsed: priceUpdates.length + unchanged.length + newProducts.length,
        priceUpdatesCount: priceUpdates.length,
        unchangedCount: unchanged.length,
        newProductsCount: newProducts.length,
        sheets: workbook.SheetNames,
      },
      sheets: workbook.SheetNames,
      priceUpdates,
      unchanged,
      newProducts,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to parse Excel file" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { updates = [], newItems = [], updateSchemes = true } = body

    let updatedCount = 0
    let createdCount = 0

    if (Array.isArray(updates) && updates.length > 0) {
      for (const item of updates) {
        if (!item.id || typeof item.newPrice !== "number") continue
        await db
          .update(products)
          .set({
            price: Math.round(item.newPrice),
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.id))

        if (updateSchemes && item.schemeQty > 0 && item.schemeFoc > 0) {
          const [existingScheme] = await db
            .select()
            .from(schemes)
            .where(eq(schemes.productId, String(item.id)))
            .limit(1)

          if (existingScheme) {
            await db
              .update(schemes)
              .set({
                buyQty: item.schemeQty,
                freeQty: item.schemeFoc,
                status: "Active",
                updatedAt: new Date(),
              })
              .where(eq(schemes.id, existingScheme.id))
          } else {
            await db.insert(schemes).values({
              productId: String(item.id),
              productName: item.name,
              brand: item.brand || "Crown",
              category: item.category || "Others",
              buyQty: item.schemeQty,
              freeQty: item.schemeFoc,
              status: "Active",
            })
          }
        }
        updatedCount++
      }
    }

    if (Array.isArray(newItems) && newItems.length > 0) {
      for (const item of newItems) {
        if (!item.name || !item.price) continue
        const targetSlug = createSlug(item.name)
        const [inserted] = await db
          .insert(products)
          .values({
            name: item.name.trim(),
            slug: targetSlug,
            type: item.type || "wholesale",
            category: item.category || "Others",
            brand: item.brand || "Crown",
            price: Math.round(item.price),
            originalPrice: item.originalPrice ? Math.round(item.originalPrice) : null,
            stockStatus: "instock",
            compatibleBike: item.compatibleBike || "All Models",
            description: item.description || `Genuine ${item.brand || "Crown"} motorcycle spare part (${item.model || ""})`,
            colors: [],
            images: ["/bike-engine.png"],
            mainImageIndex: 0,
            badge: item.schemeQty && item.schemeFoc ? `Buy ${item.schemeQty}+${item.schemeFoc}` : null,
            isFeatured: false,
          })
          .returning({ id: products.id })

        if (inserted?.id && updateSchemes && item.schemeQty > 0 && item.schemeFoc > 0) {
          await db.insert(schemes).values({
            productId: String(inserted.id),
            productName: item.name,
            brand: item.brand || "Crown",
            category: item.category || "Others",
            buyQty: item.schemeQty,
            freeQty: item.schemeFoc,
            status: "Active",
          })
        }
        createdCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} products and created ${createdCount} new products.`,
      updatedCount,
      createdCount,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to apply Excel sync" }, { status: 500 })
  }
}
