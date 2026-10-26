"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CircleUserRound,
  CreditCard,
  LogOut,
  ExternalLink,
} from "lucide-react"

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}

const itemClass =
  "p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2 rounded-lg w-full flex items-center"

export function AdminUserDropdown({ trigger, defaultOpen, align = "end" }: Props) {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-64 rounded-xl p-1.5 shadow-md border"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-3 px-3 py-2.5">
              <div className="relative">
                <Avatar className="size-9 ring-1 ring-border">
                  <AvatarImage src="/icon.png" alt="Super Admin" />
                  <AvatarFallback className="bg-neutral-900 text-white font-semibold text-xs">
                    SA
                  </AvatarFallback>
                </Avatar>
                <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-emerald-500 ring-2" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-foreground text-sm font-semibold truncate">
                  Super Admin
                </span>
                <span className="text-muted-foreground text-xs truncate">
                  admin@sarfrazautos.com
                </span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              render={<Link href="/admin/dashboard" />}
              className={itemClass}
            >
              <CircleUserRound className="size-4 text-neutral-500" />
              <span>Admin Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/admin/payments" />}
              className={itemClass}
            >
              <CreditCard className="size-4 text-neutral-500" />
              <span>Payment Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/" target="_blank" />}
              className={itemClass}
            >
              <ExternalLink className="size-4 text-neutral-500" />
              <span>Visit Storefront</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            render={<Link href="/admin/login" />}
            className={itemClass}
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
