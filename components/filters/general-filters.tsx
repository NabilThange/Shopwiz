"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface GeneralFiltersProps {
  filters: Record<string, any>
  onFilterChange: (filterType: string, value: any) => void
}

export function GeneralFilters({ filters, onFilterChange }: GeneralFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["price", "brand", "rating"]))

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
              max="100000"
              value={filters.priceRange?.[0] || 0}
              onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange?.[1] || 100000)}
              className="flex-1 slider"
            />
            <input
              type="range"
              min="0"
              max="100000"
              value={filters.priceRange?.[1] || 100000}
              onChange={(e) => handlePriceChange(filters.priceRange?.[0] || 0, Number(e.target.value))}
              className="flex-1 slider"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange?.[0] || ""}
              onChange={(e) => handlePriceChange(Number(e.target.value) || 0, filters.priceRange?.[1] || 100000)}
              className="flex-1 px-3 py-2 border-2 border-black rounded-lg font-bold"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange?.[1] || ""}
              onChange={(e) => handlePriceChange(filters.priceRange?.[0] || 0, Number(e.target.value) || 100000)}
              className="flex-1 px-3 py-2 border-2 border-black rounded-lg font-bold"
            />
          </div>

          <div className="text-center font-bold">
            ₹{(filters.priceRange?.[0] || 0).toLocaleString()} - ₹{(filters.priceRange?.[1] || 100000).toLocaleString()}
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Popular Brands" sectionKey="brand">
        <div className="grid grid-cols-2 gap-2">
          {["Amazon", "Flipkart", "Samsung", "Apple", "Nike", "Adidas", "Sony", "LG"].map((brand) => (
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

      {/* Rating */}
      <FilterSection title="Customer Rating" sectionKey="rating">
        <div className="space-y-2">
          {[
            { label: "4★ & up", value: "4-plus" },
            { label: "3★ & up", value: "3-plus" },
            { label: "2★ & up", value: "2-plus" },
            { label: "1★ & up", value: "1-plus" },
          ].map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === value}
                onChange={() => handleRadioChange("rating", value)}
                className="w-4 h-4 border-2 border-black"
              />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Discount */}
      <FilterSection title="Discount" sectionKey="discount">
        <div className="grid grid-cols-2 gap-2">
          {["10% & above", "25% & above", "40% & above", "60% & above"].map((discount) => (
            <label key={discount} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.discount?.includes(discount) || false}
                onChange={() => handleCheckboxChange("discount", discount)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{discount}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" sectionKey="availability">
        <div className="space-y-2">
          {[
            { label: "In Stock", value: "in-stock" },
            { label: "Fast Delivery", value: "fast-delivery" },
            { label: "Free Shipping", value: "free-shipping" },
            { label: "Cash on Delivery", value: "cod" },
          ].map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availability?.includes(value) || false}
                onChange={() => handleCheckboxChange("availability", value)}
                className="w-4 h-4 border-2 border-black rounded"
              />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" sectionKey="category">
        <div className="grid grid-cols-2 gap-2">
          {["Electronics", "Clothing", "Home & Kitchen", "Sports", "Books", "Beauty", "Automotive", "Toys"].map(
            (category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.category?.includes(category) || false}
                  onChange={() => handleCheckboxChange("category", category)}
                  className="w-4 h-4 border-2 border-black rounded"
                />
                <span className="font-medium">{category}</span>
              </label>
            ),
          )}
        </div>
      </FilterSection>
    </div>
  )
}
