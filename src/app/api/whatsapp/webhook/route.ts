import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const mode = searchParams.get("hub.mode")
    const token = searchParams.get("hub.verify_token")
    const challenge = searchParams.get("hub.challenge")

    const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "r@lex2016"

    if (mode === "subscribe" && token === expectedToken) {
      return new Response(challenge, { status: 200 })
    }

    return new Response("Forbidden", { status: 403 })
  } catch {
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 })
  } catch {
    return NextResponse.json({ status: "ERROR" }, { status: 500 })
  }
}

