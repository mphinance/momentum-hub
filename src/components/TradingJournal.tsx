import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plus, Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Trade, TradeSortField, TradeSortDirection, TradeStrategy, PerformanceMetrics } from '../types/Trade';
import { mockTrades, mockStrategies } from '../utils/mockTradeData';
import TradeRow from './TradeRow';
import AddTradeModal from './AddTradeModal';
import PerformanceCharts from './PerformanceCharts';
import WebullSettings from './WebullSettings';

export default function TradingJournal() {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [strategies] = useState<TradeStrategy[]>(mockStrategies);
  const [sortField, setSortField] = useState<TradeSortField>('date');
  const [sortDirection, setSortDirection] = useState<TradeSortDirection>('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStrategyFilter, setSelectedStrategyFilter] = useState<string>('');
  const [selectedAssetTypeFilter, setSelectedAssetTypeFilter] = useState<string>('');
  const [showPerformanceCharts, setShowPerformanceCharts] = useState(false);
  const [showWebullSettings, setShowWebullSettings] = useState(false);

  const handleSort = (field: TradeSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTrades = trades.filter(trade => {
    const strategyMatch = !selectedStrategyFilter || trade.strategy === selectedStrategyFilter;
    const assetTypeMatch = !selectedAssetTypeFilter || trade.assetType === selectedAssetTypeFilter;
    return strategyMatch && assetTypeMatch;
  });

  const sortedTrades = [...filteredTrades].sort((a, b) => {
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

  const handleAddTrade = (newTrade: Trade) => {
    setTrades(prev => [...prev, newTrade]);
  };

  const handleUpdateTrade = (id: string, updatedTrade: Partial<Trade>) => {
    setTrades(prev => prev.map(trade => 
      trade.id === id ? { ...trade, ...updatedTrade } : trade
    ));
  };

  const handleRemoveTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
  };

  // Calculate statistics
  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winningTrades = trades.filter(trade => (trade.pnl || 0) > 0).length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  // Asset type breakdown
  const stockTrades = trades.filter(t => t.assetType === 'stock').length;
  const callTrades = trades.filter(t => t.assetType === 'call').length;
  const putTrades = trades.filter(t => t.assetType === 'put').length;

  const SortIcon = ({ field }: { field: TradeSortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="text-[#39FF14]" /> : 
      <ChevronDown size={16} className="text-[#39FF14]" />;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#2C2C2C] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-[#39FF14]" />
            <span className="text-[#AAAAAA] text-sm">Total P&L</span>
          </div>
          <div className={`text-xl font-bold font-mono ${totalPnL >= 0 ? 'text-[#39FF14]' : 'text-[#BF00FF]'}`}>
            ${totalPnL.toFixed(2)}
          </div>
        </div>

        <div className="bg-[#2C2C2C] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-[#39FF14]" />
            <span className="text-[#AAAAAA] text-sm">Win Rate</span>
          </div>
          <div className="text-xl font-bold text-[#F0F0F0]">{winRate.toFixed(1)}%</div>
          <div className="text-xs text-[#AAAAAA]">{winningTrades}/{totalTrades} trades</div>
        </div>

        <div className="bg-[#2C2C2C] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-[#BF00FF]" />
            <span className="text-[#AAAAAA] text-sm">Asset Mix</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#AAAAAA]">Stocks:</span>
              <span className="text-[#F0F0F0]">{stockTrades}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#39FF14]">Calls:</span>
              <span className="text-[#F0F0F0]">{callTrades}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#BF00FF]">Puts:</span>
              <span className="text-[#F0F0F0]">{putTrades}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#2C2C2C] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={20} className="text-[#39FF14]" />
            <span className="text-[#AAAAAA] text-sm">Actions</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setShowPerformanceCharts(!showPerformanceCharts)}
              className="w-full px-3 py-1 bg-[#383838] text-[#F0F0F0] rounded text-xs hover:bg-[#4A4A4A] transition-colors"
            >
              Performance Charts
            </button>
            <button
              onClick={() => setShowWebullSettings(!showWebullSettings)}
              className="w-full px-3 py-1 bg-[#BF00FF] text-[#F0F0F0] rounded text-xs hover:bg-[#A000E6] transition-colors"
            >
              Webull Settings
            </button>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      {showPerformanceCharts && <PerformanceCharts trades={trades} />}

      {/* Webull Settings */}
      {showWebullSettings && <WebullSettings />}

      {/* Trading Journal Table */}
      <div className="bg-[#2C2C2C] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#383838]">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-xl font-bold text-[#F0F0F0]">Trading Journal</h2>
            <select
              value={selectedAssetTypeFilter}
              onChange={(e) => setSelectedAssetTypeFilter(e.target.value)}
              className="px-3 py-1 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] text-sm focus:outline-none focus:border-[#39FF14]"
            >
              <option value="">All Assets</option>
              <option value="stock">Stocks</option>
              <option value="call">Calls</option>
              <option value="put">Puts</option>
            </select>
            <select
              value={selectedStrategyFilter}
              onChange={(e) => setSelectedStrategyFilter(e.target.value)}
              className="px-3 py-1 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] text-sm focus:outline-none focus:border-[#39FF14]"
            >
              <option value="">All Strategies</option>
              {strategies.map((strategy) => (
                <option key={strategy.id} value={strategy.name}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors"
          >
            <Plus size={16} />
            Add Trade
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#383838] bg-[#242424]">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm"
                  >
                    Date/Time
                    <SortIcon field="date" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm"
                  >
                    Symbol
                    <SortIcon field="symbol" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('assetType')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm"
                  >
                    Asset
                    <SortIcon field="assetType" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm"
                  >
                    Type
                    <SortIcon field="type" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('quantity')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    Qty
                    <SortIcon field="quantity" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    Price
                    <SortIcon field="price" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('entryIV')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    IV/Greeks
                    <SortIcon field="entryIV" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort('pnl')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm ml-auto"
                  >
                    P&L
                    <SortIcon field="pnl" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('strategy')}
                    className="flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors font-medium text-sm"
                  >
                    Strategy
                    <SortIcon field="strategy" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-[#AAAAAA] font-medium text-sm">Notes</span>
                </th>
              </tr>
            </thead>
            <tbody className="group">
              {sortedTrades.map((trade) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                  onUpdate={handleUpdateTrade}
                  onRemove={handleRemoveTrade}
                  availableStrategies={strategies}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddTradeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTrade}
        availableStrategies={strategies}
      />
    </div>
  );
}