import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminUploadProductSection } from "@/components/admin-dashboard/admin-upload-product-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminUploadProductPage() {
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
        <AdminSiteHeader title="Upload Product" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <AdminUploadProductSection />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
