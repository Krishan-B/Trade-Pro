export interface Order {
  id: string;
  asset: string;
  type: 'Market' | 'Limit' | 'Stop' | 'Trailing Stop';
  side: 'Buy' | 'Sell';
  quantity: number;
  price?: number;
  stopPrice?: number;
  trailingDistance?: number;
  status: 'Pending' | 'Filled' | 'Cancelled';
  createdAt: string;
}

export interface Position {
  id: string;
  asset: string;
  side: 'Long' | 'Short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  takeProfit?: number;
  stopLoss?: number;
  leverage: number;
  margin: number;
}
