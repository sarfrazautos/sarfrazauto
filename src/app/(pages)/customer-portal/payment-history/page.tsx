import type { Metadata } from "next"
import { AppSidebar } from "@/components/wholesale-dashboard/app-sidebar"
import { SiteHeader } from "@/components/wholesale-dashboard/site-header"
import { PaymentHistorySection } from "@/components/payment-history/payment-history-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Payment History & Receipts | Sarfraz Autos Wholesale",
  description: "View cleared payments, bank transfer receipts, and payment channels for wholesale auto parts purchases.",
}

export default function PaymentHistoryPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <PaymentHistorySection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
