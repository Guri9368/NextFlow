import { Node, Edge } from "reactflow"

export async function executeWorkflow(nodes: Node[], edges: Edge[]) {

  const results: any = {}

  for (const node of nodes) {

    console.log("Executing node:", node.id)

    // simulate execution
    await new Promise((resolve) => setTimeout(resolve, 500))

    results[node.id] = {
      status: "success",
      output: "node executed"
    }
  }

  return results
}