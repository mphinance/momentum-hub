import React, { useState, useEffect } from 'react';
import { Stock } from '../types/Stock';
import { fetchStockData } from '../utils/stockDataService';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface WatchlistRowProps {
  stock: Stock;
  onDelete: (id: string) => void;
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
}

const WatchlistRow: React.FC<WatchlistRowProps> = ({ stock, onDelete, onSelect, isSelected }) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [dailyChange, setDailyChange] = useState<number | null>(null);
  const [dailyChangePercent, setDailyChangePercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStockData(stock.symbol);
        if (data) {
          setCurrentPrice(data.currentPrice);
          setDailyChange(data.dailyChange);
          setDailyChangePercent(data.dailyChangePercent);
        } else {
          setError('No data found for this stock.');
        }
      } catch (err: any) {
        console.error(`Error fetching data for ${stock.symbol}:`, err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    getStockData();
    const interval = setInterval(getStockData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [stock.symbol]);

  const changeColorClass = dailyChange && dailyChange > 0 ? 'text-green-400' : dailyChange && dailyChange < 0 ? 'text-red-400' : 'text-gray-300';

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-700 transition duration-150 ease-in-out">
      <td className="px-5 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(stock.id, e.target.checked)}
          className="form-checkbox h-4 w-4 text-purple-600 rounded"
        />
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-purple-300 font-medium">{stock.symbol}</td>
      <td className="px-5 py-4 whitespace-nowrap text-gray-200">{stock.companyName}</td>
      <td className="px-5 py-4 whitespace-nowrap">
        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : error ? (
          <span className="text-red-400 text-sm">{error}</span>
        ) : (
          formatCurrency(currentPrice)
        )}
      </td>
      <td className={`px-5 py-4 whitespace-nowrap ${changeColorClass}`}>
        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : (
          formatCurrency(dailyChange)
        )}
      </td>
      <td className={`px-5 py-4 whitespace-nowrap ${changeColorClass}`}>
        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : (
          formatPercentage(dailyChangePercent)
        )}
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-2">
          {stock.tags?.map((tag, index) => (
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
          onClick={() => onDelete(stock.id)}
          className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default WatchlistRow;
