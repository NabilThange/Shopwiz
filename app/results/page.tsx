"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Filter, RotateCcw } from "lucide-react"
import { ResultCard } from "@/components/results/result-card"
import { GroupHeader } from "@/components/results/group-header"
import { RefinementBar } from "@/components/results/refinement-bar"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
// import { FilterModal } from "@/components/filters/filter-modal"
import { IntelligentFilterModal } from "@/components/filters/intelligent-filter-modal"
import { platforms } from "@/lib/mock-data"
import type { Product } from "@/lib/types"

type ViewMode = "flat" | "grouped"
type SortOption = "relevance" | "price-low" | "price-high" | "rating" | "platform"

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchCompleted, setSearchCompleted] = useState(false)
  const [collapsedPlatforms, setCollapsedPlatforms] = useState<Set<string>>(new Set())

  // New state for view mode and sorting
  const [viewMode, setViewMode] = useState<ViewMode>("flat")
  const [sortOption, setSortOption] = useState<SortOption>("relevance")
  const [searchInputFocused, setSearchInputFocused] = useState(false)
  const [newSearchQuery, setNewSearchQuery] = useState("")

  // Filter modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({})

  // Load user preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem("shopwhiz-view-mode") as ViewMode
    const savedSortOption = localStorage.getItem("shopwhiz-sort-option") as SortOption
    if (savedViewMode) setViewMode(savedViewMode)
    if (savedSortOption) setSortOption(savedSortOption)
  }, [])

  // Save user preference to localStorage
  useEffect(() => {
    localStorage.setItem("shopwhiz-view-mode", viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem("shopwhiz-sort-option", sortOption)
  }, [sortOption])

  // Memoize search parameters to prevent infinite re-renders
  const searchConfig = useMemo(() => {
    const query = searchParams.get("q") || ""
    const selectedPlatforms = searchParams.get("platforms")?.split(",").filter(Boolean) || []
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "10000")
    const category = searchParams.get("category") || ""

    return {
      query,
      selectedPlatforms: selectedPlatforms.length > 0 
        ? selectedPlatforms 
        : ['amazon', 'flipkart', 'myntra', 'ajio'],
      minPrice,
      maxPrice,
      category,
    }
  }, [searchParams])

  // Real Tavily API search
  useEffect(() => {
    if (!searchConfig.query) return

    const fetchSearchResults = async () => {
      try {
        setLoading(true)
        setSearchCompleted(false)
        setProducts([])

        const searchPromises = searchConfig.selectedPlatforms.map(platform => 
          fetch('/api/search/tavily', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: searchConfig.query,
              platform: platform
            })
          }).then(res => res.json())
        )

        const results = await Promise.all(searchPromises)
        const allProducts = results
          .flatMap(result => result.results || [])
          .filter(product => {
            const price = Number.parseInt(product.price.replace(/[₹,]/g, ""))
            return price >= searchConfig.minPrice && price <= searchConfig.maxPrice
          })
        
        setProducts(allProducts)
        setSearchCompleted(true)
        setLoading(false)
      } catch (error) {
        console.error('Search failed:', error)
        setLoading(false)
        setSearchCompleted(true)
      }
    }

    fetchSearchResults()
  }, [searchConfig.query, searchConfig.selectedPlatforms.join(","), searchConfig.minPrice, searchConfig.maxPrice])

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const sorted = [...products]

    switch (sortOption) {
      case "price-low":
        return sorted.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[₹,]/g, ""))
          const priceB = Number.parseInt(b.price.replace(/[₹,]/g, ""))
          return priceA - priceB
        })
      case "price-high":
        return sorted.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[₹,]/g, ""))
          const priceB = Number.parseInt(b.price.replace(/[₹,]/g, ""))
          return priceB - priceA
        })
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case "platform":
        return sorted.sort((a, b) => a.platform.name.localeCompare(b.platform.name))
      case "relevance":
      default:
        return sorted // Keep original order for relevance
    }
  }, [products, sortOption])

  const togglePlatformCollapse = (platformId: string) => {
    setCollapsedPlatforms((prev) => {
      const newCollapsed = new Set(prev)
      if (newCollapsed.has(platformId)) {
        newCollapsed.delete(platformId)
      } else {
        newCollapsed.add(platformId)
      }
      return newCollapsed
    })
  }

  const handleRefinement = (refinementQuery: string) => {
    // Mock refinement - restart the search process
    console.log("Refining with:", refinementQuery)
    setLoading(true)
    setSearchCompleted(false)

    setTimeout(() => {
      // For demo, just reload the same results
      setSearchCompleted(true)
      setLoading(false)
    }, 1500)
  }

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters)
  }

  const groupedProducts = useMemo(() => {
    return platforms.reduce(
      (acc, platform) => {
        const platformProducts = sortedProducts.filter((p) => p.platform.id === platform.id)
        if (platformProducts.length > 0) {
          acc[platform.id] = platformProducts
        }
        return acc
      },
      {} as Record<string, Product[]>,
    )
  }, [sortedProducts])

  const totalResults = products.length
  const hasNoResults = searchCompleted && totalResults === 0

  const removeFilter = (type: string, value: string) => {
    if (type === "platform") {
      const newPlatforms = searchConfig.selectedPlatforms.filter((p) => p !== value)
      const params = new URLSearchParams({
        q: searchConfig.query,
        platforms: newPlatforms.join(","),
        minPrice: searchConfig.minPrice.toString(),
        maxPrice: searchConfig.maxPrice.toString(),
      })
      router.push(`/results?${params.toString()}`)
    } else if (type === "price") {
      // Reset price to default
      const params = new URLSearchParams({
        q: searchConfig.query,
        platforms: searchConfig.selectedPlatforms.join(","),
        minPrice: "0",
        maxPrice: "10000",
      })
      router.push(`/results?${params.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/search">
                <button className="p-2 border-2 border-black rounded-lg bg-gray-100 hover:bg-gray-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold uppercase">Search Results</h1>
                <p className="text-sm text-gray-600 max-w-md">
                  <span className="font-medium">Search results for </span>
                  <span className="font-bold text-black bg-yellow-200 px-2 py-1 rounded animate-pulse">
                    '{searchConfig.query}'
                  </span>
                  <span className="font-medium"> across </span>
                  <span className="font-semibold text-blue-700">
                    {(() => {
                      const selectedPlatformNames = searchConfig.selectedPlatforms
                        .map((id) => platforms.find((p) => p.id === id)?.name)
                        .filter(Boolean)

                      if (selectedPlatformNames.length === 0) {
                        return "all platforms"
                      } else if (selectedPlatformNames.length === 1) {
                        return selectedPlatformNames[0]
                      } else if (selectedPlatformNames.length === 2) {
                        return `${selectedPlatformNames[0]} & ${selectedPlatformNames[1]}`
                      } else if (selectedPlatformNames.length === 3) {
                        return `${selectedPlatformNames[0]}, ${selectedPlatformNames[1]} & ${selectedPlatformNames[2]}`
                      } else {
                        return `${selectedPlatformNames[0]}, ${selectedPlatformNames[1]} & ${selectedPlatformNames.length - 2} more`
                      }
                    })()}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!loading && (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Refine your search..."
                      className={`neubrutalism-input text-sm pl-10 pr-4 py-2 transition-all duration-300 ${
                        searchInputFocused ? "w-80" : "w-48"
                      }`}
                      onFocus={() => setSearchInputFocused(true)}
                      onBlur={() => setSearchInputFocused(false)}
                      onChange={(e) => setNewSearchQuery(e.target.value)}
                      value={newSearchQuery}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newSearchQuery.trim()) {
                          const params = new URLSearchParams({
                            q: newSearchQuery,
                            platforms: searchConfig.selectedPlatforms.join(","),
                            minPrice: searchConfig.minPrice.toString(),
                            maxPrice: searchConfig.maxPrice.toString(),
                          })
                          router.push(`/results?${params.toString()}`)
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newSearchQuery.trim()) {
                          const params = new URLSearchParams({
                            q: newSearchQuery,
                            platforms: searchConfig.selectedPlatforms.join(","),
                            minPrice: searchConfig.minPrice.toString(),
                            maxPrice: searchConfig.maxPrice.toString(),
                          })
                          router.push(`/results?${params.toString()}`)
                        }
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-yellow-400 border border-black hover:bg-yellow-500"
                    >
                      🔍
                    </button>
                  </div>
                  <span className="font-bold text-lg whitespace-nowrap">{totalResults} Results</span>
                </>
              )}

              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-bold text-lg">Searching...</span>
                </div>
              )}

              <button onClick={() => setIsFilterModalOpen(true)} className="neubrutalism-button text-sm px-4 py-2">
                <Filter className="w-4 h-4 mr-1" />
                MODIFY
              </button>
            </div>
          </div>

          {/* View Controls */}
          {!loading && totalResults > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-600">VIEW:</span>
                  <div className="flex border-2 border-black rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("flat")}
                      className={`px-3 py-1 text-sm font-bold flex items-center gap-1 transition-all ${
                        viewMode === "flat" ? "bg-yellow-400 text-black" : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      FLAT
                    </button>
                    <button
                      onClick={() => setViewMode("grouped")}
                      className={`px-3 py-1 text-sm font-bold flex items-center gap-1 transition-all border-l-2 border-black ${
                        viewMode === "grouped" ? "bg-yellow-400 text-black" : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      GROUPED
                    </button>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-600">SORT:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="px-3 py-1 border-2 border-black rounded-lg text-sm font-bold bg-white hover:bg-gray-100"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="platform">Platform</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Sorted by{" "}
                  {sortOption === "price-low"
                    ? "Price (Low)"
                    : sortOption === "price-high"
                      ? "Price (High)"
                      : sortOption}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Summary */}
        {!loading && (
          <div className="neubrutalism-card p-4 mb-6 bg-blue-100 fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">Active Filters:</span>

              {/* Price filter chip */}
              <button
                onClick={() => removeFilter("price", "")}
                className="neubrutalism-chip text-xs flex items-center gap-1 hover:bg-red-200 transition-colors group"
              >
                ₹{searchConfig.minPrice} - ₹{searchConfig.maxPrice}
                <span className="ml-1 font-bold group-hover:text-red-600 group-hover:scale-110 transition-all">✕</span>
              </button>

              {/* Platform filter chips */}
              {searchConfig.selectedPlatforms.map((platformId) => {
                const platform = platforms.find((p) => p.id === platformId)
                return platform ? (
                  <button
                    key={platformId}
                    onClick={() => removeFilter("platform", platformId)}
                    className="neubrutalism-chip text-xs flex items-center gap-1 hover:bg-red-200 transition-colors group"
                  >
                    {platform.logo} {platform.name}
                    <span className="ml-1 font-bold group-hover:text-red-600 group-hover:scale-110 transition-all">
                      ✕
                    </span>
                  </button>
                ) : null
              })}

              {/* Applied filter chips */}
              {Object.entries(appliedFilters).map(([filterType, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null

                const displayValue = Array.isArray(value) ? value.join(", ") : value.toString()
                return (
                  <button
                    key={filterType}
                    onClick={() => setAppliedFilters((prev) => ({ ...prev, [filterType]: undefined }))}
                    className="neubrutalism-chip text-xs flex items-center gap-1 hover:bg-red-200 transition-colors group bg-purple-200"
                  >
                    {filterType}: {displayValue}
                    <span className="ml-1 font-bold group-hover:text-red-600 group-hover:scale-110 transition-all">
                      ✕
                    </span>
                  </button>
                )
              })}

              <button
                onClick={() => {
                  setAppliedFilters({})
                  router.push("/search")
                }}
                className="ml-auto text-xs px-3 py-1 bg-gray-100 border-2 border-black rounded font-medium hover:bg-yellow-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Refinement Bar */}
        {!loading && totalResults > 0 && (
          <div className="mb-6 fade-in">
            <RefinementBar onRefine={handleRefinement} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div>
            <div className="mb-6">
              <div className="neubrutalism-card p-4 bg-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-bold">Searching across platforms...</span>
                </div>
              </div>
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* No Results State */}
        {hasNoResults && (
          <div className="text-center py-16 fade-in">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-3xl font-bold mb-4 uppercase">No Results Found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Sorry, we couldn't find any products matching your search criteria. Try adjusting your filters or search
              query.
            </p>

            <div className="space-y-4">
              <button onClick={() => setIsFilterModalOpen(true)} className="neubrutalism-button mr-4">
                MODIFY FILTERS
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border-2 border-black rounded-lg font-bold bg-gray-100 hover:bg-gray-200"
              >
                TRY AGAIN
              </button>
            </div>

            {/* Search Suggestions */}
            <div className="mt-8 p-6 bg-white border-2 border-black rounded-lg max-w-md mx-auto">
              <h3 className="font-bold mb-4 uppercase">Try These Instead:</h3>
              <div className="space-y-2">
                {["titan watch", "titan analog", "titan chronograph", "titan smart watch"].map((suggestion, index) => (
                  <Link key={index} href={`/search?q=${encodeURIComponent(suggestion)}`}>
                    <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded border font-medium">
                      🔍 {suggestion}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results State */}
        {!loading && totalResults > 0 && (
          <div className="fade-in">
            {viewMode === "flat" ? (
              /* Flat Grid View */
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ResultCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Grouped View */
              <div className="space-y-6">
                {Object.entries(groupedProducts).map(([platformId, platformProducts]) => {
                  const platform = platforms.find((p) => p.id === platformId)!
                  const isCollapsed = collapsedPlatforms.has(platformId)

                  return (
                    <div key={platformId} className="fade-in">
                      <GroupHeader
                        platform={platform}
                        count={platformProducts.length}
                        isCollapsed={isCollapsed}
                        onToggle={() => togglePlatformCollapse(platformId)}
                      />

                      {!isCollapsed && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                          {platformProducts.map((product) => (
                            <ResultCard key={product.id} product={product} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {/* <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        searchQuery={searchConfig.query}
        currentFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
      /> */}

      {/* Intelligent Filter Modal */}
      <IntelligentFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        searchQuery={searchConfig.query}
        currentFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        products={products}
      />
    </div>
  )
}
