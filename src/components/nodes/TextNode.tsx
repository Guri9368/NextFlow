"use client"

import { Handle, Position } from "reactflow"

export default function TextNode({ data }: any) {
  return (
    <div className="bg-white border rounded shadow p-3 w-40">

      <div className="font-semibold text-sm mb-2">
        Text Node
      </div>

      <textarea
        className="w-full border rounded text-xs p-1"
        placeholder="Enter text..."
      />

      <Handle type="source" position={Position.Right} />

    </div>
  )
}