"use client"

import { Handle, Position, NodeProps } from "reactflow"
import { useState, useEffect } from "react"
import { useWorkflowStore } from "@/store/workflowStore"

const MODELS = [
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro" },
]
export default function LLMNode({ id, data }: NodeProps) {
  const [model, setModel] = useState<string>(data.model || "gemini-1.5-flash")
  const [systemPrompt, setSystemPrompt] = useState<string>(data.systemPrompt || "")
  const [userMessage, setUserMessage] = useState<string>(data.userMessage || "")
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)
  const status = data.status as string | undefined

  useEffect(() => { updateNodeData(id, { model, systemPrompt, userMessage }) }, [model, systemPrompt, userMessage])

  return (
    <div className={`nf-node ${status === "running" ? "nf-node-running" : ""}`} style={{ minWidth: 256 }}>
      <div className="nf-node-header">
        <div className="nf-node-icon" style={{ background: "rgba(124,106,255,0.15)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7c6aff" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <span className="nf-node-title">Run LLM</span>
        {status === "success" && <span className="nf-status nf-status-success">✓</span>}
        {status === "error" && <span className="nf-status nf-status-error">✗</span>}
        {status === "running" && <span className="nf-status nf-status-running">⟳ Running</span>}
      </div>
      <div className="nf-node-body">
        <div className="nf-field">
          <div className="nf-label">Model</div>
          <select className="nf-select" value={model} onChange={(e) => setModel(e.target.value)}>
            {MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="nf-field">
          <div className="nf-label">System Prompt <span style={{ color: "var(--text-muted)" }}>(optional)</span></div>
          <textarea className="nf-input" rows={2} placeholder="Connected or manual..." value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} style={{ minHeight: 48 }} />
        </div>
        <div className="nf-field">
          <div className="nf-label">User Message</div>
          <textarea className="nf-input" rows={2} placeholder="Connected or manual..." value={userMessage} onChange={(e) => setUserMessage(e.target.value)} style={{ minHeight: 48 }} />
        </div>
        {data.output && (
          <div>
            <div className="nf-label" style={{ color: "var(--green)" }}>Response</div>
            <div className="nf-output">{data.output}</div>
          </div>
        )}
        {data.error && <div className="nf-output" style={{ color: "var(--red)" }}>{data.error}</div>}
      </div>
      <Handle type="target" position={Position.Left} id="system_prompt" style={{ top: "38%" }} />
      <Handle type="target" position={Position.Left} id="user_message" style={{ top: "58%" }} />
      <Handle type="target" position={Position.Left} id="image" style={{ top: "78%" }} />
      <Handle type="source" position={Position.Right} id="output" style={{ top: "50%" }} />
    </div>
  )
}