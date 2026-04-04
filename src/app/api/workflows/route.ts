import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const body = await req.json()

  const workflow = await prisma.workflow.create({
    data: {
      name: body.name,
      nodes: body.nodes,
      edges: body.edges
    }
  })

  return Response.json(workflow)
}

export async function GET() {

  const workflows = await prisma.workflow.findMany()

  return Response.json(workflows)
}