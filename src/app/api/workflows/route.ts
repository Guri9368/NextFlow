import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1).default("Untitled Workflow"),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    const workflow = await prisma.workflow.create({
      data: {
        name: parsed.data.name,
        nodes: parsed.data.nodes,
        edges: parsed.data.edges,
      },
    })
    return NextResponse.json(workflow, { status: 201 })
  } catch (err: any) {
    console.error("POST /api/workflows:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(workflows)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}