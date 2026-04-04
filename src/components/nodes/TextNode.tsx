"use client"

import { Handle, Position, NodeProps } from "reactflow"
import { useState, useEffect } from "react"
import { useWorkflowStore } from "@/store/workflowStore"

export default function TextNode({ id, data }: NodeProps) {
  const [text, setText] = useState<string>(data.text || "")
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)
  const status = data.status as string | undefined

  useEffect(() => { updateNodeData(id, { text }) }, [text])

  return (
    <div className={`nf-node ${status === "running" ? "nf-node-running" : ""}`}>
      <div className="nf-node-header">
        <div className="nf-node-icon" style={{ background: "rgba(124,106,255,0.15)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7c6aff" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <span className="nf-node-title">Text</span>
        {status === "success" && <span className="nf-status nf-status-success">✓</span>}
        {status === "error" && <span className="nf-status nf-status-error">✗</span>}
        {status === "running" && <span className="nf-status nf-status-running">●</span>}
      </div>
      <div className="nf-node-body">
        <div className="nf-field">
          <div className="nf-label">Content</div>
          <textarea
            className="nf-input"
            rows={3}
            placeholder="Enter text content..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ minHeight: 64, resize: "vertical" }}
          />
        </div>
        {data.output && (
          <div className="nf-output" style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
            {String(data.output).slice(0, 120)}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="output" style={{ top: "50%" }} />
    </div>
  )
}