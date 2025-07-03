import React from 'react';
import { Trade } from '../types/Trade';
import { formatCurrency } from '../utils/formatters';

interface TradeRowProps {
  trade: Trade;
  onDelete: (id: string) => void;
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
}

const TradeRow: React.FC<TradeRowProps> = ({ trade, onDelete, onSelect, isSelected }) => {
  const tradeTypeColorClass = trade.type === 'Buy' ? 'text-green-400' : 'text-red-400';

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-150 ease-in-out">
      <td className="px-5 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(trade.id, e.target.checked)}
          className="form-checkbox h-4 w-4 text-purple-600 rounded"
        />
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-purple-300 font-medium">{trade.symbol}</td>
      <td className="px-5 py-4 whitespace-nowrap text-gray-200">{new Date(trade.date).toLocaleDateString()}</td>
      <td className={`px-5 py-4 whitespace-nowrap ${tradeTypeColorClass}`}>{trade.type}</td>
      <td className="px-5 py-4 whitespace-nowrap text-gray-200">{trade.quantity}</td>
      <td className="px-5 py-4 whitespace-nowrap text-gray-200">{formatCurrency(trade.price)}</td>
      <td className="px-5 py-4 whitespace-nowrap text-gray-200">{formatCurrency(trade.quantity * trade.price)}</td>
      <td className="px-5 py-4 whitespace-nowrap text-gray-200 truncate max-w-xs">{trade.notes}</td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-2">
          {trade.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-purple-800 text-purple-200 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onDelete(trade.id)}
          className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TradeRow;
