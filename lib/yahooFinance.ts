import axios from 'axios';

interface YahooQuoteResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        symbol: string;
      };
    }>;
    error: any;
  };
}

/**
 * Fetches current market price (CMP) from Yahoo Finance
 * Uses the unofficial Yahoo Finance API endpoint
 * Note: This is an unofficial API and may break if Yahoo changes their structure
 */
export async function fetchYahooFinancePrice(symbol: string): Promise<number | null> {
  try {
    // Yahoo Finance API endpoint (unofficial)
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

    const response = await axios.get<YahooQuoteResponse>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
      return response.data.chart.result[0].meta.regularMarketPrice;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching Yahoo Finance data for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetches prices for multiple symbols in parallel
 * Implements batching to avoid rate limits
 */
export async function fetchMultipleYahooFinancePrices(
  symbols: string[]
): Promise<Record<string, number | null>> {
  const results: Record<string, number | null> = {};

  // Process in batches of 5 to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);

    const batchPromises = batch.map(async (symbol) => {
      const price = await fetchYahooFinancePrice(symbol);
      return { symbol, price };
    });

    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach(({ symbol, price }) => {
      results[symbol] = price;
    });

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}
