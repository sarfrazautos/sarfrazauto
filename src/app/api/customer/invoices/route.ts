import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { invoices } from "@/db/schema/invoices"
import { eq, ilike, and, or, desc, count } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    const search = searchParams.get("search")?.trim() || ""
    const status = searchParams.get("status")?.trim().toLowerCase() || ""

    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(invoices.invoiceNumber, `%${search}%`),
          ilike(invoices.orderNumber, `%${search}%`),
          ilike(invoices.customerName, `%${search}%`),
          ilike(invoices.itemsSummary, `%${search}%`)
        )
      )
    }

    if (status && status !== "all") {
      conditions.push(ilike(invoices.status, status))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [totalRow] = await db
      .select({ count: count() })
      .from(invoices)
      .where(whereClause)

    const total = Number(totalRow?.count || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const offset = (page - 1) * limit

    const items = await db
      .select()
      .from(invoices)
      .where(whereClause)
      .orderBy(desc(invoices.issueDate))
      .limit(limit)
      .offset(offset)

    const formattedInvoices = items.map((inv) => {
      const issueStr = inv.issueDate
        ? new Date(inv.issueDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Recently"

      const dueStr = inv.dueDate
        ? new Date(inv.dueDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "14 Days"

      return {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        orderNumber: inv.orderNumber,
        customerName: inv.customerName,
        customerPhone: inv.customerPhone,
        customerCity: inv.customerCity,
        dealerCode: inv.dealerCode || "DLR-5021",
        issueDate: issueStr,
        dueDate: dueStr,
        itemsSummary: inv.itemsSummary || "Motorcycle Spare Parts",
        items: inv.items || [],
        amount: inv.amount,
        status: inv.status,
        createdAt: inv.createdAt,
      }
    })

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch invoices" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.orderNumber || !body.customerName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (orderNumber, customerName)" },
        { status: 400 }
      )
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const invoiceNumber = body.invoiceNumber || `INV-2026-${randomSuffix}`

    const issueDate = body.issueDate ? new Date(body.issueDate) : new Date()
    const dueDate = body.dueDate ? new Date(body.dueDate) : new Date(issueDate.getTime() + 14 * 86400000)

    const [created] = await db
      .insert(invoices)
      .values({
        invoiceNumber,
        orderNumber: body.orderNumber.trim(),
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone || null,
        customerCity: body.customerCity || "Karachi",
        dealerCode: body.dealerCode || "DLR-5021",
        itemsSummary: body.itemsSummary || "Motorcycle Spare Parts",
        items: Array.isArray(body.items) ? body.items : [],
        amount: parseInt(body.amount, 10) || 0,
        status: body.status || "Pending",
        issueDate,
        dueDate,
      })
      .returning()

    return NextResponse.json(
      { success: true, invoice: created },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create invoice" },
      { status: 500 }
    )
  }
}
