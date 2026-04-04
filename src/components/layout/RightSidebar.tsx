"use client"

import { useState } from "react"
import { useWorkflowStore } from "@/store/workflowStore"
import { WorkflowRun, NodeExecutionResult } from "@/types/workflow"

function formatDuration(ms?: number) {
  if (!ms) return "-"
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function NodeResultRow({ result }: { result: NodeExecutionResult }) {
  const [expanded, setExpanded] = useState(false)

  const nodeLabel =
    result.nodeType === "textNode" ? "Text"
    : result.nodeType === "imageUpload" ? "Image Upload"
    : result.nodeType === "videoUpload" ? "Video Upload"
    : result.nodeType === "llmNode" ? "LLM"
    : result.nodeType === "cropImage" ? "Crop Image"
    : result.nodeType === "extractFrame" ? "Extract Frame"
    : result.nodeType

  const statusColor =
    result.status === "success" ? "var(--green)"
    : result.status === "error" ? "var(--red)"
    : "var(--yellow)"

  return (
    <div
      style={{
        borderLeft: `2px solid ${statusColor}`,
        paddingLeft: 8,
        marginBottom: 6,
        cursor: "pointer",
      }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: statusColor, flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-primary)" }}>
            {nodeLabel}
          </span>
        </div>
        <span style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
          {formatDuration(result.durationMs)}
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: 5 }}>
          {result.output !== undefined && result.output !== null && (
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "4px 6px",
                fontSize: 10,
                color: "var(--text-secondary)",
                fontFamily: "'JetBrains Mono', monospace",
                wordBreak: "break-all",
                maxHeight: 60,
                overflowY: "auto",
              }}
            >
              {typeof result.output === "string"
                ? result.output.slice(0, 200)
                : JSON.stringify(result.output).slice(0, 200)}
            </div>
          )}
          {result.error && (
            <div
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 4,
                padding: "4px 6px",
                fontSize: 10,
                color: "var(--red)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RunEntry({ run, isSelected, onClick }: {
  run: WorkflowRun
  isSelected: boolean
  onClick: () => void
}) {
  const successCount = run.nodeResults.filter((r) => r.status === "success").length
  const errorCount = run.nodeResults.filter((r) => r.status === "error").length

  const statusColor =
    run.status === "success" ? "var(--green)"
    : run.status === "error" ? "var(--red)"
    : "var(--yellow)"

  return (
    <div
      className="history-entry"
      onClick={onClick}
      style={{
        borderColor: isSelected ? "var(--accent)" : undefined,
        background: isSelected ? "rgba(124,106,255,0.06)" : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: statusColor, flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-primary)" }}>
            {run.scope === "full" ? "Full Run" : "Partial Run"}
          </span>
        </div>
        <span style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
          {formatDuration(run.durationMs)}
        </span>
      </div>
      <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 5 }}>
        {formatTime(run.startedAt)}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {successCount > 0 && (
          <span className="nf-status nf-status-success">{successCount} ok</span>
        )}
        {errorCount > 0 && (
          <span className="nf-status nf-status-error">{errorCount} failed</span>
        )}
        <span style={{ fontSize: 9.5, color: "var(--text-muted)", alignSelf: "center" }}>
          {run.nodeResults.length} nodes
        </span>
      </div>

      {isSelected && run.nodeResults.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 6,
            }}
          >
            Node Results
          </div>
          {run.nodeResults.map((r) => (
            <NodeResultRow key={r.nodeId} result={r} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function RightSidebar() {
  const { runs, rightSidebarOpen, selectedRunId, setSelectedRunId } = useWorkflowStore()

  if (!rightSidebarOpen) return null

  return (
    <div
      style={{
        width: 240,
        borderLeft: "1px solid var(--border)",
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
            marginBottom: 2,
          }}
        >
          Run History
        </div>
        {runs.length > 0 && (
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
            {runs.length} run{runs.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Run list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {runs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px 16px",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>⏱</div>
            <div style={{ fontSize: 11.5, fontWeight: 500, marginBottom: 4, color: "var(--text-secondary)" }}>
              No runs yet
            </div>
            <div style={{ fontSize: 10.5, lineHeight: 1.5 }}>
              Run your workflow to see execution history here
            </div>
          </div>
        ) : (
          runs.map((run) => (
            <RunEntry
              key={run.id}
              run={run}
              isSelected={selectedRunId === run.id}
              onClick={() =>
                setSelectedRunId(selectedRunId === run.id ? null : run.id)
              }
            />
          ))
        )}
      </div>
    </div>
  )
}
