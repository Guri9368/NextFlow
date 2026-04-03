"use client"

import { Handle, Position } from "reactflow"
import { useState, useEffect } from "react"

export default function ImageUploadNode({ data }: any) {

  const [image, setImage] = useState<any>(null)

  useEffect(() => {
    data.image = image
  }, [image])

  const handleFile = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setImage(url)
  }

  return (
    <div className="bg-white border rounded shadow p-3 w-48">

      <div className="font-semibold text-sm mb-2">
        Upload Image
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="text-xs"
      />

      {image && (
        <img
          src={image}
          alt="preview"
          className="mt-2 w-full h-20 object-cover rounded"
        />
      )}

      <Handle type="source" position={Position.Right} />

    </div>
  )
}