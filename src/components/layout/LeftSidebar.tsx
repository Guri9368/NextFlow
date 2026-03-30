export default function LeftSidebar() {
    return (
        <div   className="w-64 border-r p-4 space-y-3" >

        <h2 className="text-sm font-semibold">Nodes</h2>

      <button className="node-btn">Text Node</button>
      <button className="node-btn">Upload Image</button>
      <button className="node-btn">Upload Video</button>
      <button className="node-btn">LLM Node</button>
      <button className="node-btn">Crop Image</button>
      <button className="node-btn">Extract Frame</button>



        </div>
    )
}