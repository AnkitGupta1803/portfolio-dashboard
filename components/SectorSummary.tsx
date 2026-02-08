'use client';

import React from 'react';
import { SectorSummary as SectorSummaryType } from '@/types/portfolio';
import { formatCurrency, formatPercent, getGainLossColorClass } from '@/lib/portfolioCalculations';
import PortfolioTable from './PortfolioTable';

interface SectorSummaryProps {
  sectorSummaries: SectorSummaryType[];
}

export default function SectorSummary({ sectorSummaries }: SectorSummaryProps) {
  const [expandedSectors, setExpandedSectors] = React.useState<Set<string>>(new Set());

  const toggleSector = (sector: string) => {
    const newExpanded = new Set(expandedSectors);
    if (newExpanded.has(sector)) {
      newExpanded.delete(sector);
    } else {
      newExpanded.add(sector);
    }
    setExpandedSectors(newExpanded);
  };

  return (
    <div className="space-y-4">
      {sectorSummaries.map((summary) => {
        const isExpanded = expandedSectors.has(summary.sector);

        return (
          <div
            key={summary.sector}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Sector Header */}
            <div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-colors"
              onClick={() => toggleSector(summary.sector)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSector(summary.sector);
                    }}
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {summary.sector}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({summary.stocks.length} stocks)
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Investment
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(summary.totalInvestment)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Present Value
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(summary.totalPresentValue)}
                    </div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Gain/Loss
                    </div>
                    <div className={`font-bold ${getGainLossColorClass(summary.gainLoss)}`}>
                      <div>{formatCurrency(summary.gainLoss)}</div>
                      <div className="text-xs">{formatPercent(summary.gainLossPercent)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Stocks Table */}
            {isExpanded && (
              <div className="p-4 bg-white dark:bg-gray-900">
                <PortfolioTable data={summary.stocks} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
