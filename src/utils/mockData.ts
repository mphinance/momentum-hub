import { WatchlistTag } from '../types/Stock';

export const mockTags: WatchlistTag[] = [
  { id: '3', name: 'Swing', color: '#00BFFF' },
  { id: '4', name: 'Day Trade', color: '#FF6B35' },
  { id: '5', name: 'Long Term', color: '#FFD700' },
  { id: '6', name: 'Earnings', color: '#FF1493' },
  { id: '7', name: 'LEAPS', color: '#32CD32' },
  { id: '8', name: 'Watching Only', color: '#9370DB' },
];

// Remove mock stocks - we'll use real data from Polygon API
export const mockStocks = [];