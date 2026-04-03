"use client"

import { Handle, Position } from "reactflow"
import { useState, useEffect } from "react"

export default function VideoUploadNode({ data }: any) {

  const [video, setVideo] = useState<any>(null)

  useEffect(() => {
    data.video = video
  }, [video])

  const handleFile = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setVideo(url)
  }

  return (
    <div className="bg-white border rounded shadow p-3 w-48">

      <div className="font-semibold text-sm mb-2">
        Upload Video
      </div>

      <input
        type="file"
        accept="video/*"
        onChange={handleFile}
        className="text-xs"
      />

      {video && (
        <video
          src={video}
          controls
          className="mt-2 w-full h-24 rounded"
        />
      )}

      <Handle type="source" position={Position.Right} />

    </div>
  )
}