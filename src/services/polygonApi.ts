// src/services/polygonApi.ts
export interface PolygonQuote {
  ticker: string;
  name?: string;
  last_trade?: {
    price: number;
    timestamp: number;
  };
  last_quote?: {
    price: number;
    timestamp: number;
  };
  min?: {
    c: number; // close
    h: number; // high
    l: number; // low
    o: number; // open
    v: number; // volume
  };
  prevDay?: {
    c: number; // close
    h: number; // high
    l: number; // low
    o: number; // open
    v: number; // volume
  };
  fmv?: number; // fair market value (pre-market)
}

export interface PolygonTickerDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik?: string;
  composite_figi?: string;
  share_class_figi?: string;
  market_cap?: number;
  phone_number?: string;
  address?: {
    address1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  description?: string;
  sic_code?: string;
  sic_description?: string;
  ticker_root?: string;
  homepage_url?: string;
  total_employees?: number;
  list_date?: string;
  branding?: {
    logo_url?: string;
    icon_url?: string;
  };
  share_class_shares_outstanding?: number;
  weighted_shares_outstanding?: number;
}

export interface PolygonSearchResult {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  last_updated_utc: string;
}

class PolygonApiService {
  private baseUrl = 'https://api.polygon.io';
  private apiKey: string | undefined; // Changed type to string | undefined

  constructor() {
    // Get the API key from environment variables (Vite-specific way)
    this.apiKey = import.meta.env.VITE_POLYGON_API_KEY; //

    if (!this.apiKey) {
      console.error('VITE_POLYGON_API_KEY is not set. Please ensure it is configured in your .env file or Netlify environment variables.');
    } else {
      console.log('Polygon API initialized with key:', `${this.apiKey.substring(0, 8)}...`);
    }
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Polygon API key not configured. Cannot make request.'); //
    }

