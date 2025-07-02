"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Send,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Menu,
  Plus,
  User,
  Mic,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConversationState, ConversationMessage } from "@/lib/conversation-types"
import { createInitialConversationState } from "@/lib/conversation-types"
import { DynamicFilterRenderer } from "./dynamic-filter-renderer"
import type { FollowUpQuestion } from "@/lib/groq-integration"
import { generateFollowUpQuestions } from '@/lib/groq-integration'

interface ConversationalAgentProps {
  initialQuery?: string
  onSearchReady?: (params: URLSearchParams) => void
}

// Mock chat history - replace with your actual data source
const mockChatHistory = [
  { id: "1", title: "Titan watches under ₹3000", timestamp: new Date(Date.now() - 3600000) },
  { id: "2", title: "Nike running shoes", timestamp: new Date(Date.now() - 7200000) },
  { id: "3", title: "Samsung smartphones", timestamp: new Date(Date.now() - 86400000) },
]

// Suggested prompts for new users
const suggestedPrompts = [
  "Find Titan watches under ₹3000",
  "Show me Nike running shoes",
  "Samsung smartphones under ₹20000",
  "Casual shirts for men",
  "Wireless earbuds under ₹5000",
  "Women's ethnic wear",
]

// Debug logging function
const debugLog = (message: string, data?: any) => {
  console.log(`🔍 ConversationalAgent Debug: ${message}`, data || '')
}

// Debug component to show current conversation state
const ConversationStateDebug = ({ state }: { state: ConversationState }) => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          background: 'rgba(0,0,0,0.7)', 
          color: 'white', 
          padding: '10px', 
          zIndex: 1000,
          maxWidth: '300px',
          overflow: 'auto'
        }}
      >
        <h3>🐞 Conversation State Debug</h3>
        <pre>{JSON.stringify({
          currentStep: state.currentStep,
          currentQuestion: state.currentQuestion,
          followUpQuestionsCount: state.followUpQuestions.length
        }, null, 2)}</pre>
      </div>
    )
  }
  return null
}

