"use client"

import { useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EllipsisVerticalIcon, CircleUserRoundIcon, CreditCardIcon, LogOutIcon, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { data: session } = authClient.useSession()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const displayName = session?.user?.name || user.name
  const displayEmail = session?.user?.email || user.email
  const displayAvatar = session?.user?.image || user.avatar

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/customer/logout", { method: "POST" })
      await authClient.signOut()
      setShowLogoutDialog(false)
      router.push("/login")
      router.refresh()
    } catch (err) {
      router.push("/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
              }
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback className="rounded-lg bg-neutral-900 text-white font-bold text-xs">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-neutral-900">{displayName}</span>
                <span className="truncate text-xs text-neutral-500">
                  {displayEmail}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4 text-neutral-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src={displayAvatar} alt={displayName} />
                      <AvatarFallback className="rounded-lg bg-neutral-900 text-white font-bold text-xs">
                        {displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-neutral-900">{displayName}</span>
                      <span className="truncate text-xs text-neutral-500">
                        {displayEmail}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/customer-portal/dealer-account">
                  <DropdownMenuItem className="cursor-pointer">
                    <CircleUserRoundIcon className="size-4 mr-2" />
                    Dealer Account
                  </DropdownMenuItem>
                </Link>
                <Link href="/customer-portal/commercial-invoices">
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCardIcon className="size-4 mr-2" />
                    Commercial Billing
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowLogoutDialog(true)}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOutIcon className="size-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="gap-2">
            <div className="size-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <LogOutIcon className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-neutral-950">
              Log out of Customer Portal?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-neutral-600">
              You will be signed out from your session ({displayEmail}). You can log back in at any time with your credentials.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              disabled={isLoggingOut}
              onClick={() => setShowLogoutDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Logging out...
                </>
              ) : (
                "Log out"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
