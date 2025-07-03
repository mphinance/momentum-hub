import React from 'react';
import { Eye, Calendar, Tag, ExternalLink } from 'lucide-react';
import { Stock } from '../types/Stock';
import { formatPrice, formatChange, formatPercent, formatVolume } from '../utils/formatters';

interface SharedWatchlistViewProps {
  watchlistData: {
    watchlist: Stock[];
    timestamp: string;
    settings: {
      includeNotes: boolean;
      includePrices: boolean;
    };
  };
}

export default function SharedWatchlistView({ watchlistData }: SharedWatchlistViewProps) {
  const { watchlist, timestamp, settings } = watchlistData;
  const shareDate = new Date(timestamp).toLocaleDateString();
  const shareTime = new Date(timestamp).toLocaleTimeString();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#F0F0F0]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg p-2">
              <img 
                src="/MPH_white.png" 
                alt="MPH Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F0F0F0] flex items-center gap-2">
                <Eye size={24} className="text-[#39FF14]" />
                Shared Watchlist
              </h1>
              <p className="text-[#AAAAAA] text-sm">
                Shared on {shareDate} at {shareTime}
              </p>
            </div>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors"
          >
            <ExternalLink size={16} />
            Create Your Own
          </a>
        </div>

        {/* Share Info */}
        <div className="bg-[#2C2C2C] rounded-lg p-4 mb-6 border border-[#383838]">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} className="text-[#39FF14]" />
            <span className="text-sm font-medium text-[#F0F0F0]">View-Only Watchlist</span>
          </div>
          <div className="text-xs text-[#AAAAAA] space-y-1">
            <div>• {watchlist.length} stocks in this watchlist</div>
            <div>• {settings.includeNotes ? 'Trading notes included' : 'Trading notes excluded'}</div>
            <div>• {settings.includePrices ? 'Market data included (as of share time)' : 'Market data excluded'}</div>
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="bg-[#2C2C2C] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#383838]">
            <h2 className="text-xl font-bold text-[#F0F0F0]">Watchlist ({watchlist.length} stocks)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#383838] bg-[#242424]">
                  <th className="px-4 py-3 text-left text-[#AAAAAA] font-medium text-sm">Symbol</th>
                  {settings.includePrices && (
                    <>
                      <th className="px-4 py-3 text-right text-[#AAAAAA] font-medium text-sm">Last Price</th>
                      <th className="px-4 py-3 text-right text-[#AAAAAA] font-medium text-sm">Change / Pre-Market</th>
                      <th className="px-4 py-3 text-right text-[#AAAAAA] font-medium text-sm">High</th>
                      <th className="px-4 py-3 text-right text-[#AAAAAA] font-medium text-sm">Low</th>
                      <th className="px-4 py-3 text-right text-[#AAAAAA] font-medium text-sm">Volume</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-left text-[#AAAAAA] font-medium text-sm">Tags</th>
                  {settings.includeNotes && (
                    <th className="px-4 py-3 text-left text-[#AAAAAA] font-medium text-sm">Notes</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {watchlist.map((stock, index) => {
                  const isPositive = (stock.change || 0) >= 0;
                  const changeColor = isPositive ? '#39FF14' : '#BF00FF';
                  
                  const preMarketIsPositive = (stock.preMarketChange || 0) >= 0;
                  const preMarketColor = preMarketIsPositive ? '#39FF14' : '#BF00FF';

                  return (
                    <tr key={index} className="border-b border-[#383838] hover:bg-[#2A2A2A] transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-bold text-[#F0F0F0] text-sm">{stock.symbol}</div>
                          <div className="text-[#AAAAAA] text-xs truncate max-w-[120px]">{stock.name}</div>
                        </div>
                      </td>
                      
                      {settings.includePrices && (
                        <>
                          <td className="px-4 py-3 text-right">
                            <div className="font-mono text-[#F0F0F0] font-medium">
                              {stock.price ? formatPrice(stock.price) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="font-mono">
                              {/* Regular Session Change */}
                              {stock.change !== undefined && stock.changePercent !== undefined ? (
                                <div className="font-medium" style={{ color: changeColor }}>
                                  {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
                                </div>
                              ) : (
                                <div className="text-[#AAAAAA]">N/A</div>
                              )}
                              
                              {/* Pre-Market Data */}
                              {stock.preMarketPrice ? (
                                <div className="text-xs mt-1">
                                  <div className="text-[#AAAAAA]">Pre: {formatPrice(stock.preMarketPrice)}</div>
                                  <div style={{ color: preMarketColor }}>
                                    {stock.preMarketChange ? formatChange(stock.preMarketChange) : ''} 
                                    {stock.preMarketChangePercent ? ` (${formatPercent(stock.preMarketChangePercent)})` : ''}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-[#AAAAAA] mt-1">
                                  <div>Pre: N/A</div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="font-mono text-[#F0F0F0] font-medium">
                              {stock.high ? formatPrice(stock.high) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="font-mono text-[#F0F0F0] font-medium">
                              {stock.low ? formatPrice(stock.low) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="font-mono text-[#AAAAAA] text-sm">
                              {stock.volume ? formatVolume(stock.volume) : 'N/A'}
                            </div>
                          </td>
                        </>
                      )}
                      
                      <td className="px-4 py-3 min-w-[150px]">
                        <div className="flex flex-wrap gap-1">
                          {stock.tags && stock.tags.length > 0 ? (
                            stock.tags.map((tagName, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 text-xs rounded text-[#1A1A1A] font-medium bg-[#39FF14]"
                              >
                                {tagName}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#AAAAAA]">No tags</span>
                          )}
                        </div>
                      </td>
                      
                      {settings.includeNotes && (
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="text-xs text-[#AAAAAA]">
                            {stock.notes || 'No notes'}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#383838] text-center">
          <div className="text-sm text-[#AAAAAA] mb-4">
            This is a shared view-only watchlist. Create your own trading dashboard to track your investments.
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors"
          >
            <ExternalLink size={16} />
            Get Started with mphinance Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}