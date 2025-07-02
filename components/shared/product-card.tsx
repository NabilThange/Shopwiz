"use client"

import type React from "react"

import Image from "next/image"
import { ExternalLink, Star, Tag, Globe, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Define the props interface
export interface ProductCardProps {
  platform: string
  platformLogo?: string
  productImage?: string
  discountPercent?: string | number
  productName?: string
  price?: number | string
  originalPrice?: number | string
  rating?: number
  reviewCount?: number
  shortDescription?: string
  tags?: string[]
  badges?: Array<{
    text: string
    icon?: React.ReactNode
  }>
  productLink?: string
  isFromWeb?: boolean
  ctaLabel?: string
  className?: string
  id?: string
}

// Platform styling configurations
const platformStyles: Record<string, any> = {
  amazon: {
    cardClass: "bg-white border-2 border-gray-200",
    hoverClass: "hover:shadow-lg hover:border-4 hover:border-yellow-500 hover:scale-105",
    priceClass: "bg-black text-white px-2 py-1 rounded font-bold text-xl",
    badgeClass: "bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold",
    badgeText: "Amazon",
    titleClass: "text-black",
    brandClass: "",
    buttonClass: "bg-yellow-400 hover:bg-yellow-500",
    logo: "🛒",
  },
  flipkart: {
    cardClass: "bg-white border-2 border-blue-200",
    hoverClass: "hover:shadow-blue-400 hover:border-2 hover:border-blue-500 hover:scale-105",
    priceClass: "text-[#00B9F5] font-bold text-xl",
    badgeClass: "bg-sky-500 text-white px-3 py-1 rounded text-xs font-bold",
    badgeText: "Flipkart",
    titleClass: "text-gray-800",
    brandClass: "",
    buttonClass: "bg-blue-400 hover:bg-blue-500",
    logo: "🛍️",
  },
  myntra: {
    cardClass: "bg-rose-50 border-2 border-pink-200",
    hoverClass: "hover:shadow-pink-400 hover:rotate-1",
    priceClass: "text-[#FF3F6C] font-bold text-xl",
    badgeClass: "bg-pink-500 text-white px-3 py-1 rounded text-xs font-bold",
    badgeText: "Myntra",
    titleClass: "text-gray-800",
    brandClass: "italic",
    buttonClass: "bg-pink-400 hover:bg-pink-500",
    logo: "👗",
  },
  ajio: {
    cardClass: "bg-gray-50 border-2 border-gray-300",
    hoverClass: "hover:shadow-green-300 hover:brightness-105",
    priceClass: "text-[#A4C639] font-bold text-xl font-mono",
    badgeClass: "bg-lime-200 text-black px-2 py-1 text-xs font-medium",
    badgeText: "Ajio",
    titleClass: "text-gray-800 font-mono",
    brandClass: "font-mono",
    buttonClass: "bg-lime-400 hover:bg-lime-500",
    logo: "🎽",
  },
  web: {
    cardClass: "bg-gray-50 border-2 border-gray-300",
    hoverClass: "hover:shadow-gray-400 hover:scale-105",
    priceClass: "text-gray-700 font-bold text-xl",
    badgeClass: "bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-bold",
    badgeText: "Web",
    titleClass: "text-gray-800",
    brandClass: "",
    buttonClass: "bg-gray-400 hover:bg-gray-500",
    logo: "🌐",
  },
}

export function ProductCard({
  platform,
  platformLogo,
  productImage,
  discountPercent,
  productName,
  price,
  originalPrice,
  rating,
  reviewCount,
  shortDescription,
  tags = [],
  badges = [],
  productLink,
  isFromWeb = false,
  ctaLabel = "VIEW PRODUCT",
  className,
  id,
}: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Determine which platform styling to use
  const normalizedPlatform = platform?.toLowerCase() || "web"
  const actualPlatform = isFromWeb ? "web" : normalizedPlatform

  // Get platform style or fallback to web style
  const style = platformStyles[actualPlatform] || platformStyles.web

  // Format price for display
  const formattedPrice = typeof price === "number" ? `₹${price.toLocaleString()}` : price

  // Handle click on product card
  const handleProductClick = () => {
    if (productLink) {
      window.open(productLink, "_blank")
    }
  }

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!productName || !price) return

    setIsAddingToCart(true)

    const cartItem = {
      id: id || `${platform}-${productName}-${Date.now()}`,
      productName: productName,
      price: price,
      originalPrice: originalPrice,
      productImage: productImage,
      platform: platform,
      productLink: productLink,
    }

    addToCart(cartItem)

    // Show success toast
    toast({
      title: "Added to Cart! 🛒",
      description: `${productName} has been added to your cart`,
      duration: 3000,
    })

    // Show feedback animation
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

  return (
    <div
      className={cn(
        "neubrutalism-card p-4",
        style.cardClass,
        style.hoverClass,
        "group cursor-pointer transition-all duration-300",
        !productLink && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      <div className="relative mb-4 overflow-hidden rounded-lg">
        {/* Product Image with fallback */}
        <Image
          src={productImage || "/placeholder.svg?height=200&width=200&text=No+Image"}
          alt={productName || "Product Image"}
          width={200}
          height={200}
          className="w-full h-48 object-cover transition-transform group-hover:scale-110"
        />

        {/* Platform Badge in top-left corner */}
        <div className="absolute top-2 left-2">
          <span className={style.badgeClass}>
            {isFromWeb ? (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {style.badgeText}
              </span>
            ) : (
              style.badgeText
            )}
          </span>
        </div>

        {/* Platform logo in top-right corner */}
        <div className="absolute top-2 right-2">
          <span className="text-xl">{platformLogo || style.logo}</span>
        </div>

        {/* Discount badge */}
        {discountPercent && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {typeof discountPercent === "number" ? `${discountPercent}% off` : discountPercent}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Product Name with fallback */}
        <h3 className={cn("font-bold text-lg leading-tight line-clamp-2", style.titleClass)}>
          {productName || "Unnamed Product"}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {/* Price with fallback */}
            {formattedPrice ? (
              <span className={style.priceClass}>{formattedPrice}</span>
            ) : (
              <span className="text-gray-500 italic font-medium">Price not listed</span>
            )}

            {/* Original Price if available */}
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through mt-1">
                {typeof originalPrice === "number" ? `₹${originalPrice.toLocaleString()}` : originalPrice}
              </span>
            )}
          </div>

          {/* Rating and Reviews */}
          {(rating || reviewCount) && (
            <div className="flex items-center gap-1 text-sm">
              {rating && (
                <>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{rating}</span>
                </>
              )}
              {reviewCount && <span className="text-gray-500">({reviewCount})</span>}
            </div>
          )}
        </div>

        {/* Description if available */}
        {shortDescription && <p className="text-sm text-gray-600 line-clamp-2">{shortDescription}</p>}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "px-2 py-1 text-xs font-bold rounded",
                  tag === "Titan" ? "bg-black text-white" : "bg-gray-200 text-gray-800",
                  style.brandClass,
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-200 pt-2">
            {badges.slice(0, 2).map((badge, index) => (
              <span key={index} className="flex items-center gap-1">
                {badge.icon || <Tag className="w-3 h-3" />}
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!productName || !price || isAddingToCart}
            className={cn(
              "flex-1 neubrutalism-button text-sm py-2 flex items-center justify-center gap-2 transition-all duration-200",
              "bg-green-400 hover:bg-green-500 text-black font-bold",
              (!productName || !price || isAddingToCart) && "opacity-50 cursor-not-allowed",
            )}
            title={!productName || !price ? "Cannot add to cart" : "Add to cart"}
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ADDING...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                ADD TO CART
              </>
            )}
          </button>

          {/* View Product Button */}
          <button
            onClick={handleProductClick}
            disabled={!productLink}
            className={cn(
              "flex-1 neubrutalism-button text-sm py-2 flex items-center justify-center gap-2 transition-all duration-200",
              style.buttonClass,
              !productLink && "opacity-50 cursor-not-allowed",
            )}
            title={!productLink ? "No link available" : undefined}
          >
            {ctaLabel}
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
