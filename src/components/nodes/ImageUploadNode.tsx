"use client"

import { Handle, Position } from "reactflow"

export default function ImageUploadNode() {
  return (
    <div className="bg-white border rounded shadow p-3 w-48">

      <div className="font-semibold text-sm mb-2">
        Upload Image
      </div>

      <input type="file" accept="image/*" className="text-xs" />

      <Handle type="source" position={Position.Right} />

    </div>
  )
}