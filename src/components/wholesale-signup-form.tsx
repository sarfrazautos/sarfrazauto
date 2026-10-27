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
import { AlertCircle, Loader2, Clock, CheckCircle2, PhoneCall } from "lucide-react"
import { WHATSAPP_RAW, WHATSAPP_DISPLAY } from "@/lib/constants"

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

    if (!formData.name.trim()) {
      setError("Please enter your full name.")
      return
    }
    if (!formData.shopName.trim()) {
      setError("Please enter your shop or workshop name.")
      return
    }
    if (!formData.whatsapp.trim()) {
      setError("Please enter your WhatsApp / mobile number.")
      return
    }
    if (!formData.city.trim()) {
      setError("Please select your city.")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)

    try {
      const res = await authClient.signUp.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim(),
        phone: formData.whatsapp.trim(),
        city: formData.city.trim(),
        shopName: formData.shopName.trim(),
        deliveryAddress: formData.address.trim(),
        role: "pending_dealer",
      } as any)

      if (res?.error) {
        setError(res.error.message || "Could not complete registration. Please try again.")
        setIsLoading(false)
        return
      }

      await fetch("/api/dealer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName: formData.shopName.trim(),
          ownerName: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.whatsapp.trim(),
          city: formData.city.trim(),
          address: formData.address.trim(),
          status: "Pending",
          notes: "Wholesale Portal Application",
        }),
      })

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
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
            <Clock className="size-7 animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <span className="size-2 rounded-full bg-amber-500 animate-ping" />
            <span>Pending Admin Approval</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Dealer Application Submitted!
          </h2>
          <p className="text-sm text-neutral-600 max-w-md leading-relaxed">
            Thank you, <strong className="text-neutral-900">{formData.name}</strong>! Your dealer registration for{" "}
            <strong className="text-neutral-900">{formData.shopName}</strong> has been sent to the Sarfraz Autos admin team.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left space-y-2 text-xs text-neutral-600">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Review Window: Within 24 Hours</span>
          </div>
          <p className="pl-6 text-neutral-500 leading-relaxed">
            Our trade team verifies workshop credentials and city business markets. Once approved by admin, you will have instant access to the <strong>Dealer Customer Portal</strong> and <strong>Wholesale Bulk Carton Rates</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href={`https://wa.me/${WHATSAPP_RAW}?text=Hello%20Sarfraz%20Autos,%20I%20have%20submitted%20my%20wholesale%20dealer%20application%20for%20${encodeURIComponent(
              formData.shopName
            )}%20(${encodeURIComponent(formData.city)})%20and%20would%20like%20to%20request%20early%20verification.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs cursor-pointer shadow-xs gap-2">
              <PhoneCall className="size-3.5" />
              <span>WhatsApp Admin ({WHATSAPP_DISPLAY})</span>
            </Button>
          </a>
          <Link href="/retail" className="w-full">
            <Button variant="outline" className="w-full h-10 text-xs text-neutral-700 cursor-pointer">
              Explore Retail Counter Meanwhile
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="ghost" className="w-full h-9 text-xs text-neutral-500 cursor-pointer">
              Back to Home
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
          <h1 className="text-2xl font-bold">Dealer Account Registration</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Register your dealership to access wholesale prices, master cartons, and dealer orders
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
              "Register Dealer Account"
            )}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Already have a dealer account?{" "}
          <Link href="/login" className="underline underline-offset-4 font-medium">
            Log in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
