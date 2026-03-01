import React, { useState } from 'react';
import { Settings, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

export default function WebullSettings() {
  const [settings, setSettings] = useState({
    webullUsername: '',
    webullPassword: '',
    webullPin: '',
    autoSync: false,
    syncInterval: '5',
    lastSync: null as Date | null
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection attempt
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setSettings(prev => ({ ...prev, lastSync: new Date() }));
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSettings(prev => ({ ...prev, lastSync: null }));
  };

  return (
    <div className="bg-[#383838] rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings size={24} className="text-[#BF00FF]" />
        <h2 className="text-xl font-bold text-[#F0F0F0]">Webull Integration</h2>
        <a
          href="https://www.tradesviz.com/blog/auto-import-webull/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-[#39FF14] hover:text-[#33E60C] transition-colors text-sm"
        >
          Setup Guide <ExternalLink size={14} />
        </a>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-lg border ${
        isConnected 
          ? 'bg-[#39FF14] bg-opacity-10 border-[#39FF14]' 
          : 'bg-[#BF00FF] bg-opacity-10 border-[#BF00FF]'
      }`}>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle size={20} className="text-[#39FF14]" />
          ) : (
            <AlertCircle size={20} className="text-[#BF00FF]" />
          )}
          <span className={`font-medium ${
            isConnected ? 'text-[#39FF14]' : 'text-[#BF00FF]'
          }`}>
            {isConnected ? 'Connected to Webull' : 'Not Connected'}
          </span>
        </div>
        {settings.lastSync && (
          <div className="text-sm text-[#AAAAAA] mt-1">
            Last sync: {settings.lastSync.toLocaleString()}
          </div>
        )}
      </div>

      {/* Important Notice */}
      <div className="bg-[#2C2C2C] p-4 rounded-lg border border-[#4A4A4A]">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-[#FFD700] mt-0.5 flex-shrink-0" />
          <div className="text-sm text-[#AAAAAA]">
            <p className="font-medium text-[#F0F0F0] mb-1">Important Notes:</p>
            <ul className="space-y-1 text-xs">
              <li>• Only live trades can be synced from Webull</li>
              <li>• Historical trades cannot be imported automatically</li>
              <li>• Manual entry is required for past trades</li>
              <li>• Connection requires your Webull login credentials</li>
            </ul>
          </div>
        </div>
      </div>

      {!isConnected ? (
        /* Connection Form */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Webull Username *
              </label>
              <input
                type="text"
                name="webullUsername"
                value={settings.webullUsername}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="your_username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Webull Password *
              </label>
              <input
                type="password"
                name="webullPassword"
                value={settings.webullPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Trading PIN *
              </label>
              <input
                type="password"
                name="webullPin"
                value={settings.webullPin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
                placeholder="••••"
                maxLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#AAAAAA] mb-1">
                Sync Interval (minutes)
              </label>
              <select
                name="syncInterval"
                value={settings.syncInterval}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#2C2C2C] border border-[#4A4A4A] rounded text-[#F0F0F0] focus:outline-none focus:border-[#39FF14]"
              >
                <option value="1">1 minute</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoSync"
              name="autoSync"
              checked={settings.autoSync}
              onChange={handleInputChange}
              className="w-4 h-4 text-[#39FF14] bg-[#2C2C2C] border-[#4A4A4A] rounded focus:ring-[#39FF14]"
            />
            <label htmlFor="autoSync" className="text-sm text-[#AAAAAA]">
              Enable automatic sync for live trades
            </label>
          </div>

          <button
            onClick={handleConnect}
            disabled={isConnecting || !settings.webullUsername || !settings.webullPassword || !settings.webullPin}
            className="w-full px-4 py-2 bg-[#BF00FF] text-[#F0F0F0] rounded font-medium hover:bg-[#A000E6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Connect to Webull'}
          </button>
        </div>
      ) : (
        /* Connected State */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#2C2C2C] p-4 rounded-lg">
              <h4 className="text-sm font-medium text-[#F0F0F0] mb-2">Connection Status</h4>
              <div className="text-xs text-[#AAAAAA] space-y-1">
                <div>Username: {settings.webullUsername}</div>
                <div>Auto Sync: {settings.autoSync ? 'Enabled' : 'Disabled'}</div>
                <div>Sync Interval: {settings.syncInterval} minutes</div>
              </div>
            </div>
            <div className="bg-[#2C2C2C] p-4 rounded-lg">
              <h4 className="text-sm font-medium text-[#F0F0F0] mb-2">Sync Statistics</h4>
              <div className="text-xs text-[#AAAAAA] space-y-1">
                <div>Trades Synced Today: 0</div>
                <div>Last Error: None</div>
                <div>Status: Active</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {/* Manual sync logic */}}
              className="flex-1 px-4 py-2 bg-[#39FF14] text-[#1A1A1A] rounded font-medium hover:bg-[#33E60C] transition-colors"
            >
              Sync Now
            </button>
            <button
              onClick={handleDisconnect}
              className="flex-1 px-4 py-2 bg-[#383838] text-[#AAAAAA] rounded hover:bg-[#4A4A4A] transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}