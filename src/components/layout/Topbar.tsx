"use client"

import { useWorkflowStore } from "@/store/workflowStore"

export default function Topbar({
  onRun,
  onSave,
  onExport,
  onImport,
  onLoadSample,
  isRunning,
}: {
  onRun: () => void
  onSave: () => void
  onExport: () => void
  onImport: () => void
  onLoadSample: () => void
  isRunning: boolean
}) {
  const {
    toggleLeftSidebar,
    toggleRightSidebar,
    leftSidebarOpen,
    rightSidebarOpen,
    nodes,
  } = useWorkflowStore()

  return (
    <div
      style={{
        height: 48,
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-surface)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
        <div
          style={{
            width: 24,
            height: 24,
            background: "var(--accent)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          NextFlow
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "var(--border)" }} />

      {/* Sidebar toggles */}
      <button
        onClick={toggleLeftSidebar}
        title="Toggle left sidebar"
        style={{
          background: leftSidebarOpen ? "var(--bg-elevated)" : "transparent",
          border: "1px solid " + (leftSidebarOpen ? "var(--border)" : "transparent"),
          borderRadius: 5,
          padding: "4px 7px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: leftSidebarOpen ? "var(--text-primary)" : "var(--text-muted)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
        </svg>
      </button>

      <button
        onClick={toggleRightSidebar}
        title="Toggle history panel"
        style={{
          background: rightSidebarOpen ? "var(--bg-elevated)" : "transparent",
          border: "1px solid " + (rightSidebarOpen ? "var(--border)" : "transparent"),
          borderRadius: 5,
          padding: "4px 7px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: rightSidebarOpen ? "var(--text-primary)" : "var(--text-muted)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M15 3v18" />
        </svg>
      </button>

      <div style={{ flex: 1 }} />

      {/* Node count */}
      {nodes.length > 0 && (
        <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
          {nodes.length} node{nodes.length !== 1 ? "s" : ""}
        </span>
      )}

      {/* Action buttons */}
      <button
        onClick={onLoadSample}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "5px 11px",
          fontSize: 11.5,
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          transition: "border-color 0.12s, color 0.12s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-light)"
          e.currentTarget.style.color = "var(--text-primary)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.color = "var(--text-secondary)"
        }}
      >
        Sample Workflow
      </button>

      <button
        onClick={onImport}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "5px 11px",
          fontSize: 11.5,
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          transition: "border-color 0.12s, color 0.12s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-light)"
          e.currentTarget.style.color = "var(--text-primary)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.color = "var(--text-secondary)"
        }}
      >
        Import
      </button>

      <button
        onClick={onExport}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "5px 11px",
          fontSize: 11.5,
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          transition: "border-color 0.12s, color 0.12s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-light)"
          e.currentTarget.style.color = "var(--text-primary)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.color = "var(--text-secondary)"
        }}
      >
        Export
      </button>

      <button
        onClick={onSave}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "5px 11px",
          fontSize: 11.5,
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          transition: "border-color 0.12s, color 0.12s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-light)"
          e.currentTarget.style.color = "var(--text-primary)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.color = "var(--text-secondary)"
        }}
      >
        Save
      </button>

      {/* Run button */}
      <button
        onClick={onRun}
        disabled={isRunning}
        style={{
          background: isRunning ? "rgba(124,106,255,0.3)" : "var(--accent)",
          border: "none",
          borderRadius: 6,
          padding: "5px 16px",
          fontSize: 12,
          fontWeight: 600,
          color: "white",
          cursor: isRunning ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.03em",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "background 0.12s",
        }}
      >
        {isRunning ? (
          <>
            <span
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "white", opacity: 0.8,
                animation: "pulse-glow 0.8s ease-in-out infinite",
              }}
            />
            Running...
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Run Workflow
          </>
        )}
      </button>
    </div>
  )
}
