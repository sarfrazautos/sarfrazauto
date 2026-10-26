import type { Metadata } from "next"
import { AppSidebar } from "@/components/wholesale-dashboard/app-sidebar"
import { SiteHeader } from "@/components/wholesale-dashboard/site-header"
import { DealerAccountSection } from "@/components/dealer-account/dealer-account-section"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Dealer Account Profile | Sarfraz Autos Wholesale",
  description: "Manage registered wholesale motorcycle spare parts dealer account and shop details.",
}

export default function DealerAccountPage() {
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
          <DealerAccountSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
