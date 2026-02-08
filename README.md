# Dynamic Portfolio Dashboard

A real-time portfolio tracking application built with Next.js, TypeScript, and Tailwind CSS. This application fetches live stock data from Yahoo Finance and Google Finance to provide comprehensive portfolio analysis.

## Features

- **Real-time Stock Prices**: Fetches current market prices (CMP) from Yahoo Finance every 15 seconds
- **Fundamental Data**: Retrieves P/E ratios and latest earnings from Google Finance
- **Interactive Dashboard**: Modern, responsive UI with dark mode support
- **Sector Grouping**: View portfolio organized by sectors with expandable/collapsible sections
- **Performance Metrics**:
  - Investment vs Present Value
  - Gain/Loss with percentage
  - Portfolio weight distribution
  - Sector-wise summaries
- **Sortable Tables**: Click column headers to sort data
- **Visual Indicators**: Color-coded gains (green) and losses (red)
- **Auto-refresh**: Automatic data updates every 15 seconds
- **Caching**: Intelligent caching to reduce API calls and improve performance
- **Error Handling**: Graceful error handling with retry mechanisms

## Technology Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **@tanstack/react-table**: Powerful table component with sorting

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Axios**: HTTP client for API requests
- **Cheerio**: Web scraping for Google Finance data

### Data Sources
- **Yahoo Finance**: Unofficial API for current market prices
- **Google Finance**: Web scraping for P/E ratios and earnings data

## Project Structure

