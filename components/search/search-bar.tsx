"use client"

import type React from "react"

import { useState } from "react"
import { Search, Mic, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
}

export function SearchBar({ value, onChange, onSubmit, placeholder = "What are you looking for?" }: SearchBarProps) {
  const [isListening, setIsListening] = useState(false)

  const handleVoiceSearch = () => {
    setIsListening(!isListening)
    // Mock voice input - in real app would use Web Speech API
    if (!isListening) {
      setTimeout(() => {
        onChange("red titan analog watch under 3000")
        setIsListening(false)
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit()
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="neubrutalism-input w-full text-xl pl-14 pr-32"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-600" />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
          <button
            onClick={handleVoiceSearch}
            className={`p-3 rounded-lg border-2 border-black font-bold transition-all ${
              isListening ? "bg-red-400 animate-pulse" : "bg-pink-400 hover:bg-pink-500"
            }`}
          >
            {isListening ? <X className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button onClick={onSubmit} className="neubrutalism-button px-6 py-3 text-sm">
            SEARCH
          </button>
        </div>
      </div>

      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-red-100 border-2 border-black rounded-lg">
          <div className="flex items-center gap-2 text-red-800 font-medium">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Listening... Say your search query
          </div>
        </div>
      )}
    </div>
  )
}
