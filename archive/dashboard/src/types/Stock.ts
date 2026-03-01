export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  notes: string;
  tags: string[];
  preMarketPrice?: number;
  preMarketChange?: number;
  preMarketChangePercent?: number;
}

export type SortField = 'symbol' | 'price' | 'change' | 'changePercent' | 'volume' | 'high' | 'low' | 'preMarketPrice' | 'preMarketChangePercent';
export type SortDirection = 'asc' | 'desc';

export interface WatchlistTag {
  id: string;
  name: string;
  color: string;
}