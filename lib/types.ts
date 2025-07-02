export interface Product {
  id: string
  title: string
  price: string
  image: string
  platform: Platform
  url: string
  tags: string[]
  rating?: number
  reviews?: number
  description?: string
  discount?: string
  originalPrice?: string
}

export interface Platform {
  id: string
  name: string
  logo: string
  color: string
  borderColor: string
  shadowColor: string
}

export interface Filter {
  id: string
  name: string
  type: "chips" | "select" | "toggle" | "range"
  options?: string[]
  value?: any
}

export interface ProductCategory {
  id: string
  name: string
  filters: Filter[]
}

export interface SearchState {
  query: string
  category?: string
  filters: Record<string, any>
  selectedPlatforms: string[]
  priceRange: [number, number]
}
