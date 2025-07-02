"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ClothingFiltersProps {
  filters: Record<string, any>
  onFilterChange: (filterType: string, value: any) => void
}

export function ClothingFilters({ filters, onFilterChange }: ClothingFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["size", "brand", "price"]))

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const handleCheckboxChange = (filterType: string, value: string) => {
    const currentValues = filters[filterType] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value]
    onFilterChange(filterType, newValues)
  }

  const handleRadioChange = (filterType: string, value: string) => {
    onFilterChange(filterType, value)
  }

  const FilterSection = ({
    title,
    children,
    sectionKey,
  }: { title: string; children: React.ReactNode; sectionKey: string }) => {
    const isExpanded = expandedSections.has(sectionKey)

    return (
      <div className="neubrutalism-card p-4 bg-white mb-4">
        <button onClick={() => toggleSection(sectionKey)} className="flex items-center justify-between w-full mb-3">
          <h3 className="text-lg font-bold uppercase">{title}</h3>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {isExpanded && <div className="fade-in">{children}</div>}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Size */}
      <FilterSection title="Size" sectionKey="size">
        <div className="grid grid-cols-4 gap-2">
          {["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"].map((size) => (
            <button
              key={size}
              onClick={() => handleCheckboxChange("size", size)}
              className={`px-3 py-2 border-2 border-black rounded-lg font-bold text-sm transition-all hover:scale-105 ${
                filters.size?.includes(size) ? "bg-yellow-400" : "bg-white hover:bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" sectionKey="brand">
        <div className="grid grid-cols-2 gap-2">
          {["Nike", "Adidas", "Puma", "HRX", "Jockey", "Levi's", "H&M", "Zara"].map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brand?.includes(brand) || false}
                onChange={() => handleCheckboxChange("brand", brand)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-3">
          {[
            { label: "Under ₹499", value: "under-499" },
            { label: "₹499 - ₹999", value: "499-999" },
            { label: "₹999 - ₹1,499", value: "999-1499" },
            { label: "₹1,499 - ₹1,999", value: "1499-1999" },
            { label: "₹1,999+", value: "1999-plus" },
          ].map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === value}
                onChange={() => handleRadioChange("priceRange", value)}
                className="w-4 h-4 border-2 border-black"
              />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color" sectionKey="color">
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Black", color: "#000000" },
            { name: "White", color: "#FFFFFF" },
            { name: "Red", color: "#FF0000" },
            { name: "Blue", color: "#0066CC" },
            { name: "Green", color: "#008000" },
            { name: "Yellow", color: "#FFFF00" },
            { name: "Pink", color: "#FFC0CB" },
            { name: "Purple", color: "#800080" },
            { name: "Orange", color: "#FFA500" },
            { name: "Brown", color: "#8B4513" },
            { name: "Gray", color: "#808080" },
            { name: "Navy", color: "#000080" },
          ].map(({ name, color }) => (
            <button
              key={name}
              onClick={() => handleCheckboxChange("color", name)}
              className={`w-8 h-8 border-2 border-black rounded-sm transition-all hover:scale-110 ${
                filters.color?.includes(name) ? "ring-4 ring-pink-400" : ""
              }`}
              style={{ backgroundColor: color }}
              title={name}
            />
          ))}
        </div>
      </FilterSection>

      {/* Fabric */}
      <FilterSection title="Fabric" sectionKey="fabric">
        <div className="grid grid-cols-2 gap-2">
          {["Cotton", "Polyester", "Modal", "Rayon", "Linen", "Silk", "Denim", "Wool"].map((fabric) => (
            <label key={fabric} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fabric?.includes(fabric) || false}
                onChange={() => handleCheckboxChange("fabric", fabric)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{fabric}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Pattern */}
      <FilterSection title="Pattern" sectionKey="pattern">
        <div className="grid grid-cols-2 gap-2">
          {["Solid", "Printed", "Striped", "Checkered", "Floral", "Abstract", "Geometric", "Polka Dots"].map(
            (pattern) => (
              <label key={pattern} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.pattern?.includes(pattern) || false}
                  onChange={() => handleCheckboxChange("pattern", pattern)}
                  className="w-4 h-4 border-2 border-black rounded"
                />
                <span className="font-medium">{pattern}</span>
              </label>
            ),
          )}
        </div>
      </FilterSection>

      {/* Fit */}
      <FilterSection title="Fit" sectionKey="fit">
        <div className="space-y-2">
          {["Slim Fit", "Regular Fit", "Loose Fit", "Oversized"].map((fit) => (
            <label key={fit} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="fit"
                checked={filters.fit === fit}
                onChange={() => handleRadioChange("fit", fit)}
                className="w-4 h-4 border-2 border-black"
              />
              <span className="font-medium">{fit}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Occasion */}
      <FilterSection title="Occasion" sectionKey="occasion">
        <div className="grid grid-cols-2 gap-2">
          {["Casual", "Formal", "Party", "Sports", "Ethnic", "Lounge", "Work", "Travel"].map((occasion) => (
            <label key={occasion} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.occasion?.includes(occasion) || false}
                onChange={() => handleCheckboxChange("occasion", occasion)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{occasion}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
