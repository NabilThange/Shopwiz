import type { ConversationContext, FollowUpQuestion, ConversationState } from "./conversation-types"

// AI-powered entity extraction (mock implementation)
export function extractEntitiesFromQuery(query: string): Record<string, any> {
  const entities: Record<string, any> = {}
  const lowerQuery = query.toLowerCase()

  // Brand extraction
  const brands = ["titan", "casio", "fossil", "timex", "seiko", "nike", "adidas", "samsung", "apple"]
  brands.forEach((brand) => {
    if (lowerQuery.includes(brand)) {
      entities.brand = brand.charAt(0).toUpperCase() + brand.slice(1)
    }
  })

  // Price extraction
  const priceMatch = lowerQuery.match(/under\s*₹?(\d+(?:,\d+)*)/i) || lowerQuery.match(/below\s*₹?(\d+(?:,\d+)*)/i)
  if (priceMatch) {
    const price = Number.parseInt(priceMatch[1].replace(/,/g, ""))
    entities.maxPrice = price
    entities.priceRange = [0, price]
  }

  // Category detection
  if (lowerQuery.includes("watch")) entities.category = "watches"
  if (lowerQuery.includes("shoe") || lowerQuery.includes("sneaker")) entities.category = "shoes"
  if (lowerQuery.includes("phone") || lowerQuery.includes("mobile")) entities.category = "smartphones"
  if (lowerQuery.includes("laptop")) entities.category = "laptops"

  // Display type for watches
  if (entities.category === "watches") {
    if (lowerQuery.includes("digital")) entities.displayType = "digital"
    if (lowerQuery.includes("analog")) entities.displayType = "analog"
    if (lowerQuery.includes("smart")) entities.displayType = "smart"
  }

  // Features
  const features = []
  if (lowerQuery.includes("waterproof") || lowerQuery.includes("water resistant")) features.push("Water Resistant")
  if (lowerQuery.includes("bluetooth")) features.push("Bluetooth")
  if (lowerQuery.includes("gps")) features.push("GPS")
  if (features.length > 0) entities.features = features

  return entities
}

// Generate intelligent follow-up questions based on context
export function generateFollowUpQuestions(context: ConversationContext): FollowUpQuestion[] {
  const questions: FollowUpQuestion[] = []
  const { detectedCategory, extractedEntities } = context

  // Category-specific questions
  if (detectedCategory === "watches") {
    // Display type question (if not already specified)
    if (!extractedEntities.displayType) {
      questions.push({
        id: "display-type",
        question: "Got it! Do you want a digital or analog watch?",
        type: "choice",
        options: ["Digital", "Analog", "Smart Watch", "No preference"],
        category: "product",
        priority: 10,
      })
    }

    // Material preference
    questions.push({
      id: "material",
      question: "What about the band material?",
      type: "choice",
      options: ["Leather", "Stainless Steel", "Rubber", "Any material"],
      category: "product",
      priority: 8,
    })
  }

  if (detectedCategory === "smartphones") {
    // RAM preference
    questions.push({
      id: "ram",
      question: "How much RAM do you need?",
      type: "choice",
      options: ["4 GB", "6 GB", "8 GB", "12 GB+", "Not sure"],
      category: "product",
      priority: 9,
    })
  }

  // Platform preference question
  questions.push({
    id: "platform-preference",
    question: "Should I avoid Amazon and focus on Flipkart + other sites?",
    type: "choice",
    options: ["Yes, avoid Amazon", "Include Amazon", "Focus on Flipkart only", "Search everywhere"],
    category: "platform",
    priority: 7,
  })

  // Sorting preference
  questions.push({
    id: "sorting",
    question: "Would you like me to sort by discount or reviews?",
    type: "choice",
    options: ["Best discounts first", "Highest rated first", "Lowest price first", "Most relevant"],
    category: "sorting",
    priority: 6,
  })

  // Budget flexibility (if price was mentioned)
  if (extractedEntities.maxPrice) {
    questions.push({
      id: "budget-flexibility",
      question: `I see you want it under ₹${extractedEntities.maxPrice.toLocaleString()}. Should I also show slightly higher-priced options with great reviews?`,
      type: "choice",
      options: ["Stick to budget", "Show 20% higher if highly rated", "Show all options"],
      category: "filters",
      priority: 5,
    })
  }

  // Brand alternatives (if specific brand mentioned)
  if (extractedEntities.brand) {
    questions.push({
      id: "brand-alternatives",
      question: `You mentioned ${extractedEntities.brand}. Should I also include similar brands?`,
      type: "choice",
      options: ["Only " + extractedEntities.brand, "Include similar brands", "Show all brands"],
      category: "product",
      priority: 4,
    })
  }

  return questions.sort((a, b) => b.priority - a.priority)
}

