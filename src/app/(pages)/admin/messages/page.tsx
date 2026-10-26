import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminContactInquiriesSection } from "@/components/admin-dashboard/contact-inquiries/admin-contact-inquiries-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminMessagesPage() {
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
        <AdminSiteHeader title="Contact Messages" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <AdminContactInquiriesSection />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
