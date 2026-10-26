import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { messages } from "@/db/schema/messages"
import { eq } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const messageId = parseInt(id, 10)

    if (isNaN(messageId)) {
      return NextResponse.json(
        { success: false, error: "Invalid message ID" },
        { status: 400 }
      )
    }

    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch message" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const messageId = parseInt(id, 10)

    if (isNaN(messageId)) {
      return NextResponse.json(
        { success: false, error: "Invalid message ID" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (body.status !== undefined) updateData.status = String(body.status).toLowerCase().trim()

    const [updated] = await db
      .update(messages)
      .set(updateData)
      .where(eq(messages.id, messageId))
      .returning()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: updated })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update message" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const messageId = parseInt(id, 10)

    if (isNaN(messageId)) {
      return NextResponse.json(
        { success: false, error: "Invalid message ID" },
        { status: 400 }
      )
    }

    const [deleted] = await db
      .delete(messages)
      .where(eq(messages.id, messageId))
      .returning()

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
      id: messageId,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete message" },
      { status: 500 }
    )
  }
}