export function ConversationalAgent({ initialQuery = "", onSearchReady }: ConversationalAgentProps) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Existing state
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversationState, setConversationState] = useState<ConversationState>(createInitialConversationState())

  // NEW: Question management state
  const [currentStep, setCurrentStep] = useState<'initial' | 'questions' | 'results'>('initial')
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({})

  // New UI state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // Determine if we're in "new chat" mode (no messages yet)
  const isNewChat = conversationState.messages.length === 0 && !conversationState.isActive

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationState.messages])

  // Initialize conversation with initial query
  useEffect(() => {
    if (initialQuery && !conversationState.isActive) {
      handleUserMessage(initialQuery)
    }
  }, [initialQuery])

  // Focus input when transitioning to new chat
  useEffect(() => {
    if (isNewChat && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isNewChat])

  // Enhanced logging for follow-up questions
  useEffect(() => {
    debugLog('Current Follow-up Questions', {
      count: followUpQuestions.length,
      questions: followUpQuestions
    })
  }, [followUpQuestions])

  const addMessage = (type: "user" | "agent", content: string, metadata?: any) => {
    const message: ConversationMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata,
    }

    setConversationState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))

    return message
  }

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      callback()
    }, delay)
  }

  // Handle new chat creation
  const handleNewChat = () => {
    setConversationState(createInitialConversationState())
    setInput("")
    setSidebarOpen(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle suggested prompt click
  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    handleUserMessage(prompt)
  }

  // Handle voice input toggle
  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Implement voice recognition logic here
    // This is a placeholder for the actual voice input functionality
  }

  // ✅ MAIN HANDLER: Two-step approach 
  const handleUserMessage = async (message: string) => {
    // Add user message
    addMessage("user", message)

    if (currentStep === 'initial') {
      // ✅ STEP 1: Extract filters from initial query
      await handleInitialQuery(message)
    } else {
      console.warn("Unexpected message during conversation")
    }

    setInput("")
  }

  // ✅ STEP 1: Initial Query Processing 
  const handleInitialQuery = async (query: string) => {
    debugLog('Starting Initial Query Processing', { query })
    setIsProcessing(true)

    try {
      // Call filter extraction API
      const extractResponse = await fetch("/api/groq/extract-filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      debugLog('Filter Extraction Response', { ok: extractResponse.ok })

      if (!extractResponse.ok) {
        throw new Error("Failed to extract filters")
      }

      const extractResult = await extractResponse.json()
      const extractedFilters = extractResult.extracted || extractResult.filters || {}
      debugLog('Extracted Filters', extractedFilters)

      // ✅ STEP 2: Generate follow-up questions
      const questionsResponse = await fetch("/api/groq/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          extracted: extractedFilters,
          filters: extractedFilters  // Backward compatibility
        }),
      })

      debugLog('Questions Response', { ok: questionsResponse.ok })

      if (!questionsResponse.ok) {
        throw new Error("Failed to generate questions")
      }

      const questionsResult = await questionsResponse.json()
      const generatedQuestions = questionsResult.followUpQuestions || questionsResult.questions || []
      
      debugLog('Generated Questions', generatedQuestions)

      // Fallback if no questions generated
      if (generatedQuestions.length === 0) {
        console.warn('No questions generated. Using fallback.')
        const fallbackQuestions = generateFollowUpQuestions({
          category: extractedFilters.category,
          brand: extractedFilters.brand,
          priceMax: extractedFilters.priceMax,
          priceMin: extractedFilters.priceMin,
          color: extractedFilters.color,
          type: extractedFilters.type,
          size: extractedFilters.size,
          features: extractedFilters.features
        })
        
        debugLog('Fallback Questions Generated', {
          count: fallbackQuestions.length,
          questions: fallbackQuestions
        })

        generatedQuestions.push(...fallbackQuestions)
      }

      // Update conversation state with current question and follow-up questions
      setConversationState((prev: ConversationState) => {
        const updatedState: ConversationState = {
          ...prev,
          isActive: true,
          originalQuery: query,
          extractedFilters,
          currentQuestion: generatedQuestions[0] || null,
          followUpQuestions: generatedQuestions,
          currentStep: prev.currentStep + 1
        }
        
        // Debug logging
        console.log('🔍 Updated Conversation State:', {
          currentQuestion: updatedState.currentQuestion,
          followUpQuestions: updatedState.followUpQuestions,
          currentStep: updatedState.currentStep
        })
        
        return updatedState
      })

      // Send acknowledgment
      simulateTyping(() => {
        const category = extractedFilters.category || "products"
        const brand = extractedFilters.brand ? ` ${extractedFilters.brand}` : ""
        const price = extractedFilters.priceMax ? ` under ₹${extractedFilters.priceMax.toLocaleString()}` : ""

        const ackMessage = `Perfect! I found${brand} ${category}${price}. I have ${generatedQuestions.length} quick question${generatedQuestions.length !== 1 ? "s" : ""} to find exactly what you need! 🎯`

        addMessage("agent", ackMessage)
      })
    } catch (error) {
      console.error("Initial query processing failed:", error)

      // Fallback questions if processing fails
      const fallbackQuestions: FollowUpQuestion[] = [
        {
          facet: "priceRange",
          question: "What's your budget range?",
          type: "range",
          options: [],
          priority: 10,
        },
        {
          facet: "platforms",
          question: "Which shopping platforms would you like to search?",
          type: "checkbox",
          options: ["Amazon", "Flipkart", "Myntra", "Ajio"],
          priority: 5,
        },
      ]

      setFollowUpQuestions(fallbackQuestions)
      setCurrentStep('questions')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle individual question responses
  const handleQuestionResponse = (facet: string, value: any) => {
    // Debug logging
    console.log('🔍 Question Response', { 
      facet, 
      value, 
      currentQuestionIndex: conversationState.currentStep,
      totalQuestions: conversationState.followUpQuestions.length 
    })

    // Validate response
    if (!facet || value === undefined || value === null) {
      console.warn('Invalid question response', { facet, value })
      return
    }

    // Update user answers
    const updatedAnswers = {
      ...conversationState.answeredQuestions,
      [facet]: value
    }

    // Determine next question index
    const nextQuestionIndex = conversationState.currentStep + 1

    // Update conversation state
    setConversationState((prev) => {
      // Prepare the next question (or null if no more questions)
      const nextQuestion = 
        prev.followUpQuestions[nextQuestionIndex] || null

      const updatedState: ConversationState = {
        ...prev,
        answeredQuestions: updatedAnswers,
        currentQuestion: nextQuestion,
        currentStep: nextQuestionIndex,
        // If no more questions, mark as complete
        isComplete: nextQuestion === null
      }

      // Debug logging for state update
      console.log('🔍 Updated Conversation State after Response', {
        nextQuestionIndex,
        nextQuestion,
        isComplete: updatedState.isComplete
      })

      return updatedState
    })

    // Add agent message for the next question (if exists)
    const nextQuestion = conversationState.followUpQuestions[nextQuestionIndex]
    if (nextQuestion) {
      addMessage("agent", nextQuestion.question, { 
        questionId: nextQuestion.facet 
      })
    } else {
      // All questions answered, initiate search
      handleSearchWithAnswers(updatedAnswers)
    }
  }

  // Finalize search with collected answers
  const handleSearchWithAnswers = (answers: Record<string, any>) => {
    // Debug logging
    console.log('🔍 Finalizing Search', { 
      extractedFilters: conversationState.extractedFilters,
      userAnswers: answers 
    })

    // Combine initial filters with user answers
    const finalParams = new URLSearchParams()

    // Add initial query
    finalParams.append('query', conversationState.originalQuery)

    // Add extracted filters
    const extractedFilters = conversationState.extractedFilters
    Object.entries(extractedFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        finalParams.append(key, String(value))
      }
    })

    // Add user-provided answers
    Object.entries(answers).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          // For multi-select (like platforms)
          value.forEach(item => finalParams.append(key, String(item)))
        } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          // For range inputs (like price)
          finalParams.append(`${key}Min`, String(value.min))
          finalParams.append(`${key}Max`, String(value.max))
        } else {
          // For single select or text inputs
          finalParams.append(key, String(value))
        }
      }
    })

    // Debug the final search parameters
    console.log('🔍 Final Search Parameters', Object.fromEntries(finalParams))

    // Update conversation state to mark as complete
    setConversationState(prev => ({
      ...prev,
      isComplete: true,
      finalSearchParams: Object.fromEntries(finalParams)
    }))

    // Trigger search/redirect
    const searchUrl = `/results?${finalParams.toString()}`
    
    // Add final message before redirecting
    addMessage("agent", "Great! I've found some products that match your requirements. Redirecting to results...", {
      type: 'search_complete'
    })

    // Slight delay to allow message to be seen
    setTimeout(() => {
      onSearchReady?.(searchUrl)
      router.push(searchUrl)
    }, 1000)
  }

  // Render questions or results based on current step
  const renderContent = () => {
    debugLog('Rendering Content', { 
      currentStep, 
      questionsCount: followUpQuestions.length 
    })

    switch (currentStep) {
      case 'initial':
        return (
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserMessage(input)}
              placeholder="What are you looking for?"
              className="w-full max-w-xl px-4 py-3 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="px-3 py-2 text-xs sm:text-sm bg-gray-100 border-2 border-black rounded-lg hover:bg-gray-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 'questions':
        return followUpQuestions.length > 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-xl">
              {/* Debug overlay */}
              <div 
                style={{ 
                  border: '2px solid red', 
                  padding: '10px', 
                  marginBottom: '20px',
                  display: followUpQuestions.length === 0 ? 'none' : 'block'
                }}
              >
                <h3>🐞 Debug: Questions</h3>
                <pre>{JSON.stringify(followUpQuestions, null, 2)}</pre>
              </div>

              <DynamicFilterRenderer 
                key={followUpQuestions[0].facet}
                question={followUpQuestions[0]} 
                onResponse={handleQuestionResponse} 
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 p-4">
            No questions available. Something went wrong.
          </div>
        )

      case 'results':
        // Placeholder for results or redirect
        return null

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-80" : sidebarCollapsed ? "w-12" : "w-64"
        } flex-shrink-0 flex flex-col md:relative absolute inset-y-0 left-0 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">ShopWhiz</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 h-8 w-8 md:flex hidden"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="p-1 h-8 w-8 md:hidden">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <Button
              onClick={handleNewChat}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Chats</h3>
              {mockChatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    // Handle chat selection
                    setSidebarOpen(false)
                  }}
                >
                  <div className="text-sm font-medium text-gray-900 truncate">{chat.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{chat.timestamp.toLocaleDateString()}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">User</div>
                <div className="text-xs text-gray-500">Premium Plan</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gray-900">ShopWhiz</span>
          </div>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col ${isNewChat ? "justify-center" : "justify-start"} transition-all duration-500`}
        >
          {/* New Chat Welcome */}
          {isNewChat && (
            <div className="max-w-4xl mx-auto px-6 w-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-purple-600" />
                </div>
                <h1 className="font-bold text-3xl mb-2 text-gray-900">Hi! I'm your shopping assistant</h1>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Tell me what you're looking for and I'll help you find the perfect products with smart questions.
                </p>
              </div>

              {/* Centered Input */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex gap-3 bg-white rounded-xl border border-gray-300 shadow-lg p-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && input.trim() && handleUserMessage(input)}
                    placeholder="What are you looking for? (e.g., Titan watch under ₹3000)"
                    className="flex-1 px-4 py-3 border-0 rounded-lg focus:outline-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-500"
                    disabled={isTyping || isProcessing}
                  />
                  <Button
                    onClick={handleVoiceInput}
                    variant="ghost"
                    size="sm"
                    className={`p-3 rounded-lg ${isListening ? "bg-red-100 text-red-600" : "hover:bg-gray-100"}`}
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => input.trim() && handleUserMessage(input)}
                    disabled={!input.trim() || isTyping || isProcessing}
                    className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-purple-500 group-hover:text-purple-600" />
                        <span className="text-gray-700 group-hover:text-gray-900">{prompt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          {!isNewChat && (
            <>
              {/* Desktop Header */}
              <div className="hidden md:block bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">ShopWhiz Assistant</h3>
                      <p className="text-sm text-gray-500">Your AI shopping companion</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Progress indicator */}
                    {conversationState.isActive && !conversationState.isComplete && (
                      <div className="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full border">
                        {conversationState.currentStep}/{conversationState.followUpQuestions.length}
                      </div>
                    )}
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
                  {/* Error Alert */}
                  {conversationState.hasError && conversationState.errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <p className="text-red-800 text-sm">{conversationState.errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {conversationState.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-3xl ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === "user" ? "bg-blue-500" : "bg-purple-500"
                          }`}
                        >
                          {message.type === "user" ? (
                            <span className="text-white text-sm font-medium">U</span>
                          ) : (
                            <MessageCircle className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Message bubble */}
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-white border border-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                          <div
                            className={`text-xs mt-2 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Dynamic Question Component */}
                  {conversationState.currentQuestion && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-3xl">
                        {/* Avatar */}
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>

                        {/* Question card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                          <DynamicFilterRenderer
                            question={conversationState.currentQuestion}
                            onResponse={handleQuestionResponse}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-3xl">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processing indicator */}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-3xl">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white animate-spin" />
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-purple-700">
                              {conversationState.isComplete ? "Finalizing your search..." : "Processing your search..."}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area for Active Conversations */}
              <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                  {!conversationState.isComplete && (
                    <div className="flex gap-3">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && input.trim() && handleUserMessage(input)}
                        placeholder="Type your response..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={isTyping || isProcessing}
                      />
                      <Button
                        onClick={handleVoiceInput}
                        variant="ghost"
                        size="sm"
                        className={`p-3 rounded-xl ${isListening ? "bg-red-100 text-red-600" : "hover:bg-gray-100"}`}
                      >
                        <Mic className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => input.trim() && handleUserMessage(input)}
                        disabled={!input.trim() || isTyping || isProcessing}
                        className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl disabled:opacity-50"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  )}

                  {/* Completion Status */}
                  {conversationState.isComplete && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-green-800 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Conversation completed! Redirecting to search results...
                      </div>
                    </div>
                  )}

                  {/* Processing Status */}
                  {isProcessing && (
                    <div className="mt-2 text-xs text-purple-600 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 animate-spin" />
                      Analyzing with Groq AI...
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <ConversationStateDebug state={conversationState} />
    </div>
  )
}
