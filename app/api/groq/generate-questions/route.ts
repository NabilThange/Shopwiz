import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type QuestionType = 'checkbox' | 'radio' | 'slider' | 'select';

interface FollowUpQuestion {
  facet: string;
  question: string;
  type: QuestionType;
  options?: string[];
  min?: number;
  max?: number;
}

type CategoryQuestions = {
  [key: string]: FollowUpQuestion[];
};

const CATEGORY_QUESTIONS: CategoryQuestions = {
  watches: [
    { facet: "platform", question: "Where to search?", type: "checkbox", options: ["Amazon", "Flipkart", "Myntra", "Ajio", "Web"] },
    { facet: "type", question: "What type?", type: "radio", options: ["Analog", "Digital", "Smartwatch"] },
    { facet: "gender", question: "For whom?", type: "radio", options: ["Men", "Women", "Unisex"] },
    { facet: "priceRange", question: "Budget?", type: "slider", min: 500, max: 50000 }
  ],
  laptops: [
    { facet: "platform", question: "Where to search?", type: "checkbox", options: ["Amazon", "Flipkart", "Web"] },
    { facet: "usage", question: "Primary use?", type: "radio", options: ["Gaming", "Work", "Study", "General"] },
    { facet: "ram", question: "RAM requirement?", type: "select", options: ["8GB", "16GB", "32GB"] },
    { facet: "storage", question: "Storage?", type: "select", options: ["256GB SSD", "512GB SSD", "1TB SSD"] },
    { facet: "priceRange", question: "Budget?", type: "slider", min: 25000, max: 200000 }
  ],
  clothing: [
    { facet: "platform", question: "Where to search?", type: "checkbox", options: ["Myntra", "Ajio", "Amazon", "Flipkart"] },
    { facet: "gender", question: "For whom?", type: "radio", options: ["Men", "Women", "Kids"] },
    { facet: "size", question: "Size?", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    { facet: "occasion", question: "Occasion?", type: "radio", options: ["Casual", "Formal", "Party", "Sports"] },
    { facet: "priceRange", question: "Budget?", type: "slider", min: 500, max: 10000 }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Robust input validation
    const extracted: Record<string, any> = body.extracted || body.filters || {};
    
    // Log the input extracted filters with more context
    console.log("🤔 Question Generation Input:", { 
      body, 
      extractedFilters: extracted 
    });
    
    // Safety check: use default category if not provided
    const category = (extracted?.category?.toLowerCase() || 'watches') as keyof CategoryQuestions;
    const questions = CATEGORY_QUESTIONS[category] || CATEGORY_QUESTIONS.watches;
    
    // More robust filtering of questions
    const filteredQuestions = questions.filter((q: FollowUpQuestion) => {
      // Skip questions for already answered facets
      if (q.facet === 'priceRange' && (extracted?.priceMax || extracted?.priceMin)) {
        return false;
      }
      
      // Ensure we don't return questions for known values
      return !extracted?.[q.facet];
    });
    
    // Ensure at least some questions are returned
    const safeQuestions = filteredQuestions.length > 0 
      ? filteredQuestions 
      : CATEGORY_QUESTIONS.watches.slice(0, 2);
    
    // Log the generated questions
    console.log("🤔 Generated Follow-up Questions:", safeQuestions);
    
    return NextResponse.json({ 
      success: true, 
      followUpQuestions: safeQuestions 
    });

  } catch (error) {
    console.error("Question Generation Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      followUpQuestions: CATEGORY_QUESTIONS.watches.slice(0, 2)
    }, { status: 500 });
  }
}
