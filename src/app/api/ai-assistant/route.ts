import { NextResponse } from "next/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText, tool } from "ai"
import { z } from "zod"
import { searchProductsInDb, isSafeQuery } from "@/lib/ai/product-search"

const SYSTEM_INSTRUCTION = `You are the AI Auto Parts Assistant for "Sarfraz Autos", a motorcycle spare parts shop in Karachi, Pakistan.
You speak Urdu, Roman Urdu, and English naturally and politely.

RULES:
1. When the customer asks for or mentions any motorcycle part, use the searchInventory tool to check real stock.
2. If the user mentions a part without specifying a bike model (e.g. CD 70, CG 125), ask them which bike model they have.
3. If the user provides a bike model (e.g. "70", "125") and the part was mentioned in earlier messages, IMMEDIATELY call searchInventory with both the partName and the bikeModel.
4. STRICT ORDERING RULES:
   - NEVER ask for customer name, phone number, or delivery address in chat.
   - NEVER confirm orders in chat or say "order confirm ho gaya".
   - Ordering is done through the website button. If the user wants to order or sends their contact details, tell them to click the red "Order" button on the product card to confirm.
5. Keep chat replies concise (1-2 sentences maximum in Roman Urdu or Urdu).`

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!isSafeQuery(message)) {
      return NextResponse.json({
        success: true,
        message: "Mujhe sirf motorcycle spare parts search karne ki ijazat hai. Please part batayein.",
        products: [],
      })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google AI API key not configured" }, { status: 500 })
    }

    const google = createGoogleGenerativeAI({ apiKey })

    const cleanHistory = Array.isArray(history)
      ? history.filter((h: any) => h.content && typeof h.content === "string").slice(-10)
      : []

    const formattedMessages = [
      ...cleanHistory.map((h: any) => ({
        role: (h.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: String(h.content || ""),
      })),
      {
        role: "user" as const,
        content: message,
      },
    ]

    let matchedProducts: any[] = []
    let searchedPart = ""
    let searchedBike = ""
    let toolWasCalled = false

    const searchInventoryTool = tool({
      description: "Search motorcycle spare parts in Sarfraz Autos database. Call this whenever the user wants, mentions, or asks for any motorcycle part (e.g. tyre, headlight, backlight, brake shoe, clutch, filter, cable, mirror, chain, sprocket, plug).",
      inputSchema: z.object({
        partName: z.string().describe("The name of the motorcycle part in English (e.g. tyre, headlight, backlight, brake, clutch, filter, cable, mirror, chain, sprocket, plug)"),
        bikeModel: z.string().nullable().optional().describe("Bike model (e.g. 70, 125, 100) or null if unknown"),
        brand: z.string().nullable().optional().describe("Brand name (e.g. Crown, Servis, Panther, Honda) or null"),
      }),
      execute: async ({ partName, bikeModel, brand }: any) => {
        toolWasCalled = true
        searchedPart = partName
        searchedBike = bikeModel || ""
        const products = await searchProductsInDb({ partName, bikeModel, brand })
        matchedProducts = products
        return {
          found: products.length > 0,
          count: products.length,
          items: products.map((p) => `${p.name} - Rs. ${p.price}`),
        }
      },
    })

    const result = await generateText({
      model: google("gemini-flash-lite-latest"),
      system: SYSTEM_INSTRUCTION,
      messages: formattedMessages,
      tools: {
        searchInventory: searchInventoryTool,
      },
    })

    let responseMessage = result.text?.trim()
    if (!responseMessage && matchedProducts.length > 0) {
      const bikeLabel = searchedBike ? ` ${searchedBike}` : ""
      responseMessage = `Yeh rahein Sarfraz Autos par available${bikeLabel} ${searchedPart || "parts"}:`
    } else if (!responseMessage && toolWasCalled) {
      const bikeLabel = searchedBike ? ` ${searchedBike}` : ""
      responseMessage = `Maazrat, filhal${bikeLabel} ${searchedPart || "yeh part"} stock mein nahi hai.`
    } else if (!responseMessage) {
      responseMessage = "Aapko kaunsa motorcycle spare part chahiye?"
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      products: matchedProducts,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process AI assistant request" },
      { status: 500 }
    )
  }
}
