import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { stockDataService } from '../utils/stockDataService';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function MarketSummary() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Major market ETFs that should have good data availability
  const marketSymbols = [
    { symbol: 'SPY', name: 'S&P 500' },
    { symbol: 'QQQ', name: 'NASDAQ' },
    { symbol: 'DIA', name: 'DOW' }
  ];

  const fetchMarketData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching market summary data...');
      const symbols = marketSymbols.map(m => m.symbol);
      const data = await stockDataService.getMultipleStocksData(symbols);
      
      console.log('Market data received:', data);
      
      const formattedData: MarketData[] = [];
      
      for (const market of marketSymbols) {
        const stockData = data[market.symbol];
        
        if (stockData && stockData.price && stockData.price > 0) {
          formattedData.push({
            symbol: market.symbol,
            name: market.name,
            price: stockData.price,
            change: stockData.change || 0,
            changePercent: stockData.changePercent || 0
          });
        } else {
          console.warn(`No valid data for ${market.symbol}:`, stockData);
          // Add placeholder with error indicator
          formattedData.push({
            symbol: market.symbol,
            name: market.name,
            price: 0,
            change: 0,
            changePercent: 0
          });
        }
      }

      // Check if we got any valid data
      const validData = formattedData.filter(d => d.price > 0);
      
      if (validData.length === 0) {
        throw new Error('No valid market data received from API');
      }

      setMarketData(formattedData);
      setLastUpdate(new Date());
      
      if (validData.length < formattedData.length) {
        setError(`Some market data unavailable (${validData.length}/${formattedData.length} loaded)`);
      }
      
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError('Failed to load market data');
      
      // Use fallback data when API fails
      const fallbackData: MarketData[] = [
        { symbol: 'SPY', name: 'S&P 500', price: 445.32, change: 2.15, changePercent: 0.48 },
        { symbol: 'QQQ', name: 'NASDAQ', price: 378.91, change: -1.23, changePercent: -0.32 },
        { symbol: 'DIA', name: 'DOW', price: 348.76, change: 0.87, changePercent: 0.25 }
      ];
      setMarketData(fallbackData);
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#2C2C2C] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#F0F0F0]">Market Summary</h3>
        <div className="flex items-center gap-2">
          {error && (
            <AlertCircle size={16} className="text-[#FFD700]" title={error} />
          )}
          {lastUpdate && (
            <span className="text-xs text-[#AAAAAA]">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchMarketData}
            disabled={isLoading}
            className="text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors"
            title="Refresh market data"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {isLoading && marketData.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-[#383838] rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-[#383838] rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {marketData.map((market) => {
            const isPositive = market.changePercent >= 0;
            const color = isPositive ? '#39FF14' : '#BF00FF';
            const Icon = isPositive ? TrendingUp : TrendingDown;
            
            // Show error state for zero prices
            if (market.price === 0) {
              return (
                <div key={market.symbol} className="flex justify-between items-center opacity-50">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-[#FFD700]" />
                    <span className="text-[#AAAAAA]">{market.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[#AAAAAA] text-sm">
                      No data
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={market.symbol} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color }} />
                  <span className="text-[#AAAAAA]">{market.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[#F0F0F0] text-sm">
                    ${market.price.toFixed(2)}
                  </div>
                  <div className="font-mono text-xs" style={{ color }}>
                    {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {error && (
        <div className="mt-3 pt-3 border-t border-[#383838]">
          <div className="text-xs text-[#FFD700] flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </div>
        </div>
      )}
    </div>
  );
}