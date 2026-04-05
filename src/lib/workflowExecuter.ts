import { Node, Edge } from "reactflow"
import { NodeExecutionResult, WorkflowRun } from "@/types/workflow"

function buildExecutionBatches(nodes: Node[], edges: Edge[]): string[][] {
  const deps: Record<string, Set<string>> = {}
  for (const n of nodes) deps[n.id] = new Set()
  for (const e of edges) deps[e.target].add(e.source)

  const visited = new Set<string>()
  const stack = new Set<string>()
  const hasCycle = (id: string): boolean => {
    if (stack.has(id)) return true
    if (visited.has(id)) return false
    visited.add(id)
    stack.add(id)
    for (const d of deps[id]) if (hasCycle(d)) return true
    stack.delete(id)
    return false
  }
  for (const n of nodes) {
    if (hasCycle(n.id))
      throw new Error("Workflow has a circular dependency — remove the loop and try again.")
  }

  const done = new Set<string>()
  const batches: string[][] = []
  while (done.size < nodes.length) {
    const batch = nodes
      .map((n) => n.id)
      .filter((id) => !done.has(id) && [...deps[id]].every((d) => done.has(d)))
    if (batch.length === 0) break
    batches.push(batch)
    for (const id of batch) done.add(id)
  }
  return batches
}

function collectInputs(
  nodeId: string,
  edges: Edge[],
  results: Record<string, NodeExecutionResult>
): Record<string, any> {
  const inputs: Record<string, any> = {}
  for (const edge of edges) {
    if (edge.target === nodeId && results[edge.source] !== undefined) {
      const handleKey = edge.targetHandle || edge.source
      inputs[handleKey] = results[edge.source].output
    }
  }
  return inputs
}

async function executeNode(node: Node, inputs: Record<string, any>): Promise<any> {
  const data = node.data || {}

  switch (node.type) {
    case "textNode":
      return data.text || ""

    case "imageUpload":
      // Return the imageUrl stored by the node component via updateNodeData
      return data.imageUrl || data.image || null

    case "videoUpload":
      return data.videoUrl || data.video || null

    case "cropImage": {
      // Accept image from connected node OR from node's own data
      const imageUrl =
        inputs["image"] ||
        (Object.keys(inputs).length > 0 ? Object.values(inputs)[0] : null) ||
        data.imageUrl

      if (!imageUrl) {
        throw new Error("No image input connected to Crop Image node")
      }

      const res = await fetch("/api/nodes/crop-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          x: data.x ?? 0,
          y: data.y ?? 0,
          width: data.width ?? 50,
          height: data.height ?? 50,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Crop image failed")
      return json.outputUrl
    }

    case "extractFrame": {
      // Accept video from connected node OR from node's own data
      const videoUrl =
        inputs["video"] ||
        (Object.keys(inputs).length > 0 ? Object.values(inputs)[0] : null) ||
        data.videoUrl

      if (!videoUrl) {
        throw new Error("No video input connected to Extract Frame node")
      }

      const res = await fetch("/api/nodes/extract-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          timestamp: data.timestamp || "50%",
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Extract frame failed")
      return json.frameUrl
    }

    case "llmNode": {
      const systemPrompt =
        inputs["system_prompt"] ||
        inputs["systemPrompt"] ||
        data.systemPrompt ||
        ""

      const userMessage =
        inputs["user_message"] ||
        inputs["userMessage"] ||
        data.userMessage ||
        ""

      // Collect all image inputs — accept both base64 data URLs and http URLs
      const images: string[] = Object.entries(inputs)
        .filter(([k]) => k === "image" || k.startsWith("image"))
        .map(([, v]) => v)
        .filter((v): v is string => typeof v === "string" && v.length > 0)

      // Build a combined user message from all text inputs if userMessage is empty
      const textInputs = Object.values(inputs)
        .filter((v): v is string => typeof v === "string" && v.length > 0)
        .filter((v) => !v.startsWith("data:") && !v.startsWith("blob:"))

      const resolvedUserMessage =
        userMessage ||
        (data.userMessage as string) ||
        textInputs.join("\n\n") ||
        "Please analyze the provided content."

      const res = await fetch("/api/nodes/run-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: data.model || "gemini-1.5-flash",
          systemPrompt,
          userMessage: resolvedUserMessage,
          // Pass all image URLs — API handles both data: and http: URLs
          images,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "LLM execution failed")
      return json.response
    }

    default:
      return "executed"
  }
}

export async function executeWorkflow(
  nodes: Node[],
  edges: Edge[],
  callbacks?: {
    onNodeStart?: (nodeId: string) => void
    onNodeDone?: (nodeId: string, output: any, error?: string) => void
  }
): Promise<WorkflowRun> {
  const runId = `run_${Date.now()}`
  const startedAt = new Date().toISOString()
  const nodeResults: Record<string, NodeExecutionResult> = {}
  const batches = buildExecutionBatches(nodes, edges)

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (nodeId) => {
        const node = nodes.find((n) => n.id === nodeId)!
        const inputs = collectInputs(nodeId, edges, nodeResults)
        const t0 = Date.now()

        callbacks?.onNodeStart?.(nodeId)

        try {
          const output = await executeNode(node, inputs)
          nodeResults[nodeId] = {
            nodeId,
            nodeType: node.type as any,
            status: "success",
            output,
            inputs,
            startedAt: new Date(t0).toISOString(),
            finishedAt: new Date().toISOString(),
            durationMs: Date.now() - t0,
          }
          callbacks?.onNodeDone?.(nodeId, output)
        } catch (err: any) {
          nodeResults[nodeId] = {
            nodeId,
            nodeType: node.type as any,
            status: "error",
            error: err.message,
            inputs,
            startedAt: new Date(t0).toISOString(),
            finishedAt: new Date().toISOString(),
            durationMs: Date.now() - t0,
          }
          callbacks?.onNodeDone?.(nodeId, undefined, err.message)
        }
      })
    )
  }

  const anyError = Object.values(nodeResults).some((r) => r.status === "error")
  return {
    id: runId,
    status: anyError ? "error" : "success",
    scope: "full",
    startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - new Date(startedAt).getTime(),
    nodeResults: Object.values(nodeResults),
  }
}
