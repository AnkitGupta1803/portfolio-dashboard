'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { portfolioHoldings } from '@/data/holdings';
import { PortfolioData } from '@/types/portfolio';
import { calculatePortfolioData, formatCurrency, formatPercent, getGainLossColorClass } from '@/lib/portfolioCalculations';
import SectorSummary from './SectorSummary';
import PortfolioTable from './PortfolioTable';

const REFRESH_INTERVAL = 15000; // 15 seconds

export default function PortfolioDashboard() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'sector'>('sector');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPortfolioData = useCallback(async () => {
    try {
      setIsRefreshing(true);

      const symbols = portfolioHoldings.map(h => h.symbol).join(',');

      // Fetch prices and fundamentals in parallel
      const [pricesResponse, fundamentalsResponse] = await Promise.all([
        fetch(`/api/stock-prices?symbols=${symbols}`),
        fetch(`/api/stock-fundamentals?symbols=${symbols}`)
      ]);

      if (!pricesResponse.ok || !fundamentalsResponse.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const pricesData = await pricesResponse.json();
      const fundamentalsData = await fundamentalsResponse.json();

      if (!pricesData.success || !fundamentalsData.success) {
        throw new Error(pricesData.error || fundamentalsData.error || 'Unknown error');
      }

      // Calculate portfolio data
      const calculatedData = calculatePortfolioData(
        portfolioHoldings,
        pricesData.data,
        fundamentalsData.data
      );

      setPortfolioData(calculatedData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPortfolioData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchPortfolioData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error && !portfolioData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={fetchPortfolioData}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Portfolio Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Real-time portfolio tracking and analysis
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchPortfolioData}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Total Investment
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                {formatCurrency(portfolioData.totalInvestment)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                Present Value
              </div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {formatCurrency(portfolioData.totalPresentValue)}
              </div>
            </div>

            <div className={`bg-gradient-to-br p-4 rounded-lg border ${
              portfolioData.totalGainLoss >= 0
                ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'
                : 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
            }`}>
              <div className={`text-sm font-medium ${
                portfolioData.totalGainLoss >= 0
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                Total Gain/Loss
              </div>
              <div className={`text-2xl font-bold mt-1 ${getGainLossColorClass(portfolioData.totalGainLoss)}`}>
                {formatCurrency(portfolioData.totalGainLoss)}
              </div>
              <div className={`text-sm ${getGainLossColorClass(portfolioData.totalGainLoss)}`}>
                {formatPercent(portfolioData.totalGainLossPercent)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Last Updated
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {lastUpdated?.toLocaleTimeString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Auto-refresh: 15s
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
            <button
              onClick={() => setViewMode('sector')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'sector'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              By Sector
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Stocks
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Warning: {error} (showing last successful data)
            </p>
          </div>
        )}

        {viewMode === 'sector' ? (
          <SectorSummary sectorSummaries={portfolioData.sectorSummaries} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              All Holdings
            </h2>
            <PortfolioTable data={portfolioData.rows} />
          </div>
        )}
      </div>
    </div>
  );
}
