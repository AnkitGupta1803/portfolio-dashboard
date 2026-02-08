import { NextRequest, NextResponse } from 'next/server';
import { fetchMultipleGoogleFinanceData } from '@/lib/googleFinance';
import { fundamentalsCache } from '@/lib/cache';

// This API handles dynamic requests for stock fundamentals
// For static builds, you would need to pre-generate data at build time
export const dynamic = 'force-dynamic';

/**
 * API Route: GET /api/stock-fundamentals
 * Fetches P/E ratio and earnings data for multiple stock symbols
 * Query params: symbols (comma-separated list)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbolsParam = searchParams.get('symbols');

    if (!symbolsParam) {
      return NextResponse.json(
        { success: false, error: 'Missing symbols parameter' },
        { status: 400 }
      );
    }

    const symbols = symbolsParam.split(',').map(s => s.trim());

    if (symbols.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No symbols provided' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `fundamentals_${symbols.join('_')}`;
    const cachedData = fundamentalsCache.get(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    // For static builds, we could pre-populate data during build time
    // In all cases, fetch live data for most accurate information
    const fundamentals = await fetchMultipleGoogleFinanceData(symbols);
    
    // Cache the results
    fundamentalsCache.set(cacheKey, fundamentals);

    return NextResponse.json({
      success: true,
      data: fundamentals,
      cached: false
    });
  } catch (error) {
    console.error('Error in stock-fundamentals API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Revalidate stock data every 15 minutes (900 seconds)
export const revalidate = 900; // Revalidate every 15 minutes
