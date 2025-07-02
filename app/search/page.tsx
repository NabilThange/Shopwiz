"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, ShoppingCart } from "lucide-react"
import { SearchBar } from "@/components/search/search-bar"
import { NavbarSiteSelector } from "@/components/search/navbar-site-selector"
import { productCategories } from "@/lib/mock-data"
import type { SearchState } from "@/lib/types"
import { useCart } from "@/lib/cart-context"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const { getTotalItems } = useCart()

  const [searchState, setSearchState] = useState<SearchState>({
    query: initialQuery,
    category: undefined,
    filters: {},
    selectedPlatforms: ["amazon", "flipkart", "web"], // Added "web" as default
    priceRange: [0, 10000],
  })

  const [detectedCategory, setDetectedCategory] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock AI analysis of search query
  useEffect(() => {
    if (searchState.query) {
      setIsAnalyzing(true)
      setTimeout(() => {
        // Mock category detection based on keywords
        if (searchState.query.toLowerCase().includes("watch")) {
          setDetectedCategory("watches")
        } else if (searchState.query.toLowerCase().includes("shoe")) {
          setDetectedCategory("shoes")
        } else {
          setDetectedCategory("watches") // Default for demo
        }
        setIsAnalyzing(false)
      }, 1000)
    }
  }, [searchState.query])

  const currentCategory = productCategories.find((cat) => cat.id === detectedCategory)

  const handleSearch = () => {
    if (!searchState.query.trim()) return

    // Navigate to results with search state
    const params = new URLSearchParams({
      q: searchState.query,
      category: detectedCategory || "",
      platforms: searchState.selectedPlatforms.join(","),
      minPrice: searchState.priceRange[0].toString(),
      maxPrice: searchState.priceRange[1].toString(),
      ...searchState.filters,
    })

    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-pink-50">
      {/* Header with Site Selector */}
      <div className="bg-white border-b-2 border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="p-2 border-2 border-black rounded-lg bg-gray-100 hover:bg-gray-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <h1 className="text-2xl font-bold uppercase">ShopWhiz Search</h1>
            </div>

            {/* Cart Button */}
            <Link href="/cart">
              <button className="relative p-2 border-2 border-black rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </Link>
          </div>

          <SearchBar
            value={searchState.query}
            onChange={(value) => setSearchState((prev) => ({ ...prev, query: value }))}
            onSubmit={handleSearch}
          />

          {/* Site Selector in Navbar */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <NavbarSiteSelector
              selectedPlatforms={searchState.selectedPlatforms}
              onChange={(platforms) => setSearchState((prev) => ({ ...prev, selectedPlatforms: platforms }))}
              includeWeb={true}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* AI Analysis Status */}
        {isAnalyzing && (
          <div className="neubrutalism-card p-4 mb-6 bg-yellow-100 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span className="font-bold">AI is analyzing your search...</span>
            </div>
          </div>
        )}

        {/* Detected Category */}
        {detectedCategory && !isAnalyzing && (
          <div className="neubrutalism-card p-4 mb-6 bg-green-100 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-bold">Category Detected: {currentCategory?.name}</div>
                <div className="text-sm text-gray-600">Ready to search across selected platforms</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Centered */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-3xl font-bold mb-4 uppercase">Ready to Search!</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Your search query has been analyzed. Select your preferred shopping sites above and click search to find
              the perfect products.
            </p>

            <button
              onClick={handleSearch}
              disabled={!searchState.query.trim() || searchState.selectedPlatforms.length === 0}
              className="neubrutalism-button text-xl px-12 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 SEARCH NOW
            </button>

            {searchState.selectedPlatforms.length === 0 && (
              <p className="text-red-600 font-bold mt-4">Please select at least one shopping site!</p>
            )}

            {/* Selected Platforms Summary */}
            <div className="mt-6 p-6 bg-white border-2 border-black rounded-lg max-w-lg mx-auto shadow-[4px_4px_0px_black]">
              <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">🔍 Your Selection:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {searchState.selectedPlatforms.map((platformId) => {
                  if (platformId === "web") {
                    return (
                      <span
                        key={platformId}
                        className="px-3 py-2 bg-gray-200 border-2 border-black rounded-full font-bold text-sm flex items-center gap-1 shadow-[2px_2px_0px_black]"
                      >
                        🌐 Web
                      </span>
                    )
                  }

                  const platformData = {
                    amazon: { name: "Amazon", logo: "🛒" },
                    flipkart: { name: "Flipkart", logo: "🛍️" },
                    myntra: { name: "Myntra", logo: "👗" },
                    ajio: { name: "Ajio", logo: "🎽" },
                  }[platformId]

                  return platformData ? (
                    <span
                      key={platformId}
                      className="px-3 py-2 bg-yellow-400 border-2 border-black rounded-full font-bold text-sm shadow-[2px_2px_0px_black]"
                    >
                      {platformData.logo} {platformData.name}
                    </span>
                  ) : null
                })}
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center font-medium">
                Ready to search across {searchState.selectedPlatforms.length} platform
                {searchState.selectedPlatforms.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="text-center mt-12">
            <h3 className="text-xl font-bold mb-4 uppercase text-gray-700">Popular Searches</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Red Titan watch under ₹3000",
                "Nike running shoes size 9",
                "Formal shirts for men",
                "Wireless earphones",
                "Laptop bags for women",
              ].map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchState((prev) => ({ ...prev, query: search }))}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
