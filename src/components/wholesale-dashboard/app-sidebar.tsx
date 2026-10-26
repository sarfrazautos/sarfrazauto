"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { NavDocuments } from "@/components/wholesale-dashboard/nav-documents"
import { NavMain } from "@/components/wholesale-dashboard/nav-main"
import { NavSecondary } from "@/components/wholesale-dashboard/nav-secondary"
import { NavUser } from "@/components/wholesale-dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  PackageIcon,
  ClipboardListIcon,
  FileTextIcon,
  ReceiptTextIcon,
  CircleHelpIcon,
  Home,
} from "lucide-react"
import Link from "next/link"
import { getCustomerProfile } from "@/lib/api/customer-profile"

const defaultData = {
  navMain: [
    {
      title: "Overview",
      url: "/customer-portal",
      icon: <LayoutDashboardIcon className="size-4" />,
    },
    {
      title: "My Orders",
      url: "/customer-portal/orders",
      icon: <ClipboardListIcon className="size-4" />,
    },
    {
      title: "Shop",
      url: "/wholesale",
      icon: <PackageIcon className="size-4" />,
    },
  ],
  documents: [
    {
      name: "Commercial Invoices",
      url: "/customer-portal/commercial-invoices",
      icon: <FileTextIcon className="size-4" />,
    },
    {
      name: "Payment History",
      url: "/customer-portal/payment-history",
      icon: <ReceiptTextIcon className="size-4" />,
    },
  ],
  navSecondary: [
    {
      title: "Dealer Support",
      url: "/contact",
      icon: <CircleHelpIcon className="size-4" />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile } = useQuery({
    queryKey: ["customer-profile"],
    queryFn: getCustomerProfile,
  })

  const user = {
    name: profile?.businessName || "Tariq Auto Traders",
    email: profile?.email || "dealer@sarfrazautos.com",
    avatar: "/icon.png",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/customer-portal" />}
            >
              <Home className="size-5!" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-base font-semibold text-neutral-900">
                  Customer Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={defaultData.navMain} />
        <NavDocuments items={defaultData.documents} label="Ledger & Invoices" />
        <NavSecondary items={defaultData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