    const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${this.apiKey}`;
    
    try {
      console.log('Making Polygon API request to:', endpoint);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Polygon API error:', response.status, errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Polygon.io API key configuration.');
        } else if (response.status === 403) {
          throw new Error('API key does not have permission for this endpoint. Consider upgrading your Polygon.io plan.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please wait before making more requests.');
        }
        
        throw new Error(`Polygon API error: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Polygon API response:', data);
      return data;
    } catch (error) {
      console.error('Polygon API request failed:', error);
      throw error;
    }
  }

  private isWeekend(): boolean {
    const now = new Date();
    const day = now.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  }

  private isMarketHours(): boolean {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Weekend check
    if (day === 0 || day === 6) return false;
    
    // Market hours: 9:30 AM - 4:00 PM ET (approximate)
    // Pre-market: 4:00 AM - 9:30 AM ET
    // After-hours: 4:00 PM - 8:00 PM ET
    return hour >= 4 && hour <= 20;
  }

  async getQuote(symbol: string): Promise<PolygonQuote> {
    try {
      let response;
      let result;

      // During weekends or off-hours, prioritize previous close data
      if (this.isWeekend() || !this.isMarketHours()) {
        console.log(`Weekend/off-hours detected for ${symbol}, using previous close data`);
        
        try {
          // Get previous close data (most reliable for weekends)
          response = await this.makeRequest(`/v2/aggs/ticker/${symbol}/prev`);
          
          if (response.status === 'OK' && response.results && response.results.length > 0) {
            const prevClose = response.results[0];
            result = {
              ticker: symbol,
              prevDay: {
                c: prevClose.c,
                h: prevClose.h,
                l: prevClose.l,
                o: prevClose.o,
                v: prevClose.v
              }
            };
            
            console.log(`Previous close data for ${symbol}:`, result);
          }
        } catch (prevCloseError) {
          console.warn('Previous close endpoint failed:', prevCloseError);
        }
      }

      // If we don't have data yet, try snapshot endpoint
      if (!result) {
        try {
          response = await this.makeRequest(`/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}`);
          
          if (response.status === 'OK' && response.results) {
            result = response.results;
            console.log(`Snapshot data for ${symbol}:`, result);
          }
        } catch (snapshotError) {
          console.warn('Snapshot endpoint failed:', snapshotError);
        }
      }

      // Final fallback: try previous close if we still don't have data
      if (!result) {
        try {
          response = await this.makeRequest(`/v2/aggs/ticker/${symbol}/prev`);
          
          if (response.status === 'OK' && response.results && response.results.length > 0) {
            const prevClose = response.results[0];
            result = {
              ticker: symbol,
              prevDay: {
                c: prevClose.c,
                h: prevClose.h,
                l: prevClose.l,
                o: prevClose.o,
                v: prevClose.v
              }
            };
          }
        } catch (finalError) {
          console.warn('Final fallback failed:', finalError);
        }
      }

      if (!result) {
        throw new Error(`No data available for ${symbol}. This might be due to the symbol not being found or API limitations during ${this.isWeekend() ? 'weekend' : 'off-market hours'}.`);
      }
      
      // Transform the data to our PolygonQuote format
      const quote: PolygonQuote = {
        ticker: result.ticker || symbol,
        name: result.name,
        last_trade: result.last_trade ? {
          price: result.last_trade.p,
          timestamp: result.last_trade.t
        } : undefined,
        last_quote: result.last_quote ? {
          price: (result.last_quote.a + result.last_quote.b) / 2,
          timestamp: (result.last_quote.t)
        } : undefined,
        min: result.min ? {
          c: result.min.c,
          h: result.min.h,
          l: result.min.l,
          o: result.min.o,
          v: result.min.v
        } : undefined,
        prevDay: result.prevDay ? {
          c: result.prevDay.c,
          h: result.prevDay.h,
          l: result.prevDay.l,
          o: result.prevDay.o,
          v: result.prevDay.v
        } : undefined,
        fmv: result.fmv
      };
      
      return quote;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }

  async getTickerDetails(symbol: string): Promise<{ results: PolygonTickerDetails }> {
    try {
      const response = await this.makeRequest(`/v3/reference/tickers/${symbol}`);
      return response;
    } catch (error) {
      console.error(`Error fetching ticker details for ${symbol}:`, error);
      // Return a fallback response if ticker details fail
      return {
        results: {
          ticker: symbol,
          name: symbol,
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'UNKNOWN',
          type: 'CS',
          active: true,
          currency_name: 'usd'
        }
      };
    }
  }

  async searchTickers(query: string): Promise<{ results: PolygonSearchResult[] }> {
    try {
      const response = await this.makeRequest(`/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&market=stocks&limit=10`);
      return response;
    } catch (error) {
      console.error(`Error searching tickers for ${query}:`, error);
      return { results: [] };
    }
  }

  async getMarketStatus(): Promise<any> {
    try {
      const response = await this.makeRequest('/v1/marketstatus/now');
      return response;
    } catch (error) {
      console.error('Error fetching market status:', error);
      
      // Return realistic market status based on current time
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      
      let market = 'closed';
      if (day >= 1 && day <= 5) { // Monday to Friday
        if (hour >= 9 && hour < 16) {
          market = 'open';
        } else if (hour >= 4 && hour < 9) {
          market = 'extended-hours';
        } else if (hour >= 16 && hour < 20) {
          market = 'extended-hours';
        }
      }
      
      return {
        market: market,
        serverTime: new Date().toISOString(),
        exchanges: {
          nyse: market,
          nasdaq: market
        }
      };
    }
  }

  async getAggregates(symbol: string, from: string, to: string): Promise<any> {
    return this.makeRequest(`/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}`);
  }

  async getPreviousClose(symbol: string): Promise<any> {
    return this.makeRequest(`/v2/aggs/ticker/${symbol}/prev`);
  }
}

export const polygonApi = new PolygonApiService();
