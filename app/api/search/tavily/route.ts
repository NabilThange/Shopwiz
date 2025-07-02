// app/api/search/tavily/route.ts
import { NextRequest, NextResponse } from 'next/server';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_BASE_URL = 'https://api.tavily.com/search';

export async function POST(request: NextRequest) {
  try {
    const { query, platform } = await request.json();
    
    if (!TAVILY_API_KEY) {
      throw new Error('TAVILY_API_KEY is not configured');
    }

    console.log(`🔍 Tavily Search - Platform: ${platform}, Query: ${query}`);

    // Prepare Tavily search request
    const tavilyRequest = {
      api_key: TAVILY_API_KEY,
      query: query,
      search_depth: "basic", // or "advanced" for more results
      include_answer: false,
      include_images: true,
      include_raw_content: false,
      max_results: 10,
      include_domains: getIncludeDomains(platform),
      exclude_domains: getExcludeDomains(platform)
    };

    console.log('📤 Tavily Request:', tavilyRequest);

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
    console.log('📥 Tavily Response:', data);

    // Filter and enhance results
    const filteredResults = data.results
      ?.filter((result: any) => isProductResult(result, platform))
      ?.map((result: any) => enhanceResult(result, platform))
      ?.slice(0, 8) || []; // Limit to 8 results per platform

    console.log(`📊 Filtered ${platform} Results:`, filteredResults.length);

    return NextResponse.json({
      success: true,
      platform,
      query,
      results: filteredResults,
      total: filteredResults.length
    });

  } catch (error) {
    console.error('❌ Tavily
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getIncludeDomains(platform: string) {
  return platform === 'amazon' ? ['amazon.com'] : [];