// Process user response and update conversation state
export function processUserResponse(
  response: string,
  questionId: string,
  currentState: ConversationState,
): ConversationState {
  const updatedState = { ...currentState }
  const lowerResponse = response.toLowerCase()

  switch (questionId) {
    case "display-type":
      if (lowerResponse.includes("digital")) {
        updatedState.extractedInfo.displayType = "Digital"
      } else if (lowerResponse.includes("analog")) {
        updatedState.extractedInfo.displayType = "Analog"
      } else if (lowerResponse.includes("smart")) {
        updatedState.extractedInfo.displayType = "Smart Watch"
      }
      break

    case "platform-preference":
      if (lowerResponse.includes("avoid amazon")) {
        updatedState.extractedInfo.platforms = ["flipkart", "myntra", "ajio", "web"]
      } else if (lowerResponse.includes("flipkart only")) {
        updatedState.extractedInfo.platforms = ["flipkart"]
      } else if (lowerResponse.includes("include amazon")) {
        updatedState.extractedInfo.platforms = ["amazon", "flipkart", "myntra", "ajio", "web"]
      } else {
        updatedState.extractedInfo.platforms = ["amazon", "flipkart", "myntra", "ajio", "web"]
      }
      break

    case "sorting":
      if (lowerResponse.includes("discount")) {
        updatedState.extractedInfo.sortBy = "discount"
      } else if (lowerResponse.includes("review") || lowerResponse.includes("rated")) {
        updatedState.extractedInfo.sortBy = "rating"
      } else if (lowerResponse.includes("price")) {
        updatedState.extractedInfo.sortBy = "price-low"
      } else {
        updatedState.extractedInfo.sortBy = "relevance"
      }
      break

    case "budget-flexibility":
      if (lowerResponse.includes("stick")) {
        // Keep original budget
      } else if (lowerResponse.includes("20%")) {
        if (updatedState.extractedInfo.priceRange) {
          updatedState.extractedInfo.priceRange[1] = Math.round(updatedState.extractedInfo.priceRange[1] * 1.2)
        }
      } else if (lowerResponse.includes("all")) {
        updatedState.extractedInfo.priceRange = [0, 100000]
      }
      break

    case "brand-alternatives":
      if (lowerResponse.includes("only")) {
        // Keep only the specified brand
      } else if (lowerResponse.includes("similar")) {
        updatedState.extractedInfo.features = [...(updatedState.extractedInfo.features || []), "Similar Brands"]
      } else {
        // Show all brands - remove brand filter
        delete updatedState.extractedInfo.brand
      }
      break
  }

  return updatedState
}

// Check if conversation is complete and ready to search
export function isConversationComplete(state: ConversationState): boolean {
  const answeredQuestions = state.messages.filter((m) => m.type === "user").length - 1 // Exclude initial query
  const totalQuestions = state.followUpQuestions.length

  // Complete if answered at least 2 questions or all questions
  return answeredQuestions >= Math.min(2, totalQuestions) || answeredQuestions >= totalQuestions
}

// Generate search parameters from conversation
export function generateSearchParams(state: ConversationState): URLSearchParams {
  const params = new URLSearchParams()
  const info = state.extractedInfo

  if (info.query) params.set("q", info.query)
  if (info.category) params.set("category", info.category)
  if (info.platforms) params.set("platforms", info.platforms.join(","))
  if (info.priceRange) {
    params.set("minPrice", info.priceRange[0].toString())
    params.set("maxPrice", info.priceRange[1].toString())
  }
  if (info.sortBy) params.set("sort", info.sortBy)

  // Add filter parameters
  if (info.brand) params.set("brand", info.brand)
  if (info.displayType) params.set("displayType", info.displayType)

  return params
}
