"use client"

import { useState, useEffect } from "react"
import { Send, Sparkles, MessageCircle } from "lucide-react"

interface RefinementBarProps {
  onRefine: (query: string) => void
}

export function RefinementBar({ onRefine }: RefinementBarProps) {
  const [refinementQuery, setRefinementQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  // Dynamic agent messages that simulate AI responses
  const agentMessages = [
    "I found 3 top-rated smartwatches. The one on Flipkart is ₹2,999 with 1-day delivery. Should I open it in your browser now?",
    "The Titan Neo has better reviews (4.5★), but the Fastrack Reflex is ₹500 cheaper. Which matters more to you?",
    "Amazon has a lightning deal on this watch ending in 2 hours. Want me to set a reminder?",
    "This watch is available in 5 colors. Based on your history, you might prefer the black or blue variant.",
    "I noticed similar watches are 15% cheaper on Myntra today. Would you like me to compare prices across all sites?",
    "This model has 30% more battery life than the one you viewed last week. Worth the extra ₹800?",
    "Flipkart is offering no-cost EMI on this watch. Would you like to see payment options?",
    "I found a coupon code SHOP10 that gives you an extra 10% off. Should I apply it automatically?",
    "This watch is trending in your city right now. 240 people purchased it in the last 24 hours.",
    "Based on your search history, you might prefer the premium model with heart rate monitoring. Want to see it?",
  ]

  const handleSubmit = () => {
    if (!refinementQuery.trim()) return

    setIsProcessing(true)
    setTimeout(() => {
      onRefine(refinementQuery)
      setRefinementQuery("")
      setIsProcessing(false)
    }, 1000)
  }

  // Rotate through agent messages every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % agentMessages.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [agentMessages.length])

  const quickRefinements = ["Only Titan brand", "Under ₹2000", "Add Myntra", "Show digital only", "Increase max price"]

  return (
    <div className="neubrutalism-card p-4 bg-gradient-to-r from-purple-100 to-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold uppercase text-purple-800">Ask ShopWhiz</h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-bold rounded-full border border-purple-400">
            AI Assistant
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Dynamic Agent Message */}
      <div className="mb-4 p-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_black]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-400 border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">{agentMessages[currentMessageIndex]}</p>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 bg-purple-400 text-white text-xs font-bold rounded-full hover:bg-purple-500 transition-colors">
                Yes, please
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-300 transition-colors">
                No, thanks
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={refinementQuery}
          onChange={(e) => setRefinementQuery(e.target.value)}
          placeholder="Ask anything about products or preferences..."
          className="flex-1 px-3 py-2 border-2 border-black rounded-lg font-medium"
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={!refinementQuery.trim() || isProcessing}
          className="px-4 py-2 bg-purple-400 border-2 border-black rounded-lg font-bold hover:bg-purple-500 hover:scale-105 transition-all duration-200 shadow-[2px_2px_0px_black] hover:shadow-[4px_4px_0px_black] disabled:opacity-50 disabled:hover:scale-100"
        >
          {isProcessing ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600">Try asking:</span>
        {quickRefinements.map((refinement, index) => (
          <button
            key={index}
            onClick={() => {
              setRefinementQuery(refinement)
              setTimeout(() => handleSubmit(), 100)
            }}
            className="px-4 py-2 bg-white border-2 border-black rounded-full text-sm font-bold hover:bg-yellow-200 hover:scale-105 transition-all duration-200 shadow-[2px_2px_0px_black] hover:shadow-[4px_4px_0px_black] cursor-pointer"
          >
            {refinement}
          </button>
        ))}
      </div>
    </div>
  )
}
