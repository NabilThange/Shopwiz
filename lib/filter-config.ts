// FUTURE INTEGRATION NOTE: This configuration will be moved to backend/database
// when integrating with real e-commerce APIs. Each category will have its own
// filter configuration stored in the database and fetched dynamically.

export interface FilterConfig {
  name: string
  type: "checkbox" | "radio" | "slider" | "swatch" | "toggle" | "range"
  options?: string[]
  required?: boolean
  priority?: number // Higher priority filters appear first
}

export interface CategoryConfig {
  id: string
  name: string
  keywords: string[] // Keywords to detect this category
  filters: FilterConfig[]
}

// COMPREHENSIVE CATEGORY-TO-FILTER MAPPING
// Based on Amazon India and Flipkart filter analysis
export const categoryConfigs: CategoryConfig[] = [
  {
    id: "watches",
    name: "Watches",
    keywords: ["watch", "watches", "timepiece", "titan", "fastrack", "analog", "digital", "chronograph"],
    filters: [
      {
        name: "Brand",
        type: "checkbox",
        options: ["Titan", "Fastrack", "Fossil", "Timex", "Casio", "Seiko", "Citizen", "Armani", "Rolex", "Omega"],
        priority: 10,
      },
      {
        name: "Price",
        type: "slider",
        priority: 9,
      },
      {
        name: "Display Type",
        type: "checkbox",
        options: ["Analog", "Digital", "Smart", "Hybrid", "Chronograph"],
        priority: 8,
      },
      {
        name: "Band Material",
        type: "checkbox",
        options: ["Leather", "Stainless Steel", "Rubber", "Silicone", "Metal", "Fabric", "Ceramic"],
        priority: 7,
      },
      {
        name: "Dial Color",
        type: "swatch",
        options: ["Black", "White", "Blue", "Gold", "Silver", "Brown", "Green", "Red", "Rose Gold"],
        priority: 6,
      },
      {
        name: "Water Resistance",
        type: "radio",
        options: ["3 ATM & below", "5 ATM", "10 ATM", "20 ATM", "30 ATM", "50 ATM+"],
        priority: 5,
      },
      {
        name: "Gender",
        type: "checkbox",
        options: ["Men", "Women", "Unisex", "Kids"],
        priority: 4,
      },
      {
        name: "Customer Ratings",
        type: "radio",
        options: ["4★ & up", "3★ & up", "2★ & up", "1★ & up"],
        priority: 3,
      },
      {
        name: "Discount",
        type: "checkbox",
        options: ["10% & above", "25% & above", "40% & above", "60% & above"],
        priority: 2,
      },
    ],
  },
  {
    id: "laptops",
    name: "Laptops & PCs",
    keywords: ["laptop", "laptops", "computer", "pc", "notebook", "macbook", "gaming laptop"],
    filters: [
      {
        name: "Brand",
        type: "checkbox",
        options: ["Dell", "HP", "Lenovo", "Asus", "Apple", "Acer", "MSI", "Alienware", "Microsoft"],
        priority: 10,
      },
      {
        name: "Price",
        type: "slider",
        priority: 9,
      },
      {
        name: "Processor Type",
        type: "checkbox",
        options: [
          "Intel Core i3",
          "Intel Core i5",
          "Intel Core i7",
          "Intel Core i9",
          "AMD Ryzen 3",
          "AMD Ryzen 5",
          "AMD Ryzen 7",
          "AMD Ryzen 9",
          "Apple M1",
          "Apple M2",
        ],
        priority: 8,
      },
      {
        name: "RAM",
        type: "checkbox",
        options: ["4 GB", "8 GB", "16 GB", "32 GB", "64 GB"],
        priority: 7,
      },
      {
        name: "Storage",
        type: "checkbox",
        options: ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD", "1 TB HDD", "2 TB HDD"],
        priority: 6,
      },
      {
        name: "Operating System",
        type: "checkbox",
        options: ["Windows 11", "Windows 10", "macOS", "Chrome OS", "Linux", "DOS"],
        priority: 5,
      },
      {
        name: "Graphics Card",
        type: "checkbox",
        options: [
          "NVIDIA RTX 4090",
          "NVIDIA RTX 4080",
          "NVIDIA RTX 4070",
          "NVIDIA GTX 1650",
          "AMD Radeon",
          "Intel Integrated",
        ],
        priority: 4,
      },
      {
        name: "Display Size",
        type: "checkbox",
        options: ['13" - 14"', '14" - 15"', '15" - 16"', '16" - 17"', '17" - 18"'],
        priority: 3,
      },
      {
        name: "Special Features",
        type: "checkbox",
        options: ["Touchscreen", "Backlit Keyboard", "Fingerprint Reader", "2-in-1 Convertible", "Gaming", "Business"],
        priority: 2,
      },
    ],
  },
  {
    id: "smartphones",
    name: "Smartphones & Tablets",
    keywords: ["phone", "smartphone", "mobile", "tablet", "iphone", "android", "samsung", "oneplus"],
    filters: [
      {
        name: "Brand",
        type: "checkbox",
        options: ["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo", "Google", "Nothing"],
        priority: 10,
      },
      {
        name: "Price",
        type: "slider",
        priority: 9,
      },
      {
        name: "RAM",
        type: "checkbox",
        options: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB"],
        priority: 8,
      },
      {
        name: "Storage",
        type: "checkbox",
        options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB"],
        priority: 7,
      },
      {
        name: "Operating System",
        type: "radio",
        options: ["Android", "iOS", "HarmonyOS"],
        priority: 6,
      },
      {
        name: "Display Size",
        type: "checkbox",
        options: ['Under 5"', '5" - 6"', '6" - 6.5"', '6.5" - 7"', 'Above 7"'],
        priority: 5,
      },
      {
        name: "Connectivity",
        type: "checkbox",
        options: ["4G", "5G", "WiFi 6", "Bluetooth 5.0", "NFC", "USB-C", "Lightning"],
        priority: 4,
      },
      {
        name: "Features",
        type: "checkbox",
        options: ["Dual SIM", "Fingerprint", "Face Unlock", "Wireless Charging", "Fast Charging", "Water Resistant"],
        priority: 3,
      },
      {
        name: "Camera",
        type: "checkbox",
        options: ["12 MP", "48 MP", "64 MP", "108 MP", "200 MP", "Triple Camera", "Quad Camera"],
        priority: 2,
      },
    ],
  },
  {
    id: "clothing",
    name: "Clothing & Fashion",
    keywords: ["shirt", "t-shirt", "dress", "jeans", "shoes", "clothing", "fashion", "apparel", "wear"],
    filters: [
      {
        name: "Brand",
        type: "checkbox",
        options: ["Nike", "Adidas", "Puma", "HRX", "Jockey", "Levi's", "H&M", "Zara", "Uniqlo", "Forever 21"],
        priority: 10,
      },
      {
        name: "Price",
        type: "radio",
        options: ["Under ₹499", "₹499 - ₹999", "₹999 - ₹1,499", "₹1,499 - ₹1,999", "₹1,999+"],
        priority: 9,
      },
      {
        name: "Size",
        type: "checkbox",
        options: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"],
        priority: 8,
      },
      {
        name: "Color",
        type: "swatch",
        options: [
          "Black",
          "White",
          "Red",
          "Blue",
          "Green",
          "Yellow",
          "Pink",
          "Purple",
          "Orange",
          "Brown",
          "Gray",
          "Navy",
        ],
        priority: 7,
      },
      {
        name: "Fabric",
        type: "checkbox",
        options: ["Cotton", "Polyester", "Modal", "Rayon", "Linen", "Silk", "Denim", "Wool", "Blend"],
        priority: 6,
      },
      {
        name: "Pattern",
        type: "checkbox",
        options: ["Solid", "Printed", "Striped", "Checkered", "Floral", "Abstract", "Geometric", "Polka Dots"],
        priority: 5,
      },
      {
        name: "Fit",
        type: "radio",
        options: ["Slim Fit", "Regular Fit", "Loose Fit", "Oversized"],
        priority: 4,
      },
      {
        name: "Occasion",
        type: "checkbox",
        options: ["Casual", "Formal", "Party", "Sports", "Ethnic", "Lounge", "Work", "Travel"],
        priority: 3,
      },
      {
        name: "Sleeve",
        type: "radio",
        options: ["Half Sleeve", "Full Sleeve", "Sleeveless", "3/4 Sleeve"],
        priority: 2,
      },
    ],
  },
  {
    id: "home_kitchen",
    name: "Home & Kitchen",
    keywords: ["kitchen", "home", "appliance", "furniture", "cookware", "bedding", "decor"],
    filters: [
      {
        name: "Brand",
        type: "checkbox",
        options: ["Prestige", "Hawkins", "Pigeon", "Bajaj", "Philips", "LG", "Samsung", "Godrej"],
        priority: 10,
      },
      {
        name: "Price",
        type: "slider",
        priority: 9,
      },
      {
        name: "Category",
        type: "checkbox",
        options: ["Kitchen Appliances", "Cookware", "Furniture", "Bedding", "Home Decor", "Storage"],
        priority: 8,
      },
      {
        name: "Material",
        type: "checkbox",
        options: ["Stainless Steel", "Aluminum", "Non-Stick", "Cast Iron", "Wood", "Plastic", "Glass"],
        priority: 7,
      },
      {
        name: "Capacity",
        type: "checkbox",
        options: ["1 L", "2 L", "3 L", "5 L", "10 L", "15 L", "20 L+"],
        priority: 6,
      },
      {
        name: "Color",
        type: "swatch",
        options: ["Black", "White", "Silver", "Red", "Blue", "Green", "Brown"],
        priority: 5,
      },
      {
        name: "Power",
        type: "checkbox",
        options: ["500W", "750W", "1000W", "1500W", "2000W", "2500W+"],
        priority: 4,
      },
      {
        name: "Features",
        type: "checkbox",
        options: ["Energy Star", "Auto Shutoff", "Timer", "Digital Display", "Remote Control"],
        priority: 3,
      },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    keywords: ["beauty", "skincare", "makeup", "cosmetics", "personal care", "hair care"],
    filters: [
      {
        name: "Brand",
        type: "checkbox",
        options: ["Lakme", "Maybelline", "L'Oreal", "Nivea", "Dove", "Himalaya", "Biotique", "Mamaearth"],
        priority: 10,
      },
      {
        name: "Price",
        type: "slider",
        priority: 9,
      },
      {
        name: "Category",
        type: "checkbox",
        options: ["Skincare", "Hair Care", "Makeup", "Fragrance", "Personal Care", "Men's Grooming"],
        priority: 8,
      },
      {
        name: "Skin Type",
        type: "radio",
        options: ["Oily", "Dry", "Combination", "Sensitive", "Normal", "All Skin Types"],
        priority: 7,
      },
      {
        name: "Form",
        type: "checkbox",
        options: ["Cream", "Serum", "Gel", "Powder", "Liquid", "Oil", "Foam"],
        priority: 6,
      },
      {
        name: "Ingredients",
        type: "checkbox",
        options: ["Paraben-Free", "Organic", "Natural", "Sulphate-Free", "Cruelty-Free", "Vegan"],
        priority: 5,
      },
      {
        name: "Volume",
        type: "checkbox",
        options: ["50 ml", "100 ml", "200 ml", "500 ml", "1 L"],
        priority: 4,
      },
      {
        name: "Features",
        type: "checkbox",
        options: ["SPF Protection", "Anti-Aging", "Whitening", "Moisturizing", "Oil Control"],
        priority: 3,
      },
    ],
  },
  {
    id: "general",
    name: "General Products",
    keywords: [], // Fallback category
    filters: [
      {
        name: "Brand",
        type: "checkbox",
        options: ["Amazon", "Flipkart", "Samsung", "Apple", "Nike", "Adidas", "Sony", "LG"],
        priority: 10,
      },
      {
        name: "Price",
        type: "slider",
        priority: 9,
      },
      {
        name: "Customer Ratings",
        type: "radio",
        options: ["4★ & up", "3★ & up", "2★ & up", "1★ & up"],
        priority: 8,
      },
      {
        name: "Discount",
        type: "checkbox",
        options: ["10% & above", "25% & above", "40% & above", "60% & above"],
        priority: 7,
      },
      {
        name: "Availability",
        type: "checkbox",
        options: ["In Stock", "Fast Delivery", "Free Shipping", "Cash on Delivery"],
        priority: 6,
      },
      {
        name: "Category",
        type: "checkbox",
        options: ["Electronics", "Clothing", "Home & Kitchen", "Sports", "Books", "Beauty", "Automotive", "Toys"],
        priority: 5,
      },
    ],
  },
]

// FUTURE INTEGRATION: This function will be replaced with an API call
// to fetch category configuration from backend/database
export function getCategoryConfig(categoryId: string): CategoryConfig | null {
  return categoryConfigs.find((config) => config.id === categoryId) || null
}

// INTELLIGENT CATEGORY DETECTION
// FUTURE INTEGRATION: This will be enhanced with ML/AI models for better accuracy
export function detectCategory(searchQuery: string): string {
  const query = searchQuery.toLowerCase()

  // Score each category based on keyword matches
  const categoryScores = categoryConfigs.map((config) => {
    if (config.id === "general") return { id: config.id, score: 0 } // General is fallback

    const score = config.keywords.reduce((acc, keyword) => {
      if (query.includes(keyword.toLowerCase())) {
        // Give higher score for exact matches and longer keywords
        return acc + keyword.length
      }
      return acc
    }, 0)

    return { id: config.id, score }
  })

  // Find category with highest score
  const bestMatch = categoryScores.reduce((best, current) => (current.score > best.score ? current : best))

  // Return best match if score > 0, otherwise return general
  return bestMatch.score > 0 ? bestMatch.id : "general"
}

// DYNAMIC FILTER OPTION POPULATION
// FUTURE INTEGRATION: This will extract options from real product data
export function populateFilterOptions(
  filterConfig: FilterConfig,
  products: any[], // Will be typed properly with real product interface
  categoryId: string,
): string[] {
  // For mock data, return predefined options
  if (filterConfig.options) {
    return filterConfig.options
  }

  // FUTURE: Extract unique values from product data
  // Example for brand filter:
  // if (filterConfig.name === "Brand") {
  //   return [...new Set(products.map(p => p.brand))].sort()
  // }

  return []
}

// PRICE RANGE CALCULATION
// FUTURE INTEGRATION: Calculate from real product prices
export function calculatePriceRange(products: any[], categoryId: string): [number, number] {
  if (!products.length) {
    // Default ranges by category
    const defaultRanges: Record<string, [number, number]> = {
      watches: [0, 50000],
      laptops: [0, 200000],
      smartphones: [0, 150000],
      clothing: [0, 10000],
      home_kitchen: [0, 100000],
      beauty: [0, 5000],
      general: [0, 100000],
    }
    return defaultRanges[categoryId] || [0, 100000]
  }

  // FUTURE: Calculate from actual product prices
  // const prices = products.map(p => parseFloat(p.price.replace(/[₹,]/g, '')))
  // return [Math.min(...prices), Math.max(...prices)]

  return [0, 100000] // Mock range for now
}
