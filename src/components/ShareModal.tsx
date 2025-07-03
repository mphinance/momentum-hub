// src/components/ShareModal.tsx
import React, { useState } from 'react';
import { X, Share2, Copy, Check, Eye, ExternalLink } from 'lucide-react';
import { Stock, WatchlistTag } from '../types/Stock';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  availableTags: WatchlistTag[]; // Added this prop
}

export default function ShareModal({ isOpen, onClose, stocks, availableTags }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includePrices, setIncludePrices] = useState(true);

  const generateShareUrl = async () => {
    setIsGenerating(true);
    
    try {
      // Create a shareable data object
      const shareData = {
        watchlist: stocks.map(stock => ({
          id: stock.id, // Include ID for consistency
          symbol: stock.symbol,
          name: stock.name,
          price: includePrices ? stock.price : undefined,
          change: includePrices ? stock.change : undefined,
          changePercent: includePrices ? stock.changePercent : undefined,
          volume: includePrices ? stock.volume : undefined,
          high: includePrices ? stock.high : undefined,
          low: includePrices ? stock.low : undefined,
          notes: includeNotes ? stock.notes : '',
          tags: stock.tags,
          preMarketPrice: includePrices ? stock.preMarketPrice : undefined,
          preMarketChange: includePrices ? stock.preMarketChange : undefined,
          preMarketChangePercent: includePrices ? stock.preMarketChangePercent : undefined,
        })),
        timestamp: new Date().toISOString(),
        settings: {
          includeNotes,
          includePrices,
          availableTags // Include availableTags here
        }
      };

      // Encode the data directly in the URL (Base64 + URL encoding)
      const jsonString = JSON.stringify(shareData);
      const base64Data = btoa(encodeURIComponent(jsonString));
      
      // Generate the share URL with data embedded
      const baseUrl = window.location.origin;
      const url = `${baseUrl}?shareData=${base64Data}`;
      
      setShareUrl(url);
    } catch (error) {
      console.error('Error generating share URL:', error);
      alert('Error generating share URL. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openInNewTab = () => {
    window.open(shareUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#2C2C2C] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Share2 size={24} className="text-[#39FF14]" />
            <h2 className="text-xl font-bold text-[#F0F0F0]">Share Watchlist</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Share Options */}
          <div className="bg-[#383838] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">Share Options</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeNotes"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="w-4 h-4 text-[#39FF14] bg-[#2C2C2C] border-[#4A4A4A] rounded focus:ring-[#39FF14]"
                />
                <label htmlFor="includeNotes" className="text-sm text-[#F0F0F0]">
                  Include trading notes
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includePrices"
                  checked={includePrices}
                  onChange={(e) => setIncludePrices(e.target.checked)}
                  className="w-4 h-4 text-[#39FF14] bg-[#2C2C2C] border-[#4A4A4A] rounded focus:ring-[#39FF14]"
                />
                <label htmlFor="includePrices" className="text-sm text-[#F0F0F0]">
                  Include current prices and market data
                </label>
              </div>
            </div>
          </div>

          {/* Watchlist Preview */}
          <div className="bg-[#383838] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">Watchlist Preview</h3>
            <div className="text-sm text-[#AAAAAA] mb-3">
              {stocks.length} stocks will be shared
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {stocks.slice(0, 5).map((stock) => (
                <div key={stock.id} className="flex items-center justify-between p-2 bg-[#2C2C2C] rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#F0F0F0]">{stock.symbol}</span>
                    <span className="text-xs text-[#AAAAAA] truncate max-w-[150px]">{stock.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {stock.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-[#4A4A4A] text-[#F0F0F0] rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {stocks.length > 5 && (
                <div className="text-xs text-[#AAAAAA] text-center py-2">
                  ... and {stocks.length - 5} more stocks
                </div>
              )}
            </div>
          </div>

          {/* Generate Share URL */}
          {!shareUrl ? (
            <button
              onClick={generateShareUrl}
              disabled={isGenerating}
              className="w-full px-4 py-3 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              {isGenerating ? 'Generating Share URL...' : 'Generate Share URL'}
            </button>
          ) : (
            <div className="space-y-4">
              {/* Share URL Display */}
              <div className="bg-[#383838] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#F0F0F0] mb-3">Share URL Generated</h3>
                <div className="flex items-center gap-2 p-3 bg-[#2C2C2C] rounded border border-[#4A4A4A]">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent text-[#F0F0F0] text-sm focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-[#39FF14] text-[#1A1A1A] rounded text-sm hover:bg-[#33E60C] transition-colors flex items-center gap-1"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={openInNewTab}
                  className="flex-1 px-4 py-2 bg-[#BF00FF] text-[#F0F0F0] rounded font-medium hover:bg-[#A000E6] transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
                  Preview
                </button>
                <button
                  onClick={() => {
                    setShareUrl('');
                    setCopied(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#383838] text-[#AAAAAA] rounded hover:bg-[#4A4A4A] transition-colors"
                >
                  Generate New
                </button>
              </div>

              {/* Share Instructions */}
              <div className="bg-[#383838] rounded-lg p-4 border border-[#4A4A4A]">
                <div className="flex items-start gap-2">
                  <Eye size={16} className="text-[#39FF14] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-[#AAAAAA]">
                    <p className="font-medium text-[#F0F0F0] mb-1">Share Instructions:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Anyone with this URL can view your watchlist</li>
                      <li>• The shared watchlist is read-only (view only)</li>
                      <li>• {includeNotes ? 'Trading notes are included' : 'Trading notes are excluded'}</li>
                      <li>• {includePrices ? 'Current prices and market data are included' : 'Prices and market data are excluded'}</li>
                      <li>• The URL contains all data and works on any device/browser</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#383838] text-[#AAAAAA] rounded hover:bg-[#4A4A4A] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
