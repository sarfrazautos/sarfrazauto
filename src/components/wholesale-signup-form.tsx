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
import { AlertCircle, Loader2 } from "lucide-react"

export function WholesaleSignupForm({ className = "", ...props }: { className?: string } & React.ComponentProps<"form">) {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    email: "",
    whatsapp: "",
    city: "",
    address: "",
    password: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) {
      setError("")
    }
  }

  const handleCityChange = (value: string | null) => {
    setFormData({
      ...formData,
      city: value || "",
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)

    try {
      const res = await authClient.signUp.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim() || formData.shopName.trim() || "Customer",
      })

      if (res?.error) {
        setError(res.error.message || "Could not complete registration. Please try again.")
        setIsLoading(false)
        return
      }

      setSubmitted(true)
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during account registration.")
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Account Created Successfully</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Welcome, {formData.name || "Customer"}! Your account for{" "}
            <span className="font-semibold text-foreground">
              {formData.shopName || "your shop"}
            </span>{" "}
            has been registered. You can now access your Customer Portal.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <Link href="/customer-portal">
            <Button className="w-full cursor-pointer">
              Go to Customer Portal
            </Button>
          </Link>
          <Link href="/checkout">
            <Button variant="outline" className="w-full cursor-pointer">
              Return to Checkout
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-5", className)}
      noValidate
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Wholesale & Customer Registration</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Create your account to access wholesale prices and track all your orders
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
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
            <FieldLabel htmlFor="shopName">Shop / Business Name</FieldLabel>
            <Input
              id="shopName"
              name="shopName"
              type="text"
              placeholder="e.g. Al-Madina Auto Store"
              value={formData.shopName}
              onChange={handleChange}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="whatsapp">WhatsApp Number</FieldLabel>
            <Input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              placeholder="0333 1234567"
              value={formData.whatsapp}
              onChange={handleChange}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="city">City / Province</FieldLabel>
            <Select
              value={formData.city}
              onValueChange={handleCityChange}
            >
              <SelectTrigger id="city" className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
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
                  <SelectLabel>Federal Capital</SelectLabel>
                  <SelectItem value="Islamabad">Islamabad</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Khyber Pakhtunkhwa (KPK)</SelectLabel>
                  <SelectItem value="Peshawar">Peshawar</SelectItem>
                  <SelectItem value="Mardan">Mardan</SelectItem>
                  <SelectItem value="Abbottabad">Abbottabad</SelectItem>
                  <SelectItem value="Swat">Swat</SelectItem>
                  <SelectItem value="Dera Ismail Khan">Dera Ismail Khan</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Balochistan</SelectLabel>
                  <SelectItem value="Quetta">Quetta</SelectItem>
                  <SelectItem value="Hub">Hub</SelectItem>
                  <SelectItem value="Gwadar">Gwadar</SelectItem>
                  <SelectItem value="Turbat">Turbat</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Azad Kashmir & Gilgit-Baltistan</SelectLabel>
                  <SelectItem value="Muzaffarabad">Muzaffarabad</SelectItem>
                  <SelectItem value="Mirpur (AJK)">Mirpur (AJK)</SelectItem>
                  <SelectItem value="Gilgit">Gilgit</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Create Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="address">Shop / Delivery Address</FieldLabel>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="Shop #, Market, Area"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 font-medium">
            Log in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
