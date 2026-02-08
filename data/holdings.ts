import { Stock } from '@/types/portfolio';

// Actual portfolio holdings from Excel sheet
export const portfolioHoldings: Stock[] = [
  // Financial Sector
  {
    id: '1',
    particulars: 'HDFC Bank',
    purchasePrice: 1490.00,
    quantity: 50,
    sector: 'Financial',
    exchange: 'NSE',
    symbol: 'HDFCBANK.NS'
  },
  {
    id: '2',
    particulars: 'Bajaj Finance',
    purchasePrice: 6466.00,
    quantity: 15,
    sector: 'Financial',
    exchange: 'NSE',
    symbol: 'BAJFINANCE.NS'
  },
  {
    id: '3',
    particulars: 'ICICI Bank',
    purchasePrice: 780.00,
    quantity: 84,
    sector: 'Financial',
    exchange: 'NSE',
    symbol: 'ICICIBANK.NS'
  },
  {
    id: '4',
    particulars: 'Bajaj Housing',
    purchasePrice: 130.00,
    quantity: 504,
    sector: 'Financial',
    exchange: 'NSE',
    symbol: 'BAJAJHFL.NS'
  },
  {
    id: '5',
    particulars: 'SBI Life',
    purchasePrice: 1197.00,
    quantity: 49,
    sector: 'Financial',
    exchange: 'NSE',
    symbol: 'SBILIFE.NS'
  },

  // Tech Sector
  {
    id: '6',
    particulars: 'Affle India',
    purchasePrice: 1151.00,
    quantity: 50,
    sector: 'Technology',
    exchange: 'NSE',
    symbol: 'AFFLE.NS'
  },
  {
    id: '7',
    particulars: 'LTI Mindtree',
    purchasePrice: 4775.00,
    quantity: 16,
    sector: 'Technology',
    exchange: 'NSE',
    symbol: 'LTIM.NS'
  },
  {
    id: '8',
    particulars: 'KPIT Tech',
    purchasePrice: 672.00,
    quantity: 61,
    sector: 'Technology',
    exchange: 'NSE',
    symbol: 'KPITTECH.NS'
  },
  {
    id: '9',
    particulars: 'Tata Tech',
    purchasePrice: 1072.00,
    quantity: 63,
    sector: 'Technology',
    exchange: 'NSE',
    symbol: 'TATATECH.NS'
  },
  {
    id: '10',
    particulars: 'BLS E-Services',
    purchasePrice: 232.00,
    quantity: 191,
    sector: 'Technology',
    exchange: 'NSE',
    symbol: 'BLS.NS'
  },
  {
    id: '11',
    particulars: 'Tanla',
    purchasePrice: 1134.00,
    quantity: 45,
    sector: 'Technology',
    exchange: 'NSE',
    symbol: 'TANLA.NS'
  },

  // Consumer Sector
  {
    id: '12',
    particulars: 'Dmart',
    purchasePrice: 3777.00,
    quantity: 27,
    sector: 'Consumer',
    exchange: 'NSE',
    symbol: 'DMART.NS'
  },
  {
    id: '13',
    particulars: 'Tata Consumer',
    purchasePrice: 845.00,
    quantity: 90,
    sector: 'Consumer',
    exchange: 'NSE',
    symbol: 'TATACONSUM.NS'
  },
  {
    id: '14',
    particulars: 'Pidilite',
    purchasePrice: 2376.00,
    quantity: 36,
    sector: 'Consumer',
    exchange: 'NSE',
    symbol: 'PIDILITIND.NS'
  },

  // Power Sector
  {
    id: '15',
    particulars: 'Tata Power',
    purchasePrice: 224.00,
    quantity: 225,
    sector: 'Power',
    exchange: 'NSE',
    symbol: 'TATAPOWER.NS'
  },
  {
    id: '16',
    particulars: 'KPI Green',
    purchasePrice: 875.00,
    quantity: 50,
    sector: 'Power',
    exchange: 'NSE',
    symbol: 'KPIGREEN.NS'
  },
  {
    id: '17',
    particulars: 'Suzlon',
    purchasePrice: 44.00,
    quantity: 450,
    sector: 'Power',
    exchange: 'NSE',
    symbol: 'SUZLON.NS'
  },
  {
    id: '18',
    particulars: 'Gensol',
    purchasePrice: 998.00,
    quantity: 45,
    sector: 'Power',
    exchange: 'NSE',
    symbol: 'GENSOL.NS'
  },

  // Pipe Sector
  {
    id: '19',
    particulars: 'Hariom Pipes',
    purchasePrice: 580.00,
    quantity: 60,
    sector: 'Pipes',
    exchange: 'NSE',
    symbol: 'HARIOMPIPE.NS'
  },
  {
    id: '20',
    particulars: 'Astral',
    purchasePrice: 1517.00,
    quantity: 56,
    sector: 'Pipes',
    exchange: 'NSE',
    symbol: 'ASTRAL.NS'
  },
  {
    id: '21',
    particulars: 'Polycab',
    purchasePrice: 2818.00,
    quantity: 28,
    sector: 'Pipes',
    exchange: 'NSE',
    symbol: 'POLYCAB.NS'
  },

  // Others
  {
    id: '22',
    particulars: 'Clean Science',
    purchasePrice: 1610.00,
    quantity: 32,
    sector: 'Chemicals',
    exchange: 'NSE',
    symbol: 'CLEAN.NS'
  },
  {
    id: '23',
    particulars: 'Deepak Nitrite',
    purchasePrice: 2248.00,
    quantity: 27,
    sector: 'Chemicals',
    exchange: 'NSE',
    symbol: 'DEEPAKNTR.NS'
  },
  {
    id: '24',
    particulars: 'Fine Organic',
    purchasePrice: 4284.00,
    quantity: 16,
    sector: 'Chemicals',
    exchange: 'NSE',
    symbol: 'FINEORG.NS'
  },
  {
    id: '25',
    particulars: 'Gravita',
    purchasePrice: 2037.00,
    quantity: 8,
    sector: 'Metals',
    exchange: 'NSE',
    symbol: 'GRAVITA.NS'
  }
];
