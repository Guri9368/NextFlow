"use client"

export default function LeftSidebar() {

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="w-64 border-r p-4 space-y-3">

      <h2 className="text-sm font-semibold">Nodes</h2>

      <button
        draggable
        onDragStart={(e) => onDragStart(e, "textNode")}
        className="node-btn"
      >
        Text Node
      </button>

      <button
        draggable
        onDragStart={(e) => onDragStart(e, "imageUpload")}
        className="node-btn"
      >
        Upload Image
      </button>

      <button
        draggable
        onDragStart={(e) => onDragStart(e, "videoUpload")}
        className="node-btn"
      >
        Upload Video
      </button>

      <button
        draggable
        onDragStart={(e) => onDragStart(e, "llmNode")}
        className="node-btn"
      >
        LLM Node
      </button>

      <button
        draggable
        onDragStart={(e) => onDragStart(e, "cropImage")}
        className="node-btn"
      >
        Crop Image
      </button>

      <button
        draggable
        onDragStart={(e) => onDragStart(e, "extractFrame")}
        className="node-btn"
      >
        Extract Frame
      </button>

    </div>
  )
}