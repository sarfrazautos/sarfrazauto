import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminPaymentManagementSection } from "@/components/admin-dashboard/admin-payment-management-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminPaymentsPage() {
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
        <AdminSiteHeader title="Payment Management" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <AdminPaymentManagementSection />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
