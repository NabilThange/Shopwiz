"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Filter } from "@/lib/types"

interface FilterCardProps {
  filter: Filter
  value: any
  onChange: (value: any) => void
}

export function FilterCard({ filter, value, onChange }: FilterCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const renderFilterContent = () => {
    switch (filter.type) {
      case "chips":
        return (
          <div className="flex flex-wrap gap-2">
            {filter.options?.map((option) => (
              <button
                key={option}
                onClick={() => onChange(value === option ? null : option)}
                className={`neubrutalism-chip text-sm ${value === option ? "selected" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        )

      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="neubrutalism-input w-full"
          >
            <option value="">Select {filter.name}</option>
            {filter.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "toggle":
        return (
          <div className="flex gap-2">
            {filter.options?.map((option) => (
              <button
                key={option}
                onClick={() => onChange(value === option ? null : option)}
                className={`px-4 py-2 border-2 border-black rounded-lg font-bold transition-all ${
                  value === option ? "bg-yellow-400" : "bg-white hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="neubrutalism-card p-4 bg-white">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full mb-3">
        <h3 className="text-lg font-bold uppercase">{filter.name}</h3>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && <div className="fade-in">{renderFilterContent()}</div>}
    </div>
  )
}
