"use client"

import { AdminLoginForm } from "@/components/admin-login-form"
import Link from "next/link"

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            Sarfraz Autos
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AdminLoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/auth-banner.jpg"
          alt="Motorcycle Spare Parts Wholesale"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-10 text-white">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &ldquo;Reliable wholesale supplier of genuine Crown motorcycle spare parts &amp; bulk orders.&rdquo;
            </p>
            <footer className="text-sm text-zinc-300">
              Sarfraz Autos
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
