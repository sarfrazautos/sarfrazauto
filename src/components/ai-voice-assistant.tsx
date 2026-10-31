"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Mic,
  MicOff,
  Sparkles,
  X,
  Send,
  ShoppingCart,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  Pencil,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/store/cart-store"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import { toast } from "sonner"

const STORAGE_KEY_MESSAGES = "sarfraz-ai-chat-history"

export function AiVoiceAssistant() {
  const pathname = usePathname()
  const { addItem } = useCart()
  const { info: checkoutInfo, setInfo: setCheckoutInfo } = useCheckoutStore()

  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)

  const defaultWelcomeMessage = {
    role: "assistant" as const,
    content:
      "Assalam-o-Alaikum! Main Sarfraz Autos ka AI Assistant hoon. Aap Urdu ya English mein bol kar ya likh kar koi bhi spare part dhoond sakte hain (Jaise: 'CD 70 ki backlight dikhao').",
  }

  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant"
      content: string
      products?: any[]
    }>
  >([defaultWelcomeMessage])

  const [orderModalProduct, setOrderModalProduct] = useState<any | null>(null)
  const [orderStep, setOrderStep] = useState<"form" | "confirm">("confirm")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerCity, setCustomerCity] = useState("Karachi")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef(messages)
  const handleSendMessageRef = useRef<(text?: string) => Promise<void>>(() => Promise.resolve())

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES)
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch { }

    if (checkoutInfo.fullName) setCustomerName(checkoutInfo.fullName)
    if (checkoutInfo.phone) setCustomerPhone(checkoutInfo.phone)
    if (checkoutInfo.city) setCustomerCity(checkoutInfo.city)
  }, [checkoutInfo.fullName, checkoutInfo.phone, checkoutInfo.city])

  useEffect(() => {
    try {
      if (messages.length > 1) {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages.slice(-20)))
      }
    } catch { }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "ur-PK"

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript
          setIsListening(false)
          if (transcript && transcript.trim()) {
            handleSendMessageRef.current(transcript.trim())
          }
        }

        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)

        recognitionRef.current = recognition
      }
    }
  }, [])

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.info("Voice recognition is supported in Google Chrome, Edge, and Android browsers.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        setIsListening(false)
      }
    }
  }

  const handleClearHistory = () => {
    setMessages([defaultWelcomeMessage])
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES)
    } catch { }
    toast.success("Chat history reset")
  }

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend || inputText).trim()
    if (!rawText || loading) return

    const text = rawText
      .replace(/\b1\s*(to|two)\s*5\b/gi, "125")
      .replace(/\b7\s*0\b/g, "70")

    const currentHistory = messagesRef.current
    const newHistory = [...currentHistory, { role: "user" as const, content: text }]
    setMessages(newHistory)
    setInputText("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newHistory.slice(-12),
        }),
      })

      const data = await res.json()

      if (data.success && data.message) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            products: data.products || [],
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error || "Maazrat, main samajh nahi saka. Dobara koshish karein.",
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please check your internet connection.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  handleSendMessageRef.current = handleSendMessage

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      title: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || "/bike-engine.png",
      type: "retail",
    })
    toast.success(`Added ${product.name} to cart!`)
  }

  const handleOpenOrderModal = (product: any) => {
    setOrderModalProduct(product)
    const activeName = customerName || checkoutInfo.fullName || ""
    const activePhone = customerPhone || checkoutInfo.phone || ""
    const activeCity = customerCity || checkoutInfo.city || "Karachi"

    setCustomerName(activeName)
    setCustomerPhone(activePhone)
    setCustomerCity(activeCity)

    if (activePhone.trim().length >= 7 && activeName.trim().length > 0) {
      setOrderStep("confirm")
    } else {
      setOrderStep("form")
    }
  }

  const handleContinueToConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim()) {
      toast.error("Please enter your name")
      return
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 7) {
      toast.error("Please enter a valid phone number")
      return
    }

    setCheckoutInfo({
      fullName: customerName.trim(),
      phone: customerPhone.trim(),
      city: customerCity.trim() || "Karachi",
    })
    setOrderStep("confirm")
  }

  const handleConfirmOrder = async () => {
    if (!customerPhone.trim() || !orderModalProduct) {
      toast.error("Please enter your phone number")
      setOrderStep("form")
      return
    }

    setCheckoutInfo({
      fullName: customerName.trim(),
      phone: customerPhone.trim(),
      city: customerCity.trim() || "Karachi",
    })

    try {
      setIsPlacingOrder(true)
      const res = await fetch("/api/ai-assistant/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerCity: customerCity.trim() || "Karachi",
          items: [{ ...orderModalProduct, quantity: 1 }],
          notes: `Voice Order via AI Assistant for ${orderModalProduct.name}`,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Order placed successfully! We will contact you on WhatsApp.")
        setOrderModalProduct(null)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Shukriya ${customerName || "Customer"}! Aapka order #${data.order.orderNumber} confirm ho chuka hai. Humare numainday aapse WhatsApp (${customerPhone}) par rabta karenge.`,
          },
        ])
      } else {
        toast.error(data.error || "Failed to place order")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex items-center group pointer-events-auto select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Voice Assistant"
          className="relative flex items-center justify-center size-14 rounded-full bg-red-600 text-white shadow-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="size-6 text-yellow-300 animate-pulse" />
          <span className="absolute -bottom-1 -right-1 flex size-5 rounded-full bg-neutral-900 border-2 border-white items-center justify-center">
            <Mic className="size-3 text-white" />
          </span>
        </button>

        <div className="hidden sm:flex items-center mr-3 px-3 py-1.5 rounded-full bg-white text-neutral-800 text-xs font-semibold shadow-md border border-neutral-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
          <span>AI Voice Assistant</span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="p-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-2xl bg-red-600 flex items-center justify-center shadow-xs">
                <Bot className="size-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">Sarfraz Autos AI</h3>
                  <Badge variant="outline" className="border-red-500/50 text-[10px] text-red-300 py-0 px-1.5">
                    Voice &amp; Search
                  </Badge>
                </div>
                <p className="text-[11px] text-neutral-300">Bol kar ya likh kar spare part dhoondein</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearHistory}
                title="Reset conversation"
                className="size-8 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="size-8 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-neutral-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="size-7 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="size-4" />
                  </div>
                )}

                <div className="max-w-[82%] space-y-2">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${m.role === "user"
                      ? "bg-red-600 text-white rounded-br-xs"
                      : "bg-white text-neutral-800 border border-neutral-200/80 shadow-2xs rounded-bl-xs"
                      }`}
                  >
                    {m.content}
                  </div>

                  {m.products && m.products.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                        Available Products ({m.products.length})
                      </span>
                      {m.products.map((p) => {
                        const productHref = p.slug
                          ? `/product-overview/${p.slug}`
                          : `/product-overview?id=${p.id}`

                        return (
                          <div
                            key={p.id}
                            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.images?.[0] || "/bike-engine.png"}
                                alt={p.name}
                                className="size-11 object-contain rounded-lg bg-neutral-50 p-1 border border-neutral-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-neutral-900 truncate">{p.name}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs font-bold text-red-600">
                                    Rs. {Number(p.price).toLocaleString()}
                                  </span>
                                  {p.brand && (
                                    <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded">
                                      {p.brand}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleAddToCart(p)}
                                  title="Add to Cart"
                                  className="size-7 rounded-lg cursor-pointer"
                                >
                                  <ShoppingCart className="size-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenOrderModal(p)}
                                  className="h-7 px-2 text-[11px] bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                                >
                                  Order
                                </Button>
                              </div>
                            </div>

                            <div className="pt-1 border-t border-neutral-100 flex items-center justify-between">
                              <Link
                                href={productHref}
                                target="_blank"
                                className="text-[11px] text-neutral-500 hover:text-red-600 font-medium inline-flex items-center gap-1 transition-colors"
                              >
                                View product
                                <ExternalLink className="size-3" />
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="size-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 py-1">
                <div className="size-7 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Bot className="size-4 animate-spin" />
                </div>
                <span>Checking Sarfraz Autos inventory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] px-0.5">
              <span className="inline-flex items-center gap-1.5 font-medium text-neutral-600">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-red-600"></span>
                </span>
                {isListening ? (
                  <span className="text-red-600 font-semibold animate-pulse">Sun raha hai... Bolain!</span>
                ) : (
                  <span>Mic par click karein aur bolain (Click &amp; Speak)</span>
                )}
              </span>
              <span className="text-[10px] text-neutral-400">Urdu / English</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={toggleListening}
                variant={isListening ? "default" : "outline"}
                title={isListening ? "Stop listening" : "Click & Speak"}
                className={`size-10 rounded-2xl shrink-0 cursor-pointer transition-all ${isListening
                  ? "bg-red-600 text-white shadow-xs animate-pulse ring-2 ring-red-400 ring-offset-1"
                  : "border-red-200 bg-red-50/50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300"
                  }`}
              >
                {isListening ? <MicOff className="size-4" /> : <Mic className="size-4 text-red-600" />}
              </Button>

              {isListening ? (
                <div
                  onClick={toggleListening}
                  className="flex-1 h-10 px-3 bg-red-50/80 border border-red-200 rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-red-600 rounded-full animate-pulse"></span>
                      <span className="w-1 h-5 bg-red-600 rounded-full animate-pulse delay-75"></span>
                      <span className="w-1 h-2 bg-red-600 rounded-full animate-pulse delay-150"></span>
                      <span className="w-1 h-4 bg-red-600 rounded-full animate-pulse delay-100"></span>
                    </div>
                    <span className="text-xs font-semibold text-red-700 animate-pulse">
                      Aapki aawaz sun raha hai...
                    </span>
                  </div>
                  <span className="text-[10px] text-red-600 font-medium underline">
                    Stop
                  </span>
                </div>
              ) : (
                <Input
                  placeholder="Bolain ya likhein (e.g. CD 70 chain sprocket)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="h-10 text-xs bg-neutral-50 rounded-xl"
                />
              )}

              <Button
                type="button"
                disabled={loading || !inputText.trim()}
                onClick={() => handleSendMessage()}
                className="size-10 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white shrink-0 cursor-pointer"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {orderModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">
                {orderStep === "confirm" ? "Confirm Order" : "Delivery Details"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOrderModalProduct(null)}
                className="size-7 rounded-full cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </div>

            {orderStep === "confirm" ? (
              <div className="space-y-4 pt-3">
                <div className="p-3 bg-red-50/70 border border-red-100 rounded-2xl flex items-start gap-2.5">
                  <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      Are you sure you want to confirm this order?
                    </h4>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Your order will be placed with Cash on Delivery.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={orderModalProduct.images?.[0] || "/bike-engine.png"}
                      alt={orderModalProduct.name}
                      className="size-11 object-contain bg-white rounded-xl p-1 border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-neutral-900 truncate">
                        {orderModalProduct.name}
                      </h4>
                      <p className="text-xs font-bold text-red-600 mt-0.5">
                        Rs. {Number(orderModalProduct.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-[11px]">
                    <div className="space-y-0.5 text-neutral-700">
                      <p>
                        <span className="text-neutral-500">Name:</span>{" "}
                        <span className="font-semibold">{customerName}</span>
                      </p>
                      <p>
                        <span className="text-neutral-500">WhatsApp:</span>{" "}
                        <span className="font-semibold">{customerPhone}</span>
                      </p>
                      <p>
                        <span className="text-neutral-500">City:</span>{" "}
                        <span className="font-semibold">{customerCity || "Karachi"}</span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setOrderStep("form")}
                      className="h-7 px-2 text-[11px] text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                      <Pencil className="size-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPlacingOrder}
                    onClick={() => setOrderModalProduct(null)}
                    className="w-1/2 h-9 text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={isPlacingOrder}
                    onClick={handleConfirmOrder}
                    className="w-1/2 h-9 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer shadow-xs"
                  >
                    {isPlacingOrder ? "Placing..." : "Yes, Confirm Order"}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContinueToConfirm} className="space-y-3 pt-3">
                <div className="flex items-center gap-2.5 bg-neutral-50 rounded-2xl p-2.5 border border-neutral-200">
                  <img
                    src={orderModalProduct.images?.[0] || "/bike-engine.png"}
                    alt={orderModalProduct.name}
                    className="size-11 object-contain bg-white rounded-xl p-1 border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-900 truncate">
                      {orderModalProduct.name}
                    </h4>
                    <p className="text-xs font-bold text-red-600 mt-0.5">
                      Rs. {Number(orderModalProduct.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Your Name (e.g. Ali Khan)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="0300-1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-700">
                    City / Delivery Address
                  </label>
                  <Input
                    placeholder="Karachi, Lahore, etc."
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOrderModalProduct(null)}
                    className="w-1/2 h-9 text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-1/2 h-9 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer shadow-xs"
                  >
                    Continue
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