```
portfolio-dashboard/
├── app/
│   ├── api/
│   │   ├── stock-prices/
│   │   │   └── route.ts          # Yahoo Finance API endpoint
│   │   └── stock-fundamentals/
│   │       └── route.ts          # Google Finance API endpoint
│   ├── layout.tsx
│   └── page.tsx                  # Main page
├── components/
│   ├── PortfolioDashboard.tsx    # Main dashboard component
│   ├── PortfolioTable.tsx        # Stock table component
│   └── SectorSummary.tsx         # Sector grouping component
├── data/
│   └── holdings.ts               # Portfolio holdings data
├── lib/
│   ├── yahooFinance.ts           # Yahoo Finance integration
│   ├── googleFinance.ts          # Google Finance integration
│   ├── cache.ts                  # Caching mechanism
│   └── portfolioCalculations.ts  # Business logic
├── types/
│   └── portfolio.ts              # TypeScript type definitions
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup

1. Navigate to the project directory:
```bash
cd portfolio-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Update portfolio holdings:
Edit `data/holdings.ts` to add your portfolio stocks:
```typescript
export const portfolioHoldings: Stock[] = [
  {
    id: '1',
    particulars: 'Stock Name',
    purchasePrice: 1000.00,
    quantity: 10,
    sector: 'Technology',
    exchange: 'NSE',
    symbol: 'STOCKNAME.NS'  // Yahoo Finance symbol format
  },
  // Add more stocks...
];
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Usage

### Dashboard Views

The dashboard offers two view modes:

1. **By Sector**: Groups stocks by sector with expandable sections showing:
   - Total investment per sector
   - Present value per sector
   - Gain/Loss per sector
   - Individual stock details (expandable)

2. **All Stocks**: Displays all stocks in a single sortable table

### Features in Action

- **Auto-refresh**: Data automatically updates every 15 seconds
- **Manual Refresh**: Click the "Refresh" button to fetch latest data immediately
- **Sorting**: Click any column header to sort the table
- **Color Indicators**:
  - Green: Positive gains
  - Red: Losses
  - Blue: Current market prices
- **Sector Expansion**: Click on sector headers to expand/collapse stock details

### Stock Symbol Format

For Yahoo Finance API:
- NSE stocks: `STOCKNAME.NS` (e.g., `RELIANCE.NS`)
- BSE stocks: `STOCKNAME.BO` (e.g., `RELIANCE.BO`)

## API Endpoints

### GET /api/stock-prices

Fetches current market prices for multiple stocks.

**Query Parameters:**
- `symbols`: Comma-separated list of stock symbols

**Example:**
```
GET /api/stock-prices?symbols=RELIANCE.NS,TCS.NS,INFY.NS
```

**Response:**
```json
{
  "success": true,
  "data": {
    "RELIANCE.NS": 2450.50,
    "TCS.NS": 3600.75,
    "INFY.NS": 1450.25
  },
  "cached": false
}
```

### GET /api/stock-fundamentals

Fetches P/E ratios and earnings data for multiple stocks.

**Query Parameters:**
- `symbols`: Comma-separated list of stock symbols

**Example:**
```
GET /api/stock-fundamentals?symbols=RELIANCE.NS,TCS.NS
```

**Response:**
```json
{
  "success": true,
  "data": {
    "RELIANCE.NS": {
      "peRatio": 28.5,
      "latestEarnings": "Q3 2024: ₹15,000 Cr"
    },
    "TCS.NS": {
      "peRatio": 32.1,
      "latestEarnings": "Q3 2024: ₹11,500 Cr"
    }
  },
  "cached": false
}
```

## Technical Challenges & Solutions

### 1. Unofficial APIs

**Challenge**: Yahoo Finance and Google Finance don't provide official public APIs.

**Solution**:
- Yahoo Finance: Using unofficial API endpoint (`query1.finance.yahoo.com`)
- Google Finance: Web scraping using Cheerio
- Implemented robust error handling to handle API changes
- Added fallback mechanisms when data is unavailable

### 2. Rate Limiting

**Challenge**: Public endpoints may have rate limits that could block requests.

**Solution**:
- Implemented batching: Process stocks in small batches (3-5 at a time)
- Added delays between batches (1-2 seconds)
- Implemented caching with TTL:
  - Stock prices: 15-second cache
  - Fundamentals: 5-minute cache
- Used memoization in React components

### 3. Data Accuracy

**Challenge**: Scraped data may vary in structure or be incomplete.

**Solution**:
- Multiple parsing strategies for each data point
- Fallback values when data is unavailable
- Null handling throughout the application
- Clear "N/A" indicators for missing data

### 4. Performance Optimization

**Challenge**: Fetching data for multiple stocks can be slow.

**Solution**:
- Parallel API calls using `Promise.all()`
- Client-side caching to prevent redundant requests
- React.memo and useCallback for component optimization
- Efficient state management to minimize re-renders

### 5. Real-time Updates

**Challenge**: Keep data fresh without overwhelming the APIs.

**Solution**:
- 15-second refresh interval (configurable)
- Cache-first approach: Check cache before making API calls
- Background refresh without disrupting user experience
- Loading states that don't block UI interaction

### 6. Error Handling

**Challenge**: Network failures, API changes, or invalid data.

**Solution**:
- Try-catch blocks in all API functions
- Display last successful data when errors occur
- Warning messages for partial failures
- Retry mechanisms for failed requests
- Timeout handling (10-15 seconds per request)

### 7. Security

**Challenge**: Protect against XSS and injection attacks.

**Solution**:
- TypeScript for type safety
- Input validation on API routes
- No sensitive data in client-side code
- Sanitized data before rendering
- CORS handling in API routes

## Caching Strategy

The application uses a two-tier caching system:

1. **Price Cache**: 15-second TTL
   - Matches the auto-refresh interval
   - Ensures real-time data while reducing API calls

2. **Fundamentals Cache**: 5-minute TTL
   - P/E ratios and earnings change less frequently
   - Significantly reduces scraping requests to Google Finance

## Performance Considerations

- **Lazy Loading**: Data fetched only when needed
- **Memoization**: Expensive calculations cached
- **Batch Processing**: API calls batched to reduce network overhead
- **Debouncing**: User actions debounced to prevent excessive API calls
- **Code Splitting**: Next.js automatic code splitting
- **Server-Side Rendering**: Fast initial page load

## Known Limitations

1. **API Reliability**: Unofficial APIs may break if providers change their structure
2. **Rate Limits**: Heavy usage may trigger rate limiting
3. **Data Delay**: Stock prices may have a slight delay compared to real-time exchange data
4. **Scraping Fragility**: Google Finance scraping may break with HTML changes
5. **No Authentication**: Current version doesn't support user authentication

## Future Enhancements

- User authentication and multi-user support
- Historical data and charts (using recharts)
- Portfolio comparison and benchmarking
- Alerts and notifications
- Export to CSV/PDF
- Mobile app version
- WebSocket for true real-time updates
- More data sources for redundancy
- Technical indicators (RSI, MACD, etc.)
- News integration
- Transaction history tracking

## Troubleshooting

### Issue: No data showing

**Solution**:
- Check internet connection
- Verify stock symbols are in correct format
- Check browser console for API errors
- Try manual refresh

### Issue: "Failed to fetch" errors

**Solution**:
- Yahoo/Google Finance might be temporarily down
- Check if you're behind a firewall or VPN
- Wait a few minutes and try again
- Check rate limiting

### Issue: Missing P/E ratios or earnings

**Solution**:
- Google Finance may not have data for all stocks
- Scraping might have failed for that particular stock
- This is normal and the app handles it gracefully with "N/A"

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Disclaimer

This application is for educational and informational purposes only. The stock data is provided "as-is" without any guarantees of accuracy. Do not make investment decisions based solely on this application. Always consult with a qualified financial advisor.

The use of unofficial APIs and web scraping may violate terms of service. Use at your own risk.

## Author

Created as a technical case study for Octa Byte AI Pvt Ltd.

---

**Note**: Remember to update the `data/holdings.ts` file with your actual portfolio before running the application. The sample data is for demonstration only.
# portfolio-dashboard
