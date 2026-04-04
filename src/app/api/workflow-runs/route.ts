import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createSchema = z.object({
  workflowId: z.string().optional(),
  status: z.enum(["success", "error", "running", "idle"]),
  result: z.any().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    // Find or create a standalone workflow for this user
    let workflowId = parsed.data.workflowId
    if (!workflowId) {
      const standalone = await prisma.workflow.upsert({
        where: { id: `standalone_${userId}` },
        update: {},
        create: {
          id: `standalone_${userId}`,
          userId,
          name: "Standalone Runs",
          nodes: [],
          edges: [],
        },
      })
      workflowId = standalone.id
    }

    const run = await prisma.workflowRun.create({
      data: {
        workflowId,
        userId,
        status: parsed.data.status,
        result: parsed.data.result || {},
      },
    })
    return NextResponse.json(run, { status: 201 })
  } catch (err: any) {
    console.error("POST /api/workflow-runs:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const runs = await prisma.workflowRun.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json(runs)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
