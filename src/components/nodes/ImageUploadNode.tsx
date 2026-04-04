"use client"

import { Handle, Position, NodeProps } from "reactflow"
import { useState } from "react"
import { useWorkflowStore } from "@/store/workflowStore"

export default function ImageUploadNode({ id, data }: NodeProps) {
  const [preview, setPreview] = useState<string>(data.imageUrl || "")
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)
  const status = data.status as string | undefined

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      updateNodeData(id, { imageUrl: dataUrl, image: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={`nf-node ${status === "running" ? "nf-node-running" : ""}`}>
      <div className="nf-node-header">
        <div className="nf-node-icon" style={{ background: "rgba(34,197,94,0.12)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <span className="nf-node-title">Upload Image</span>
        {status === "success" && <span className="nf-status nf-status-success">✓</span>}
        {status === "error" && <span className="nf-status nf-status-error">✗</span>}
      </div>
      <div className="nf-node-body">
        {!preview ? (
          <label className="nf-upload-area" style={{ display: "block" }}>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" onChange={handleFile} style={{ display: "none" }} />
            <div style={{ marginBottom: 4, fontSize: 16 }}>🖼️</div>
            <div>Click to upload image</div>
            <div style={{ marginTop: 3, color: "var(--text-muted)", fontSize: 10 }}>JPG · PNG · WEBP · GIF</div>
          </label>
        ) : (
          <div style={{ position: "relative" }}>
            <img src={preview} alt="preview" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
            <button
              onClick={() => { setPreview(""); updateNodeData(id, { imageUrl: "", image: "" }) }}
              style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.7)", border: "none", color: "white", borderRadius: 4, padding: "2px 6px", fontSize: 10, cursor: "pointer" }}
            >×</button>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="image" style={{ top: "50%" }} />
    </div>
  )
}