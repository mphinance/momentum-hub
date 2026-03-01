import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Trade, TradeStrategy } from '../types/Trade';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trade: Trade) => void;
  availableStrategies: TradeStrategy[];
}

export default function AddTradeModal({ isOpen, onClose, onAdd, availableStrategies }: AddTradeModalProps) {
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'buy' as 'buy' | 'sell',
    assetType: 'stock' as 'stock' | 'call' | 'put',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    strategy: '',
    notes: '',
    pnl: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    commission: '',
    
    // Options fields
    strikePrice: '',
    expirationDate: '',
    daysToExpiration: '',
    
    // Greeks
    entryIV: '',
    exitIV: '',
    entryDelta: '',
    exitDelta: '',
    entryGamma: '',
    exitGamma: '',
    entryTheta: '',
    exitTheta: '',
    entryVega: '',
    exitVega: '',
    entryRho: '',
    exitRho: '',
    
    // Performance
    mae: '',
    mfe: '',
    holdingPeriod: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: formData.symbol.toUpperCase(),
      type: formData.type,
      assetType: formData.assetType,
      quantity: parseInt(formData.quantity) || 0,
      price: parseFloat(formData.price) || 0,
      date: formData.date,
      time: formData.time,
      strategy: formData.strategy,
      notes: formData.notes,
      pnl: formData.pnl ? parseFloat(formData.pnl) : undefined,
      tags: [],
      entryPrice: formData.entryPrice ? parseFloat(formData.entryPrice) : undefined,
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      commission: formData.commission ? parseFloat(formData.commission) : undefined,
      
      // Options
      strikePrice: formData.strikePrice ? parseFloat(formData.strikePrice) : undefined,
      expirationDate: formData.expirationDate || undefined,
      daysToExpiration: formData.daysToExpiration ? parseInt(formData.daysToExpiration) : undefined,
      
      // Greeks
      entryIV: formData.entryIV ? parseFloat(formData.entryIV) : undefined,
      exitIV: formData.exitIV ? parseFloat(formData.exitIV) : undefined,
      entryDelta: formData.entryDelta ? parseFloat(formData.entryDelta) : undefined,
      exitDelta: formData.exitDelta ? parseFloat(formData.exitDelta) : undefined,
      entryGamma: formData.entryGamma ? parseFloat(formData.entryGamma) : undefined,
      exitGamma: formData.exitGamma ? parseFloat(formData.exitGamma) : undefined,
      entryTheta: formData.entryTheta ? parseFloat(formData.entryTheta) : undefined,
      exitTheta: formData.exitTheta ? parseFloat(formData.exitTheta) : undefined,
      entryVega: formData.entryVega ? parseFloat(formData.entryVega) : undefined,
      exitVega: formData.exitVega ? parseFloat(formData.exitVega) : undefined,
      entryRho: formData.entryRho ? parseFloat(formData.entryRho) : undefined,
      exitRho: formData.exitRho ? parseFloat(formData.exitRho) : undefined,
      
      // Performance
      mae: formData.mae ? parseFloat(formData.mae) : undefined,
      mfe: formData.mfe ? parseFloat(formData.mfe) : undefined,
      holdingPeriod: formData.holdingPeriod ? parseInt(formData.holdingPeriod) : undefined
    };

    onAdd(newTrade);
    
    // Reset form
    setFormData({
      symbol: '',
      type: 'buy',
      assetType: 'stock',
      quantity: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      strategy: '',
      notes: '',
      pnl: '',
      entryPrice: '',
      exitPrice: '',
      stopLoss: '',
      takeProfit: '',
      commission: '',
      strikePrice: '',
      expirationDate: '',
      daysToExpiration: '',
      entryIV: '',
      exitIV: '',
      entryDelta: '',
      exitDelta: '',
      entryGamma: '',
      exitGamma: '',
      entryTheta: '',
      exitTheta: '',
      entryVega: '',
      exitVega: '',
      entryRho: '',
      exitRho: '',
      mae: '',
      mfe: '',
      holdingPeriod: ''
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isOptionsSelected = formData.assetType === 'call' || formData.assetType === 'put';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#2C2C2C] rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#F0F0F0]">Add Trade to Journal</h2>
          <button
            onClick={onClose}
            className="text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Trade Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Symbol *
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="AAPL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Asset Type *
              </label>
              <select
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
              >
                <option value="stock">Stock</option>
                <option value="call">Call Option</option>
                <option value="put">Put Option</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
          </div>

          {/* Options-specific fields */}
          {isOptionsSelected && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#383838] rounded-lg">
              <div>
                <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                  Strike Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="strikePrice"
                  value={formData.strikePrice}
                  onChange={handleChange}
                  required={isOptionsSelected}
                  className="w-full px-3 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                  placeholder="190.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                  Expiration Date *
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  required={isOptionsSelected}
                  className="w-full px-3 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                  Days to Expiration
                </label>
                <input
                  type="number"
                  name="daysToExpiration"
                  value={formData.daysToExpiration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                  placeholder="30"
                />
              </div>
            </div>
          )}

          {/* Trade Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="189.95"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
              />
            </div>
          </div>

          {/* Strategy and P&L */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Strategy *
              </label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
              >
                <option value="">Select Strategy</option>
                {availableStrategies.map((strategy) => (
                  <option key={strategy.id} value={strategy.name}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                P&L
              </label>
              <input
                type="number"
                step="0.01"
                name="pnl"
                value={formData.pnl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="125.50"
              />
            </div>
          </div>

          {/* Entry/Exit Prices */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Entry Price
              </label>
              <input
                type="number"
                step="0.01"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="185.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Exit Price
              </label>
              <input
                type="number"
                step="0.01"
                name="exitPrice"
                value={formData.exitPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="190.25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Stop Loss
              </label>
              <input
                type="number"
                step="0.01"
                name="stopLoss"
                value={formData.stopLoss}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="180.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Take Profit
              </label>
              <input
                type="number"
                step="0.01"
                name="takeProfit"
                value={formData.takeProfit}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="195.00"
              />
            </div>
          </div>

          {/* Greeks Section */}
          {isOptionsSelected && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#F0F0F0] border-b border-[#383838] pb-2">
                Greeks & IV
              </h3>
              
              {/* Entry Greeks */}
              <div>
                <h4 className="text-md font-medium text-[#AAAAAA] mb-2">Entry Greeks</h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      IV
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="entryIV"
                      value={formData.entryIV}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Delta
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="entryDelta"
                      value={formData.entryDelta}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.65"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Gamma
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="entryGamma"
                      value={formData.entryGamma}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Theta
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="entryTheta"
                      value={formData.entryTheta}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="-0.05"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Vega
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="entryVega"
                      value={formData.entryVega}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Rho
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="entryRho"
                      value={formData.entryRho}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.08"
                    />
                  </div>
                </div>
              </div>

              {/* Exit Greeks */}
              <div>
                <h4 className="text-md font-medium text-[#AAAAAA] mb-2">Exit Greeks</h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      IV
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="exitIV"
                      value={formData.exitIV}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.22"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Delta
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="exitDelta"
                      value={formData.exitDelta}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.72"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Gamma
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="exitGamma"
                      value={formData.exitGamma}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Theta
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="exitTheta"
                      value={formData.exitTheta}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="-0.04"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Vega
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="exitVega"
                      value={formData.exitVega}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                      Rho
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      name="exitRho"
                      value={formData.exitRho}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                      placeholder="0.09"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                MAE (Max Adverse)
              </label>
              <input
                type="number"
                step="0.01"
                name="mae"
                value={formData.mae}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="-50.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                MFE (Max Favorable)
              </label>
              <input
                type="number"
                step="0.01"
                name="mfe"
                value={formData.mfe}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="200.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Holding Period (min)
              </label>
              <input
                type="number"
                name="holdingPeriod"
                value={formData.holdingPeriod}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Commission
              </label>
              <input
                type="number"
                step="0.01"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="1.00"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-[#383838] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14] resize-none"
              placeholder="Trade analysis and notes..."
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
              className="flex-1 px-4 py-2 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}