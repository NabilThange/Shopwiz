// app/api/search/tavily/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type { Product } from '@/lib/types';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_BASE_URL = 'https://api.tavily.com/search';

// Platform configuration for mapping
const PLATFORM_CONFIG = {
  'amazon': { id: 'amazon', name: 'Amazon', logo: '🛒' },
  'flipkart': { id: 'flipkart', name: 'Flipkart', logo: '🛍️' },
  'myntra': { id: 'myntra', name: 'Myntra', logo: '👗' },
  'ajio': { id: 'ajio', name: 'AJIO', logo: '👚' }
};

export async function POST(request: NextRequest) {
  try {
    const { query, platform, category } = await request.json();
    
    if (!TAVILY_API_KEY) {
      console.error('❌ TAVILY_API_KEY is not configured');
      throw new Error('TAVILY_API_KEY is not configured');
    }

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required',
        results: [],
        total: 0
      }, { status: 400 });
    }

    console.log(`🔍 Tavily Search - Platform: ${platform}, Query: "${query}"`);

    // Build better search query
    let searchQuery = `${query} ${platform} buy online price`;
    if (category) {
      searchQuery += ` ${category}`;
    }

    // Prepare Tavily search request
    const tavilyRequest = {
      api_key: TAVILY_API_KEY,
      query: searchQuery,
      search_depth: "basic",
      include_answer: false,
      include_images: true,
      include_raw_content: true,
      max_results: 15, // Get more results to filter better
      include_domains: getIncludeDomains(platform),
      exclude_domains: getExcludeDomains(platform)
    };

    console.log('📡 Calling Tavily with query:', searchQuery);

    // Call Tavily API
    const response = await fetch(TAVILY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tavilyRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Tavily API Error:', response.status, errorText);
      throw new Error(`Tavily API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`📊 Tavily returned ${data.results?.length || 0} raw results`);

    if (!data.results || data.results.length === 0) {
      console.log('⚠️ No results from Tavily API');
      return NextResponse.json({
        success: true,
        platform,
        query,
        results: [],
        total: 0
      });
    }

    // Transform Tavily results into Product objects with better filtering
    const products: Product[] = data.results
      .filter((result: any) => {
        const productKeywords = ['buy', 'price', '₹', '$', 'product', 'sale', 'discount', 'shopping', 'store'];
        const content = (result.content || '').toLowerCase();
        const title = (result.title || '').toLowerCase();
        const url = (result.url || '').toLowerCase();
        
        // Must have product-related keywords
        const hasProductKeywords = productKeywords.some(keyword => 
          content.includes(keyword) || title.includes(keyword)
        );
        
        // Must be from the right platform
        const isFromPlatform = getIncludeDomains(platform).some(domain => 
          url.includes(domain)
        );
        
        return hasProductKeywords && (isFromPlatform || getIncludeDomains(platform).length === 0);
      })
      .map((result: any, index: number) => {
        const extractedImage = extractImage(result, platform)
        
        // Log image extraction details for debugging
        console.log(`🖼️ Image Extraction for Result ${index}:`, {
          originalResult: result,
          extractedImage: extractedImage
        })

        const price = extractPrice(result.content, result.title) || "Price not available"
        
        return {
          id: `${platform}-${Date.now()}-${index}`,
          title: cleanTitle(result.title),
          price: price,
          image: extractedImage,
          platform: PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG] || { 
            id: platform, 
            name: platform.charAt(0).toUpperCase() + platform.slice(1), 
            logo: '🛍️' 
          },
          rating: generateRandomRating(),
          tags: extractTags(result.content, query),
          url: result.url
        };
      })
      .slice(0, 8); // Limit to 8 best results

    console.log(`✅ Processed ${products.length} products for ${platform}`);
    console.log('📦 Sample product:', products[0] || 'None');

    return NextResponse.json({
      success: true,
      platform,
      query,
      results: products,
      total: products.length
    });

  } catch (error) {
    console.error('❌ Tavily Search Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results: [],
      total: 0,
      platform: request.body?.platform || 'unknown'
    }, { status: 500 });
  }
}

// Helper Functions
function getIncludeDomains(platform: string): string[] {
  const platformDomains = {
    'amazon': ['amazon.in', 'amazon.com'],
    'flipkart': ['flipkart.com'],
    'myntra': ['myntra.com'],
    'ajio': ['ajio.com']
  };
  return platformDomains[platform as keyof typeof platformDomains] || [];
}

function getExcludeDomains(platform: string): string[] {
  const excludedDomains = {
    'amazon': ['flipkart.com', 'myntra.com', 'ajio.com'],
    'flipkart': ['amazon.in', 'myntra.com', 'ajio.com'],
    'myntra': ['amazon.in', 'flipkart.com', 'ajio.com'],
    'ajio': ['amazon.in', 'flipkart.com', 'myntra.com']
  };
  return excludedDomains[platform as keyof typeof excludedDomains] || [];
}

function extractPrice(content: string, title: string = ''): string | null {
  const text = `${content} ${title}`;
  
  // Multiple price patterns
  const pricePatterns = [
    /₹[\s]*[\d,]+(?:\.\d{1,2})?/g,        // ₹2,999 or ₹ 2,999
    /INR[\s]*[\d,]+(?:\.\d{1,2})?/g,      // INR 2999
    /Rs\.?[\s]*[\d,]+(?:\.\d{1,2})?/g,    // Rs. 2999
    /\$[\s]*[\d,]+(?:\.\d{1,2})?/g        // $49.99
  ];
  
  for (const pattern of pricePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Return the first price found
      return matches[0].trim();
    }
  }
  
  return null;
}

// Helper function for image extraction with improved logic
function extractImage(result: any, platform?: string): string {
  // Check for images array first
  if (result.images && result.images.length > 0) {
    // Return the first valid image URL
    const validImage = result.images.find((img: string) => 
      img && (img.startsWith('http://') || img.startsWith('https://'))
    )
    if (validImage) return validImage
  }

  // Fallback: Try to extract image from content using regex
  const imageUrlRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp)/i
  const contentImageMatch = (result.content || '').match(imageUrlRegex)
  if (contentImageMatch) return contentImageMatch[0]

  // Fallback to platform-specific placeholder
  const platformPlaceholders: Record<string, string> = {
    'amazon': '/placeholders/amazon-placeholder.jpg',
    'flipkart': '/placeholders/flipkart-placeholder.jpg',
    'myntra': '/placeholders/myntra-placeholder.jpg',
    'ajio': '/placeholders/ajio-placeholder.jpg'
  }

  // Determine platform from multiple sources
  const detectPlatform = () => {
    // First, check if platform was passed directly
    if (platform) return platform

    // Then check URL
    if (result.url) {
      const urlPlatforms = {
        'amazon': 'amazon',
        'flipkart': 'flipkart',
        'myntra': 'myntra',
        'ajio': 'ajio'
      }
      const matchedPlatform = Object.keys(urlPlatforms).find(p => 
        result.url.toLowerCase().includes(p)
      )
      if (matchedPlatform) return matchedPlatform
    }

    // Then check result's platform property
    if (result.platform) return result.platform

    // Fallback to generic placeholder
    return 'default'
  }

  const detectedPlatform = detectPlatform()

  // Return platform-specific or generic placeholder
  return platformPlaceholders[detectedPlatform] || '/placeholders/default-placeholder.jpg'
}

function cleanTitle(title: string): string {
  // Remove common noise from titles
  return title
    .replace(/\s*-\s*(Buy|Shop|Online|Price|Amazon|Flipkart|Myntra|AJIO).*$/i, '')
    .replace(/^\s*(Buy|Shop)\s+/i, '')
    .trim();
}

function extractTags(content: string, query: string): string[] {
  const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const commonTags = ['product', 'sale', 'new', 'trending'];
  
  const extractedTags = [
    ...queryWords,
    ...commonTags
  ];

  return [...new Set(extractedTags)].slice(0, 5);
}

function generateRandomRating(): number {
  return Number((Math.random() * 1.5 + 3.5).toFixed(1)); // Random rating between 3.5 and 5.0
}