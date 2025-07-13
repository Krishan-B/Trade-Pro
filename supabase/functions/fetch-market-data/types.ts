export interface Asset {
  symbol: string;
  name: string;
  base: number;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change_percentage: number;
  volume: string;
  market_cap?: string;
  market_type: string;
}