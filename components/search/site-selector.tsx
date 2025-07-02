"use client"

import { platforms } from "@/lib/mock-data"

interface SiteSelectorProps {
  selectedPlatforms: string[]
  onChange: (platforms: string[]) => void
}

export function SiteSelector({ selectedPlatforms, onChange }: SiteSelectorProps) {
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onChange(selectedPlatforms.filter((id) => id !== platformId))
    } else {
      onChange([...selectedPlatforms, platformId])
    }
  }

  const selectAll = () => {
    onChange(platforms.map((p) => p.id))
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className="neubrutalism-card p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold uppercase">Shopping Sites</h3>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs px-3 py-1 bg-green-400 border border-black rounded font-bold">
            ALL
          </button>
          <button onClick={clearAll} className="text-xs px-3 py-1 bg-red-400 border border-black rounded font-bold">
            NONE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`p-3 border-2 border-black rounded-lg font-bold transition-all flex items-center gap-2 ${
              selectedPlatforms.includes(platform.id)
                ? `bg-${platform.color === "#FFFFFF" ? "gray-200" : "yellow-400"}`
                : "bg-white hover:bg-gray-100"
            }`}
            style={{
              backgroundColor: selectedPlatforms.includes(platform.id) ? platform.color : undefined,
            }}
          >
            <span className="text-xl">{platform.logo}</span>
            <span className="text-sm">{platform.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 text-sm font-medium text-gray-600">
        {selectedPlatforms.length} of {platforms.length} sites selected
      </div>
    </div>
  )
}
