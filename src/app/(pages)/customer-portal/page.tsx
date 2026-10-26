import { AppSidebar } from "@/components/wholesale-dashboard/app-sidebar"
import { SectionCards } from "@/components/wholesale-dashboard/section-cards"
import { SiteHeader } from "@/components/wholesale-dashboard/site-header"
import { CustomerSpendingChart } from "@/components/wholesale-dashboard/customer-spending-chart"
import { CustomerCategoryChart } from "@/components/wholesale-dashboard/customer-category-chart"
import { WholesaleOrderHistorySection } from "@/components/wholesale-dashboard/wholesale-order-history-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function WholesaleDashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="grid grid-cols-12 gap-4 lg:gap-6 px-4 lg:px-6">
                <div className="xl:col-span-8 col-span-12">
                  <CustomerSpendingChart />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <CustomerCategoryChart />
                </div>
              </div>
              <WholesaleOrderHistorySection />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}