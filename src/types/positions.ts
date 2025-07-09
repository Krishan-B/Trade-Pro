export interface Position {
  id: string;
  symbol: string;
  direction: string;
  quantity: number;
  entryPrice: number;
  marginRequired: number;
  tp?: number | null;
  sl?: number | null;
  createdAt: string;
  unrealizedPnl: number;
}

export interface OrderRequest {
  [key: string]: string | number | undefined;
  symbol: string;
  direction: "buy" | "sell";
  quantity: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
  expiryDate?: string;
}

export interface OrderUpdate {
  [key: string]: string | number | undefined;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
  expiryDate?: string;
}
