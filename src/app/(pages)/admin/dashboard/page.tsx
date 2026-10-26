import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminStatisticsBlock } from "@/components/admin-dashboard/admin-statistics-block"
import { AdminSalesOverviewChart } from "@/components/admin-dashboard/admin-sales-overview-chart"
import { AdminEarningReportChart } from "@/components/admin-dashboard/admin-earning-report-chart"
import { AdminDealerRequestsTable } from "@/components/admin-dashboard/admin-dealer-requests-table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminDashboardPage() {
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
        <AdminSiteHeader title="Admin Dashboard" />
        <div className="flex flex-1 flex-col bg-white">
          <div className="grid grid-cols-12 gap-6 p-4 lg:p-6 w-full bg-white">
            <div className="col-span-12">
              <AdminStatisticsBlock />
            </div>
            <div className="xl:col-span-8 col-span-12">
              <AdminSalesOverviewChart />
            </div>
            <div className="xl:col-span-4 col-span-12">
              <AdminEarningReportChart />
            </div>
            <div className="col-span-12">
              <AdminDealerRequestsTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
