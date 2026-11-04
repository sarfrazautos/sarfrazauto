import { Metadata } from "next"
import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminPriceComparisonSection } from "@/components/admin-dashboard/admin-price-comparison-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Price Comparison & Audit | Sarfraz Autos Admin",
  description: "Audit cut prices against selling prices and fix pricing anomalies",
}

export default function AdminPriceComparisonPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <AdminSiteHeader title="Price Comparison & Audit" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <AdminPriceComparisonSection />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

