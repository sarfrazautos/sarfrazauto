import { Metadata } from "next"
import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminBulkManageProductsSection } from "@/components/admin-dashboard/admin-bulk-manage-products-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Bulk Operations & Visibility Manager | Admin",
  description: "Bulk delete, hide models, and manage product catalog visibility",
}

export default function AdminBulkManagePage() {
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
        <AdminSiteHeader title="Bulk Operations & Visibility" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <AdminBulkManageProductsSection />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
