import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createSchema = z.object({
  workflowId: z.string().optional(),
  status: z.enum(["success", "error", "running", "idle"]),
  result: z.any().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    const run = await prisma.workflowRun.create({
      data: {
        workflowId: parsed.data.workflowId || "standalone",
        status: parsed.data.status,
        result: parsed.data.result || {},
      },
    })
    return NextResponse.json(run, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const runs = await prisma.workflowRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json(runs)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}