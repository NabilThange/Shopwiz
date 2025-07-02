"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface WatchFiltersProps {
  filters: Record<string, any>
  onFilterChange: (filterType: string, value: any) => void
}

export function WatchFilters({ filters, onFilterChange }: WatchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["brand", "price", "displayType"]))

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

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange("priceRange", [min, max])
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
      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="50000"
              value={filters.priceRange?.[0] || 0}
              onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange?.[1] || 50000)}
              className="flex-1 slider"
            />
            <input
              type="range"
              min="0"
              max="50000"
              value={filters.priceRange?.[1] || 50000}
              onChange={(e) => handlePriceChange(filters.priceRange?.[0] || 0, Number(e.target.value))}
              className="flex-1 slider"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.[0] || ""}
              onChange={(e) => handlePriceChange(Number(e.target.value) || 0, filters.priceRange?.[1] || 50000)}
              className="flex-1 px-3 py-2 border-2 border-black rounded-lg font-bold"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.[1] || ""}
              onChange={(e) => handlePriceChange(filters.priceRange?.[0] || 0, Number(e.target.value) || 50000)}
              className="flex-1 px-3 py-2 border-2 border-black rounded-lg font-bold"
            />
          </div>

          <div className="text-center font-bold">
            ₹{(filters.priceRange?.[0] || 0).toLocaleString()} - ₹{(filters.priceRange?.[1] || 50000).toLocaleString()}
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" sectionKey="brand">
        <div className="grid grid-cols-2 gap-2">
          {["Titan", "Fastrack", "Fossil", "Timex", "Casio", "Seiko", "Citizen", "Armani"].map((brand) => (
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

      {/* Display Type */}
      <FilterSection title="Display Type" sectionKey="displayType">
        <div className="grid grid-cols-2 gap-2">
          {["Analog", "Digital", "Smart", "Hybrid"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.displayType?.includes(type) || false}
                onChange={() => handleCheckboxChange("displayType", type)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Band Material */}
      <FilterSection title="Band Material" sectionKey="bandMaterial">
        <div className="grid grid-cols-2 gap-2">
          {["Leather", "Stainless Steel", "Rubber", "Silicone", "Metal", "Fabric"].map((material) => (
            <label key={material} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.bandMaterial?.includes(material) || false}
                onChange={() => handleCheckboxChange("bandMaterial", material)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{material}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Dial Color */}
      <FilterSection title="Dial Color" sectionKey="dialColor">
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Black", color: "#000000" },
            { name: "White", color: "#FFFFFF" },
            { name: "Blue", color: "#0066CC" },
            { name: "Gold", color: "#FFD700" },
            { name: "Silver", color: "#C0C0C0" },
            { name: "Brown", color: "#8B4513" },
            { name: "Green", color: "#008000" },
            { name: "Red", color: "#FF0000" },
          ].map(({ name, color }) => (
            <button
              key={name}
              onClick={() => handleCheckboxChange("dialColor", name)}
              className={`w-8 h-8 border-2 border-black rounded-sm transition-all hover:scale-110 ${
                filters.dialColor?.includes(name) ? "ring-4 ring-pink-400" : ""
              }`}
              style={{ backgroundColor: color }}
              title={name}
            />
          ))}
        </div>
      </FilterSection>

      {/* Water Resistance */}
      <FilterSection title="Water Resistance" sectionKey="waterResistance">
        <div className="space-y-2">
          {["3 ATM & below", "5 ATM", "10 ATM", "20 ATM", "30 ATM"].map((resistance) => (
            <label key={resistance} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="waterResistance"
                checked={filters.waterResistance === resistance}
                onChange={() => handleRadioChange("waterResistance", resistance)}
                className="w-4 h-4 border-2 border-black"
              />
              <span className="font-medium">{resistance}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender" sectionKey="gender">
        <div className="grid grid-cols-2 gap-2">
          {["Men", "Women", "Unisex", "Kids"].map((gender) => (
            <label key={gender} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.gender?.includes(gender) || false}
                onChange={() => handleCheckboxChange("gender", gender)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{gender}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
