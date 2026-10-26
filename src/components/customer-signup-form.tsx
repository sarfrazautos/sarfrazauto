"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react"

export function CustomerSignupForm({ className = "", ...props }: { className?: string } & React.ComponentProps<"form">) {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    shopName: "",
    deliveryAddress: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (error) {
      setError("")
    }
  }

  const handleCityChange = (value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      city: value || "",
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Please enter your full name.")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone or WhatsApp number.")
      return
    }

    setIsLoading(true)

    try {
      const res = await (authClient.signUp.email as any)({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city || undefined,
        shopName: formData.shopName.trim() || undefined,
        deliveryAddress: formData.deliveryAddress.trim() || undefined,
      })

      if (res?.error) {
        setError(res.error.message || "Failed to create account. Please try again.")
        setIsLoading(false)
        return
      }

      setSubmitted(true)
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during registration.")
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Account Created Successfully</h2>
          <p className="text-sm text-neutral-600 max-w-sm leading-relaxed">
            Welcome, <span className="font-semibold text-neutral-900">{formData.name}</span>! Your customer portal account is ready. Please log in with your email and password to access your dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 pt-2">
          <Link href="/login">
            <Button className="w-full h-11 flex items-center justify-center gap-2 cursor-pointer">
              <span>Continue to Login</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4", className)}
      noValidate
      {...props}
    >
      <FieldGroup className="gap-3.5">
        <div className="flex flex-col items-center gap-1 text-center mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Create Customer Account</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign up for the Customer Portal to track purchases, invoices &amp; orders
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="name">Full Name <span className="text-red-500">*</span></FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Muhammad Sarfraz"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone / WhatsApp <span className="text-red-500">*</span></FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0300 1234567"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email Address <span className="text-red-500">*</span></FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="password">Password <span className="text-red-500">*</span></FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="city">City / Region</FieldLabel>
            <Select value={formData.city} onValueChange={handleCityChange}>
              <SelectTrigger id="city" className="w-full">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Punjab</SelectLabel>
                  <SelectItem value="Lahore">Lahore</SelectItem>
                  <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                  <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
                  <SelectItem value="Multan">Multan</SelectItem>
                  <SelectItem value="Gujranwala">Gujranwala</SelectItem>
                  <SelectItem value="Sialkot">Sialkot</SelectItem>
                  <SelectItem value="Bahawalpur">Bahawalpur</SelectItem>
                  <SelectItem value="Sargodha">Sargodha</SelectItem>
                  <SelectItem value="Rahim Yar Khan">Rahim Yar Khan</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Sindh</SelectLabel>
                  <SelectItem value="Karachi">Karachi</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Sukkur">Sukkur</SelectItem>
                  <SelectItem value="Larkana">Larkana</SelectItem>
                  <SelectItem value="Mirpur Khas">Mirpur Khas</SelectItem>
                  <SelectItem value="Nawabshah">Nawabshah</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Federal</SelectLabel>
                  <SelectItem value="Islamabad">Islamabad</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>KPK</SelectLabel>
                  <SelectItem value="Peshawar">Peshawar</SelectItem>
                  <SelectItem value="Mardan">Mardan</SelectItem>
                  <SelectItem value="Abbottabad">Abbottabad</SelectItem>
                  <SelectItem value="Swat">Swat</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Balochistan</SelectLabel>
                  <SelectItem value="Quetta">Quetta</SelectItem>
                  <SelectItem value="Gwadar">Gwadar</SelectItem>
                  <SelectItem value="Hub">Hub</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>AJK / GB</SelectLabel>
                  <SelectItem value="Muzaffarabad">Muzaffarabad</SelectItem>
                  <SelectItem value="Mirpur (AJK)">Mirpur (AJK)</SelectItem>
                  <SelectItem value="Gilgit">Gilgit</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex flex-col gap-3">
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="shopName">Shop / Business Name</FieldLabel>
              <span className="text-xs text-muted-foreground font-normal">Optional</span>
            </div>
            <Input
              id="shopName"
              name="shopName"
              type="text"
              placeholder="e.g. Al-Madina Auto Store (optional)"
              value={formData.shopName}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="deliveryAddress">Delivery Address</FieldLabel>
              <span className="text-xs text-muted-foreground font-normal">Optional</span>
            </div>
            <Input
              id="deliveryAddress"
              name="deliveryAddress"
              type="text"
              placeholder="Shop #, Street, Area (optional)"
              value={formData.deliveryAddress}
              onChange={handleChange}
            />
          </Field>
        </div>

        <Field className="pt-1">
          <Button type="submit" className="w-full h-10 cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </Field>

        <FieldDescription className="text-center text-xs">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 font-medium text-foreground">
            Log in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
