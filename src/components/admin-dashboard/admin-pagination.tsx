"use client"

import * as React from "react"
import { motion } from "motion/react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export interface AdminPaginationProps {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  totalItems?: number
  pageSize?: number
  className?: string
}

export function AdminPagination({
  currentPage: controlledPage,
  totalPages = 5,
  onPageChange,
  className,
}: AdminPaginationProps) {
  const [internalPage, setInternalPage] = React.useState(1)
  const activePage = controlledPage !== undefined ? controlledPage : internalPage

  const handlePageChange = (newPage: number) => {
    setInternalPage(newPage)
    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  return (
    <div className={cn("flex justify-center w-full py-4", className)}>
      <Pagination>
        <PaginationContent className="bg-background/80 border p-1 rounded-full transition-all shadow-xs">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(Math.max(1, activePage - 1))
              }}
              className="rounded-full hover:bg-muted cursor-pointer"
            />
          </PaginationItem>

          <div className="relative flex items-center mx-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
              const isActive = activePage === page
              return (
                <PaginationItem key={page} className="relative">
                  <PaginationLink
                    href="#"
                    isActive={isActive}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                    className={cn(
                      "relative z-10 w-9 h-9 rounded-full border-0 transition-colors uppercase text-xs font-bold tracking-tighter cursor-pointer",
                      isActive
                        ? "bg-transparent text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {page}
                  </PaginationLink>
                  {isActive && (
                    <motion.div
                      layoutId="pill-active"
                      className="absolute inset-0 bg-primary rounded-full shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </PaginationItem>
              )
            })}
          </div>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(Math.min(totalPages, activePage + 1))
              }}
              className="rounded-full hover:bg-muted transition-transform active:scale-95 cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export const FloatingPill = AdminPagination
export default AdminPagination
