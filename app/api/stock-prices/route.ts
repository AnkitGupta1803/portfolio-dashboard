import { NextRequest, NextResponse } from 'next/server';
import { fetchMultipleYahooFinancePrices } from '@/lib/yahooFinance';
import { priceCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

/**
 * API Route: GET /api/stock-prices
 * Fetches current market prices for multiple stock symbols
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
    const cacheKey = `prices_${symbols.join('_')}`;
    const cachedData = priceCache.get<Record<string, number | null>>(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    // Fetch fresh data
    const prices = await fetchMultipleYahooFinancePrices(symbols);

    // Cache the results
    priceCache.set(cacheKey, prices);

    return NextResponse.json({
      success: true,
      data: prices,
      cached: false
    });
  } catch (error) {
    console.error('Error in stock-prices API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
