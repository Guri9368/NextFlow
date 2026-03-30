"use client"

import React, { useCallback } from "react"

import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection
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

// node mapping
const nodeTypes = {
  textNode: TextNode,
  llmNode: LLMNode,
  imageUpload: ImageUploadNode,
   videoUpload: VideoUploadNode,
  cropImage: CropImageNode,
  extractFrame: ExtractFrameNode

}

export default function FlowCanvas() {

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // connect nodes
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    []
  )

  // allow drag
  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // drop node on canvas
  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (!type) return

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100
      }

      const newNode = {
        id: getId(),
        type: type,
        position,
        data: { label: `${type}` }
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes]
  )

  return (
    <div className="flex-1 h-full">

      <ReactFlowProvider>

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

      </ReactFlowProvider>

    </div>
  )
}