"use client"

import { useState } from "react"
import { useWorkflowStore } from "@/store/workflowStore"

const NODE_TYPES = [
  {
    type: "textNode",
    label: "Text Node",
    desc: "Static text input",
    color: "rgba(124,106,255,0.15)",
    stroke: "#7c6aff",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    type: "imageUpload",
    label: "Upload Image",
    desc: "JPG, PNG, WEBP, GIF",
    color: "rgba(34,197,94,0.12)",
    stroke: "#22c55e",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    type: "videoUpload",
    label: "Upload Video",
    desc: "MP4, MOV, WEBM",
    color: "rgba(59,130,246,0.12)",
    stroke: "#3b82f6",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    type: "llmNode",
    label: "Run Any LLM",
    desc: "Gemini AI models",
    color: "rgba(168,85,247,0.12)",
    stroke: "#a855f7",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    type: "cropImage",
    label: "Crop Image",
    desc: "FFmpeg processing",
    color: "rgba(234,179,8,0.12)",
    stroke: "#eab308",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 2v4M2 6h4M18 2v4M20 6h4M6 22v-4M2 18h4M18 22v-4M20 18h4" />
        <rect x="6" y="6" width="12" height="12" />
      </svg>
    ),
  },
  {
    type: "extractFrame",
    label: "Extract Frame",
    desc: "From video at timestamp",
    color: "rgba(99,102,241,0.12)",
    stroke: "#6366f1",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
]

export default function LeftSidebar() {
  const [search, setSearch] = useState("")
  const { leftSidebarOpen } = useWorkflowStore()

  const filtered = NODE_TYPES.filter(
    (n) =>
      n.label.toLowerCase().includes(search.toLowerCase()) ||
      n.desc.toLowerCase().includes(search.toLowerCase())
  )

  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData("application/reactflow", nodeType)
    e.dataTransfer.effectAllowed = "move"
  }

  if (!leftSidebarOpen) return null

  return (
    <div
      style={{
        width: 220,
        borderRight: "1px solid var(--border)",
        background: "var(--bg-surface)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 14px 10px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 10,
          }}
        >
          Quick Access
        </div>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2.5"
            style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--text-primary)",
              fontSize: 11.5,
              padding: "5px 8px 5px 26px",
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
      </div>

      {/* Node list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {filtered.map((node) => (
          <button
            key={node.type}
            className="sidebar-node-btn"
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
          >
            <div
              className="nf-node-icon"
              style={{ background: node.color, color: node.stroke, flexShrink: 0 }}
            >
              {node.icon}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>
                {node.label}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{node.desc}</span>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 11,
              padding: "20px 0",
            }}
          >
            No nodes found
          </div>
        )}
      </div>

      {/* Footer tip */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--border)",
          fontSize: 10,
          color: "var(--text-muted)",
          lineHeight: 1.5,
        }}
      >
        Drag nodes onto the canvas or click to add
      </div>
    </div>
  )
}
