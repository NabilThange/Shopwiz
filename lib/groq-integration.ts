// Groq Integration for ShopWhiz (Client-side)
// This file handles all interactions with our server-side Groq API routes

// ✅ STEP 1: Simple Filter Extraction (Single Purpose)
export interface ExtractedFilters {
  category: string | null
  brand: string | null
  priceMax: number | null
  priceMin: number | null
  color: string | null
  type: string | null
  size: string | null
  features: string[] | null
}

export async function extractFiltersFromQuery(query: string): Promise<ExtractedFilters> {
  try {
    // Call server-side Groq API route for filter extraction
    const response = await fetch('/api/groq/extract-filters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error('Filter extraction failed');
    }

    const result = await response.json();

    // If server extraction fails, fallback to client-side
    if (!result.success) {
      console.warn('Server-side filter extraction failed, using fallback');
      return extractFiltersWithFallback(query);
    }

    // Merge server results with fallback to ensure comprehensive extraction
    const serverExtracted = result.extracted;
    const fallbackExtracted = extractFiltersWithFallback(query);

    return {
      category: serverExtracted.category || fallbackExtracted.category,
      brand: serverExtracted.brand || fallbackExtracted.brand,
      priceMax: serverExtracted.priceMax || fallbackExtracted.priceMax,
      priceMin: serverExtracted.priceMin || fallbackExtracted.priceMin,
      color: serverExtracted.color || fallbackExtracted.color,
      type: serverExtracted.type || fallbackExtracted.type,
      size: serverExtracted.size || fallbackExtracted.size,
      features: serverExtracted.features || fallbackExtracted.features,
    };
  } catch (error) {
    console.error("Filter extraction completely failed:", error);
    return extractFiltersWithFallback(query);
  }
}

// ✅ FALLBACK: Simple keyword-based extraction when Groq fails
function extractFiltersWithFallback(query: string): ExtractedFilters {
  const lowerQuery = query.toLowerCase()

  // Basic category detection
  let category = null
  if (lowerQuery.includes("watch")) category = "watches"
  else if (lowerQuery.includes("phone") || lowerQuery.includes("mobile") || lowerQuery.includes("smartphone"))
    category = "smartphones"
  else if (lowerQuery.includes("shoe") || lowerQuery.includes("sneaker")) category = "shoes"
  else if (lowerQuery.includes("laptop") || lowerQuery.includes("computer")) category = "laptops"
  else if (lowerQuery.includes("shirt") || lowerQuery.includes("tshirt") || lowerQuery.includes("t-shirt"))
    category = "clothing"
  else if (lowerQuery.includes("headphone") || lowerQuery.includes("earphone")) category = "audio"

  // Basic brand detection
  let brand = null
  const brands = [
    "titan",
    "casio",
    "fossil",
    "timex",
    "seiko",
    "nike",
    "adidas",
    "puma",
    "reebok",
    "samsung",
    "apple",
    "oneplus",
    "xiaomi",
    "realme",
    "oppo",
    "vivo",
    "dell",
    "hp",
    "lenovo",
    "asus",
    "acer",
  ]

  for (const b of brands) {
    if (lowerQuery.includes(b)) {
      brand = b.charAt(0).toUpperCase() + b.slice(1)
      break
    }
  }

  // Basic price extraction
  let priceMax = null
  let priceMin = null

  const priceMaxMatch =
    lowerQuery.match(/under\s*₹?(\d+(?:,\d+)*)/i) ||
    lowerQuery.match(/below\s*₹?(\d+(?:,\d+)*)/i) ||
    lowerQuery.match(/less\s+than\s*₹?(\d+(?:,\d+)*)/i)

  if (priceMaxMatch) {
    priceMax = Number.parseInt(priceMaxMatch[1].replace(/,/g, ""))
  }

  const priceMinMatch =
    lowerQuery.match(/above\s*₹?(\d+(?:,\d+)*)/i) ||
    lowerQuery.match(/over\s*₹?(\d+(?:,\d+)*)/i) ||
    lowerQuery.match(/more\s+than\s*₹?(\d+(?:,\d+)*)/i)

  if (priceMinMatch) {
    priceMin = Number.parseInt(priceMinMatch[1].replace(/,/g, ""))
  }

  // Basic color detection
  let color = null
  const colors = [
    "black",
    "white",
    "red",
    "blue",
    "green",
    "yellow",
    "pink",
    "purple",
    "orange",
    "brown",
    "gray",
    "grey",
    "silver",
    "gold",
  ]
  for (const c of colors) {
    if (lowerQuery.includes(c)) {
      color = c.charAt(0).toUpperCase() + c.slice(1)
      break
    }
  }

  // Basic type detection
  let type = null
  if (category === "watches") {
    if (lowerQuery.includes("analog")) type = "Analog"
    else if (lowerQuery.includes("digital")) type = "Digital"
    else if (lowerQuery.includes("smart")) type = "Smart Watch"
  } else if (category === "smartphones") {
    if (lowerQuery.includes("android")) type = "Android"
    else if (lowerQuery.includes("iphone") || lowerQuery.includes("ios")) type = "iPhone"
  }

  return {
    category,
    brand,
    priceMax,
    priceMin,
    color,
    type,
    size: null,
    features: null,
  }
}

