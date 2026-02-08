'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { PortfolioRow } from '@/types/portfolio';
import { formatCurrency, formatPercent, getGainLossColorClass } from '@/lib/portfolioCalculations';

interface PortfolioTableProps {
  data: PortfolioRow[];
}

const columnHelper = createColumnHelper<PortfolioRow>();

export default function PortfolioTable({ data }: PortfolioTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('particulars', {
        header: 'Particulars',
        cell: (info) => (
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('sector', {
        header: 'Sector',
        cell: (info) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('purchasePrice', {
        header: 'Purchase Price',
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor('quantity', {
        header: 'Qty',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      columnHelper.accessor('investment', {
        header: 'Investment',
        cell: (info) => (
          <span className="font-semibold">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('portfolioPercent', {
        header: 'Portfolio %',
        cell: (info) => `${info.getValue().toFixed(2)}%`,
      }),
      columnHelper.accessor('exchange', {
        header: 'Exchange',
        cell: (info) => (
          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('cmp', {
        header: 'CMP',
        cell: (info) => (
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('presentValue', {
        header: 'Present Value',
        cell: (info) => (
          <span className="font-semibold">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('gainLoss', {
        header: 'Gain/Loss',
        cell: (info) => {
          const value = info.getValue();
          const row = info.row.original;
          return (
            <div className={getGainLossColorClass(value)}>
              <div className="font-semibold">{formatCurrency(value)}</div>
              <div className="text-xs">{formatPercent(row.gainLossPercent)}</div>
            </div>
          );
        },
      }),
      columnHelper.accessor('peRatio', {
        header: 'P/E Ratio',
        cell: (info) => {
          const value = info.getValue();
          return value !== null ? value.toFixed(2) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor('latestEarnings', {
        header: 'Latest Earnings',
        cell: (info) => {
          const value = info.getValue();
          return value || <span className="text-gray-400">N/A</span>;
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() && (
                      <span>
                        {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
