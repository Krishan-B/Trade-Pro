export interface MarketData {
  symbol: string;
  name: string;
  live_price: number;
  buy_price: number;
  sell_price: number;
  change_percent_24h: number;
  volume: number;
  market_type: string;
}

export interface YahooQuote {
  symbol: string;
  longName?: string;
  shortName?: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
}

export interface YahooFinanceResponse {
  quoteResponse: {
    result: YahooQuote[];
    error: null | { code: string; description: string; };
  };
}