import type { Product, Platform, ProductCategory } from "./types"

export const platforms: Platform[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "🛒",
    color: "#FFD700",
    borderColor: "#000",
    shadowColor: "#000",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logo: "🛍️",
    color: "#00FFFF",
    borderColor: "#000",
    shadowColor: "#0066CC",
  },
  {
    id: "myntra",
    name: "Myntra",
    logo: "👗",
    color: "#FF69B4",
    borderColor: "#000",
    shadowColor: "#CC1477",
  },
  {
    id: "ajio",
    name: "Ajio",
    logo: "🎽",
    color: "#FFFFFF",
    borderColor: "#000",
    shadowColor: "#666",
  },
  // Added web platform to main platforms array
  {
    id: "web",
    name: "Web",
    logo: "🌐",
    color: "#E0E0E0",
    borderColor: "#000",
    shadowColor: "#666",
  },
]

// Keep webPlatform for backward compatibility
export const webPlatform: Platform = platforms.find((p) => p.id === "web")!

export const productCategories: ProductCategory[] = [
  {
    id: "watches",
    name: "Watches",
    filters: [
      {
        id: "brand",
        name: "Brand",
        type: "chips",
        options: ["Titan", "Casio", "Fossil", "Timex", "Seiko", "Any"],
      },
      {
        id: "type",
        name: "Type",
        type: "select",
        options: ["Analog", "Digital", "Smart Watch", "Any"],
      },
      {
        id: "color",
        name: "Color",
        type: "chips",
        options: ["Black", "Silver", "Gold", "Blue", "Red", "Any"],
      },
      {
        id: "gender",
        name: "Gender",
        type: "toggle",
        options: ["Men", "Women", "Unisex"],
      },
    ],
  },
  {
    id: "shoes",
    name: "Shoes",
    filters: [
      {
        id: "brand",
        name: "Brand",
        type: "chips",
        options: ["Nike", "Adidas", "Puma", "Reebok", "Bata", "Any"],
      },
      {
        id: "type",
        name: "Type",
        type: "select",
        options: ["Sneakers", "Formal", "Casual", "Sports", "Any"],
      },
      {
        id: "size",
        name: "Size",
        type: "select",
        options: ["6", "7", "8", "9", "10", "11", "12", "Any"],
      },
      {
        id: "color",
        name: "Color",
        type: "chips",
        options: ["Black", "White", "Blue", "Red", "Brown", "Any"],
      },
    ],
  },
]

