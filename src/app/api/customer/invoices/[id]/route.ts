import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { invoices } from "@/db/schema/invoices"
import { eq, or } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numId = parseInt(id, 10)

    const condition = !isNaN(numId)
      ? or(eq(invoices.id, numId), eq(invoices.invoiceNumber, id), eq(invoices.orderNumber, id))
      : or(eq(invoices.invoiceNumber, id), eq(invoices.orderNumber, id))

    const [item] = await db.select().from(invoices).where(condition)

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, invoice: item })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch invoice" },
      { status: 500 }
    )
  }
}
