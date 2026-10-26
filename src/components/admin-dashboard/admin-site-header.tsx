"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AdminUserDropdown } from "@/components/admin-dashboard/admin-user-dropdown"
import { BellRing } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminSiteHeader({ title = "Admin Panel" }: { title?: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between border-b px-4 lg:px-6 bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 h-8 w-8 cursor-pointer text-neutral-700 hover:text-neutral-900" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-base font-semibold text-neutral-900 tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">

        <AdminUserDropdown
          defaultOpen={false}
          align="end"
          trigger={
            <div className="rounded-full cursor-pointer">
              <Avatar className="size-8 ring-1 ring-border shadow-2xs">
                <AvatarImage src="/icon.png" alt="Super Admin" />
                <AvatarFallback className="bg-neutral-900 text-white text-xs font-semibold">
                  SA
                </AvatarFallback>
              </Avatar>
            </div>
          }
        />
      </div>
    </header>
  )
}
