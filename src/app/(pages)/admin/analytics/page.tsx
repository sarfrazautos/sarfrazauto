import { AdminSidebar } from "@/components/admin-dashboard/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-dashboard/admin-site-header"
import { AdminAnalyticsView } from "@/components/admin-dashboard/admin-analytics-view"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics | Sarfraz Autos Admin",
  description: "Track your website performance and visitor analytics",
}

export default function AdminAnalyticsPage() {
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
        <AdminSiteHeader title="Google Analytics" />
        <div className="flex flex-1 flex-col bg-white">
          <AdminAnalyticsView />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

