import { Stock, PortfolioRow, SectorSummary, PortfolioData } from '@/types/portfolio';

/**
 * Calculates portfolio metrics for a single stock
 */
export function calculateStockMetrics(
  stock: Stock,
  cmp: number,
  peRatio: number | null,
  latestEarnings: string | null,
  totalPortfolioInvestment: number
): PortfolioRow {
  const investment = stock.purchasePrice * stock.quantity;
  const presentValue = cmp * stock.quantity;
  const gainLoss = presentValue - investment;
  const gainLossPercent = (gainLoss / investment) * 100;
  const portfolioPercent = (investment / totalPortfolioInvestment) * 100;

  return {
    ...stock,
    investment,
    portfolioPercent,
    cmp,
    presentValue,
    gainLoss,
    gainLossPercent,
    peRatio,
    latestEarnings
  };
}

/**
 * Calculates total investment across all stocks
 */
export function calculateTotalInvestment(stocks: Stock[]): number {
  return stocks.reduce((total, stock) => {
    return total + (stock.purchasePrice * stock.quantity);
  }, 0);
}

/**
 * Groups portfolio rows by sector and calculates sector summaries
 */
export function groupBySector(portfolioRows: PortfolioRow[]): SectorSummary[] {
  const sectorMap = new Map<string, PortfolioRow[]>();

  // Group stocks by sector
  portfolioRows.forEach(row => {
    const existing = sectorMap.get(row.sector) || [];
    existing.push(row);
    sectorMap.set(row.sector, existing);
  });

  // Calculate sector summaries
  const sectorSummaries: SectorSummary[] = [];

  sectorMap.forEach((stocks, sector) => {
    const totalInvestment = stocks.reduce((sum, stock) => sum + stock.investment, 0);
    const totalPresentValue = stocks.reduce((sum, stock) => sum + stock.presentValue, 0);
    const gainLoss = totalPresentValue - totalInvestment;
    const gainLossPercent = (gainLoss / totalInvestment) * 100;

    sectorSummaries.push({
      sector,
      totalInvestment,
      totalPresentValue,
      gainLoss,
      gainLossPercent,
      stocks
    });
  });

  // Sort by total investment (descending)
  return sectorSummaries.sort((a, b) => b.totalInvestment - a.totalInvestment);
}

/**
 * Calculates complete portfolio data with all metrics
 */
export function calculatePortfolioData(
  stocks: Stock[],
  prices: Record<string, number | null>,
  fundamentals: Record<string, { peRatio: number | null; latestEarnings: string | null }>
): PortfolioData {
  const totalPortfolioInvestment = calculateTotalInvestment(stocks);

  // Calculate metrics for each stock
  const portfolioRows: PortfolioRow[] = stocks.map(stock => {
    const cmp = prices[stock.symbol] || stock.purchasePrice; // Fallback to purchase price if CMP unavailable
    const fundamental = fundamentals[stock.symbol] || { peRatio: null, latestEarnings: null };

    return calculateStockMetrics(
      stock,
      cmp,
      fundamental.peRatio,
      fundamental.latestEarnings,
      totalPortfolioInvestment
    );
  });

  // Group by sector
  const sectorSummaries = groupBySector(portfolioRows);

  // Calculate total portfolio metrics
  const totalInvestment = portfolioRows.reduce((sum, row) => sum + row.investment, 0);
  const totalPresentValue = portfolioRows.reduce((sum, row) => sum + row.presentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPercent = (totalGainLoss / totalInvestment) * 100;

  return {
    rows: portfolioRows,
    sectorSummaries,
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercent
  };
}

/**
 * Formats currency in Indian Rupee format
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formats percentage with sign
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Determines color class based on gain/loss
 */
export function getGainLossColorClass(value: number): string {
  if (value > 0) return 'text-green-600 dark:text-green-400';
  if (value < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
}
