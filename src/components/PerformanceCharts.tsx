import React, { useState } from 'react';
import { BarChart3, Clock, TrendingUp, Target, DollarSign, Calendar, Activity, Zap, Timer } from 'lucide-react';
import { Trade } from '../types/Trade';

interface PerformanceChartsProps {
  trades: Trade[];
}

export default function PerformanceCharts({ trades }: PerformanceChartsProps) {
  const [showPnLCalendar, setShowPnLCalendar] = useState(false);

  // Calculate performance metrics from REAL trade data
  const calculateMetrics = () => {
    const metrics = {
      tradesByHour: {} as { [hour: number]: { count: number; pnl: number; wins: number } },
      tradesByAssetType: { stock: { count: 0, pnl: 0, wins: 0 }, call: { count: 0, pnl: 0, wins: 0 }, put: { count: 0, pnl: 0, wins: 0 } },
      tradesByIV: {} as { [range: string]: { count: number; pnl: number; wins: number } },
      tradesByDTE: {} as { [range: string]: { count: number; pnl: number; wins: number } },
      tradesByPrice: {} as { [range: string]: { count: number; pnl: number; wins: number } },
      tradesByStrategy: {} as { [strategy: string]: { count: number; pnl: number; wins: number } },
      tradesByDayOfWeek: {} as { [day: string]: { count: number; pnl: number; wins: number } },
      tradesByPeriodHeld: {} as { [range: string]: { count: number; pnl: number; wins: number } }
    };

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    trades.forEach(trade => {
      const hour = parseInt(trade.time.split(':')[0]);
      const pnl = trade.pnl || 0;
      const isWin = pnl > 0;
      
      // CRITICAL FIX: Parse the date correctly to get the right day of week
      const [year, month, day] = trade.date.split('-').map(Number);
      const tradeDate = new Date(year, month - 1, day); // month is 0-indexed
      const dayOfWeek = dayNames[tradeDate.getDay()];

      // SKIP WEEKEND TRADES - This should never happen but double-check
      if (dayOfWeek === 'Sunday' || dayOfWeek === 'Saturday') {
        console.warn(`WARNING: Found weekend trade on ${trade.date} (${dayOfWeek}) - this should not exist!`);
        return; // Skip this trade
      }

      // By hour
      if (!metrics.tradesByHour[hour]) {
        metrics.tradesByHour[hour] = { count: 0, pnl: 0, wins: 0 };
      }
      metrics.tradesByHour[hour].count++;
      metrics.tradesByHour[hour].pnl += pnl;
      if (isWin) metrics.tradesByHour[hour].wins++;

      // By asset type
      metrics.tradesByAssetType[trade.assetType].count++;
      metrics.tradesByAssetType[trade.assetType].pnl += pnl;
      if (isWin) metrics.tradesByAssetType[trade.assetType].wins++;

      // By day of week (ONLY WEEKDAYS)
      if (!metrics.tradesByDayOfWeek[dayOfWeek]) {
        metrics.tradesByDayOfWeek[dayOfWeek] = { count: 0, pnl: 0, wins: 0 };
      }
      metrics.tradesByDayOfWeek[dayOfWeek].count++;
      metrics.tradesByDayOfWeek[dayOfWeek].pnl += pnl;
      if (isWin) metrics.tradesByDayOfWeek[dayOfWeek].wins++;

      // By period held
      if (trade.holdingPeriod) {
        const minutes = trade.holdingPeriod;
        let periodRange = '';
        if (minutes < 5) periodRange = '0-5 min';
        else if (minutes < 15) periodRange = '5-15 min';
        else if (minutes < 60) periodRange = '15-60 min';
        else if (minutes < 240) periodRange = '1-4 hours';
        else if (minutes < 1440) periodRange = '4-24 hours';
        else periodRange = '1+ days';

        if (!metrics.tradesByPeriodHeld[periodRange]) {
          metrics.tradesByPeriodHeld[periodRange] = { count: 0, pnl: 0, wins: 0 };
        }
        metrics.tradesByPeriodHeld[periodRange].count++;
        metrics.tradesByPeriodHeld[periodRange].pnl += pnl;
        if (isWin) metrics.tradesByPeriodHeld[periodRange].wins++;
      }

      // By IV (for options)
      if (trade.entryIV && (trade.assetType === 'call' || trade.assetType === 'put')) {
        const ivPercent = trade.entryIV * 100;
        let ivRange = '';
        if (ivPercent < 20) ivRange = '0-20%';
        else if (ivPercent < 40) ivRange = '20-40%';
        else if (ivPercent < 60) ivRange = '40-60%';
        else if (ivPercent < 80) ivRange = '60-80%';
        else ivRange = '80%+';

        if (!metrics.tradesByIV[ivRange]) {
          metrics.tradesByIV[ivRange] = { count: 0, pnl: 0, wins: 0 };
        }
        metrics.tradesByIV[ivRange].count++;
        metrics.tradesByIV[ivRange].pnl += pnl;
        if (isWin) metrics.tradesByIV[ivRange].wins++;
      }

      // By DTE (for options)
      if (trade.daysToExpiration !== undefined && (trade.assetType === 'call' || trade.assetType === 'put')) {
        const dte = trade.daysToExpiration;
        let dteRange = '';
        if (dte === 0) dteRange = '0DTE';
        else if (dte <= 7) dteRange = '1-7 days';
        else if (dte <= 30) dteRange = '8-30 days';
        else if (dte <= 60) dteRange = '31-60 days';
        else dteRange = '60+ days';

        if (!metrics.tradesByDTE[dteRange]) {
          metrics.tradesByDTE[dteRange] = { count: 0, pnl: 0, wins: 0 };
        }
        metrics.tradesByDTE[dteRange].count++;
        metrics.tradesByDTE[dteRange].pnl += pnl;
        if (isWin) metrics.tradesByDTE[dteRange].wins++;
      }

      // By price range
      let priceRange = '';
      if (trade.price < 50) priceRange = '$0-50';
      else if (trade.price < 100) priceRange = '$50-100';
      else if (trade.price < 200) priceRange = '$100-200';
      else if (trade.price < 500) priceRange = '$200-500';
      else priceRange = '$500+';

      if (!metrics.tradesByPrice[priceRange]) {
        metrics.tradesByPrice[priceRange] = { count: 0, pnl: 0, wins: 0 };
      }
      metrics.tradesByPrice[priceRange].count++;
      metrics.tradesByPrice[priceRange].pnl += pnl;
      if (isWin) metrics.tradesByPrice[priceRange].wins++;

      // By strategy
      if (!metrics.tradesByStrategy[trade.strategy]) {
        metrics.tradesByStrategy[trade.strategy] = { count: 0, pnl: 0, wins: 0 };
      }
      metrics.tradesByStrategy[trade.strategy].count++;
      metrics.tradesByStrategy[trade.strategy].pnl += pnl;
      if (isWin) metrics.tradesByStrategy[trade.strategy].wins++;
    });

    return metrics;
  };

  // Calculate real trade data from actual trades
  const calculateRealTradeData = () => {
    const tradesByDate: { [date: string]: { [timeSlot: string]: { pnl: number; count: number; trades: Trade[] } } } = {};
    
    // Initialize time slots
    const timeSlots = ['Pre', '9-11', '12-2', '3-4', 'AH'];
    
    // Process all trades
    trades.forEach(trade => {
      const date = trade.date;
      const hour = parseInt(trade.time.split(':')[0]);
      const pnl = trade.pnl || 0;
      
      // SKIP WEEKEND TRADES
      const [year, month, day] = date.split('-').map(Number);
      const tradeDate = new Date(year, month - 1, day);
      const dayOfWeek = tradeDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.warn(`WARNING: Skipping weekend trade on ${date}`);
        return;
      }
      
      // Determine time slot
      let timeSlot = '';
      if (hour >= 4 && hour <= 8) timeSlot = 'Pre';
      else if (hour >= 9 && hour <= 11) timeSlot = '9-11';
      else if (hour >= 12 && hour <= 14) timeSlot = '12-2';
      else if (hour >= 15 && hour <= 16) timeSlot = '3-4';
      else if (hour >= 17 && hour <= 19) timeSlot = 'AH';
      else return; // Skip trades outside these hours
      
      // Initialize date if not exists
      if (!tradesByDate[date]) {
        tradesByDate[date] = {};
        timeSlots.forEach(slot => {
          tradesByDate[date][slot] = { pnl: 0, count: 0, trades: [] };
        });
      }
      
      // Add trade to appropriate slot
      tradesByDate[date][timeSlot].pnl += pnl;
      tradesByDate[date][timeSlot].count++;
      tradesByDate[date][timeSlot].trades.push(trade);
    });
    
    return tradesByDate;
  };

  // Generate comprehensive weekly heatmap data from real trades
  const generateWeeklyHeatmapData = () => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['Pre', '9-11', '12-2', '3-4', 'AH'];
    
    const heatmapData: { [slot: string]: { [day: string]: { pnl: number; count: number } } } = {};
    
    // Initialize structure
    timeSlots.forEach(slot => {
      heatmapData[slot] = {};
      dayNames.forEach(day => {
        heatmapData[slot][day] = { pnl: 0, count: 0 };
      });
    });
    
    // Get real trade data
    const realTradeData = calculateRealTradeData();
    
    // Aggregate all June 2025 weekday trades by day of week
    Object.keys(realTradeData).forEach(date => {
      if (!date.startsWith('2025-06')) return;
      
      const [year, month, day] = date.split('-').map(Number);
      const dayOfWeek = new Date(year, month - 1, day).getDay(); // 0=Sunday, 1=Monday, etc.
      if (dayOfWeek === 0 || dayOfWeek === 6) return; // Skip weekends
      
      const dayName = dayNames[dayOfWeek - 1]; // Convert to Monday=0, Tuesday=1, etc.
      
      timeSlots.forEach(slot => {
        if (realTradeData[date][slot]) {
          heatmapData[slot][dayName].pnl += realTradeData[date][slot].pnl;
          heatmapData[slot][dayName].count += realTradeData[date][slot].count;
        }
      });
    });

    return heatmapData;
  };

  const metrics = calculateMetrics();
  const weeklyHeatmapData = generateWeeklyHeatmapData();
  const realTradeData = calculateRealTradeData();

  // Calculate heatmap color intensity
  const getHeatmapColor = (pnl: number, maxAbsPnL: number) => {
    if (pnl === 0) return '#383838';
    
    const intensity = Math.min(Math.abs(pnl) / maxAbsPnL, 1);
    
    if (pnl > 0) {
      return `rgba(57, 255, 20, ${intensity * 0.7 + 0.1})`; // Green for profits
    } else {
      return `rgba(191, 0, 255, ${intensity * 0.7 + 0.1})`; // Purple for losses
    }
  };

  const WeeklyHeatmap = () => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['Pre', '9-11', '12-2', '3-4', 'AH'];
    
    // Find max absolute P&L for color scaling
    const allPnLValues = Object.values(weeklyHeatmapData).flatMap(slotData => 
      Object.values(slotData).map(dayData => Math.abs(dayData.pnl))
    );
    const maxAbsPnL = Math.max(...allPnLValues, 1); // Ensure at least 1 to avoid division by 0

    return (
      <div className="bg-[#2C2C2C] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-[#BF00FF]" />
          <h3 className="text-lg font-semibold text-[#F0F0F0]">Weekly P&L Heatmap (All June 2025 Weekdays)</h3>
        </div>
        
        {/* Day headers */}
        <div className="flex items-center gap-1 mb-2">
          <div className="w-12"></div>
          {dayNames.map(day => (
            <div key={day} className="flex-1 text-center text-xs text-[#AAAAAA] font-medium">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>
        
        {/* Time slots with data */}
        <div className="space-y-1">
          {timeSlots.map(slot => (
            <div key={slot} className="flex items-center gap-1">
              <div className="w-12 text-xs text-[#AAAAAA] font-medium text-right">
                {slot}
              </div>
              {dayNames.map(day => {
                const data = weeklyHeatmapData[slot]?.[day];
                const pnl = data?.pnl || 0;
                const count = data?.count || 0;
                
                return (
                  <div
                    key={`${slot}-${day}`}
                    className="flex-1 h-8 rounded text-xs flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-[#39FF14] transition-all relative group"
                    style={{ backgroundColor: getHeatmapColor(pnl, maxAbsPnL) }}
                    title={`${day} ${slot}: $${pnl.toFixed(2)} (${count} trades)`}
                  >
                    <div className={`font-medium text-xs ${Math.abs(pnl) > maxAbsPnL * 0.4 ? 'text-[#1A1A1A]' : 'text-[#F0F0F0]'}`}>
                      ${Math.abs(pnl) >= 100 ? Math.round(pnl) : pnl.toFixed(0)}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1A1A] text-[#F0F0F0] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {day} {slot}<br/>
                      P&L: ${pnl.toFixed(2)}<br/>
                      Trades: {count}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#383838]">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#AAAAAA]">P&L:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(191, 0, 255, 0.6)' }}></div>
              <span className="text-xs text-[#AAAAAA]">Loss</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(57, 255, 20, 0.6)' }}></div>
              <span className="text-xs text-[#AAAAAA]">Profit</span>
            </div>
          </div>
          <div className="text-xs text-[#AAAAAA]">
            Pre = 4-9 AM • AH = 4-7 PM
          </div>
        </div>
      </div>
    );
  };

  const MonthlyCalendar = () => {
    const monthName = 'June 2025';
    
    // CORRECT: Calculate June 1, 2025 day of week properly
    // June 1, 2025 is actually a SUNDAY (0)
    const june1_2025 = new Date(2025, 5, 1); // Month is 0-indexed, so 5 = June
    const firstDayOfWeek = june1_2025.getDay(); // This should be 0 (Sunday)
    const daysInMonth = 30;
    
    const getDayTotalPnL = (date: string) => {
      if (!realTradeData[date]) return 0;
      return Object.values(realTradeData[date]).reduce((sum, slot) => sum + slot.pnl, 0);
    };

    const getDayTotalTrades = (date: string) => {
      if (!realTradeData[date]) return 0;
      return Object.values(realTradeData[date]).reduce((sum, slot) => sum + slot.count, 0);
    };

    // Get all June dates that have trades
    const juneDates = Object.keys(realTradeData).filter(date => date.startsWith('2025-06')).sort();
    
    // Find max absolute P&L for color scaling across the entire month
    const allMonthlyPnL = juneDates.map(date => Math.abs(getDayTotalPnL(date)));
    const maxMonthlyPnL = Math.max(...allMonthlyPnL, 1); // Ensure at least 1

    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    // Since June 1, 2025 is Sunday (0), we don't need any empty cells at the start
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days 1-30
    for (let day = 1; day <= 30; day++) {
      const date = `2025-06-${day.toString().padStart(2, '0')}`;
      
      // Calculate day of week for this specific date
      const currentDate = new Date(2025, 5, day); // June is month 5 (0-indexed)
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const totalPnL = getDayTotalPnL(date);
      const totalTrades = getDayTotalTrades(date);
      const isFuture = day > 12; // Only through June 12
      
      calendarDays.push({
        day,
        date,
        isWeekend,
        totalPnL,
        totalTrades,
        data: realTradeData[date] || {},
        isFuture
      });
    }

    // Calculate average daily P&L based on actual trading days only
    const tradingDays = juneDates.filter(date => {
      const [year, month, day] = date.split('-').map(Number);
      const dayOfWeek = new Date(year, month - 1, day).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6; // Exclude weekends
    });
    const avgDailyPnL = tradingDays.length > 0 ? 
      tradingDays.reduce((sum, date) => sum + getDayTotalPnL(date), 0) / tradingDays.length : 0;

    return (
      <div className="bg-[#2C2C2C] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-[#BF00FF]" />
            <h3 className="text-lg font-semibold text-[#F0F0F0]">{monthName} P&L Calendar</h3>
          </div>
          <div className="text-xs text-[#AAAAAA]">
            Total Month P&L: ${juneDates.reduce((sum, date) => sum + getDayTotalPnL(date), 0).toFixed(2)}
          </div>
        </div>
        
        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-[#AAAAAA] font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayData, index) => {
            if (!dayData) {
              return <div key={index} className="h-16"></div>;
            }
            
            const { day, date, isWeekend, totalPnL, totalTrades, isFuture } = dayData;
            let bgColor = '#383838'; // Default for future dates
            
            if (isFuture) {
              bgColor = isWeekend ? '#1A1A1A' : '#383838';
            } else {
              bgColor = isWeekend ? '#1A1A1A' : getHeatmapColor(totalPnL, maxMonthlyPnL);
            }
            
            return (
              <div
                key={date}
                className={`h-16 rounded border border-[#383838] p-1 relative ${
                  isFuture ? 'opacity-50' : 'cursor-pointer hover:ring-1 hover:ring-[#39FF14] transition-all group'
                }`}
                style={{ backgroundColor: bgColor }}
                title={isFuture ? `${date}: Future date` : `${date}: $${totalPnL.toFixed(2)} (${totalTrades} trades)`}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-xs font-medium ${
                    isFuture ? 'text-[#666666]' :
                    isWeekend ? 'text-[#666666]' : 
                    Math.abs(totalPnL) > maxMonthlyPnL * 0.3 ? 'text-[#1A1A1A]' : 'text-[#F0F0F0]'
                  }`}>
                    {day}
                  </div>
                  {!isWeekend && !isFuture && (
                    <div className="flex-1 flex flex-col justify-center">
                      <div className={`text-xs font-bold ${
                        Math.abs(totalPnL) > maxMonthlyPnL * 0.3 ? 'text-[#1A1A1A]' : 'text-[#F0F0F0]'
                      }`}>
                        ${totalPnL >= 0 ? '+' : ''}${Math.round(totalPnL)}
                      </div>
                      <div className={`text-xs ${
                        Math.abs(totalPnL) > maxMonthlyPnL * 0.3 ? 'text-[#1A1A1A]' : 'text-[#AAAAAA]'
                      }`}>
                        {totalTrades}t
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Detailed tooltip - only for past dates */}
                {!isFuture && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#1A1A1A] text-[#F0F0F0] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#383838]">
                    <div className="font-medium">{date}</div>
                    <div>Total P&L: ${totalPnL.toFixed(2)}</div>
                    <div>Total Trades: {totalTrades}</div>
                    {!isWeekend && dayData.data && Object.keys(dayData.data).length > 0 && (
                      <div className="mt-1 pt-1 border-t border-[#383838]">
                        {Object.entries(dayData.data).map(([slot, data]: [string, any]) => (
                          <div key={slot} className="flex justify-between gap-2">
                            <span>{slot}:</span>
                            <span>${data.pnl.toFixed(0)} ({data.count}t)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Monthly stats */}
        <div className="mt-4 pt-4 border-t border-[#383838] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="text-center">
            <div className="text-[#AAAAAA]">Best Day</div>
            <div className="text-[#39FF14] font-medium">
              ${juneDates.length > 0 ? Math.max(...juneDates.map(date => getDayTotalPnL(date))).toFixed(2) : '0.00'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[#AAAAAA]">Worst Day</div>
            <div className="text-[#BF00FF] font-medium">
              ${juneDates.length > 0 ? Math.min(...juneDates.map(date => getDayTotalPnL(date))).toFixed(2) : '0.00'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[#AAAAAA]">Avg Daily P&L</div>
            <div className="text-[#F0F0F0] font-medium">
              ${avgDailyPnL.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[#AAAAAA]">Total Trades</div>
            <div className="text-[#F0F0F0] font-medium">
              {juneDates.reduce((sum, date) => sum + getDayTotalTrades(date), 0)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BarChart = ({ 
    data, 
    title, 
    icon: Icon, 
    valueKey = 'count',
    showWinRate = false 
  }: { 
    data: any; 
    title: string; 
    icon: any; 
    valueKey?: string;
    showWinRate?: boolean;
  }) => {
    const entries = Object.entries(data);
    if (entries.length === 0) return null;

    const maxValue = Math.max(...entries.map(([_, value]: [string, any]) => 
      valueKey === 'pnl' ? Math.abs(value[valueKey]) : value[valueKey]
    ));

    return (
      <div className="bg-[#2C2C2C] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={20} className="text-[#39FF14]" />
          <h3 className="text-lg font-semibold text-[#F0F0F0]">{title}</h3>
        </div>
        <div className="space-y-3">
          {entries.map(([key, value]: [string, any]) => {
            const barValue = valueKey === 'pnl' ? Math.abs(value[valueKey]) : value[valueKey];
            const percentage = maxValue > 0 ? (barValue / maxValue) * 100 : 0;
            const winRate = value.count > 0 ? (value.wins / value.count) * 100 : 0;
            const isPnlNegative = valueKey === 'pnl' && value[valueKey] < 0;

            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#AAAAAA]">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F0F0F0] font-mono">
                      {valueKey === 'pnl' 
                        ? `$${value[valueKey].toFixed(2)} (${value.count})`
                        : value[valueKey]
                      }
                    </span>
                    {showWinRate && (
                      <span className="text-xs text-[#AAAAAA]">
                        {winRate.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-[#383838] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isPnlNegative ? 'bg-[#BF00FF]' : 'bg-[#39FF14]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ChartSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-[#383838] pb-3">
        <Icon size={24} className="text-[#BF00FF]" />
        <h3 className="text-xl font-bold text-[#F0F0F0]">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-[#383838] rounded-lg p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={24} className="text-[#BF00FF]" />
          <h2 className="text-xl font-bold text-[#F0F0F0]">Performance Analytics</h2>
        </div>
        <button
          onClick={() => setShowPnLCalendar(!showPnLCalendar)}
          className="px-4 py-2 bg-[#BF00FF] text-[#F0F0F0] rounded font-medium hover:bg-[#A000E6] transition-colors"
        >
          P&L Calendar
        </button>
      </div>

      {/* P&L Calendar Section */}
      {showPnLCalendar && (
        <div className="space-y-6">
          <WeeklyHeatmap />
          <MonthlyCalendar />
        </div>
      )}

      {/* Asset Type Summary */}
      <div className="bg-[#2C2C2C] rounded-lg p-4">
        <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">Asset Type Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(metrics.tradesByAssetType).map(([assetType, data]) => {
            const winRate = data.count > 0 ? (data.wins / data.count) * 100 : 0;
            const avgPnL = data.count > 0 ? data.pnl / data.count : 0;
            const color = assetType === 'call' ? '#39FF14' : assetType === 'put' ? '#BF00FF' : '#F0F0F0';
            
            return (
              <div key={assetType} className="text-center p-4 bg-[#383838] rounded-lg">
                <div className="text-2xl font-bold mb-2" style={{ color }}>
                  {data.count}
                </div>
                <div className="text-sm text-[#AAAAAA] mb-2 capitalize">{assetType}s</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#AAAAAA]">Win Rate:</span>
                    <span className="text-[#F0F0F0]">{winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAAAAA]">Total P&L:</span>
                    <span className={data.pnl >= 0 ? 'text-[#39FF14]' : 'text-[#BF00FF]'}>
                      ${data.pnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAAAAA]">Avg P&L:</span>
                    <span className={avgPnL >= 0 ? 'text-[#39FF14]' : 'text-[#BF00FF]'}>
                      ${avgPnL.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📅 TIME-BASED ANALYTICS */}
      <ChartSection title="Time-Based Analytics" icon={Clock}>
        <BarChart
          data={metrics.tradesByDayOfWeek}
          title="Trades by Day of Week"
          icon={Calendar}
          showWinRate={true}
        />
        <BarChart
          data={metrics.tradesByDayOfWeek}
          title="P&L by Day of Week"
          icon={Calendar}
          valueKey="pnl"
        />
        <BarChart
          data={metrics.tradesByHour}
          title="Trades by Hour"
          icon={Clock}
          showWinRate={true}
        />
        <BarChart
          data={metrics.tradesByHour}
          title="P&L by Hour"
          icon={Clock}
          valueKey="pnl"
        />
        <BarChart
          data={metrics.tradesByPeriodHeld}
          title="Trades by Holding Period"
          icon={Timer}
          showWinRate={true}
        />
        <BarChart
          data={metrics.tradesByPeriodHeld}
          title="P&L by Holding Period"
          icon={Timer}
          valueKey="pnl"
        />
      </ChartSection>

      {/* 📊 STRATEGY & PRICE ANALYTICS */}
      <ChartSection title="Strategy & Price Analytics" icon={Target}>
        <BarChart
          data={metrics.tradesByStrategy}
          title="Trades by Strategy"
          icon={Target}
          showWinRate={true}
        />
        <BarChart
          data={metrics.tradesByStrategy}
          title="P&L by Strategy"
          icon={Target}
          valueKey="pnl"
        />
        <BarChart
          data={metrics.tradesByPrice}
          title="Trades by Price Range"
          icon={DollarSign}
          showWinRate={true}
        />
        <BarChart
          data={metrics.tradesByPrice}
          title="P&L by Price Range"
          icon={DollarSign}
          valueKey="pnl"
        />
      </ChartSection>

      {/* ⚡ OPTIONS ANALYTICS */}
      {(Object.keys(metrics.tradesByIV).length > 0 || Object.keys(metrics.tradesByDTE).length > 0) && (
        <ChartSection title="Options Analytics" icon={Zap}>
          {Object.keys(metrics.tradesByIV).length > 0 && (
            <>
              <BarChart
                data={metrics.tradesByIV}
                title="Trades by IV Range"
                icon={Activity}
                showWinRate={true}
              />
              <BarChart
                data={metrics.tradesByIV}
                title="P&L by IV Range"
                icon={Activity}
                valueKey="pnl"
              />
            </>
          )}
          {Object.keys(metrics.tradesByDTE).length > 0 && (
            <>
              <BarChart
                data={metrics.tradesByDTE}
                title="Trades by Days to Expiration"
                icon={Calendar}
                showWinRate={true}
              />
              <BarChart
                data={metrics.tradesByDTE}
                title="P&L by Days to Expiration"
                icon={Calendar}
                valueKey="pnl"
              />
            </>
          )}
        </ChartSection>
      )}

      {/* 🎯 ASSET TYPE WIN RATES */}
      <div className="bg-[#2C2C2C] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-[#39FF14]" />
          <h3 className="text-lg font-semibold text-[#F0F0F0]">Win Rate by Asset Type</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(metrics.tradesByAssetType).map(([assetType, data]) => {
            const winRate = data.count > 0 ? (data.wins / data.count) * 100 : 0;
            const color = assetType === 'call' ? '#39FF14' : assetType === 'put' ? '#BF00FF' : '#F0F0F0';
            
            return (
              <div key={assetType} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#AAAAAA] capitalize">{assetType}s</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#F0F0F0] font-mono">{winRate.toFixed(1)}%</span>
                    <span className="text-xs text-[#AAAAAA]">({data.wins}/{data.count})</span>
                  </div>
                </div>
                <div className="w-full bg-[#383838] rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${winRate}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}