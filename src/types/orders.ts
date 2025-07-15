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

export interface OpenTrade {
  id: string;
  symbol: string;
  asset: string;
  openRate: number;
  direction: 'Buy' | 'Sell';
  units: number;
  amount: number;
  marketRate: number;
  marketValue: number;
  totalPnl: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'active';
  openDate: string;
  date: string;
}

export interface PendingOrder {
  id: string;
  symbol: string;
  asset: string;
  orderRate: number;
  direction: 'Buy' | 'Sell';
  units: number;
  amount: number;
  marketRate: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'pending';
  orderDate: string;
  date: string;
}

export interface ClosedTrade {
  id: string;
  symbol: string;
  asset: string;
  direction: 'Buy' | 'Sell';
  openRate: number;
  closeRate: number;
  units: number;
  marketValue: number;
  totalPnl: number;
  openDate: string;
  closeDate: string;
  stopLoss?: number;
  takeProfit?: number;
}

export interface OrderHistory {
  id: string;
  symbol: string;
  asset: string;
  orderRate: number;
  direction: 'Buy' | 'Sell';
  units: number;
  amount: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'canceled';
  orderDate: string;
  closeDate: string;
  date: string;
}
