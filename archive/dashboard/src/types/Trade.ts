export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  assetType: 'stock' | 'call' | 'put';
  quantity: number;
  price: number;
  date: string;
  time: string;
  strategy: string;
  notes: string;
  pnl?: number;
  tags: string[];
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  commission?: number;
  
  // Options-specific fields
  strikePrice?: number;
  expirationDate?: string;
  daysToExpiration?: number;
  
  // Greeks (at entry and exit)
  entryIV?: number;
  exitIV?: number;
  entryDelta?: number;
  exitDelta?: number;
  entryGamma?: number;
  exitGamma?: number;
  entryTheta?: number;
  exitTheta?: number;
  entryVega?: number;
  exitVega?: number;
  entryRho?: number;
  exitRho?: number;
  
  // Performance metrics
  mae?: number; // Maximum Adverse Excursion
  mfe?: number; // Maximum Favorable Excursion
  holdingPeriod?: number; // in minutes
}

export interface TradeStrategy {
  id: string;
  name: string;
  color: string;
}

export type TradeSortField = 'date' | 'symbol' | 'type' | 'assetType' | 'quantity' | 'price' | 'pnl' | 'strategy' | 'daysToExpiration' | 'entryIV';
export type TradeSortDirection = 'asc' | 'desc';

export interface PerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  
  // By asset type
  stockTrades: number;
  callTrades: number;
  putTrades: number;
  
  // By time of day
  tradesByHour: { [hour: number]: { count: number; pnl: number; winRate: number } };
  
  // By IV ranges
  tradesByIV: { [range: string]: { count: number; pnl: number; winRate: number } };
  
  // By DTE ranges
  tradesByDTE: { [range: string]: { count: number; pnl: number; winRate: number } };
  
  // By price ranges
  tradesByPrice: { [range: string]: { count: number; pnl: number; winRate: number } };
}