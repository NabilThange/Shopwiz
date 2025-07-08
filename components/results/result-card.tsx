"use client"

import { ProductCard } from "@/components/shared/product-card"
import type { Product } from "@/lib/types"
import Image from "next/image"

// Enhanced platform-specific configuration
const PLATFORM_STYLES = {
  amazon: {
    borderColor: "border-orange-400",
    bgColor: "bg-gradient-to-br from-orange-50 to-yellow-50",
    shadowColor: "shadow-orange-200",
    hoverShadow: "hover:shadow-orange-300",
    accentColor: "bg-gradient-to-r from-orange-500 to-yellow-500",
    textAccent: "text-orange-600",
    badges: [
      { text: "Prime Delivery", icon: "🚚", color: "bg-orange-100 text-orange-800" },
      { text: "Best Seller", icon: "🏆", color: "bg-yellow-100 text-yellow-800" },
    ],
  },
  flipkart: {
    borderColor: "border-blue-400",
    bgColor: "bg-gradient-to-br from-blue-50 to-sky-50",
    shadowColor: "shadow-blue-200",
    hoverShadow: "hover:shadow-blue-300",
    accentColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
    textAccent: "text-blue-600",
    badges: [
      { text: "Flipkart Assured", icon: "✅", color: "bg-blue-100 text-blue-800" },
      { text: "Express Delivery", icon: "⚡", color: "bg-cyan-100 text-cyan-800" },
    ],
  },
  myntra: {
    borderColor: "border-pink-400",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
    shadowColor: "shadow-pink-200",
    hoverShadow: "hover:shadow-pink-300",
    accentColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    textAccent: "text-pink-600",
    badges: [
      { text: "Fashion Forward", icon: "✨", color: "bg-pink-100 text-pink-800" },
      { text: "Trending Style", icon: "👗", color: "bg-rose-100 text-rose-800" },
    ],
  },
  ajio: {
    borderColor: "border-purple-400",
    bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
    shadowColor: "shadow-purple-200",
    hoverShadow: "hover:shadow-purple-300",
    accentColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
    textAccent: "text-purple-600",
    badges: [
      { text: "Editor's Pick", icon: "📈", color: "bg-purple-100 text-purple-800" },
      { text: "Style Statement", icon: "🔥", color: "bg-indigo-100 text-indigo-800" },
    ],
  },
  default: {
    borderColor: "border-gray-400",
    bgColor: "bg-gradient-to-br from-gray-50 to-slate-50",
    shadowColor: "shadow-gray-200",
    hoverShadow: "hover:shadow-gray-300",
    accentColor: "bg-gradient-to-r from-gray-500 to-slate-500",
    textAccent: "text-gray-600",
    badges: [
      { text: "Best Value", icon: "💰", color: "bg-gray-100 text-gray-800" },
      { text: "Verified Seller", icon: "🔍", color: "bg-slate-100 text-slate-800" },
    ],
  },
}

interface ResultCardProps {
  product: Product
}

export function ResultCard({ product }: ResultCardProps) {
  // Determine platform-specific styles
  const platformConfig = PLATFORM_STYLES[product.platform.id as keyof typeof PLATFORM_STYLES] || PLATFORM_STYLES.default

  // Enhanced badges from platform configuration
  const badges = platformConfig.badges.map((badge) => ({
    text: badge.text,
    icon: <span className={`text-sm ${badge.color} px-2 py-1 rounded-full`}>{badge.icon} {badge.text}</span>,
  }))

  // Enhanced image handling with better fallbacks
  const productImage =
    product.image && product.image !== "/placeholder-product.jpg" && !product.image.includes("placeholder")
      ? product.image
      : `/placeholders/${product.platform.id}-placeholder.jpg`

  // Extract price as number from string (remove ₹, $, and commas)
  const priceValue = product.price ? Number.parseInt(product.price.replace(/[₹$,]/g, "")) : undefined

  const originalPriceValue = product.originalPrice
    ? Number.parseInt(product.originalPrice.replace(/[₹$,]/g, ""))
    : undefined

  // Calculate discount percentage if both prices are available
  const discountPercent =
    priceValue && originalPriceValue
      ? Math.round(((originalPriceValue - priceValue) / originalPriceValue) * 100)
      : product.discount

  // Check if this is a featured/premium product
  const isFeatured = product.rating && 
    (typeof product.rating === 'number' ? product.rating >= 4.5 : 
     parseFloat(product.rating as string) >= 4.5)

  const isHighDiscount = discountPercent && 
    (typeof discountPercent === 'number' ? discountPercent >= 30 : 
     parseInt(discountPercent as string) >= 30)

  return (
    <div
      className={`
      relative 
      group
      border-2 ${platformConfig.borderColor} 
      ${platformConfig.bgColor} 
      rounded-2xl 
      overflow-hidden 
      transition-all 
      duration-500
      ease-in-out
      ${platformConfig.shadowColor}
      shadow-md
      ${platformConfig.hoverShadow}
      hover:shadow-2xl
      hover:scale-[1.03]
      hover:-translate-y-2
      ${isFeatured ? "ring-4 ring-yellow-400 ring-opacity-50" : ""}
      ${isHighDiscount ? "ring-4 ring-red-400 ring-opacity-50" : ""}
      transform will-change-transform
    `}
    >
      {/* Animated Platform Accent Bar */}
      <div 
        className={`
          h-1.5 w-full 
          ${platformConfig.accentColor} 
          group-hover:animate-pulse
          transition-all duration-300
        `}
      />

      {/* Featured and Discount Badges */}
      <div className="absolute top-3 z-10 w-full flex justify-between px-3">
        {isFeatured && (
          <div 
            className={`
              bg-yellow-400 text-black 
              px-3 py-1.5 rounded-full 
              text-xs font-bold 
              border-2 border-black 
              shadow-md
              animate-bounce
              ${platformConfig.textAccent}
            `}
          >
            ⭐ FEATURED
          </div>
        )}

        {isHighDiscount && (
          <div 
            className={`
              ml-auto
              bg-red-500 text-white 
              px-3 py-1.5 rounded-full 
              text-xs font-bold 
              border-2 border-black 
              shadow-md
              animate-pulse
              ${platformConfig.textAccent}
            `}
          >
            🔥 HOT DEAL
          </div>
        )}
      </div>

      {/* Enhanced ProductCard with improved styling */}
      <div className="p-2 pt-8">
        <ProductCard
          platform={product.platform.id}
          platformLogo={product.platform.logo}
          productImage={productImage}
          discountPercent={discountPercent}
          productName={product.title}
          price={priceValue}
          originalPrice={originalPriceValue}
          rating={product.rating}
          reviewCount={product.reviews}
          shortDescription={product.description}
          tags={product.tags}
          badges={badges}
          productLink={product.url}
          ctaLabel="VIEW PRODUCT"
          id={`${product.platform.id}-${product.title?.replace(/\s+/g, "-").toLowerCase()}`}
          className={`
            border-0 
            shadow-none 
            bg-transparent 
            hover:bg-white/30 
            transition-colors 
            duration-300
            ${platformConfig.textAccent}
          `}
        />
      </div>

      {/* Subtle Gradient Overlay for Depth */}
      <div 
        className={`
          absolute 
          bottom-0 
          left-0 
          right-0 
          h-12 
          bg-gradient-to-t 
          from-black/10 
          via-transparent 
          to-transparent 
          pointer-events-none
          group-hover:opacity-50
          transition-opacity
          duration-300
        `}
      />
    </div>
  )
}