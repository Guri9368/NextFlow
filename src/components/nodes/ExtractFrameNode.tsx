"use client"

import { Handle, Position, NodeProps } from "reactflow"
import { useState, useEffect } from "react"
import { useWorkflowStore } from "@/store/workflowStore"

export default function ExtractFrameNode({ id, data }: NodeProps) {
  const [timestamp, setTimestamp] = useState<string>(data.timestamp || "50%")
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)
  const status = data.status as string | undefined

  useEffect(() => { updateNodeData(id, { timestamp }) }, [timestamp])

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
          <input type="text" className="nf-input" placeholder="50% or 12.5 (seconds)" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
          <div style={{ fontSize: 9.5, color: "var(--text-muted)", marginTop: 2 }}>Use % for relative, or seconds</div>
        </div>
        {data.output && <img src={data.output} alt="frame" style={{ width: "100%", height: 70, objectFit: "cover", borderRadius: 5, border: "1px solid var(--border)" }} />}
        {data.error && <div className="nf-output" style={{ color: "var(--red)" }}>{data.error}</div>}
      </div>
      <Handle type="target" position={Position.Left} id="video" style={{ top: "40%" }} />
      <Handle type="source" position={Position.Right} id="image" style={{ top: "40%" }} />
    </div>
  )
}