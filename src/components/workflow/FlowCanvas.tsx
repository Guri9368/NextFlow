"use client"

import React, { useCallback } from "react"
import { executeWorkflow } from "@/lib/workflowExecuter"

import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow
} from "reactflow"

import "reactflow/dist/style.css"

// custom nodes
import TextNode from "@/components/nodes/TextNode"
import LLMNode from "@/components/nodes/LLMNode"
import ImageUploadNode from "../nodes/ImageUploadNode"
import VideoUploadNode from "../nodes/VideoUploadNode"
import CropImageNode from "../nodes/CropImageNode"
import ExtractFrameNode from "../nodes/ExtractFrameNode"

let id = 0
const getId = () => `node_${id++}`

const nodeTypes = {
  textNode: TextNode,
  llmNode: LLMNode,
  imageUpload: ImageUploadNode,
  videoUpload: VideoUploadNode,
  cropImage: CropImageNode,
  extractFrame: ExtractFrameNode
}

function FlowCanvasInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const { screenToFlowPosition } = useReactFlow()

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: type }
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes]
  )

  const runWorkflow = async () => {

  if(nodes.length === 0){
    alert("Add some nodes first")
    return
  }

  if(edges.length === 0){
    alert("Connect nodes before running workflow")
    return
  }

  console.log("Running workflow...")

  const results = await executeWorkflow(nodes, edges)

  console.log("Workflow result:", results)
}


  return (
  <div className="h-full relative">

    <button
      onClick={runWorkflow}
      className="absolute top-4 right-4 z-10 px-3 py-1 bg-black text-white rounded"
    >
      Run Workflow
    </button>

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
    >
      <Background gap={16} />
      <Controls />
      <MiniMap />
    </ReactFlow>

  </div>
)
}

export default function FlowCanvas() {
  return (
    <div className="flex-1 h-full">
      <ReactFlowProvider>
        <FlowCanvasInner />
      </ReactFlowProvider>
    </div>
  )
}