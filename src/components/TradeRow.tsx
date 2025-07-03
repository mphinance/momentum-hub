import React, { useState } from 'react';
import { Edit3, Save, X, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Trade, TradeStrategy } from '../types/Trade';

interface TradeRowProps {
  trade: Trade;
  onUpdate: (id: string, updatedTrade: Partial<Trade>) => void;
  onRemove: (id: string) => void;
  availableStrategies: TradeStrategy[];
}

export default function TradeRow({ trade, onUpdate, onRemove, availableStrategies }: TradeRowProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(trade.notes);

  const handleSaveNotes = () => {
    onUpdate(trade.id, { notes: editedNotes });
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setEditedNotes(trade.notes);
    setIsEditingNotes(false);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove ${trade.symbol} trade from journal?`)) {
      onRemove(trade.id);
    }
  };

  const getStrategyColor = (strategyName: string) => {
    const strategy = availableStrategies.find(s => s.name === strategyName);
    return strategy?.color || '#AAAAAA';
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPnL = (pnl: number | undefined) => {
    if (pnl === undefined) return 'N/A';
    const sign = pnl >= 0 ? '+' : '';
    return `${sign}$${pnl.toFixed(2)}`;
  };

  const getAssetTypeDisplay = () => {
    if (trade.assetType === 'stock') return 'Stock';
    if (trade.assetType === 'call') return `Call ${trade.strikePrice}`;
    if (trade.assetType === 'put') return `Put ${trade.strikePrice}`;
    return trade.assetType;
  };

  const getAssetTypeColor = () => {
    if (trade.assetType === 'call') return '#39FF14';
    if (trade.assetType === 'put') return '#BF00FF';
    return '#F0F0F0';
  };

  const pnlColor = (trade.pnl || 0) >= 0 ? '#39FF14' : '#BF00FF';

  return (
    <tr className="border-b border-[#383838] hover:bg-[#2A2A2A] transition-colors">
      <td className="px-4 py-3">
        <div className="text-[#F0F0F0] text-sm font-medium">{trade.date}</div>
        <div className="text-[#AAAAAA] text-xs">{trade.time}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-[#F0F0F0] text-sm">{trade.symbol}</div>
          <button
            onClick={handleRemove}
            className="text-[#AAAAAA] hover:text-[#BF00FF] transition-colors opacity-0 group-hover:opacity-100"
            title="Remove trade"
          >
            <Trash2 size={14} />
          </button>
        </div>
        {trade.expirationDate && (
          <div className="text-[#AAAAAA] text-xs">
            Exp: {trade.expirationDate}
            {trade.daysToExpiration && ` (${trade.daysToExpiration}d)`}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <div 
          className="text-sm font-medium"
          style={{ color: getAssetTypeColor() }}
        >
          {getAssetTypeDisplay()}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {trade.type === 'buy' ? (
            <TrendingUp size={16} className="text-[#39FF14]" />
          ) : (
            <TrendingDown size={16} className="text-[#BF00FF]" />
          )}
          <span className={`text-sm font-medium ${
            trade.type === 'buy' ? 'text-[#39FF14]' : 'text-[#BF00FF]'
          }`}>
            {trade.type.toUpperCase()}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-mono text-[#F0F0F0] font-medium">{trade.quantity}</div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-mono text-[#F0F0F0] font-medium">{formatPrice(trade.price)}</div>
        {trade.entryPrice && trade.exitPrice && (
          <div className="text-xs text-[#AAAAAA]">
            {formatPrice(trade.entryPrice)} → {formatPrice(trade.exitPrice)}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {trade.entryIV && (
          <div className="text-xs space-y-1">
            <div className="text-[#F0F0F0]">IV: {(trade.entryIV * 100).toFixed(1)}%</div>
            {trade.entryDelta && (
              <div className="text-[#AAAAAA]">Δ: {trade.entryDelta.toFixed(3)}</div>
            )}
            {trade.entryTheta && (
              <div className="text-[#AAAAAA]">Θ: {trade.entryTheta.toFixed(3)}</div>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-mono font-medium" style={{ color: pnlColor }}>
          {formatPnL(trade.pnl)}
        </div>
        {trade.mae && trade.mfe && (
          <div className="text-xs text-[#AAAAAA]">
            MAE: {formatPnL(trade.mae)} | MFE: {formatPnL(trade.mfe)}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className="px-2 py-1 text-xs rounded text-[#1A1A1A] font-medium"
          style={{ backgroundColor: getStrategyColor(trade.strategy) }}
        >
          {trade.strategy}
        </span>
      </td>
      <td className="px-4 py-3 min-w-[200px]">
        {isEditingNotes ? (
          <div className="flex items-center gap-2">
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="flex-1 px-2 py-1 text-xs bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] resize-none focus:outline-none focus:border-[#39FF14]"
              rows={2}
              placeholder="Add trade notes..."
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={handleSaveNotes}
                className="text-[#39FF14] hover:text-[#33E60C] transition-colors"
                title="Save notes"
              >
                <Save size={14} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors"
                title="Cancel"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <div className="text-xs text-[#AAAAAA] flex-1 line-clamp-2">
              {trade.notes || 'Click to add notes...'}
            </div>
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-[#AAAAAA] hover:text-[#39FF14] transition-colors opacity-0 group-hover:opacity-100"
              title="Edit notes"
            >
              <Edit3 size={14} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}