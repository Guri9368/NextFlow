import LeftSidebar from "@/components/layout/LeftSidebar"
import RightSidebar from "@/components/layout/RightSidebar"
import FlowCanvas from "@/components/workflow/FlowCanvas"

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      
      
      <div className="h-14 border-b flex items-center px-6">
        <h1 className="font-semibold">NextFlow</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        <LeftSidebar />

        <FlowCanvas />

        <RightSidebar />

      </div>
    </div>
  )
}