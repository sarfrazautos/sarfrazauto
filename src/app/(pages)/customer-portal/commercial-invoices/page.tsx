import type { Metadata } from "next"
import { AppSidebar } from "@/components/wholesale-dashboard/app-sidebar"
import { SiteHeader } from "@/components/wholesale-dashboard/site-header"
import { CommercialInvoicesSection } from "@/components/commercial-invoices/commercial-invoices-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Commercial Invoices | Sarfraz Autos Wholesale",
  description: "View and download official commercial tax invoices for wholesale auto parts purchases.",
}

export default function CommercialInvoicesPage() {
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
          <CommercialInvoicesSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
