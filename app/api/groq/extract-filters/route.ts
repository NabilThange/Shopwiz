import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    const prompt = `You are an advanced filter extraction AI for an e-commerce shopping assistant.

STRICT RULES:
1. ONLY return valid JSON
2. Be precise and comprehensive
3. If unsure, return null for that field

Extract detailed filters from: "${query}"

Return EXACTLY this format:
{
  "category": "watches|laptops|clothing|electronics|smartphones|accessories|null",
  "brand": "string or null",
  "priceMax": number or null,
  "priceMin": number or null,
  "color": "string or null",
  "size": "string or null",
  "material": "string or null",
  "confidence": number between 0 and 1
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a precise JSON extraction bot. Return clean, accurate JSON."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content || "{}";
    
    console.log("🔍 Groq Filter Extraction Raw Response:", content);

    const cleanContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/\n/g, '')
      .trim();
    
    const parsed = JSON.parse(cleanContent);
    
    parsed.confidence = parsed.confidence || calculateConfidence(parsed);
    
    console.log("🔍 Groq Filter Extraction Parsed Response:", parsed);

    return NextResponse.json({ 
      success: true, 
      extracted: parsed 
    });

  } catch (error) {
    console.error('Groq Filter Extraction Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      extracted: { 
        category: null, 
        brand: null, 
        priceMax: null, 
        priceMin: null, 
        color: null,
        size: null,
        material: null,
        confidence: 0 
      }
    }, { status: 500 });
  }
}

function calculateConfidence(parsed: any): number {
  let confidence = 0;
  const fields = ['category', 'brand', 'priceMax', 'priceMin', 'color', 'size', 'material'];
  
  fields.forEach(field => {
    if (parsed[field] !== null) {
      confidence += 0.15;
    }
  });

  return Math.min(confidence, 1);
}
