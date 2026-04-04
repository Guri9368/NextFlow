export type NodeStatus = "idle" | "running" | "success" | "error"

export type NodeType =
  | "textNode"
  | "imageUpload"
  | "videoUpload"
  | "llmNode"
  | "cropImage"
  | "extractFrame"

export interface NodeExecutionResult {
  nodeId: string
  nodeType: NodeType
  status: NodeStatus
  output?: any
  error?: string
  startedAt?: string
  finishedAt?: string
  durationMs?: number
  inputs?: Record<string, any>
}

export interface WorkflowRun {
  id: string
  workflowId?: string
  status: NodeStatus
  scope: "full" | "single" | "selected"
  startedAt: string
  finishedAt?: string
  durationMs?: number
  nodeResults: NodeExecutionResult[]
}