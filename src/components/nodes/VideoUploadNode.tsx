"use client"

import { Handle, Position, NodeProps } from "reactflow"
import { useState } from "react"
import { useWorkflowStore } from "@/store/workflowStore"

export default function VideoUploadNode({ id, data }: NodeProps) {
  const [preview, setPreview] = useState<string>(data.videoUrl || "")
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)
  const status = data.status as string | undefined

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    updateNodeData(id, { videoUrl: url, video: url })
  }

  return (
    <div className={`nf-node ${status === "running" ? "nf-node-running" : ""}`}>
      <div className="nf-node-header">
        <div className="nf-node-icon" style={{ background: "rgba(59,130,246,0.12)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <span className="nf-node-title">Upload Video</span>
        {status === "success" && <span className="nf-status nf-status-success">✓</span>}
      </div>
      <div className="nf-node-body">
        {!preview ? (
          <label className="nf-upload-area" style={{ display: "block" }}>
            <input type="file" accept=".mp4,.mov,.webm,.m4v" onChange={handleFile} style={{ display: "none" }} />
            <div style={{ marginBottom: 4, fontSize: 16 }}>🎬</div>
            <div>Click to upload video</div>
            <div style={{ marginTop: 3, color: "var(--text-muted)", fontSize: 10 }}>MP4 · MOV · WEBM · M4V</div>
          </label>
        ) : (
          <div style={{ position: "relative" }}>
            <video src={preview} controls style={{ width: "100%", height: 90, borderRadius: 6, border: "1px solid var(--border)", background: "#000" }} />
            <button
              onClick={() => { setPreview(""); updateNodeData(id, { videoUrl: "", video: "" }) }}
              style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.7)", border: "none", color: "white", borderRadius: 4, padding: "2px 6px", fontSize: 10, cursor: "pointer" }}
            >×</button>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="video" style={{ top: "50%" }} />
    </div>
  )
}