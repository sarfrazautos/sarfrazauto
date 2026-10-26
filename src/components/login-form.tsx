"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { AlertCircle, Loader2 } from "lucide-react"

export function LoginForm({ className = "", ...props }: { className?: string } & React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/customer-portal"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await authClient.signIn.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (res?.error) {
        setError(res.error.message || "Invalid email or password.")
        setIsLoading(false)
        return
      }

      router.push(redirectUrl)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during login.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} noValidate {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Customer Portal Login</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your credentials to access your customer dashboard
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login to Customer Portal"
            )}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="underline underline-offset-4 font-medium">
            Register Account
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
