import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminSchemesSection } from "@/components/admin-dashboard/admin-schemes-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminSchemesPage() {
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
        <AdminSiteHeader title="Trade Schemes" />
        <div className="flex flex-1 flex-col bg-white">
          <AdminSchemesSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
