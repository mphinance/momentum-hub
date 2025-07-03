import React, { useState } from 'react';
import { Edit3, Save, X, Trash2, Tag } from 'lucide-react';
import { Stock, WatchlistTag } from '../types/Stock';
import { formatPrice, formatChange, formatPercent, formatVolume } from '../utils/formatters';

interface WatchlistRowProps {
  stock: Stock;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemoveStock: (id: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  availableTags: WatchlistTag[];
}

export default function WatchlistRow({ stock, onUpdateNotes, onRemoveStock, onUpdateTags, availableTags }: WatchlistRowProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(stock.notes);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(stock.tags);

  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? '#39FF14' : '#BF00FF';
  
  const preMarketIsPositive = (stock.preMarketChange || 0) >= 0;
  const preMarketColor = preMarketIsPositive ? '#39FF14' : '#BF00FF';

  const handleSaveNotes = () => {
    onUpdateNotes(stock.id, editedNotes);
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setEditedNotes(stock.notes);
    setIsEditingNotes(false);
  };

  const handleSaveTags = () => {
    onUpdateTags(stock.id, selectedTags);
    setIsEditingTags(false);
  };

  const handleCancelTagEdit = () => {
    setSelectedTags(stock.tags);
    setIsEditingTags(false);
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleRemove = () => {
    if (window.confirm(`Remove ${stock.symbol} from watchlist?`)) {
      onRemoveStock(stock.id);
    }
  };

  const getTagColor = (tagName: string) => {
    const tag = availableTags.find(t => t.name === tagName);
    return tag?.color || '#AAAAAA';
  };

  return (
    <tr className="border-b border-[#383838] hover:bg-[#2A2A2A] transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-[#F0F0F0] text-sm">{stock.symbol}</div>
            <div className="text-[#AAAAAA] text-xs truncate max-w-[120px]">{stock.name}</div>
          </div>
          <button
            onClick={handleRemove}
            className="text-[#AAAAAA] hover:text-[#BF00FF] transition-colors opacity-0 group-hover:opacity-100"
            title="Remove from watchlist"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-mono text-[#F0F0F0] font-medium">{formatPrice(stock.price)}</div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-mono">
          {/* Regular Session Change */}
          <div className="font-medium" style={{ color: changeColor }}>
            {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
          </div>
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
              <div>N/A</div>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-mono text-[#F0F0F0] font-medium">{formatPrice(stock.high)}</div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-mono text-[#F0F0F0] font-medium">{formatPrice(stock.low)}</div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-mono text-[#AAAAAA] text-sm">{formatVolume(stock.volume)}</div>
      </td>
      <td className="px-4 py-3 min-w-[150px]">
        {isEditingTags ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
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
            <div className="flex gap-1">
              <button
                onClick={handleSaveTags}
                className="text-[#39FF14] hover:text-[#33E60C] transition-colors"
                title="Save tags"
              >
                <Save size={12} />
              </button>
              <button
                onClick={handleCancelTagEdit}
                className="text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors"
                title="Cancel"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <div className="flex flex-wrap gap-1 flex-1">
              {stock.tags.map((tagName) => (
                <span
                  key={tagName}
                  className="px-2 py-1 text-xs rounded text-[#1A1A1A] font-medium"
                  style={{ backgroundColor: getTagColor(tagName) }}
                >
                  {tagName}
                </span>
              ))}
              {stock.tags.length === 0 && (
                <span className="text-xs text-[#AAAAAA]">No tags</span>
              )}
            </div>
            <button
              onClick={() => setIsEditingTags(true)}
              className="text-[#AAAAAA] hover:text-[#39FF14] transition-colors opacity-0 group-hover:opacity-100"
              title="Edit tags"
            >
              <Tag size={12} />
            </button>
          </div>
        )}
      </td>
      <td className="px-4 py-3 min-w-[200px]">
        {isEditingNotes ? (
          <div className="flex items-center gap-2">
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="flex-1 px-2 py-1 text-xs bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] resize-none focus:outline-none focus:border-[#39FF14]"
              rows={2}
              placeholder="Add trading notes..."
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
              {stock.notes || 'Click to add notes...'}
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