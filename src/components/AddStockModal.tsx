import React, { useState } from 'react';
import { X, Plus, Search, Loader2, Clock, AlertCircle } from 'lucide-react';
import { Stock, WatchlistTag } from '../types/Stock';
import { stockDataService, StockSearchResult } from '../utils/stockDataService';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (stock: Stock) => void;
  availableTags: WatchlistTag[];
}

export default function AddStockModal({ isOpen, onClose, onAdd, availableTags }: AddStockModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
  const [stockData, setStockData] = useState<Partial<Stock> | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const isWeekend = () => {
    const now = new Date();
    const day = now.getDay();
    return day === 0 || day === 6;
  };

  const isMarketHours = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    if (day === 0 || day === 6) return false;
    return hour >= 9 && hour < 16;
  };

  const getMarketStatusMessage = () => {
    if (isWeekend()) {
      return "Markets are closed (Weekend). Showing last available data.";
    } else if (!isMarketHours()) {
      return "Markets are closed. Showing previous close data.";
    }
    return "Markets are open. Showing live data.";
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    setSelectedStock(null);
    setStockData(null);
    
    try {
      const results = await stockDataService.searchStocks(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        // If no search results, try direct symbol lookup
        try {
          const data = await stockDataService.getStockData(searchQuery.toUpperCase());
          if (data.symbol) {
            setSelectedStock({
              symbol: data.symbol,
              name: data.name || `${data.symbol} Inc.`,
              market: 'stocks',
              type: 'CS',
              active: true
            });
            setStockData(data);
          }
        } catch (error) {
          console.warn('Direct symbol lookup failed:', error);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for stocks. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStock = async (stock: StockSearchResult) => {
    setSelectedStock(stock);
    setIsLoadingData(true);
    setStockData(null);
    
    try {
      const data = await stockDataService.getStockData(stock.symbol);
      setStockData(data);
    } catch (error) {
      console.error('Error loading stock data:', error);
      alert('Error loading stock data. Please try again.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStock || !stockData) {
      alert('Please select a stock first.');
      return;
    }

    const newStock: Stock = {
      id: Date.now().toString(),
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      price: stockData.price || 0,
      change: stockData.change || 0,
      changePercent: stockData.changePercent || 0,
      volume: stockData.volume || 0,
      high: stockData.high || stockData.price || 0,
      low: stockData.low || stockData.price || 0,
      notes: notes,
      tags: selectedTags,
      preMarketPrice: stockData.preMarketPrice,
      preMarketChange: stockData.preMarketChange,
      preMarketChangePercent: stockData.preMarketChangePercent
    };

    onAdd(newStock);
    
    // Reset form
    setSearchQuery('');
    setSearchResults([]);
    setSelectedStock(null);
    setStockData(null);
    setSelectedTags([]);
    setNotes('');
    onClose();
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#2C2C2C] rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#F0F0F0]">Add Stock to Watchlist</h2>
          <button
            onClick={onClose}
            className="text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Market Status Notice */}
        <div className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${
          isMarketHours() && !isWeekend() 
            ? 'bg-[#39FF14] bg-opacity-10 border-[#39FF14] text-[#39FF14]'
            : 'bg-[#FFD700] bg-opacity-10 border-[#FFD700] text-[#FFD700]'
        }`}>
          {isMarketHours() && !isWeekend() ? (
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></div>
          ) : (
            <Clock size={16} />
          )}
          <span className="text-sm font-medium">
            {getMarketStatusMessage()}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stock Search */}
          <div>
            <label className="block text-sm font-medium text-[#AAAAAA] mb-2">
              Search Stock Symbol or Company Name
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#AAAAAA]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                  placeholder="Enter symbol (AAPL) or company name (Apple)"
                  className="w-full pl-10 pr-4 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="px-4 py-2 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-[#383838] rounded-lg p-4 border border-[#4A4A4A]">
              <h3 className="text-lg font-semibold text-[#F0F0F0] mb-3">Search Results</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((stock) => (
                  <button
                    key={stock.symbol}
                    type="button"
                    onClick={() => handleSelectStock(stock)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedStock?.symbol === stock.symbol
                        ? 'bg-[#39FF14] bg-opacity-20 border-[#39FF14]'
                        : 'bg-[#2C2C2C] border-[#4A4A4A] hover:bg-[#4A4A4A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#F0F0F0]">{stock.symbol}</div>
                        <div className="text-sm text-[#AAAAAA] truncate max-w-[300px]">{stock.name}</div>
                      </div>
                      <div className="text-xs text-[#AAAAAA]">
                        {stock.type} • {stock.market}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Stock Data */}
          {isLoadingData && (
            <div className="bg-[#383838] rounded-lg p-4 border border-[#4A4A4A] text-center">
              <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#39FF14]" />
              <p className="text-[#AAAAAA]">Loading stock data...</p>
              {(isWeekend() || !isMarketHours()) && (
                <p className="text-xs text-[#FFD700] mt-1">
                  Loading previous close data (markets closed)
                </p>
              )}
            </div>
          )}

          {/* Stock Data Preview */}
          {selectedStock && stockData && !isLoadingData && (
            <div className="bg-[#383838] rounded-lg p-4 border border-[#4A4A4A]">
              <h3 className="text-lg font-semibold text-[#F0F0F0] mb-3">Stock Information</h3>
              
              {/* Data freshness indicator */}
              {(isWeekend() || !isMarketHours()) && (
                <div className="mb-3 p-2 bg-[#FFD700] bg-opacity-10 border border-[#FFD700] rounded flex items-center gap-2">
                  <AlertCircle size={16} className="text-[#FFD700]" />
                  <span className="text-xs text-[#FFD700]">
                    Showing {isWeekend() ? 'last Friday\'s' : 'previous'} close data (markets closed)
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-[#AAAAAA]">Symbol:</span>
                  <div className="font-bold text-[#F0F0F0]">{selectedStock.symbol}</div>
                </div>
                <div>
                  <span className="text-[#AAAAAA]">Price:</span>
                  <div className="font-mono text-[#F0F0F0]">${stockData.price?.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-[#AAAAAA]">Change:</span>
                  <div className={`font-mono ${(stockData.change || 0) >= 0 ? 'text-[#39FF14]' : 'text-[#BF00FF]'}`}>
                    {(stockData.change || 0) >= 0 ? '+' : ''}${stockData.change?.toFixed(2)} ({(stockData.changePercent || 0) >= 0 ? '+' : ''}{stockData.changePercent?.toFixed(2)}%)
                  </div>
                </div>
                <div>
                  <span className="text-[#AAAAAA]">Volume:</span>
                  <div className="font-mono text-[#F0F0F0]">{stockData.volume?.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[#AAAAAA]">High:</span>
                  <div className="font-mono text-[#F0F0F0]">${stockData.high?.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-[#AAAAAA]">Low:</span>
                  <div className="font-mono text-[#F0F0F0]">${stockData.low?.toFixed(2)}</div>
                </div>
                {stockData.preMarketPrice && (
                  <>
                    <div>
                      <span className="text-[#AAAAAA]">Pre-Market:</span>
                      <div className="font-mono text-[#F0F0F0]">${stockData.preMarketPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-[#AAAAAA]">Pre Change:</span>
                      <div className={`font-mono ${(stockData.preMarketChange || 0) >= 0 ? 'text-[#39FF14]' : 'text-[#BF00FF]'}`}>
                        {(stockData.preMarketChange || 0) >= 0 ? '+' : ''}${stockData.preMarketChange?.toFixed(2)}%
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-[#4A4A4A]">
                <div className="text-sm text-[#AAAAAA]">
                  <strong>Company:</strong> {selectedStock.name}
                </div>
              </div>
            </div>
          )}

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-medium text-[#AAAAAA] mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedTags.includes(tag.name)
                      ? 'text-[#1A1A1A] font-medium'
                      : 'text-[#F0F0F0] hover:text-[#1A1A1A]'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.name) ? tag.color : '#383838',
                    borderColor: tag.color,
                    borderWidth: '1px',
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14] resize-none"
              placeholder="Trading notes..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#383838] text-[#AAAAAA] rounded hover:bg-[#4A4A4A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedStock || !stockData || isLoadingData}
              className="flex-1 px-4 py-2 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Add Stock
            </button>
          </div>
        </form>

        {/* Polygon Attribution */}
        <div className="mt-4 pt-4 border-t border-[#383838] text-xs text-[#AAAAAA] text-center">
          Real-time stock data provided by Polygon.io • {isWeekend() ? 'Weekend' : !isMarketHours() ? 'After Hours' : 'Live'} Data
        </div>
      </div>
    </div>
  );
}