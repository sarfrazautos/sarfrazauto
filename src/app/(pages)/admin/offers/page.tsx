import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminOffersSection } from "@/components/admin-dashboard/admin-offers-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminOffersPage() {
  return (
    <SidebarProvider
      className="bg-white !bg-white"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 14)",
          "--sidebar": "white",
          "--sidebar-background": "white",
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <SidebarInset className="bg-white !bg-white">
        <AdminSiteHeader title="Special Offers" />
        <div className="flex flex-1 flex-col bg-white">
          <AdminOffersSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

