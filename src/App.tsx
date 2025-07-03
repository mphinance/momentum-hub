import React, { useState, useEffect } from 'react';
import Watchlist from './components/Watchlist';
import TradingJournal from './components/TradingJournal';
import SharedWatchlistView from './components/SharedWatchlistView';

function App() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'journal'>('watchlist');
  const [sharedWatchlistData, setSharedWatchlistData] = useState<any>(null);

  useEffect(() => {
    // Check if this is a shared watchlist URL
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('shareData');
    
    if (shareData) {
      try {
        // Decode the shared data from the URL
        const jsonString = decodeURIComponent(atob(shareData));
        const data = JSON.parse(jsonString);
        setSharedWatchlistData(data);
      } catch (error) {
        console.error('Error loading shared watchlist:', error);
        // Show error message to user
        alert('Invalid share link. The shared watchlist data could not be loaded.');
      }
    }
  }, []);

  // If this is a shared watchlist, show the shared view
  if (sharedWatchlistData) {
    return <SharedWatchlistView watchlistData={sharedWatchlistData} />;
  }

  // Regular app view
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#F0F0F0]">
      <div className="container mx-auto px-4 py-6">
        <header className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg p-2">
            <img 
              src="/MPH_white.png" 
              alt="MPH Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#F0F0F0]">mphinance Daily Dashboard</h1>
            <p className="text-[#AAAAAA] text-sm">Real-time market monitoring and trading analysis</p>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-[#39FF14] text-[#1A1A1A]'
                : 'bg-[#2C2C2C] text-[#AAAAAA] hover:text-[#F0F0F0] hover:bg-[#383838]'
            }`}
          >
            Watchlist
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors border ${
              activeTab === 'journal'
                ? 'bg-[#BF00FF] text-[#F0F0F0] border-[#BF00FF]'
                : 'bg-[#2C2C2C] text-[#AAAAAA] hover:text-[#F0F0F0] hover:bg-[#383838] border-[#BF00FF] border-opacity-30'
            }`}
          >
            Trading Journal
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === 'watchlist' && (
            <>
              <Watchlist />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#2C2C2C] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">Portfolio</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#AAAAAA]">Total Value</span>
                      <span className="text-[#F0F0F0] font-mono font-bold">$127,432.89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#AAAAAA]">Day P&L</span>
                      <span className="text-[#39FF14] font-mono">+$2,847.12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#AAAAAA]">Day P&L %</span>
                      <span className="text-[#39FF14] font-mono">+2.28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#AAAAAA]">Buying Power</span>
                      <span className="text-[#AAAAAA] font-mono">$23,156.78</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2C2C2C] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">API Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#AAAAAA]">Polygon API</span>
                      <span className="text-[#39FF14] font-medium">✓ Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#AAAAAA]">Real-time Data</span>
                      <span className="text-[#39FF14] font-medium">✓ Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#AAAAAA]">Market Status</span>
                      <span className="text-[#FFD700] font-medium">Pre-Market</span>
                    </div>
                    <div className="text-xs text-[#AAAAAA] mt-2">
                      Live market data from Polygon.io
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'journal' && <TradingJournal />}
        </div>
      </div>
    </div>
  );
}

export default App;