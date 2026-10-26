import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminAgingReportSection } from "@/components/admin-dashboard/admin-aging-report-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminAgingReportPage() {
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
        <AdminSiteHeader title="Aging Report" />
        <div className="flex flex-1 flex-col bg-white">
          <AdminAgingReportSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
