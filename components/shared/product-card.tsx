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
    cardClass: "bg-white border-2 border-yellow-100 shadow-md",
    hoverClass: "hover:shadow-xl hover:border-yellow-300 hover:scale-[1.02]",
    priceClass: "bg-black text-white px-2 py-1 rounded font-bold text-xl tracking-wider",
    badgeClass: "bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
    badgeText: "Amazon",
    titleClass: "text-black font-semibold",
    brandClass: "font-bold",
    buttonClass: "bg-yellow-400 hover:bg-yellow-500 text-black",
    logo: "🛒",
    gradient: "from-yellow-50 to-yellow-100",
  },
  flipkart: {
    cardClass: "bg-white border-2 border-blue-100 shadow-md",
    hoverClass: "hover:shadow-xl hover:border-blue-300 hover:scale-[1.02]",
    priceClass: "text-[#00B9F5] font-bold text-xl tracking-wider",
    badgeClass: "bg-sky-500 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider",
    badgeText: "Flipkart",
    titleClass: "text-gray-900 font-semibold",
    brandClass: "font-bold",
    buttonClass: "bg-blue-400 hover:bg-blue-500 text-white",
    logo: "🛍️",
    gradient: "from-blue-50 to-blue-100",
  },
  myntra: {
    cardClass: "bg-white border-2 border-pink-100 shadow-md",
    hoverClass: "hover:shadow-xl hover:border-pink-300 hover:scale-[1.02] hover:rotate-1",
    priceClass: "text-[#FF3F6C] font-bold text-xl tracking-wider",
    badgeClass: "bg-pink-500 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider",
    badgeText: "Myntra",
    titleClass: "text-gray-900 font-semibold",
    brandClass: "font-bold italic",
    buttonClass: "bg-pink-400 hover:bg-pink-500 text-white",
    logo: "👗",
    gradient: "from-pink-50 to-pink-100",
  },
  ajio: {
    cardClass: "bg-white border-2 border-green-100 shadow-md",
    hoverClass: "hover:shadow-xl hover:border-green-300 hover:scale-[1.02] hover:brightness-105",
    priceClass: "text-[#A4C639] font-bold text-xl tracking-wider font-mono",
    badgeClass: "bg-lime-200 text-black px-2 py-1 text-xs font-bold uppercase tracking-wider",
    badgeText: "Ajio",
    titleClass: "text-gray-900 font-semibold font-mono",
    brandClass: "font-bold font-mono",
    buttonClass: "bg-lime-400 hover:bg-lime-500 text-black",
    logo: "🎽",
    gradient: "from-green-50 to-green-100",
  },
  web: {
    cardClass: "bg-white border-2 border-gray-100 shadow-md",
    hoverClass: "hover:shadow-xl hover:border-gray-300 hover:scale-[1.02]",
    priceClass: "text-gray-800 font-bold text-xl tracking-wider",
    badgeClass: "bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
    badgeText: "Web",
    titleClass: "text-gray-900 font-semibold",
    brandClass: "font-bold",
    buttonClass: "bg-gray-400 hover:bg-gray-500 text-white",
    logo: "🌐",
    gradient: "from-gray-50 to-gray-100",
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

  // Enhanced Platform Detection
  const detectPlatform = () => {
    if (isFromWeb) return 'web'
    
    const platformMap: Record<string, string> = {
      'amazon': 'amazon',
      'flipkart': 'flipkart', 
      'myntra': 'myntra',
      'ajio': 'ajio'
    }

    const normalizedPlatform = platform?.toLowerCase()
    return platformMap[normalizedPlatform] || 'web'
  }

  const actualPlatform = detectPlatform()
  const style = platformStyles[actualPlatform] || platformStyles.web

  // Robust Image Handling
  const getProductImage = () => {
    // Priority: 
    // 1. Provided product image
    // 2. Platform-specific placeholder
    // 3. Generic placeholder
    if (productImage && productImage.startsWith('http')) return productImage
    
    return style.placeholderImage || "/placeholder.svg"
  }

  const safeProductImage = getProductImage()

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
        "neubrutalism-card p-4 relative overflow-hidden group",
        "transition-all duration-300 ease-in-out",
        style.cardClass,
        style.hoverClass,
        "cursor-pointer",
        !productLink && "opacity-60 cursor-not-allowed",
        className,
      )}
      onClick={handleProductClick}
    >
      {/* Gradient Background Effect */}
      <div 
        className={cn(
          "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br",
          style.gradient
        )}
      />

      <div className="relative z-10">
        <div className="relative mb-4 overflow-hidden rounded-lg">
          {/* Enhanced Image Container */}
          <div className="relative w-full h-48 overflow-hidden rounded-lg">
            <Image
              src={productImage || "/placeholder.svg?height=200&width=200&text=No+Image"}
              alt={productName || "Product Image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Enhanced Badge Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Platform Badge */}
              <div className="absolute top-2 left-2 flex items-center space-x-2">
                <span className={cn(style.badgeClass, "flex items-center gap-1")}>
                  {isFromWeb ? (
                    <>
                      <Globe className="w-3 h-3" />
                      {style.badgeText}
                    </>
                  ) : (
                    style.badgeText
                  )}
                </span>

                {/* Platform Logo */}
                <span 
                  className="text-xl bg-white/70 rounded-full p-1 backdrop-blur-sm"
                  title={`Platform: ${style.badgeText}`}
                >
                  {platformLogo || style.logo}
                </span>
              </div>

              {/* Discount Badge */}
              {discountPercent && (
                <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {typeof discountPercent === "number" ? `${discountPercent}% OFF` : discountPercent}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Product Title with Enhanced Typography */}
          <h3 
            className={cn(
              "font-bold text-lg leading-tight line-clamp-2 group-hover:text-opacity-80 transition-all",
              style.titleClass
            )}
          >
            {productName || "Unnamed Product"}
          </h3>

          {/* Price and Rating Section */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {/* Price with Animated Hover */}
              {formattedPrice ? (
                <span 
                  className={cn(
                    style.priceClass, 
                    "transition-transform group-hover:scale-105 inline-block origin-left"
                  )}
                >
                  {formattedPrice}
                </span>
              ) : (
                <span className="text-gray-500 italic font-medium">Price not listed</span>
              )}

              {/* Original Price with Strikethrough */}
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through mt-1 group-hover:text-gray-400">
                  {typeof originalPrice === "number" ? `₹${originalPrice.toLocaleString()}` : originalPrice}
                </span>
              )}
            </div>

            {/* Rating with Animated Hover */}
            {(rating || reviewCount) && (
              <div 
                className="flex items-center gap-1 text-sm transition-transform group-hover:scale-110 origin-right"
              >
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
    </div>
  )
}
