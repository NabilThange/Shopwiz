"use client"

import { ProductCard } from "@/components/shared/product-card"
import type { Product } from "@/lib/types"

interface ResultCardProps {
  product: Product
}

export function ResultCard({ product }: ResultCardProps) {
  // Check if this is a Titan watch product
  const isTitanWatch =
    product.tags.includes("Titan") &&
    (product.tags.includes("Analog") || product.tags.includes("Chronograph") || product.tags.includes("Smart Watch"))

  // Create badges based on platform and product type
  const badges = []

  if (isTitanWatch) {
    if (product.platform.id === "amazon") {
      badges.push({ text: "Fast Delivery", icon: <span>🚚</span> })
      badges.push({ text: "Top Rated", icon: <span>🏆</span> })
    } else if (product.platform.id === "flipkart") {
      badges.push({ text: "Assured", icon: <span>✅</span> })
      badges.push({ text: "2-Day Delivery", icon: <span>⏱️</span> })
    } else if (product.platform.id === "myntra") {
      badges.push({ text: "Premium", icon: <span>✨</span> })
      badges.push({ text: "Luxury", icon: <span>💎</span> })
    } else if (product.platform.id === "ajio") {
      badges.push({ text: "Trending", icon: <span>📈</span> })
      badges.push({ text: "Limited Stock", icon: <span>⚠️</span> })
    }
  }

  // Extract price as number from string (remove ₹ and commas)
  const priceValue = product.price ? Number.parseInt(product.price.replace(/[₹,]/g, "")) : undefined
  const originalPriceValue = product.originalPrice
    ? Number.parseInt(product.originalPrice.replace(/[₹,]/g, ""))
    : undefined

  // Calculate discount percentage if both prices are available
  const discountPercent =
    priceValue && originalPriceValue
      ? Math.round(((originalPriceValue - priceValue) / originalPriceValue) * 100)
      : product.discount

  return (
    <ProductCard
      platform={product.platform.id}
      platformLogo={product.platform.logo}
      productImage={product.image}
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
      className={isTitanWatch ? "ring-2 ring-offset-2 ring-black" : ""}
    />
  )
}
