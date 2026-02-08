import axios from 'axios';
import * as cheerio from 'cheerio';

export interface GoogleFinanceData {
  peRatio: number | null;
  latestEarnings: string | null;
}

/**
 * Fetches P/E ratio and earnings data from Google Finance
 * Uses web scraping as Google Finance doesn't have a public API
 * Note: This may break if Google changes their HTML structure
 */
export async function fetchGoogleFinanceData(symbol: string): Promise<GoogleFinanceData> {
  try {
    // Convert NSE symbol to Google Finance format
    // Example: RELIANCE.NS -> NSE:RELIANCE
    const googleSymbol = convertToGoogleSymbol(symbol);

    const url = `https://www.google.com/finance/quote/${googleSymbol}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000 // 15 second timeout
    });

    const $ = cheerio.load(response.data);

    // Extract P/E Ratio
    let peRatio: number | null = null;
    $('div[class*="gyFHrc"]').each((_, element) => {
      const text = $(element).text();
      if (text.includes('P/E ratio') || text.includes('PE ratio')) {
        const nextDiv = $(element).next();
        const value = nextDiv.text().trim();
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          peRatio = parsed;
        }
      }
    });

    // Alternative method to find P/E ratio
    if (peRatio === null) {
      $('.P6K39c').each((_, element) => {
        const label = $(element).text();
        if (label.includes('P/E ratio') || label.includes('PE ratio')) {
          const valueElement = $(element).parent().find('.YMlKec');
          const value = valueElement.text().trim();
          const parsed = parseFloat(value);
          if (!isNaN(parsed)) {
            peRatio = parsed;
          }
        }
      });
    }

    // Extract Latest Earnings
    let latestEarnings: string | null = null;
    $('div[class*="gyFHrc"]').each((_, element) => {
      const text = $(element).text();
      if (text.includes('Earnings') || text.includes('EPS')) {
        const nextDiv = $(element).next();
        latestEarnings = nextDiv.text().trim();
      }
    });

    return {
      peRatio,
      latestEarnings
    };
  } catch (error) {
    console.error(`Error fetching Google Finance data for ${symbol}:`, error);
    return {
      peRatio: null,
      latestEarnings: null
    };
  }
}

/**
 * Converts Yahoo Finance symbol format to Google Finance format
 * Example: RELIANCE.NS -> NSE:RELIANCE
 */
function convertToGoogleSymbol(yahooSymbol: string): string {
  if (yahooSymbol.endsWith('.NS')) {
    return `NSE:${yahooSymbol.replace('.NS', '')}`;
  } else if (yahooSymbol.endsWith('.BO')) {
    return `BOM:${yahooSymbol.replace('.BO', '')}`;
  }
  return yahooSymbol;
}

/**
 * Fetches Google Finance data for multiple symbols
 * Implements batching and delays to avoid rate limiting
 */
export async function fetchMultipleGoogleFinanceData(
  symbols: string[]
): Promise<Record<string, GoogleFinanceData>> {
  const results: Record<string, GoogleFinanceData> = {};

  // Process in batches of 3 with longer delays (Google is stricter)
  const batchSize = 3;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);

    const batchPromises = batch.map(async (symbol) => {
      const data = await fetchGoogleFinanceData(symbol);
      return { symbol, data };
    });

    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach(({ symbol, data }) => {
      results[symbol] = data;
    });

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return results;
}
