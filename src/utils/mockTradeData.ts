import { Trade, TradeStrategy } from '../types/Trade';

export const mockStrategies: TradeStrategy[] = [
  { id: '1', name: 'Breakout', color: '#39FF14' },
  { id: '2', name: 'Scalping', color: '#FF6B35' },
  { id: '3', name: 'Swing Trade', color: '#00BFFF' },
  { id: '4', name: 'Mean Reversion', color: '#BF00FF' },
  { id: '5', name: 'Momentum', color: '#FFD700' },
  { id: '6', name: 'Gap Fill', color: '#FF1493' },
  { id: '7', name: 'Iron Condor', color: '#32CD32' },
  { id: '8', name: 'Straddle', color: '#FF69B4' },
];

// Generate comprehensive June 2025 trades that match the P&L calendar
const generateJuneTrades = (): Trade[] => {
  const trades: Trade[] = [];
  const momentumStocks = ['HIMZ', 'TSLL', 'OKLO', 'NVDA', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'META', 'AMZN', 'SPY', 'QQQ', 'IWM', 'SMCI', 'PLTR'];
  const strategies = ['Breakout', 'Scalping', 'Momentum', 'Mean Reversion', 'Gap Fill'];
  const timeSlots = [
    { label: 'Pre', hours: [4, 5, 6, 7, 8] },
    { label: '9-11', hours: [9, 10, 11] },
    { label: '12-2', hours: [12, 13, 14] },
    { label: '3-4', hours: [15, 16] },
    { label: 'AH', hours: [17, 18, 19] }
  ];

  let tradeId = 1000;

  // Generate trades for June 1-12, 2025 (WEEKDAYS ONLY)
  for (let day = 1; day <= 12; day++) {
    const date = `2025-06-${day.toString().padStart(2, '0')}`;
    
    // CRITICAL: Check if this is a weekend day and SKIP IT
    const dayOfWeek = new Date(2025, 5, day).getDay(); // 0=Sunday, 6=Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // SKIP ALL WEEKEND DAYS - NO TRADING ON WEEKENDS
    if (isWeekend) {
      console.log(`Skipping ${date} - Weekend (day ${dayOfWeek})`);
      continue;
    }

    const isThursday = dayOfWeek === 4; // June 5 and June 12 are Thursdays

    timeSlots.forEach(slot => {
      const isPremarket = slot.label === 'Pre';
      let basePnL = Math.random() * 600 - 300;
      let baseCount = Math.floor(Math.random() * 6) + 5;

      // Add losing days in first few days
      if (day <= 3) {
        basePnL = Math.random() * 400 - 600;
      }

      // Make Thursdays more profitable
      if (isThursday) {
        basePnL = Math.abs(basePnL) + 400;
        if (slot.label === '9-11' || slot.label === '12-2' || slot.label === '3-4') {
          basePnL += 500;
        }
        baseCount += 3;
      }

      // Make premarket more profitable
      if (isPremarket) {
        basePnL = Math.abs(basePnL) + 200;
        if (isThursday) {
          basePnL += 300;
        }
      }

      // Lower volume for pre/after hours
      if (slot.label === 'Pre' || slot.label === 'AH') {
        baseCount = Math.max(2, Math.floor(baseCount / 2));
      }

      // Generate individual trades for this slot
      for (let i = 0; i < baseCount; i++) {
        const symbol = momentumStocks[Math.floor(Math.random() * momentumStocks.length)];
        const strategy = strategies[Math.floor(Math.random() * strategies.length)];
        const tradePnL = (basePnL / baseCount) + (Math.random() * 100 - 50);
        const hour = slot.hours[Math.floor(Math.random() * slot.hours.length)];
        const minute = Math.floor(Math.random() * 60);
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        const assetType = Math.random() > 0.3 ? (Math.random() > 0.5 ? 'call' : 'put') : 'stock';
        const isOptions = assetType !== 'stock';
        
        const basePrice = Math.random() * 400 + 50; // $50-450 range
        const quantity = isOptions ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 200) + 50;
        const price = isOptions ? Math.random() * 20 + 0.5 : basePrice;
        
        const trade: Trade = {
          id: (tradeId++).toString(),
          symbol,
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          assetType,
          quantity,
          price: Math.round(price * 100) / 100,
          date,
          time,
          strategy,
          notes: `${strategy} trade on ${symbol}. ${isPremarket ? 'Premarket' : isThursday ? 'Thursday' : 'Regular'} session.`,
          pnl: Math.round(tradePnL * 100) / 100,
          tags: [],
          entryPrice: Math.round(price * 100) / 100,
          exitPrice: Math.round((price + (tradePnL / quantity)) * 100) / 100,
          commission: isOptions ? 1.0 : 0.5,
          holdingPeriod: Math.floor(Math.random() * 240) + 5, // 5-245 minutes
          mae: Math.round((tradePnL - Math.abs(tradePnL) * 0.3) * 100) / 100,
          mfe: Math.round((tradePnL + Math.abs(tradePnL) * 0.5) * 100) / 100
        };

        // Add options-specific data
        if (isOptions) {
          const strikePrice = Math.round((basePrice + (Math.random() * 40 - 20)) / 5) * 5; // Round to nearest $5
          const daysToExp = Math.floor(Math.random() * 45) + 1; // 1-45 DTE
          const expirationDate = new Date(2025, 5, day); // Start from trade date
          expirationDate.setDate(expirationDate.getDate() + daysToExp);
          
          trade.strikePrice = strikePrice;
          trade.expirationDate = expirationDate.toISOString().split('T')[0];
          trade.daysToExpiration = daysToExp;
          
          // Greeks
          trade.entryIV = Math.round((Math.random() * 0.8 + 0.1) * 1000) / 1000; // 0.1-0.9
          trade.exitIV = Math.round((trade.entryIV + (Math.random() * 0.2 - 0.1)) * 1000) / 1000;
          trade.entryDelta = Math.round((Math.random() * 0.8 + 0.1) * 1000) / 1000;
          trade.exitDelta = Math.round((trade.entryDelta + (Math.random() * 0.2 - 0.1)) * 1000) / 1000;
          trade.entryGamma = Math.round((Math.random() * 0.05 + 0.005) * 1000) / 1000;
          trade.exitGamma = Math.round((trade.entryGamma + (Math.random() * 0.01 - 0.005)) * 1000) / 1000;
          trade.entryTheta = Math.round((Math.random() * -2 - 0.1) * 1000) / 1000;
          trade.exitTheta = Math.round((trade.entryTheta + (Math.random() * 0.5 - 0.25)) * 1000) / 1000;
          trade.entryVega = Math.round((Math.random() * 0.3 + 0.05) * 1000) / 1000;
          trade.exitVega = Math.round((trade.entryVega + (Math.random() * 0.1 - 0.05)) * 1000) / 1000;
          trade.entryRho = Math.round((Math.random() * 0.2 + 0.01) * 1000) / 1000;
          trade.exitRho = Math.round((trade.entryRho + (Math.random() * 0.05 - 0.025)) * 1000) / 1000;
        }

        trades.push(trade);
      }
    });
  }

  return trades;
};

