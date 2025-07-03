import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Plus, Share2, RefreshCw } from 'lucide-react';
import { Stock, SortField, SortDirection, WatchlistTag } from '../types/Stock';
import { mockTags } from '../utils/mockData';
import { stockDataService } from '../utils/stockDataService';
import WatchlistRow from './WatchlistRow';
import AddStockModal from './AddStockModal';
import ShareModal from './ShareModal';
import TagFilter from './TagFilter';

export default function Watchlist() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [tags] = useState<WatchlistTag[]>(mockTags);
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('mphinance_watchlist');
    if (savedWatchlist) {
      try {
        const parsedStocks = JSON.parse(savedWatchlist);
        setStocks(parsedStocks);
        // Refresh data for existing stocks
        refreshAllStocks(parsedStocks);
      } catch (error) {
        console.error('Error loading saved watchlist:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever stocks change
  useEffect(() => {
    localStorage.setItem('mphinance_watchlist', JSON.stringify(stocks));
  }, [stocks]);

  // Auto-refresh every 5 minutes during market hours
  useEffect(() => {
    const interval = setInterval(() => {
      if (stocks.length > 0) {
        refreshAllStocks(stocks);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [stocks]);

  const refreshAllStocks = async (stocksToRefresh: Stock[] = stocks) => {
    if (stocksToRefresh.length === 0) return;
    
    setIsRefreshing(true);
    try {
      const symbols = stocksToRefresh.map(stock => stock.symbol);
      const updatedData = await stockDataService.getMultipleStocksData(symbols);
      
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const newData = updatedData[stock.symbol];
          if (newData) {
            return {
              ...stock,
              price: newData.price || stock.price,
              change: newData.change || stock.change,
              changePercent: newData.changePercent || stock.changePercent,
              volume: newData.volume || stock.volume,
              high: newData.high || stock.high,
              low: newData.low || stock.low,
              preMarketPrice: newData.preMarketPrice,
              preMarketChange: newData.preMarketChange,
              preMarketChangePercent: newData.preMarketChangePercent
            };
          }
          return stock;
        })
      );
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing stock data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredStocks = selectedTagFilters.length === 0 
    ? stocks 
    : stocks.filter(stock => 
        selectedTagFilters.some(tag => stock.tags.includes(tag))
      );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  const handleUpdateNotes = (id: string, notes: string) => {
    setStocks(prev => prev.map(stock => 
      stock.id === id ? { ...stock, notes } : stock
    ));
  };

  const handleUpdateTags = (id: string, newTags: string[]) => {
    setStocks(prev => prev.map(stock => 
      stock.id === id ? { ...stock, tags: newTags } : stock
    ));
  };

  const handleAddStock = (newStock: Stock) => {
    setStocks(prev => [...prev, newStock]);
  };

  const handleRemoveStock = (id: string) => {
    setStocks(prev => prev.filter(stock => stock.id !== id));
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTagFilters(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedTagFilters([]);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="text-[#39FF14]" /> : 
      <ChevronDown size={16} className="text-[#39FF14]" />;
  };

  return (
    <div className="bg-[#2C2C2C] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#383838]">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#F0F0F0]">Watchlist ({stocks.length})</h2>
          <TagFilter
            tags={tags}
            selectedTags={selectedTagFilters}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearAllFilters}
          />
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <div className="text-xs text-[#AAAAAA] mr-2">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={() => refreshAllStocks()}
            disabled={isRefreshing || stocks.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-[#383838] text-[#AAAAAA] rounded font-medium hover:bg-[#4A4A4A] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Updating...' : 'Refresh'}
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            disabled={stocks.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#BF00FF] text-[#F0F0F0] rounded font-medium hover:bg-[#A000E6] transition-colors disabled:opacity-50"
          >
            <Share2 size={16} />
            Share
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors"
          >
            <Plus size={16} />
            Add Stock
          </button>
        </div>
      </div>

      {stocks.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-[#AAAAAA] mb-4">
            Your watchlist is empty. Add some stocks to get started!
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors"
          >
            Add Your First Stock
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#383838] bg-[#242424]">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm"
                  >
                    Symbol
                    <SortIcon field="symbol" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    Last Price
                    <SortIcon field="price" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('changePercent')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    Change / Pre-Market
                    <SortIcon field="changePercent" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('high')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    High
                    <SortIcon field="high" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('low')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    Low
                    <SortIcon field="low" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('volume')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    Volume
                    <SortIcon field="volume" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-[#AAAAAA] font-medium text-sm">Tags</span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-[#AAAAAA] font-medium text-sm">Notes</span>
                </th>
              </tr>
            </thead>
            <tbody className="group">
              {sortedStocks.map((stock) => (
                <WatchlistRow
                  key={stock.id}
                  stock={stock}
                  onUpdateNotes={handleUpdateNotes}
                  onUpdateTags={handleUpdateTags}
                  onRemoveStock={handleRemoveStock}
                  availableTags={tags}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStock}
        availableTags={tags}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        stocks={stocks}
      />
    </div>
  );
}