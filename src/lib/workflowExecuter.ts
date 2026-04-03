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

  // Step 2: Find root nodes (no dependencies)
  const readyNodes: string[] = []

  for (const nodeId in dependencies) {
    if (dependencies[nodeId].length === 0) {
      readyNodes.push(nodeId)
    }
  }

  console.log("Initial executable nodes:", readyNodes)

  return results
}