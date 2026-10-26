import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminReturnsSection } from "@/components/admin-dashboard/admin-returns-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminReturnsPage() {
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
        <AdminSiteHeader title="Product Returns & RMA" />
        <div className="flex flex-1 flex-col bg-white">
          <AdminReturnsSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
