"use client"

import type React from "react"

import { useState } from "react"

interface PriceSliderProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
  min?: number
  max?: number
}

export function PriceSlider({ value, onChange, min = 0, max = 10000 }: PriceSliderProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number.parseInt(e.target.value)
    const newValue: [number, number] = [newMin, Math.max(newMin, localValue[1])]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number.parseInt(e.target.value)
    const newValue: [number, number] = [Math.min(localValue[0], newMax), newMax]
    setLocalValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="neubrutalism-card p-4 bg-white">
      <h3 className="text-lg font-bold uppercase mb-4">Price Range</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">MIN</label>
            <input
              type="range"
              min={min}
              max={max}
              value={localValue[0]}
              onChange={handleMinChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center font-bold mt-1">₹{localValue[0].toLocaleString()}</div>
          </div>

          <div className="text-2xl font-bold">-</div>

          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">MAX</label>
            <input
              type="range"
              min={min}
              max={max}
              value={localValue[1]}
              onChange={handleMaxChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center font-bold mt-1">₹{localValue[1].toLocaleString()}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={localValue[0]}
            onChange={(e) => handleMinChange(e as any)}
            className="flex-1 px-3 py-2 border-2 border-black rounded-lg font-bold"
            placeholder="Min"
          />
          <input
            type="number"
            value={localValue[1]}
            onChange={(e) => handleMaxChange(e as any)}
            className="flex-1 px-3 py-2 border-2 border-black rounded-lg font-bold"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  )
}
