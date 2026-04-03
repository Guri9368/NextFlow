"use client"

import { Handle, Position } from "reactflow"

export default function CropImageNode() {
  return (
    <div className="bg-yellow-50 border rounded shadow p-3 w-48">

      <div className="font-semibold text-sm mb-2">
        Crop Image
      </div>

      <p className="text-xs text-gray-500">
        Crops incoming image
      </p>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

    </div>
  )
}