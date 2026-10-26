import { redirect } from "next/navigation"

export default function BulkOrdersRedirect() {
  redirect("/customer-portal/orders")
}
