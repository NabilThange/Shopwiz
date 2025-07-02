"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ElectronicsFiltersProps {
  filters: Record<string, any>
  onFilterChange: (filterType: string, value: any) => void
}

export function ElectronicsFilters({ filters, onFilterChange }: ElectronicsFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["brand", "price", "features"]))

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
      {/* Brand */}
      <FilterSection title="Brand" sectionKey="brand">
        <div className="grid grid-cols-2 gap-2">
          {["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo", "Google"].map((brand) => (
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
            { label: "Under ₹10,000", value: "under-10k" },
            { label: "₹10,000 - ₹20,000", value: "10k-20k" },
            { label: "₹20,000 - ₹40,000", value: "20k-40k" },
            { label: "₹40,000 - ₹60,000", value: "40k-60k" },
            { label: "₹60,000+", value: "60k-plus" },
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

      {/* RAM */}
      <FilterSection title="RAM" sectionKey="ram">
        <div className="grid grid-cols-3 gap-2">
          {["2 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB"].map((ram) => (
            <button
              key={ram}
              onClick={() => handleCheckboxChange("ram", ram)}
              className={`px-3 py-2 border-2 border-black rounded-lg font-bold text-sm transition-all hover:scale-105 ${
                filters.ram?.includes(ram) ? "bg-cyan-400" : "bg-white hover:bg-gray-100"
              }`}
            >
              {ram}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Storage */}
      <FilterSection title="Storage" sectionKey="storage">
        <div className="grid grid-cols-3 gap-2">
          {["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB"].map((storage) => (
            <button
              key={storage}
              onClick={() => handleCheckboxChange("storage", storage)}
              className={`px-3 py-2 border-2 border-black rounded-lg font-bold text-sm transition-all hover:scale-105 ${
                filters.storage?.includes(storage) ? "bg-cyan-400" : "bg-white hover:bg-gray-100"
              }`}
            >
              {storage}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Operating System */}
      <FilterSection title="Operating System" sectionKey="os">
        <div className="space-y-2">
          {["Android", "iOS", "Windows", "macOS", "Chrome OS"].map((os) => (
            <label key={os} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="os"
                checked={filters.os === os}
                onChange={() => handleRadioChange("os", os)}
                className="w-4 h-4 border-2 border-black"
              />
              <span className="font-medium">{os}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Display Size */}
      <FilterSection title="Display Size" sectionKey="displaySize">
        <div className="grid grid-cols-2 gap-2">
          {['Under 5"', '5" - 6"', '6" - 6.5"', '6.5" - 7"', 'Above 7"'].map((size) => (
            <label key={size} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.displaySize?.includes(size) || false}
                onChange={() => handleCheckboxChange("displaySize", size)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{size}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features" sectionKey="features">
        <div className="grid grid-cols-2 gap-2">
          {[
            "5G",
            "Dual SIM",
            "NFC",
            "Wireless Charging",
            "Fast Charging",
            "Water Resistant",
            "Fingerprint",
            "Face Unlock",
          ].map((feature) => (
            <label key={feature} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.features?.includes(feature) || false}
                onChange={() => handleCheckboxChange("features", feature)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{feature}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Connectivity */}
      <FilterSection title="Connectivity" sectionKey="connectivity">
        <div className="grid grid-cols-2 gap-2">
          {["4G", "5G", "WiFi", "Bluetooth", "USB-C", "Lightning", "3.5mm Jack", "Wireless"].map((connectivity) => (
            <label key={connectivity} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.connectivity?.includes(connectivity) || false}
                onChange={() => handleCheckboxChange("connectivity", connectivity)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{connectivity}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
