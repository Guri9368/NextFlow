"use client"

import React, { useCallback, useRef } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
  BackgroundVariant,
  Node,
  Edge,
} from "reactflow"
import "reactflow/dist/style.css"

import { useWorkflowStore } from "@/store/workflowStore"
import { executeWorkflow } from "@/lib/workflowExecuter"

import TextNode from "@/components/nodes/TextNode"
import LLMNode from "@/components/nodes/LLMNode"
import ImageUploadNode from "@/components/nodes/ImageUploadNode"
import VideoUploadNode from "@/components/nodes/VideoUploadNode"
import CropImageNode from "@/components/nodes/CropImageNode"
import ExtractFrameNode from "@/components/nodes/ExtractFrameNode"
import Topbar from "@/components/layout/Topbar"
import LeftSidebar from "@/components/layout/LeftSidebar"
import RightSidebar from "@/components/layout/RightSidebar"

const nodeTypes = {
  textNode: TextNode,
  llmNode: LLMNode,
  imageUpload: ImageUploadNode,
  videoUpload: VideoUploadNode,
  cropImage: CropImageNode,
  extractFrame: ExtractFrameNode,
}

let nodeCounter = 0
const genId = () => `node_${++nodeCounter}_${Date.now()}`

// Sample workflow definition
const SAMPLE_WORKFLOW = {
  nodes: [
    {
      id: "s_text1",
      type: "textNode",
      position: { x: 60, y: 80 },
      data: { text: "You are a creative marketing expert. Write engaging product descriptions." },
    },
    {
      id: "s_text2",
      type: "textNode",
      position: { x: 60, y: 260 },
      data: { text: "Describe this product image and create a compelling marketing tweet under 280 characters." },
    },
    {
      id: "s_image1",
      type: "imageUpload",
      position: { x: 60, y: 440 },
      data: {},
    },
    {
      id: "s_llm1",
      type: "llmNode",
      position: { x: 400, y: 200 },
      data: { model: "gemini-1.5-flash" },
    },
  ] as Node[],
  edges: [
    { id: "e1", source: "s_text1", target: "s_llm1", targetHandle: "system_prompt", animated: true },
    { id: "e2", source: "s_text2", target: "s_llm1", targetHandle: "user_message", animated: true },
    { id: "e3", source: "s_image1", target: "s_llm1", targetHandle: "image", animated: true },
  ] as Edge[],
}

function FlowCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { screenToFlowPosition } = useReactFlow()
  const importRef = useRef<HTMLInputElement>(null)

  const {
    setNodes: storeSetNodes,
    setEdges: storeSetEdges,
    setNodeStatus,
    setNodeOutput,
    addRun,
    setCurrentRunId,
  } = useWorkflowStore()

  const [isRunning, setIsRunning] = React.useState(false)
  const [toast, setToast] = React.useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData("application/reactflow")
      if (!type) return
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
      const newNode: Node = {
        id: genId(),
        type,
        position,
        data: {},
      }
      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes]
  )

  // Keep store in sync with local state
  React.useEffect(() => {
    storeSetNodes(nodes)
  }, [nodes])
  React.useEffect(() => {
    storeSetEdges(edges)
  }, [edges])

  const runWorkflow = async () => {
    if (nodes.length === 0) {
      showToast("Add some nodes first")
      return
    }

    setIsRunning(true)

    // Reset node statuses
    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, status: "idle", output: undefined, error: undefined } }))
    )

    try {
      const run = await executeWorkflow(nodes, edges, {
        onNodeStart: (nodeId) => {
          setNodes((nds) =>
            nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, status: "running" } } : n)
          )
        },
        onNodeDone: (nodeId, output, error) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId
                ? { ...n, data: { ...n.data, status: error ? "error" : "success", output, error } }
                : n
            )
          )
        },
      })

      addRun(run)
      setCurrentRunId(run.id)

      const successCount = run.nodeResults.filter((r) => r.status === "success").length
      const errorCount = run.nodeResults.filter((r) => r.status === "error").length

      if (errorCount > 0) {
        showToast(`Run complete — ${successCount} succeeded, ${errorCount} failed`)
      } else {
        showToast(`✓ Workflow complete — ${successCount} nodes ran successfully`)
      }

      // Save run to DB
      try {
        await fetch("/api/workflow-runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: run.status,
            result: { nodeResults: run.nodeResults, durationMs: run.durationMs },
          }),
        })
      } catch (_) {}
    } catch (err: any) {
      showToast(`Error: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const saveWorkflow = async () => {
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Workflow ${new Date().toLocaleString()}`,
          nodes,
          edges,
        }),
      })
      if (res.ok) showToast("✓ Workflow saved")
      else showToast("Failed to save workflow")
    } catch {
      showToast("Failed to save workflow")
    }
  }

  const exportWorkflow = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nextflow_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast("✓ Workflow exported")
  }

  const importWorkflow = () => {
    importRef.current?.click()
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes)
          setEdges(parsed.edges)
          showToast("✓ Workflow imported")
        } else {
          showToast("Invalid workflow file")
        }
      } catch {
        showToast("Failed to parse file")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const loadSample = () => {
    setNodes(SAMPLE_WORKFLOW.nodes)
    setEdges(SAMPLE_WORKFLOW.edges)
    showToast("✓ Sample workflow loaded — upload an image and run!")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <Topbar
        onRun={runWorkflow}
        onSave={saveWorkflow}
        onExport={exportWorkflow}
        onImport={importWorkflow}
        onLoadSample={loadSample}
        isRunning={isRunning}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <LeftSidebar />

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            deleteKeyCode="Delete"
            style={{ background: "var(--bg-base)" }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1.2}
              color="#252530"
            />
            <Controls />
            <MiniMap
              style={{ bottom: 16, right: 16 }}
              nodeColor={() => "var(--accent)"}
            />
          </ReactFlow>

          {/* Empty state hint */}
          {nodes.length === 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 28, opacity: 0.15 }}>⟨/⟩</div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Drag nodes from the left sidebar
                <br />
                or click <strong style={{ color: "var(--text-secondary)" }}>Sample Workflow</strong> to get started
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-primary)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {toast}
            </div>
          )}
        </div>

        <RightSidebar />
      </div>

      {/* Hidden file import input */}
      <input
        ref={importRef}
        type="file"
        accept=".json"
        onChange={handleImportFile}
        style={{ display: "none" }}
      />
    </div>
  )
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  )
}
