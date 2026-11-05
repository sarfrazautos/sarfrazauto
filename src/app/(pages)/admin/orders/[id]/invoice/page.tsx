import { db } from "@/lib/db"
import { orders } from "@/db/schema/orders"
import { eq, or } from "drizzle-orm"
import { OrderInvoiceView } from "@/components/invoice/order-invoice-view"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Order Invoice #${id} | Sarfraz Autos Admin`,
    description: `Official Sales Tax Invoice and Order Receipt`,
  }
}

export default async function AdminOrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const decoded = decodeURIComponent(id).trim()
  const numericId = parseInt(decoded, 10)

  let order = null

  if (!isNaN(numericId) && String(numericId) === decoded) {
    const [found] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, numericId))
      .limit(1)
    order = found
  }

  if (!order) {
    const [found] = await db
      .select()
      .from(orders)
      .where(
        or(
          eq(orders.orderNumber, decoded),
          eq(orders.orderNumber, `#${decoded}`),
          eq(orders.orderNumber, decoded.replace(/^#/, ""))
        )
      )
      .limit(1)
    order = found
  }

  return <OrderInvoiceView order={order} backUrl="/admin/orders" />
}

