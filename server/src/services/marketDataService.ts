import yahooFinance from 'yahoo-finance2';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  lastUpdated: string;
}

export interface AssetInfo {
  symbol: string;
  name: string;
  assetClass: string;
  exchange: string;
  currency: string;
}

export class MarketDataService {
  private static instance: MarketDataService;
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5000; // 5 seconds cache

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  // Get real-time market data for a symbol
  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      const quote = await yahooFinance.quote(symbol);
      
      if (!quote || !quote.regularMarketPrice) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      return {
        symbol: symbol,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap,
        high: quote.regularMarketDayHigh || quote.regularMarketPrice,
        low: quote.regularMarketDayLow || quote.regularMarketPrice,
        open: quote.regularMarketOpen || quote.regularMarketPrice,
        previousClose: quote.regularMarketPreviousClose || quote.regularMarketPrice,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      throw new Error(`Failed to fetch market data for ${symbol}`);
    }
  }

  // Get current price with caching for trading engine
  async getCurrentPrice(symbol: string): Promise<number> {
    const cached = this.priceCache.get(symbol);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.price;
    }

    try {
      const quote = await yahooFinance.quote(symbol);
      const price = quote.regularMarketPrice || 0;
      
      this.priceCache.set(symbol, { price, timestamp: now });
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      // Return cached price if available, otherwise throw
      if (cached) {
        return cached.price;
      }
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
  }

  // Get multiple symbols at once
  async getMultipleQuotes(symbols: string[]): Promise<MarketData[]> {
    const promises = symbols.map(symbol => this.getMarketData(symbol));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<MarketData> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  // Get historical data for charts
  async getHistoricalData(symbol: string, period: string = '1mo'): Promise<any[]> {
    try {
      const queryOptions = {
        period1: this.getPeriodStart(period),
        period2: new Date(),
        interval: '1d' as const
      };

      const result = await yahooFinance.historical(symbol, queryOptions);
      return result.map(item => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
  }

  // Get asset information
  async getAssetInfo(symbol: string): Promise<AssetInfo> {
    try {
      const quote = await yahooFinance.quote(symbol);
      
      return {
        symbol: symbol,
        name: quote.longName || quote.shortName || symbol,
        assetClass: this.determineAssetClass(symbol, quote),
        exchange: quote.fullExchangeName || quote.exchange || '',
        currency: quote.currency || 'USD'
      };
    } catch (error) {
      console.error(`Error fetching asset info for ${symbol}:`, error);
      throw new Error(`Failed to fetch asset info for ${symbol}`);
    }
  }

  // Determine asset class based on symbol and quote data
  private determineAssetClass(symbol: string, quote: any): string {
    // Check for forex pairs
    if (symbol.includes('=X') || symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP')) {
      return 'FOREX';
    }
    
    // Check for crypto
    if (symbol.includes('-USD') || symbol.includes('BTC') || symbol.includes('ETH')) {
      return 'CRYPTO';
    }
    
    // Check for commodities
    if (symbol.includes('GC=F') || symbol.includes('CL=F') || symbol.includes('SI=F')) {
      return 'COMMODITIES';
    }
    
    // Check for indices
    if (symbol.startsWith('^') || symbol.includes('SPY') || symbol.includes('QQQ')) {
      return 'INDICES';
    }
    
    // Default to stocks
    return 'STOCKS';
  }

  // Helper to get period start date
  private getPeriodStart(period: string): Date {
    const now = new Date();
    switch (period) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '1w':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '1mo':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '3mo':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  // Get popular symbols by asset class
  getPopularSymbols(assetClass: string): string[] {
    switch (assetClass.toUpperCase()) {
      case 'STOCKS':
        return ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
      case 'FOREX':
        return ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X', 'USDCAD=X'];
      case 'CRYPTO':
        return ['BTC-USD', 'ETH-USD', 'ADA-USD', 'DOT-USD', 'SOL-USD'];
      case 'INDICES':
        return ['^GSPC', '^IXIC', '^DJI', '^RUT', '^VIX'];
      case 'COMMODITIES':
        return ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'HG=F'];
      default:
        return ['AAPL', 'GOOGL', 'MSFT'];
    }
  }
}

export default MarketDataService;