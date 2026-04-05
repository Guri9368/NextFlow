"use client"

import { Handle, Position, NodeProps, useReactFlow } from "reactflow"
import { useState } from "react"

export default function ExtractFrameNode({ id, data }: NodeProps) {
  const [timestamp, setTimestamp] = useState<string>(data.timestamp || "50%")
  const { setNodes } = useReactFlow()
  const status = data.status as string | undefined

  const handleChange = (val: string) => {
    setTimestamp(val)
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, timestamp: val } } : n
      )
    )
  }

  return (
    <div className={`nf-node ${status === "running" ? "nf-node-running" : ""}`}>
      <div className="nf-node-header">
        <div className="nf-node-icon" style={{ background: "rgba(99,102,241,0.12)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
        <span className="nf-node-title">Extract Frame</span>
        {status === "success" && <span className="nf-status nf-status-success">✓</span>}
        {status === "error" && <span className="nf-status nf-status-error">✗</span>}
        {status === "running" && <span className="nf-status nf-status-running">●</span>}
      </div>
      <div className="nf-node-body">
        <div className="nf-field">
          <div className="nf-label">Timestamp</div>
          <input
            type="text"
            className="nf-input"
            placeholder="50% or 12.5 (seconds)"
            value={timestamp}
            onChange={(e) => handleChange(e.target.value)}
          />
          <div style={{ fontSize: 9.5, color: "var(--text-muted)", marginTop: 2 }}>
            Use % for relative, or seconds (e.g. 12.5)
          </div>
        </div>
        {data.output && (
          <div>
            <div className="nf-label">Extracted Frame</div>
            <img
              src={data.output}
              alt="frame"
              style={{
                width: "100%", height: 70,
                objectFit: "cover", borderRadius: 5,
                border: "1px solid var(--border)",
              }}
            />
          </div>
        )}
        {data.error && (
          <div className="nf-output" style={{ color: "var(--red)" }}>
            {data.error}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} id="video" style={{ top: "40%" }} />
      <Handle type="source" position={Position.Right} id="image" style={{ top: "40%" }} />
    </div>
  )
}