export const mockProducts: Product[] = [
  // Amazon Titan Watch
  {
    id: "amazon-titan-1",
    title: "Titan Karishma Analog Black Dial Men's Watch - NM1774SM01",
    price: "₹2,495",
    image: "/placeholder.svg?height=200&width=200&text=Titan+Watch",
    platform: platforms[0], // Amazon
    url: "#",
    tags: ["Titan", "Analog", "Black", "Men"],
    rating: 4.5,
    reviews: 3250,
    description:
      "Classic Titan analog watch with stainless steel band, water resistant up to 30m, 2-year warranty included.",
    discount: "20% off",
    originalPrice: "₹2,995",
  },

  // Flipkart Titan Watch
  {
    id: "flipkart-titan-1",
    title: "Titan Edge Ultra Slim Ceramic Analog Watch - NK1696QC01",
    price: "₹3,199",
    image: "/placeholder.svg?height=200&width=200&text=Titan+Edge",
    platform: platforms[1], // Flipkart
    url: "#",
    tags: ["Titan", "Analog", "Ceramic", "Slim"],
    rating: 4.3,
    reviews: 1876,
    description: "World's slimmest ceramic watch with sapphire crystal glass and premium leather strap.",
    discount: "15% off",
    originalPrice: "₹3,799",
  },

  // Myntra Titan Watch
  {
    id: "myntra-titan-1",
    title: "Titan Raga Viva Rose Gold Women's Watch",
    price: "₹4,295",
    image: "/placeholder.svg?height=200&width=200&text=Titan+Raga",
    platform: platforms[2], // Myntra
    url: "#",
    tags: ["Titan", "Analog", "Rose Gold", "Women"],
    rating: 4.7,
    reviews: 942,
    description: "Elegant rose gold-toned stainless steel watch with mother of pearl dial and crystal accents.",
    discount: "10% off",
    originalPrice: "₹4,795",
  },

  // Ajio Titan Watch
  {
    id: "ajio-titan-1",
    title: "Titan Octane Chronograph Blue Dial Watch",
    price: "₹5,995",
    image: "/placeholder.svg?height=200&width=200&text=Titan+Octane",
    platform: platforms[3], // Ajio
    url: "#",
    tags: ["Titan", "Chronograph", "Blue", "Sports"],
    rating: 4.4,
    reviews: 567,
    description: "Sports chronograph watch with tachymeter, date display, and stainless steel bracelet.",
    discount: "25% off",
    originalPrice: "₹7,995",
  },

  // Web Titan Watches (Multiple entries)
  {
    id: "web-titan-1",
    title: "Titan Nebula 18K Solid Gold Premium Watch",
    price: "₹89,995",
    image: "/placeholder.svg?height=200&width=200&text=Titan+Nebula",
    platform: platforms[4], // Web
    url: "https://example.com/titan-nebula",
    tags: ["Titan", "Luxury", "Gold", "Premium"],
    rating: 4.9,
    reviews: 124,
    description: "Luxury 18K solid gold watch with sapphire crystal and Swiss movement. Limited edition.",
    discount: "5% off",
    originalPrice: "₹94,995",
  },

  {
    id: "web-titan-2",
    title: "Titan Automatic Skeleton Watch - Red Edition",
    price: "₹12,999",
    image: "/placeholder.svg?height=200&width=200&text=Titan+Skeleton",
    platform: platforms[4], // Web
    url: "https://example.com/titan-skeleton",
    tags: ["Titan", "Automatic", "Red", "Skeleton"],
    rating: 4.6,
    reviews: 892,
    description: "Stunning automatic skeleton watch with visible movement, red leather strap, and sapphire crystal.",
    discount: "30% off",
    originalPrice: "₹18,499",
  },

  {
    id: "web-titan-3",
    title: "Titan Smart Pro Fitness Watch - Black",
    price: "₹8,999",
    image: "/placeholder.svg?height=200&width=200&text=Titan+Smart",
    platform: platforms[4], // Web
    url: "https://example.com/titan-smart-pro",
    tags: ["Titan", "Smart Watch", "Black", "Fitness"],
    rating: 4.2,
    reviews: 1456,
    description: "Advanced fitness tracking, heart rate monitor, GPS, 7-day battery life, water resistant.",
    discount: "20% off",
    originalPrice: "₹11,249",
  },

  {
    id: "web-titan-4",
    title: "Titan Heritage Collection Vintage Watch",
    price: "₹6,799",
    image: "/placeholder.svg?height=200&width=200&text=Titan+Heritage",
    platform: platforms[4], // Web
    url: "https://example.com/titan-heritage",
    tags: ["Titan", "Vintage", "Heritage", "Brown"],
    rating: 4.8,
    reviews: 567,
    description: "Vintage-inspired design with brown leather strap, Roman numerals, and classic analog movement.",
    discount: "15% off",
    originalPrice: "₹7,999",
  },

  // Other existing products
  {
    id: "2",
    title: "Casio Digital Sports Watch",
    price: "₹1,899",
    image: "/placeholder.svg?height=200&width=200",
    platform: platforms[0], // Amazon
    url: "#",
    tags: ["Casio", "Digital", "Blue", "Sports"],
    rating: 4.5,
    reviews: 890,
  },
  {
    id: "3",
    title: "Fossil Chronograph Watch",
    price: "₹3,299",
    image: "/placeholder.svg?height=200&width=200",
    platform: platforms[1], // Flipkart
    url: "#",
    tags: ["Fossil", "Analog", "Silver", "Men"],
    rating: 4.3,
    reviews: 567,
  },
  {
    id: "4",
    title: "Timex Expedition Watch",
    price: "₹2,799",
    image: "/placeholder.svg?height=200&width=200",
    platform: platforms[1], // Flipkart
    url: "#",
    tags: ["Timex", "Analog", "Black", "Outdoor"],
    rating: 4.1,
    reviews: 423,
  },
  {
    id: "5",
    title: "Seiko Automatic Watch",
    price: "₹4,999",
    image: "/placeholder.svg?height=200&width=200",
    platform: platforms[2], // Myntra
    url: "#",
    tags: ["Seiko", "Automatic", "Gold", "Premium"],
    rating: 4.7,
    reviews: 234,
  },
  {
    id: "6",
    title: "Titan Smart Watch Pro",
    price: "₹5,499",
    image: "/placeholder.svg?height=200&width=200",
    platform: platforms[3], // Ajio
    url: "#",
    tags: ["Titan", "Smart Watch", "Black", "Fitness"],
    rating: 4.4,
    reviews: 678,
  },
]

export const mockSearchSuggestions = [
  "red titan analog watch under 3000",
  "nike running shoes size 9",
  "formal shirts for men",
  "wireless earphones under 2000",
  "laptop bags for women",
]
