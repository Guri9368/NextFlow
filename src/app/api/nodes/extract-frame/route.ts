import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  videoUrl: z.string().min(1, "videoUrl is required"),
  timestamp: z.string().default("50%"),
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
    const { videoUrl, timestamp } = parsed.data
    const isPercent = timestamp.endsWith("%")
    const isSeconds = !isPercent && !isNaN(Number(timestamp))
    if (!isPercent && !isSeconds) {
      return NextResponse.json(
        { error: "Timestamp must be a percentage (e.g. '50%') or seconds (e.g. '12.5')" },
        { status: 400 }
      )
    }
    return NextResponse.json({
      frameUrl: videoUrl,
      meta: { timestamp, simulated: true },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
