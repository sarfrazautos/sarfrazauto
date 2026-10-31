export function formatWhatsAppPhone(phone?: string | null): string | null {
  if (!phone) return null
  const cleaned = phone.replace(/[^0-9]/g, "")
  if (!cleaned) return null

  if (cleaned.startsWith("92") && cleaned.length >= 12) {
    return cleaned
  }

  if (cleaned.startsWith("03") && cleaned.length === 11) {
    return "92" + cleaned.slice(1)
  }

  if (cleaned.startsWith("3") && cleaned.length === 10) {
    return "92" + cleaned
  }

  return cleaned
}

export async function sendWhatsAppMessage({
  to,
  message,
}: {
  to: string
  message: string
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneId) {
    return { success: false, error: "WhatsApp credentials not configured" }
  }

  const formattedTo = formatWhatsAppPhone(to)
  if (!formattedTo) {
    return { success: false, error: "Invalid phone number" }
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedTo,
        type: "text",
        text: { body: message },
      }),
    })

    const data = await res.json()
    if (!res.ok || data.error) {
      return { success: false, error: data.error?.message || "Failed to send WhatsApp message" }
    }

    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message || "Network error" }
  }
}

export async function sendOrderWhatsAppAlerts(order: {
  orderNumber: string
  customerName: string
  customerPhone?: string | null
  customerCity?: string | null
  totalAmount: number
  orderType?: string | null
  items?: any[]
  notes?: string | null
}) {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER || "923332624410"

  const itemsList = Array.isArray(order.items)
    ? order.items
        .map((i: any) => `• ${i.title || i.name} x${i.quantity || 1} (Rs. ${(i.price || 0).toLocaleString()})`)
        .slice(0, 10)
        .join("\n")
    : "Items attached in dashboard"

  const adminMsg = `🔔 *NEW ORDER RECEIVED - Sarfraz Autos*

*Order #:* ${order.orderNumber}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone || "N/A"}
*City:* ${order.customerCity || "N/A"}
*Type:* ${(order.orderType || "retail").toUpperCase()}
*Total Amount:* Rs. ${order.totalAmount.toLocaleString()}

*Items:*
${itemsList}

${order.notes ? `*Notes:* ${order.notes}` : ""}

🌐 Check admin panel for full details & shipping.`

  const customerMsg = `✅ *ORDER CONFIRMED - Sarfraz Autos*

Dear *${order.customerName}*,
Thank you for shopping with Sarfraz Autos! Your order has been placed successfully.

*Order #:* ${order.orderNumber}
*Total Amount:* Rs. ${order.totalAmount.toLocaleString()}
*Delivery City:* ${order.customerCity || "Karachi"}

*Items:*
${itemsList}

Our team will dispatch your spare parts shortly. For any inquiries, reach us at ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+92 333 1285556"}.`

  const results = await Promise.allSettled([
    sendWhatsAppMessage({ to: adminNumber, message: adminMsg }),
    order.customerPhone
      ? sendWhatsAppMessage({ to: order.customerPhone, message: customerMsg })
      : Promise.resolve({ success: false, error: "No customer phone provided" }),
  ])

  return results
}

