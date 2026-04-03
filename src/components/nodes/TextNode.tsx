"use client"

import { Handle, Position } from "reactflow"
import { useState, useEffect } from "react"

export default function TextNode({ id, data }: any) {

  const [text, setText] = useState(data.text || "")

  useEffect(() => {
    data.text = text
  }, [text])

  return (
    <div className="bg-white border rounded shadow p-3 w-44">

      <div className="font-semibold text-sm mb-2">
        Text Node
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded text-xs p-1"
        placeholder="Enter text..."
      />

      <Handle type="source" position={Position.Right} />

    </div>
  )
}