"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { FilterConfig } from "@/lib/filter-config"

interface DynamicFilterRendererProps {
  filterConfig: FilterConfig & { priceRange?: [number, number] }
  value: any
  onChange: (value: any) => void
  categoryId: string
}

export function DynamicFilterRenderer({ filterConfig, value, onChange, categoryId }: DynamicFilterRendererProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleCheckboxChange = (option: string) => {
    const currentValues = value || []
    const newValues = currentValues.includes(option)
      ? currentValues.filter((v: string) => v !== option)
      : [...currentValues, option]
    onChange(newValues)
  }

  const handleRadioChange = (option: string) => {
    onChange(option)
  }

  const handleSliderChange = (min: number, max: number) => {
    onChange([min, max])
  }

  const renderFilterContent = () => {
    switch (filterConfig.type) {
      case "checkbox":
        return (
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {filterConfig.options?.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={value?.includes(option) || false}
                  onChange={() => handleCheckboxChange(option)}
                  className="w-4 h-4 border-2 border-black rounded accent-yellow-400"
                />
                <span className="font-medium text-sm">{option}</span>
              </label>
            ))}
          </div>
        )

      case "radio":
        return (
          <div className="space-y-2">
            {filterConfig.options?.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name={filterConfig.name}
                  checked={value === option}
                  onChange={() => handleRadioChange(option)}
                  className="w-4 h-4 border-2 border-black accent-cyan-400"
                />
                <span className="font-medium text-sm">{option}</span>
              </label>
            ))}
          </div>
        )

      case "slider":
        const [min, max] = filterConfig.priceRange || [0, 100000]
        const currentMin = value?.[0] || min
        const currentMax = value?.[1] || max

        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <input
                type="range"
                min={min}
                max={max}
                value={currentMin}
                onChange={(e) => handleSliderChange(Number(e.target.value), currentMax)}
                className="w-full flex-1 slider"
              />
              <input
                type="range"
                min={min}
                max={max}
                value={currentMax}
                onChange={(e) => handleSliderChange(currentMin, Number(e.target.value))}
                className="w-full flex-1 slider"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                placeholder="Min"
                value={currentMin}
                onChange={(e) => handleSliderChange(Number(e.target.value) || min, currentMax)}
                className="w-full sm:flex-1 px-2 sm:px-3 py-2 border-2 border-black rounded-lg font-bold text-xs sm:text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={currentMax}
                onChange={(e) => handleSliderChange(currentMin, Number(e.target.value) || max)}
                className="w-full sm:flex-1 px-2 sm:px-3 py-2 border-2 border-black rounded-lg font-bold text-xs sm:text-sm"
              />
            </div>

            <div className="text-center font-bold text-xs sm:text-sm">
              ₹{currentMin.toLocaleString()} - ₹{currentMax.toLocaleString()}
            </div>
          </div>
        )

      case "swatch":
        return (
          <div className="flex flex-wrap gap-3">
            {filterConfig.options?.map((color) => {
              const colorMap: Record<string, string> = {
                Black: "#000000",
                White: "#FFFFFF",
                Red: "#FF0000",
                Blue: "#0066CC",
                Green: "#008000",
                Yellow: "#FFFF00",
                Pink: "#FFC0CB",
                Purple: "#800080",
                Orange: "#FFA500",
                Brown: "#8B4513",
                Gray: "#808080",
                Navy: "#000080",
                Gold: "#FFD700",
                Silver: "#C0C0C0",
                "Rose Gold": "#E8B4B8",
              }

              return (
                <button
                  key={color}
                  onClick={() => handleCheckboxChange(color)}
                  className={`w-8 h-8 border-2 border-black rounded-sm transition-all hover:scale-110 ${
                    value?.includes(color) ? "ring-4 ring-pink-400" : ""
                  }`}
                  style={{ backgroundColor: colorMap[color] || "#CCCCCC" }}
                  title={color}
                />
              )
            })}
          </div>
        )

      case "toggle":
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange(!value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black transition-colors ${
                value ? "bg-green-400" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white border border-black transition-transform ${
                  value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="font-medium text-sm">{value ? "Enabled" : "Disabled"}</span>
          </div>
        )

      default:
        return <div className="text-gray-500 text-sm">Filter type not supported</div>
    }
  }

  return (
    <div className="neubrutalism-card p-4 bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-3 hover:bg-gray-50 p-1 rounded"
      >
        <h3 className="text-lg font-bold uppercase">{filterConfig.name}</h3>
        <div className="flex items-center gap-2">
          {filterConfig.required && <span className="text-xs bg-red-400 text-white px-2 py-1 rounded">REQUIRED</span>}
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && <div className="fade-in">{renderFilterContent()}</div>}
    </div>
  )
}
