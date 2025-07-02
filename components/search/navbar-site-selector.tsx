"use client"

import { platforms } from "@/lib/mock-data"
import { Globe } from "lucide-react"
import { useState } from "react"

interface NavbarSiteSelectorProps {
  selectedPlatforms: string[]
  onChange: (platforms: string[]) => void
  includeWeb?: boolean
}

export function NavbarSiteSelector({ selectedPlatforms, onChange, includeWeb = true }: NavbarSiteSelectorProps) {
  const [showWebTooltip, setShowWebTooltip] = useState(false)

  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onChange(selectedPlatforms.filter((id) => id !== platformId))
    } else {
      onChange([...selectedPlatforms, platformId])
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold text-gray-600 mr-2">SITES:</span>
        {platforms.map((platform) => (
          <div key={platform.id} className="relative">
            <button
              onClick={() => togglePlatform(platform.id)}
              onMouseEnter={() => (platform.id === "web" ? setShowWebTooltip(true) : null)}
              onMouseLeave={() => (platform.id === "web" ? setShowWebTooltip(false) : null)}
              className={`px-3 py-1 border-2 border-black rounded-full font-bold text-sm transition-all flex items-center gap-1 ${
                selectedPlatforms.includes(platform.id)
                  ? "bg-yellow-400 shadow-[2px_2px_0px_black]"
                  : "bg-white hover:bg-gray-100 shadow-[1px_1px_0px_black]"
              }`}
            >
              <span className="text-xs">{platform.logo}</span>
              <span className="hidden sm:inline">{platform.name}</span>
              {platform.id === "web" && <span className="text-xs">ℹ️</span>}
            </button>

            {platform.id === "web" && showWebTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                Includes Croma, Snapdeal, brand sites, and more
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
              </div>
            )}
          </div>
        ))}

        {includeWeb && !platforms.some((p) => p.id === "web") && (
          <div className="relative">
            <button
              onClick={() => togglePlatform("web")}
              onMouseEnter={() => setShowWebTooltip(true)}
              onMouseLeave={() => setShowWebTooltip(false)}
              className={`px-3 py-1 border-2 border-black rounded-full font-bold text-sm transition-all flex items-center gap-1 ${
                selectedPlatforms.includes("web")
                  ? "bg-gray-400 shadow-[2px_2px_0px_black]"
                  : "bg-white hover:bg-gray-100 shadow-[1px_1px_0px_black]"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Web</span>
              <span className="text-xs">ℹ️</span>
            </button>

            {showWebTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                Includes Croma, Snapdeal, brand sites, and more
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const allPlatformIds = platforms.map((p) => p.id)
            if (includeWeb && !platforms.some((p) => p.id === "web")) {
              allPlatformIds.push("web")
            }
            onChange(allPlatformIds)
          }}
          className="px-3 py-1 bg-green-400 border-2 border-black rounded-full font-bold text-xs hover:bg-green-500 hover:scale-105 transition-all flex items-center gap-1"
        >
          🟢 ALL SITES
        </button>
        <button
          onClick={() => onChange([])}
          className="px-3 py-1 bg-red-400 border-2 border-black rounded-full font-bold text-xs hover:bg-red-500 hover:scale-105 transition-all flex items-center gap-1"
        >
          ❌ CLEAR
        </button>
      </div>
    </div>
  )
}
