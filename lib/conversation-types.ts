import type { FollowUpQuestion, ExtractedFilters, FinalSearchParams } from "./groq-integration"

export interface ConversationMessage {
  id: string
  type: "user" | "agent"
  content: string
  timestamp: Date
  metadata?: {
    questionId?: string
    isFollowUp?: boolean
    [key: string]: any
  }
}

export interface ConversationState {
  messages: ConversationMessage[]
  isActive: boolean
  isComplete: boolean
  hasError: boolean
  errorMessage?: string

  // New structured approach
  originalQuery: string
  extractedFilters: ExtractedFilters
  followUpQuestions: FollowUpQuestion[]
  currentQuestion: FollowUpQuestion | null
  answeredQuestions: Record<string, any>
  currentStep: number
  finalSearchParams?: FinalSearchParams
}

export function createInitialConversationState(): ConversationState {
  return {
    messages: [],
    isActive: false,
    isComplete: false,
    hasError: false,
    originalQuery: "",
    extractedFilters: {
      category: null,
      brand: null,
      priceMax: null,
      priceMin: null,
      color: null,
      type: null,
      size: null,
      features: null,
    },
    followUpQuestions: [],
    currentQuestion: null,
    answeredQuestions: {},
    currentStep: 0,
  }
}

// Legacy types for backward compatibility
export interface FollowUpQuestion_Legacy {
  id: string
  question: string
  type: "choice" | "range" | "text"
  options?: string[]
  category: "product" | "platform" | "filters"
  priority: number
}

export interface ConversationContext {
  detectedCategory: string
  confidence: number
  extractedEntities: Record<string, any>
  suggestedQuestions: string[]
}
