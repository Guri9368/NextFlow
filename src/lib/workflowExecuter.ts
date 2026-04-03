import { Node, Edge } from "reactflow"

export async function executeWorkflow(nodes: Node[], edges: Edge[]) {

  const results: any = {}

 
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

  return results
}