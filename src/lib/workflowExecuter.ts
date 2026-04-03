import { Node, Edge } from "reactflow"

export async function executeWorkflow(nodes: Node[], edges: Edge[]) {

  const results: any = {}

  // Step 1: Build dependency graph
  const dependencies: Record<string, string[]> = {}

  for (const node of nodes) {
    dependencies[node.id] = []
  }

  for (const edge of edges) {
    const source = edge.source
    const target = edge.target

    if (!dependencies[target]) {
      dependencies[target] = []
    }

    dependencies[target].push(source)
  }

  console.log("Dependency Graph:", dependencies)

  // Step 2: Find nodes with no dependencies
  const readyNodes: string[] = []

  for (const nodeId in dependencies) {
    if (dependencies[nodeId].length === 0) {
      readyNodes.push(nodeId)
    }
  }

  console.log("Initial executable nodes:", readyNodes)

  // Step 3: Execution loop (DAG executor)

  while (readyNodes.length > 0) {

    const nodeId = readyNodes.shift()

    if (!nodeId) continue

    console.log("Executing node:", nodeId)

    // simulate execution
    await new Promise((resolve) => setTimeout(resolve, 500))

    results[nodeId] = {
      status: "success",
      output: "node executed"
    }

    // remove dependency from other nodes
    for (const target in dependencies) {

      dependencies[target] = dependencies[target].filter(
        (dep) => dep !== nodeId
      )

      // if dependency cleared → node becomes executable
      if (dependencies[target].length === 0 && !results[target]) {
        readyNodes.push(target)
      }

    }

  }

  return results
}