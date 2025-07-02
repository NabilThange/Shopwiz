"use client"

import { useState, useEffect, useMemo } from "react"
import { X, Filter, RotateCcw, Sparkles } from "lucide-react"
import { detectCategory, getCategoryConfig, populateFilterOptions, calculatePriceRange } from "@/lib/filter-config"
import { DynamicFilterRenderer } from "./dynamic-filter-renderer"

interface IntelligentFilterModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  currentFilters: Record<string, any>
  onApplyFilters: (filters: Record<string, any>) => void
  products?: any[] // FUTURE: Will be properly typed with real product interface
}

export function IntelligentFilterModal({
  isOpen,
  onClose,
  searchQuery,
  currentFilters,
  onApplyFilters,
  products = [],
}: IntelligentFilterModalProps) {
  const [filters, setFilters] = useState(currentFilters)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // INTELLIGENT CATEGORY DETECTION
  const detectedCategory = useMemo(() => {
    return detectCategory(searchQuery)
  }, [searchQuery])

  // GET CATEGORY CONFIGURATION
  const categoryConfig = useMemo(() => {
    return getCategoryConfig(detectedCategory)
  }, [detectedCategory])

  // SIMULATE AI ANALYSIS (FUTURE: Replace with real AI processing)
  useEffect(() => {
    if (searchQuery && isOpen) {
      setIsAnalyzing(true)
      const timer = setTimeout(() => {
        setIsAnalyzing(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [searchQuery, isOpen])

  // POPULATE FILTER OPTIONS DYNAMICALLY
  const populatedFilters = useMemo(() => {
    if (!categoryConfig) return []

    return categoryConfig.filters
      .map((filterConfig) => ({
        ...filterConfig,
        options: populateFilterOptions(filterConfig, products, detectedCategory),
        priceRange: filterConfig.type === "slider" ? calculatePriceRange(products, detectedCategory) : undefined,
      }))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0)) // Sort by priority
  }, [categoryConfig, products, detectedCategory])

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const handleApply = () => {
    // FUTURE INTEGRATION: Send filters to backend for real product filtering
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({})
  }

  const getCategoryIcon = () => {
    const icons: Record<string, string> = {
      watches: "⌚",
      laptops: "💻",
      smartphones: "📱",
      clothing: "👕",
      home_kitchen: "🏠",
      beauty: "💄",
      general: "🔍",
    }
    return icons[detectedCategory] || "🔍"
  }

  const getAnalysisMessage = () => {
    const messages: Record<string, string> = {
      watches: "Analyzing watch specifications and features...",
      laptops: "Processing laptop configurations and specs...",
      smartphones: "Evaluating mobile device features...",
      clothing: "Analyzing fashion and apparel attributes...",
      home_kitchen: "Processing home and kitchen product features...",
      beauty: "Analyzing beauty and personal care products...",
      general: "Processing product characteristics...",
    }
    return messages[detectedCategory] || "Analyzing product features..."
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] mx-4 bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_black] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-cyan-400 border-b-4 border-black p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCategoryIcon()}</span>
              <div>
                <h2 className="text-2xl font-bold uppercase">{categoryConfig?.name || "Product Filters"}</h2>
                <p className="text-sm font-medium">
                  <span className="bg-black text-white px-2 py-1 rounded mr-2">INTELLIGENT</span>
                  Searching for: <span className="font-bold">"{searchQuery}"</span>
                </p>
                {categoryConfig && (
                  <p className="text-xs text-gray-700 mt-1">
                    🎯 Auto-detected category • {populatedFilters.length} relevant filters
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-400 border-2 border-black rounded-lg font-bold text-sm hover:bg-red-500 hover:scale-105 transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                RESET ALL
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-gray-200 border-2 border-black rounded-lg hover:bg-gray-300 hover:scale-105 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Analysis Status */}
        {isAnalyzing && (
          <div className="bg-purple-100 border-b-2 border-black p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 animate-spin text-purple-600" />
              <span className="font-bold text-purple-800">{getAnalysisMessage()}</span>
              <div className="flex gap-1 ml-auto">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {!isAnalyzing && categoryConfig ? (
            <div className="space-y-6">
              {/* Category Detection Info */}
              <div className="neubrutalism-card p-4 bg-green-100 border-green-400">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="font-bold text-green-800">Smart Category Detection</h3>
                    <p className="text-sm text-green-700">
                      Detected <span className="font-bold">{categoryConfig.name}</span> from your search query. Showing{" "}
                      {populatedFilters.length} relevant filters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Filter Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {populatedFilters.map((filterConfig) => (
                  <DynamicFilterRenderer
                    key={filterConfig.name}
                    filterConfig={filterConfig}
                    value={filters[filterConfig.name]}
                    onChange={(value) => handleFilterChange(filterConfig.name, value)}
                    categoryId={detectedCategory}
                  />
                ))}
              </div>

              {/* FUTURE INTEGRATION NOTES */}
              <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">🚀 Future Enhancements Ready</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Real-time filter options from live product data</li>
                  <li>• ML-powered category detection with 99% accuracy</li>
                  <li>• Dynamic price ranges based on actual inventory</li>
                  <li>• Personalized filter recommendations</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Sparkles className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-bold mb-2">AI Processing Your Query</h3>
                <p className="text-gray-600">Analyzing product category and preparing relevant filters...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 border-t-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <Filter className="w-4 h-4 inline mr-1" />
              {Object.keys(filters).filter((key) => filters[key] && filters[key] !== "").length} filters applied
            </div>
            {categoryConfig && (
              <div className="text-xs text-gray-500">
                Category: <span className="font-bold">{categoryConfig.name}</span>
              </div>
            )}
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
              disabled={isAnalyzing}
              className="px-6 py-2 bg-green-400 border-2 border-black rounded-lg font-bold hover:bg-green-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? "PROCESSING..." : "APPLY FILTERS"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