// ✅ STEP 2: Smart Follow-up Question Generation
export interface FollowUpQuestion {
  facet: string
  question: string
  type: "radio" | "checkbox" | "range" | "swatch" | "dropdown"
  options?: string[]
  priority: number
  min?: number
  max?: number
}

export function generateFollowUpQuestions(extractedFilters: ExtractedFilters): FollowUpQuestion[] {
  try {
    // For now, use fallback generation
    // FUTURE: This will call the actual Groq API via server route
    return generateFallbackQuestions(extractedFilters)
  } catch (error) {
    console.error("Follow-up generation failed:", error)
    return generateFallbackQuestions(extractedFilters)
  }
}

// ✅ FALLBACK: Basic question generation when Groq fails
function generateFallbackQuestions(filters: ExtractedFilters): FollowUpQuestion[] {
  const questions: FollowUpQuestion[] = []

  // Always ask about price if not specified
  if (!filters.priceMax && !filters.priceMin) {
    questions.push({
      facet: "priceRange",
      question: "What's your budget range?",
      type: "range",
      options: [],
      priority: 10,
      min: 0,
      max: 50000
    })
  }

  // Fallback if no category detected
  if (!filters.category) {
    questions.push({
      facet: "category",
      question: "What type of product are you looking for?",
      type: "radio",
      options: ["Electronics", "Clothing", "Accessories", "Shoes", "Watches"],
      priority: 9
    })
  }

  // Category-specific questions
  if (filters.category === "watches") {
    if (!filters.type) {
      questions.push({
        facet: "watchType",
        question: "What type of watch do you prefer?",
        type: "radio",
        options: ["Analog", "Digital", "Smart Watch", "No preference"],
        priority: 9,
      })
    }

    if (!filters.color) {
      questions.push({
        facet: "color",
        question: "Any preferred dial color?",
        type: "swatch",
        options: ["Black", "White", "Silver", "Gold", "Blue", "Brown", "No preference"],
        priority: 8,
      })
    }

    questions.push({
      facet: "material",
      question: "What strap material do you prefer?",
      type: "radio",
      options: ["Leather", "Stainless Steel", "Rubber", "Silicone", "Any material"],
      priority: 7,
    })
  }

  if (filters.category === "smartphones") {
    questions.push({
      facet: "ram",
      question: "How much RAM do you need?",
      type: "radio",
      options: ["4GB", "6GB", "8GB", "12GB+", "Not sure"],
      priority: 9,
    })

    questions.push({
      facet: "storage",
      question: "What storage capacity are you looking for?",
      type: "radio",
      options: ["64GB", "128GB", "256GB", "512GB+", "Not sure"],
      priority: 8,
    })
  }

  if (filters.category === "shoes") {
    questions.push({
      facet: "shoeType",
      question: "What type of shoes are you looking for?",
      type: "radio",
      options: ["Running", "Casual", "Formal", "Sports", "Sneakers", "Any type"],
      priority: 9,
    })

    questions.push({
      facet: "size",
      question: "What's your shoe size?",
      type: "dropdown",
      options: ["6", "7", "8", "9", "10", "11", "12", "Not sure"],
      priority: 8,
    })
  }

  // Always ask about platforms (mandatory)
  questions.push({
    facet: "platforms",
    question: "Which shopping platforms would you like to search?",
    type: "checkbox",
    options: ["Amazon", "Flipkart", "Myntra", "Ajio", "All major platforms"],
    priority: 5,
  })

  return questions.sort((a, b) => b.priority - a.priority)
}

// ✅ STEP 3: Final Search Parameter Generation
export interface FinalSearchParams {
  query: string
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  platforms?: string[]
  [key: string]: any // Additional filters
}

export async function generateFinalSearchParams(
  originalQuery: string,
  extractedFilters: ExtractedFilters,
  answeredQuestions: Record<string, any>,
): Promise<FinalSearchParams> {
  // Combine all filters
  const finalParams: FinalSearchParams = {
    query: originalQuery,
    ...extractedFilters,
    ...answeredQuestions,
  }

  // Clean up null values
  Object.keys(finalParams).forEach((key) => {
    if (finalParams[key] === null || finalParams[key] === undefined) {
      delete finalParams[key]
    }
  })

  return finalParams
}
