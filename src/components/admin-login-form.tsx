"use client"

import { ChangeEvent, FormEvent, useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { z } from "zod"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ShieldCheckIcon, AlertCircle, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"

const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .refine(
      (val) => val.toLowerCase() === "admin@sarfrazautos.com",
      "Access denied. Only admin@sarfrazautos.com can access this portal."
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

type FormErrors = {
  email?: string
  password?: string
}

function AdminLoginFormInner({ className = "", ...props }: { className?: string } & React.ComponentProps<"form">) {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [generalError, setGeneralError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
    if (errorParam === "unauthorized") {
      setGeneralError("Access denied. Your account does not have administrator privileges.")
    }
  }, [errorParam])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
    if (generalError) {
      setGeneralError("")
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldErrors({})
    setGeneralError("")

    const result = adminLoginSchema.safeParse(formData)

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors
      setFieldErrors({
        email: flattened.email?.[0],
        password: flattened.password?.[0],
      })
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const res = await authClient.signIn.email({
        email: result.data.email.toLowerCase(),
        password: result.data.password,
      })

      if (res?.error) {
        setGeneralError(res.error.message || "Invalid credentials. Please verify your password.")
        setIsLoading(false)
        return
      }

      window.location.href = "/admin/dashboard"
    } catch (err: any) {
      setGeneralError(err?.message || "An unexpected error occurred during authentication.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} noValidate {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
            <ShieldCheckIcon className="size-5" />
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter administrative credentials to access dashboard
          </p>
        </div>

        {generalError && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-red-200 bg-red-50 text-red-700 animate-in fade-in-0">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <p className="leading-snug">{generalError}</p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@sarfrazautos.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500/20" : ""}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-600 mt-1 animate-in fade-in-0">
              {fieldErrors.email}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className={fieldErrors.password ? "border-red-500 focus-visible:ring-red-500/20" : ""}
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-600 mt-1 animate-in fade-in-0">
              {fieldErrors.password}
            </p>
          )}
        </Field>

        <Field>
          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Login as Admin"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export function AdminLoginForm(props: React.ComponentProps<typeof AdminLoginFormInner>) {
  return (
    <Suspense fallback={<div className="h-48 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-neutral-400" /></div>}>
      <AdminLoginFormInner {...props} />
    </Suspense>
  )
}
