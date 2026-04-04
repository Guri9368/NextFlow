import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  imageUrl: z.string().min(1, "imageUrl is required"),
  x: z.number().min(0).max(100).default(0),
  y: z.number().min(0).max(100).default(0),
  width: z.number().min(1).max(100).default(50),
  height: z.number().min(1).max(100).default(50),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }
    const { imageUrl, x, y, width, height } = parsed.data
    return NextResponse.json({
      outputUrl: imageUrl,
      meta: { x, y, width, height, simulated: true },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}