// Generate the trades
const generatedTrades = generateJuneTrades();

export const mockTrades: Trade[] = [
  // Keep a few original trades for variety (from 2024)
  {
    id: '1',
    symbol: 'AAPL',
    type: 'buy',
    assetType: 'stock',
    quantity: 100,
    price: 189.95,
    date: '2024-01-15',
    time: '09:30',
    strategy: 'Breakout',
    notes: 'Broke above resistance at $188. Strong volume confirmation.',
    pnl: 245.50,
    tags: [],
    entryPrice: 189.95,
    exitPrice: 192.41,
    stopLoss: 185.00,
    takeProfit: 195.00,
    commission: 1.00,
    mae: -125.00,
    mfe: 350.00,
    holdingPeriod: 45
  },
  {
    id: '2',
    symbol: 'TSLA',
    type: 'buy',
    assetType: 'call',
    quantity: 5,
    price: 12.50,
    date: '2024-01-15',
    time: '10:15',
    strategy: 'Momentum',
    notes: 'High IV play on earnings momentum.',
    pnl: -625.00,
    tags: [],
    entryPrice: 12.50,
    exitPrice: 7.25,
    stopLoss: 8.00,
    takeProfit: 18.00,
    commission: 2.50,
    strikePrice: 250,
    expirationDate: '2024-01-19',
    daysToExpiration: 4,
    entryIV: 0.65,
    exitIV: 0.45,
    entryDelta: 0.42,
    exitDelta: 0.18,
    entryGamma: 0.025,
    exitGamma: 0.012,
    entryTheta: -0.85,
    exitTheta: -0.45,
    entryVega: 0.18,
    exitVega: 0.08,
    mae: -750.00,
    mfe: 125.00,
    holdingPeriod: 180
  },
  // Add all the generated June 2025 trades (WEEKDAYS ONLY)
  ...generatedTrades
];