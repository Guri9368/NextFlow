import { Node, Edge } from "reactflow"

export async function executeWorkflow(nodes: Node[], edges: Edge[]) {

  const results: Record<string, any> = {}

  // Step 1 — Build dependency graph
  const dependencies: Record<string, string[]> = {}

  for (const node of nodes) {
    dependencies[node.id] = []
  }

  for (const edge of edges) {
    const { source, target } = edge
    dependencies[target].push(source)
  }

  // Step 2 — Detect cycles (DAG validation)
  const visited = new Set<string>()
  const stack = new Set<string>()

  const hasCycle = (nodeId: string): boolean => {

    if (stack.has(nodeId)) return true
    if (visited.has(nodeId)) return false

    visited.add(nodeId)
    stack.add(nodeId)

    for (const dep of dependencies[nodeId]) {
      if (hasCycle(dep)) return true
    }

    stack.delete(nodeId)
    return false
  }

  for (const node of nodes) {
    if (hasCycle(node.id)) {
      throw new Error("Workflow contains a circular dependency")
    }
  }

  // Step 3 — Find initial executable nodes
  const readyNodes: string[] = []

  for (const nodeId in dependencies) {
    if (dependencies[nodeId].length === 0) {
      readyNodes.push(nodeId)
    }
  }

  console.log("Initial executable nodes:", readyNodes)

  // Step 4 — Execution loop
  while (readyNodes.length > 0) {

    const currentBatch = [...readyNodes]
    readyNodes.length = 0

    console.log("Executing batch:", currentBatch)

    await Promise.all(
      currentBatch.map(async (nodeId) => {

        console.log("Executing node:", nodeId)

        const node = nodes.find(n => n.id === nodeId)

        // Step 5 — Collect inputs from parent nodes
        const inputData: Record<string, any> = {}

        for (const edge of edges) {
          if (edge.target === nodeId) {
            const sourceResult = results[edge.source]
            if (sourceResult) {
              inputData[edge.source] = sourceResult.output
            }
          }
        }

        console.log("Node inputs:", inputData)

        // simulate execution
        await new Promise((resolve) => setTimeout(resolve, 500))

       let outputData: any = "node executed"
 
       if (node?.data?.nodeType === "textNode") {
      outputData = node.data.text || ""
      }

      if (node?.data?.nodeType === "imageUpload") {
      outputData = node.data.image || null
       }

       if (node?.data?.nodeType === "videoUpload") {
       outputData = node.data.video || null
        }
        results[nodeId] = {
          status: "success",
          output: outputData
        }

        // Step 6 — Unlock next nodes
        for (const target in dependencies) {

          dependencies[target] = dependencies[target].filter(
            (dep) => dep !== nodeId
          )

          if (dependencies[target].length === 0 && !results[target]) {
            readyNodes.push(target)
          }

        }

      })
    )

  }

  return results
}