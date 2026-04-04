import { create } from "zustand"
import { Node, Edge } from "reactflow"
import { WorkflowRun, NodeStatus } from "@/types/workflow"

interface WorkflowState {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  updateNodeData: (nodeId: string, data: Record<string, any>) => void
  setNodeStatus: (nodeId: string, status: NodeStatus) => void
  setNodeOutput: (nodeId: string, output: any, error?: string) => void

  runs: WorkflowRun[]
  currentRunId: string | null
  addRun: (run: WorkflowRun) => void
  updateRun: (runId: string, updates: Partial<WorkflowRun>) => void
  setCurrentRunId: (id: string | null) => void

  rightSidebarOpen: boolean
  leftSidebarOpen: boolean
  toggleRightSidebar: () => void
  toggleLeftSidebar: () => void
  selectedRunId: string | null
  setSelectedRunId: (id: string | null) => void
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  updateNodeData: (nodeId, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  setNodeStatus: (nodeId, status) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, status } } : n
      ),
    })),

  setNodeOutput: (nodeId, output, error) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, output, error, status: error ? "error" : "success" } }
          : n
      ),
    })),

  runs: [],
  currentRunId: null,
  addRun: (run) => set((s) => ({ runs: [run, ...s.runs] })),
  updateRun: (runId, updates) =>
    set((s) => ({
      runs: s.runs.map((r) => (r.id === runId ? { ...r, ...updates } : r)),
    })),
  setCurrentRunId: (id) => set({ currentRunId: id }),

  rightSidebarOpen: true,
  leftSidebarOpen: true,
  toggleRightSidebar: () => set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
  toggleLeftSidebar: () => set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  selectedRunId: null,
  setSelectedRunId: (id) => set({ selectedRunId: id }),
}))