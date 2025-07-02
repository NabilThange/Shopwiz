"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageCircle, Search, ShoppingCart } from "lucide-react"
import { ConversationalAgent } from "@/components/conversation/conversational-agent"
import { useCart } from "@/lib/cart-context"

export default function ConversationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const { getTotalItems } = useCart()

  const [showTraditionalSearch, setShowTraditionalSearch] = useState(false)

  const handleSearchReady = (params: URLSearchParams) => {
    // Only redirect if params are not empty
    if (params.toString()) {
      router.push(`/results?${params.toString()}`)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Left side - Back button and title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/">
              <button className="p-2 border-2 border-black rounded-xl bg-gray-100 hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold uppercase flex items-center gap-2">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Conversational Search</span>
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">Chat with our AI to find exactly what you need</p>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link href="/cart">
              <button className="relative p-2 border-2 border-black rounded-xl bg-green-100 hover:bg-green-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </Link>

            <button
              onClick={() => setShowTraditionalSearch(!showTraditionalSearch)}
              className="px-4 py-2 bg-blue-100 border-2 border-black rounded-xl font-bold text-sm hover:bg-blue-200 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">
                {showTraditionalSearch ? "Use AI Chat" : "Traditional Search"}
              </span>
              <span className="sm:hidden">
                {showTraditionalSearch ? "AI" : "Search"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Flexible height */}
      <div className="flex-1 overflow-hidden">
        {!showTraditionalSearch ? (
          <div className="h-full flex flex-col">
            <ConversationalAgent 
              initialQuery={initialQuery} 
              onSearchReady={handleSearchReady} 
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center max-w-sm mx-auto">
              <div className="text-3xl sm:text-4xl mb-4">🔍</div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Traditional Search</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Use the classic search interface</p>
              <Link href="/search">
                <button className="neubrutalism-button w-full sm:w-auto">GO TO SEARCH</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
