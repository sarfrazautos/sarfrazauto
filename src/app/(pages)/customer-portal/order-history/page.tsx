import { redirect } from "next/navigation"

export default function OrderHistoryRedirect() {
  redirect("/customer-portal/orders")
}
