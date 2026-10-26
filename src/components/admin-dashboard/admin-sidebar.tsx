"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import {
  LayoutDashboardIcon,
  PackageIcon,
  HistoryIcon,
  CreditCardIcon,
  UserCheckIcon,
  InboxIcon,
  ChevronRightIcon,
  StoreIcon,
  Building2Icon,
  LogOutIcon,
  RotateCcwIcon,
  FileSpreadsheetIcon,
  SparklesIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function AdminSidebar({
  className,
  variant = "sidebar",
  style,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const isProductsActive = pathname.startsWith("/admin/products")
  const [productsOpen, setProductsOpen] = React.useState(isProductsActive)

  React.useEffect(() => {
    if (isProductsActive) {
      setProductsOpen(true)
    }
  }, [isProductsActive])

  return (
    <Sidebar
      collapsible="offcanvas"
      variant={variant}
      style={
        {
          "--sidebar": "white",
          "--sidebar-background": "white",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "!bg-white bg-white border-r border-border [&_[data-slot=sidebar-inner]]:!bg-white [&_[data-slot=sidebar-container]]:!bg-white [&_[data-sidebar=sidebar]]:!bg-white",
        className
      )}
      {...props}
    >
      <SidebarHeader className="py-4 px-4 border-b border-border/60 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin/dashboard" className="flex items-center gap-3 w-full group">
              <img
                src="/logo.png"
                alt="Sarfraz Autos"
                className="size-10 shrink-0 object-contain"
              />
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-bold text-neutral-900 tracking-tight group-hover:text-red-600 transition-colors">
                  Sarfraz Autos
                </span>
                <span className="truncate text-[11px] text-neutral-500 font-normal">
                  Admin Control Panel
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-0 gap-0 overflow-hidden bg-white">
        <ScrollArea className="h-[calc(100vh-140px)] bg-white">
          <div className="flex flex-col gap-5 px-3 py-4 bg-white">
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-600">
                Overview
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === "/admin/dashboard"}
                      render={<Link href="/admin/dashboard" />}
                      className={cn(
                        "rounded-xl text-sm px-3 py-2 h-9 transition-colors",
                        pathname === "/admin/dashboard"
                          ? "bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <LayoutDashboardIcon className="size-4 shrink-0" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-600">
                Inventory
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <Collapsible open={productsOpen} onOpenChange={setProductsOpen}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton
                            tooltip="Products"
                            className={cn(
                              "rounded-xl text-sm px-3 py-2 h-9 cursor-pointer transition-colors w-full",
                              isProductsActive
                                ? "bg-neutral-100 font-semibold text-neutral-900"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                            )}
                          >
                            <PackageIcon className="size-4 shrink-0" />
                            <span className="font-normal flex-1 text-left">Products</span>
                            <ChevronRightIcon
                              className={cn(
                                "size-4 transition-transform duration-200 text-neutral-400",
                                productsOpen && "rotate-90 text-neutral-900"
                              )}
                            />
                          </SidebarMenuButton>
                        }
                        className="w-full"
                      />
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-3 my-1.5 pl-3 border-l border-neutral-200 space-y-1">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={pathname === "/admin/products"}
                              render={<Link href="/admin/products" />}
                              className={cn(
                                "rounded-lg text-xs px-2.5 py-1.5 h-8 transition-colors w-full",
                                pathname === "/admin/products"
                                  ? "bg-neutral-900 font-medium text-white hover:bg-neutral-900 hover:text-white"
                                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                              )}
                            >
                              <span>View All Products</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={pathname === "/admin/products/upload"}
                              render={<Link href="/admin/products/upload" />}
                              className={cn(
                                "rounded-lg text-xs px-2.5 py-1.5 h-8 transition-colors w-full",
                                pathname === "/admin/products/upload"
                                   ? "bg-neutral-900 font-medium text-white hover:bg-neutral-900 hover:text-white"
                                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                              )}
                            >
                              <span>Add Product</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === "/admin/schemes"}
                      render={<Link href="/admin/schemes" />}
                      className={cn(
                        "rounded-xl text-sm px-3 py-2 h-9 transition-colors",
                        pathname === "/admin/schemes"
                          ? "bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <SparklesIcon className="size-4 shrink-0" />
                      <span>Trade Schemes</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-600">
                Operations
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === "/admin/orders"}
                      render={<Link href="/admin/orders" />}
                      className={cn(
                        "rounded-xl text-sm px-3 py-2 h-9 transition-colors",
                        pathname === "/admin/orders"
                          ? "bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <HistoryIcon className="size-4 shrink-0" />
                      <span>Order</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === "/admin/payments"}
                      render={<Link href="/admin/payments" />}
                      className={cn(
                        "rounded-xl text-sm px-3 py-2 h-9 transition-colors",
                        pathname === "/admin/payments"
                          ? "bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <CreditCardIcon className="size-4 shrink-0" />
                      <span>Payment Management</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === "/admin/dealer-requests"}
                      render={<Link href="/admin/dealer-requests" />}
                      className={cn(
                        "rounded-xl text-sm px-3 py-2 h-9 transition-colors",
                        pathname === "/admin/dealer-requests"
                          ? "bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <UserCheckIcon className="size-4 shrink-0" />
                      <span>Dealer Requests</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === "/admin/returns"}
                      render={<Link href="/admin/returns" />}
                      className={cn(
                        "rounded-xl text-sm px-3 py-2 h-9 transition-colors",
                        pathname === "/admin/returns"
                          ? "bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <RotateCcwIcon className="size-4 shrink-0" />
                      <span>Product Returns</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === "/admin/messages"}
                      render={<Link href="/admin/messages" />}
                      className={cn(
                        "rounded-xl text-sm px-3 py-2 h-9 transition-colors",
                        pathname === "/admin/messages"
                          ? "bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <InboxIcon className="size-4 shrink-0" />
                      <span>Contact Messages</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-600">
                Finance & Reports
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === "/admin/aging-report"}
                      render={<Link href="/admin/aging-report" />}
                      className={cn(
                        "rounded-xl text-sm px-3 py-2 h-9 transition-colors",
                        pathname === "/admin/aging-report"
                          ? "bg-neutral-900 text-white font-medium hover:bg-neutral-800 hover:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      )}
                    >
                      <FileSpreadsheetIcon className="size-4 shrink-0" />
                      <span>Aging Report</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="p-0">
              <SidebarGroupLabel className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-600">
                Storefront
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/retail" />}
                      className="rounded-xl text-sm px-3 py-2 h-9 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                    >
                      <StoreIcon className="size-4 shrink-0" />
                      <span>Retail Store</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/wholesale" />}
                      className="rounded-xl text-sm px-3 py-2 h-9 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                    >
                      <Building2Icon className="size-4 shrink-0" />
                      <span>Wholesale Portal</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/60 bg-white">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-border shadow-2xs">
          <Avatar className="size-8 rounded-lg ring-1 ring-border">
            <AvatarImage src="/icon.png" alt="Super Admin" />
            <AvatarFallback className="rounded-lg bg-neutral-900 text-white text-xs font-semibold">
              SA
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight min-w-0">
            <span className="truncate font-semibold text-xs text-neutral-900">
              Super Admin
            </span>
            <span className="truncate text-[11px] text-neutral-500 font-normal">
              admin@sarfrazautos.com
            </span>
          </div>
          <Link
            href="/admin/login"
            title="Sign Out"
            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOutIcon className="size-4" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
