// Static stock data for build time generation
// This would be populated during build time with actual values

export const staticStockFundamentals = {
  // This is placeholder data - in a real implementation,
  // this would be populated during build time
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    peRatio: 28.5,
    eps: 6.12,
    marketCap: '2.8T',
    price: 175.00,
    change: 1.25,
    changePercent: 0.72
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    peRatio: 25.3,
    eps: 6.50,
    marketCap: '1.7T',
    price: 173.50,
    change: -0.75,
    changePercent: -0.43
  },
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    peRatio: 32.1,
    eps: 9.26,
    marketCap: '2.5T',
    price: 297.80,
    change: 2.10,
    changePercent: 0.71
  }
};

export function getStaticFundamentals(symbols: string[]) {
  const result: any = {};
  
  for (const symbol of symbols) {
    if (staticStockFundamentals.hasOwnProperty(symbol)) {
      result[symbol] = staticStockFundamentals[symbol as keyof typeof staticStockFundamentals];
    } else {
      // Return a default object if symbol not found in static data
      result[symbol] = {
        symbol,
        name: `${symbol} (Data not available)`,
        peRatio: null,
        eps: null,
        marketCap: null,
        price: null,
        change: null,
        changePercent: null
      };
    }
  }
  
  return result;
}