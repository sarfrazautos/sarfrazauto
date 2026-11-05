import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminWholesaleStatusSection } from "@/components/admin-dashboard/admin-wholesale-status-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wholesale Status | Sarfraz Autos Admin",
  description: "Publish and manage timed wholesale announcements and flyer statuses",
}

export default function AdminWholesaleStatusPage() {
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
        <AdminSiteHeader title="Wholesale Status" />
        <div className="flex flex-1 flex-col bg-white">
          <AdminWholesaleStatusSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

