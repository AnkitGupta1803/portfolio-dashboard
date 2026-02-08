export interface Stock {
  id: string;
  particulars: string; // Stock name
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: 'NSE' | 'BSE';
  symbol: string; // Stock symbol for API calls
}

export interface LiveStockData {
  symbol: string;
  cmp: number; // Current Market Price
  peRatio: number | null; // P/E Ratio
  latestEarnings: string | null; // Latest earnings data
  lastUpdated: Date;
}

export interface PortfolioRow extends Stock {
  investment: number; // Purchase Price × Qty
  portfolioPercent: number; // Proportional weight in portfolio
  cmp: number; // From Yahoo Finance
  presentValue: number; // CMP × Qty
  gainLoss: number; // Present Value - Investment
  gainLossPercent: number; // (Gain/Loss / Investment) × 100
  peRatio: number | null; // From Google Finance
  latestEarnings: string | null; // From Google Finance
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  stocks: PortfolioRow[];
}

export interface PortfolioData {
  rows: PortfolioRow[];
  sectorSummaries: SectorSummary[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
