"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Platform } from "@/lib/types"

interface GroupHeaderProps {
  platform: Platform
  count: number
  isCollapsed: boolean
  onToggle: () => void
}

export function GroupHeader({ platform, count, isCollapsed, onToggle }: GroupHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full neubrutalism-card p-4 mb-4 flex items-center justify-between hover:scale-[1.02] transition-transform"
      style={{ backgroundColor: platform.color }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{platform.logo}</span>
        <div className="text-left">
          <h2 className="text-xl font-bold uppercase">{platform.name}</h2>
          <p className="text-sm font-medium">{count} products found</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-bold">{count}</span>
        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </div>
    </button>
  )
}
