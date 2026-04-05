"use client"

import { Handle, Position, NodeProps, useReactFlow } from "reactflow"
import { useState } from "react"

export default function CropImageNode({ id, data }: NodeProps) {
  const [x, setX] = useState<number>(data.x ?? 0)
  const [y, setY] = useState<number>(data.y ?? 0)
  const [width, setWidth] = useState<number>(data.width ?? 50)
  const [height, setHeight] = useState<number>(data.height ?? 50)
  const { setNodes } = useReactFlow()
  const status = data.status as string | undefined

  const updateField = (key: string, val: number) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, [key]: val } } : n
      )
    )
  }

  const numInput = (
    label: string,
    val: number,
    key: string,
    setter: (v: number) => void
  ) => (
    <div className="nf-field">
      <div className="nf-label">{label} %</div>
      <input
        type="number"
        min={0}
        max={100}
        value={val}
        onChange={(e) => {
          const v = Number(e.target.value)
          setter(v)
          updateField(key, v)
        }}
        className="nf-input"
        style={{ padding: "5px 7px" }}
      />
    </div>
  )

  return (
    <div className={`nf-node ${status === "running" ? "nf-node-running" : ""}`}>
      <div className="nf-node-header">
        <div className="nf-node-icon" style={{ background: "rgba(234,179,8,0.12)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5">
            <path d="M6 2v4M2 6h4M18 2v4M20 6h4M6 22v-4M2 18h4M18 22v-4M20 18h4" />
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        </div>
        <span className="nf-node-title">Crop Image</span>
        {status === "success" && <span className="nf-status nf-status-success">✓</span>}
        {status === "error" && <span className="nf-status nf-status-error">✗</span>}
        {status === "running" && <span className="nf-status nf-status-running">●</span>}
      </div>
      <div className="nf-node-body">
        <div className="nf-row">
          {numInput("X", x, "x", setX)}
          {numInput("Y", y, "y", setY)}
        </div>
        <div className="nf-row">
          {numInput("Width", width, "width", setWidth)}
          {numInput("Height", height, "height", setHeight)}
        </div>
        {data.output && (
          <div>
            <div className="nf-label">Output</div>
            <img
              src={data.output}
              alt="cropped"
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
      <Handle type="target" position={Position.Left} id="image" style={{ top: "40%" }} />
      <Handle type="source" position={Position.Right} id="image" style={{ top: "40%" }} />
    </div>
  )
}
