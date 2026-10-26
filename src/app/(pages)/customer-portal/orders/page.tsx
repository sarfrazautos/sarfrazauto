import type { Metadata } from "next"
import { AppSidebar } from "@/components/wholesale-dashboard/app-sidebar"
import { SiteHeader } from "@/components/wholesale-dashboard/site-header"
import { CustomerOrdersSection } from "@/components/customer-orders/customer-orders-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "My Orders | Sarfraz Autos Customer Portal",
  description: "Track all your motorcycle spare parts purchases, wholesale bookings, and order receipts.",
}

export default function CustomerOrdersPage() {
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
          <CustomerOrdersSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
