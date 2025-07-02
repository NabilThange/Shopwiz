"use client"

import { useState, useEffect } from "react"
import { X, Filter, RotateCcw } from "lucide-react"
import { WatchFilters } from "./watch-filters"
import { ClothingFilters } from "./clothing-filters"
import { ElectronicsFilters } from "./electronics-filters"
import { GeneralFilters } from "./general-filters"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  currentFilters: Record<string, any>
  onApplyFilters: (filters: Record<string, any>) => void
}

type ProductCategory = "watches" | "clothing" | "electronics" | "general"

export function FilterModal({ isOpen, onClose, searchQuery, currentFilters, onApplyFilters }: FilterModalProps) {
  const [filters, setFilters] = useState(currentFilters)
  const [detectedCategory, setDetectedCategory] = useState<ProductCategory>("general")

  // Detect category from search query
  useEffect(() => {
    const query = searchQuery.toLowerCase()

    if (query.includes("watch") || query.includes("titan") || query.includes("timepiece")) {
      setDetectedCategory("watches")
    } else if (
      query.includes("shirt") ||
      query.includes("shoe") ||
      query.includes("dress") ||
      query.includes("clothing") ||
      query.includes("apparel") ||
      query.includes("fashion")
    ) {
      setDetectedCategory("clothing")
    } else if (
      query.includes("laptop") ||
      query.includes("phone") ||
      query.includes("tablet") ||
      query.includes("electronics") ||
      query.includes("computer") ||
      query.includes("mobile")
    ) {
      setDetectedCategory("electronics")
    } else {
      setDetectedCategory("general")
    }
  }, [searchQuery])

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({})
  }

  const getCategoryTitle = () => {
    switch (detectedCategory) {
      case "watches":
        return "Watch Filters"
      case "clothing":
        return "Clothing Filters"
      case "electronics":
        return "Electronics Filters"
      default:
        return "Product Filters"
    }
  }

  const getCategoryIcon = () => {
    switch (detectedCategory) {
      case "watches":
        return "⌚"
      case "clothing":
        return "👕"
      case "electronics":
        return "📱"
      default:
        return "🔍"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_black] overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-400 border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon()}</span>
            <div>
              <h2 className="text-xl font-bold uppercase">{getCategoryTitle()}</h2>
              <p className="text-sm font-medium">
                Searching for: <span className="bg-black text-white px-2 py-1 rounded">{searchQuery}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-red-400 border-2 border-black rounded-lg font-bold text-sm hover:bg-red-500 hover:scale-105 transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              RESET
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-200 border-2 border-black rounded-lg hover:bg-gray-300 hover:scale-105 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {detectedCategory === "watches" && <WatchFilters filters={filters} onFilterChange={handleFilterChange} />}

          {detectedCategory === "clothing" && <ClothingFilters filters={filters} onFilterChange={handleFilterChange} />}

          {detectedCategory === "electronics" && (
            <ElectronicsFilters filters={filters} onFilterChange={handleFilterChange} />
          )}

          {detectedCategory === "general" && <GeneralFilters filters={filters} onFilterChange={handleFilterChange} />}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t-4 border-black p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <Filter className="w-4 h-4 inline mr-1" />
            {Object.keys(filters).length} filters applied
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 border-2 border-black rounded-lg font-bold hover:bg-gray-400 hover:scale-105 transition-all"
            >
              CANCEL
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-green-400 border-2 border-black rounded-lg font-bold hover:bg-green-500 hover:scale-105 transition-all"
            >
              APPLY FILTERS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
