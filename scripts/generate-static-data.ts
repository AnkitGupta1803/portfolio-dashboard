// Script to pre-generate static stock data during build time
// Note: This would need to be run separately during build process

async function generateStaticStockData() {
  // Since we can't import from the Next.js app in a standalone script,
  // we'll create the static data directly here
  
  // Define the symbols you want to pre-generate data for
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
  
  console.log('Generating static stock data for symbols:', symbols);
  
  // Sample static data structure
  const staticData = {
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
    },
    'AMZN': {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      peRatio: 62.8,
      eps: 7.10,
      marketCap: '1.8T',
      price: 185.42,
      change: 0.85,
      changePercent: 0.46
    },
    'TSLA': {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      peRatio: 70.2,
      eps: 3.72,
      marketCap: '950B',
      price: 260.15,
      change: -3.20,
      changePercent: -1.21
    }
  };
  
  // Write the static data to a JSON file
  const fs = await import('fs');
  const path = await import('path');
  
  const outputPath = path.join(process.cwd(), 'public', 'static-stock-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(staticData, null, 2));
  
  console.log(`Static stock data written to ${outputPath}`);
}

generateStaticStockData().catch(console.error);