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

// Full Product Marketing Kit Generator sample workflow
const SAMPLE_WORKFLOW: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    // Branch A: Image processing
    {
      id: "s_img1",
      type: "imageUpload",
      position: { x: 60, y: 60 },
      data: {},
    },
    {
      id: "s_crop1",
      type: "cropImage",
      position: { x: 340, y: 60 },
      data: { x: 0, y: 0, width: 80, height: 80 },
    },
    {
      id: "s_sys_prompt",
      type: "textNode",
      position: { x: 60, y: 320 },
      data: { text: "You are a creative marketing expert. Write engaging, viral product descriptions." },
    },
    {
      id: "s_user_msg",
      type: "textNode",
      position: { x: 60, y: 500 },
      data: { text: "Describe this product image and write a compelling marketing tweet under 280 characters. Make it exciting and use relevant emojis." },
    },
    // LLM Node 1 (Branch A convergence)
    {
      id: "s_llm1",
      type: "llmNode",
      position: { x: 640, y: 200 },
      data: { model: "gemini-1.5-flash" },
    },
    // Branch B: Video processing
    {
      id: "s_vid1",
      type: "videoUpload",
      position: { x: 60, y: 700 },
      data: {},
    },
    {
      id: "s_frame1",
      type: "extractFrame",
      position: { x: 340, y: 700 },
      data: { timestamp: "50%" },
    },
  ],
  edges: [
    // Branch A connections
    { id: "e_img_crop", source: "s_img1", target: "s_crop1", sourceHandle: "image", targetHandle: "image", animated: true },
    { id: "e_crop_llm", source: "s_crop1", target: "s_llm1", sourceHandle: "image", targetHandle: "image", animated: true },
    { id: "e_sys_llm", source: "s_sys_prompt", target: "s_llm1", sourceHandle: "output", targetHandle: "system_prompt", animated: true },
    { id: "e_usr_llm", source: "s_user_msg", target: "s_llm1", sourceHandle: "output", targetHandle: "user_message", animated: true },
    // Branch B connections
    { id: "e_vid_frame", source: "s_vid1", target: "s_frame1", sourceHandle: "video", targetHandle: "video", animated: true },
  ],
}

function FlowCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { screenToFlowPosition } = useReactFlow()
  const importRef = useRef<HTMLInputElement>(null)

  const { setNodes: storeSetNodes, setEdges: storeSetEdges, addRun, setCurrentRunId } =
    useWorkflowStore()

  const [isRunning, setIsRunning] = React.useState(false)
  const [toast, setToast] = React.useState<{ msg: string; type: "ok" | "err" } | null>(null)

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
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
      const newNode: Node = { id: genId(), type, position, data: {} }
      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes]
  )

  React.useEffect(() => { storeSetNodes(nodes) }, [nodes])
  React.useEffect(() => { storeSetEdges(edges) }, [edges])

  const runWorkflow = async () => {
    if (nodes.length === 0) { showToast("Add some nodes first", "err"); return }

    setIsRunning(true)

    // Reset statuses
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

      const ok = run.nodeResults.filter((r) => r.status === "success").length
      const fail = run.nodeResults.filter((r) => r.status === "error").length

      showToast(
        fail > 0 ? `${ok} succeeded · ${fail} failed` : `✓ All ${ok} nodes completed`,
        fail > 0 ? "err" : "ok"
      )

      // Persist run
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
      showToast(err.message, "err")
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
      if (res.ok) showToast("✓ Workflow saved to database")
      else {
        const d = await res.json()
        showToast(d.error || "Save failed", "err")
      }
    } catch {
      showToast("Failed to save", "err")
    }
  }

  const exportWorkflow = () => {
    if (nodes.length === 0) { showToast("Nothing to export", "err"); return }
    const data = JSON.stringify({ nodes, edges, exportedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nextflow_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast("✓ Workflow exported as JSON")
  }

  const importWorkflow = () => importRef.current?.click()

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
          showToast(`✓ Imported ${parsed.nodes.length} nodes`)
        } else {
          showToast("Invalid workflow file — missing nodes/edges", "err")
        }
      } catch {
        showToast("Could not parse JSON file", "err")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const loadSample = () => {
    setNodes(SAMPLE_WORKFLOW.nodes)
    setEdges(SAMPLE_WORKFLOW.edges)
    showToast("✓ Product Marketing Kit loaded — upload an image and run!")
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
            <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#252530" />
            <Controls />
            <MiniMap style={{ bottom: 16, right: 16 }} nodeColor={() => "var(--accent)"} />
          </ReactFlow>

          {/* Empty state */}
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
              <div style={{ fontSize: 32, opacity: 0.1 }}>⟨/⟩</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.7 }}>
                Drag nodes from the left panel onto the canvas
                <br />
                or click{" "}
                <strong style={{ color: "var(--text-secondary)" }}>Sample Workflow</strong> to load an example
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
                background: toast.type === "err" ? "rgba(239,68,68,0.1)" : "var(--bg-elevated)",
                border: `1px solid ${toast.type === "err" ? "rgba(239,68,68,0.3)" : "var(--border-light)"}`,
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 12,
                fontWeight: 500,
                color: toast.type === "err" ? "var(--red)" : "var(--text-primary)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                zIndex: 1000,
              }}
            >
              {toast.msg}
            </div>
          )}
        </div>

        <RightSidebar />
      </div>

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
