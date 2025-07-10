// Shared types for trading functionality

// Market Data Types
export interface MarketData {
  id?: number;
  symbol: string;
  name: string;
  price: number;
  last_price: number;
  high_price: number;
  low_price: number;
  volume: string;
  change_percentage: number;
  market_type: AssetCategory;
  last_updated: string;
  timestamp: string;
  [key: string]: unknown;
}

// Asset Categories and Order Types
export type AssetCategory =
  | "Crypto"
  | "Stocks"
  | "Forex"
  | "Indices"
  | "Commodities";

export type OrderType = "market" | "limit" | "stop" | "stop_limit";
export type OrderCategory =
  | "primary"
  | "stop_loss"
  | "take_profit"
  | "trailing_stop";
export type OrderDirection = "buy" | "sell";
export type OrderStatus = "pending" | "filled" | "cancelled" | "rejected";

// Base Order Interface
export interface BaseOrder {
  id: string;
  user_id: string;
  symbol: string;
  asset_class: AssetCategory;
  order_type: OrderType;
  order_category: OrderCategory;
  direction: OrderDirection;
  quantity: number;
  price: number | null;
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
  [key: string]: unknown;
}

// Enhanced Order with Risk Management
export interface EnhancedOrder extends BaseOrder {
  execution_price?: number;
  position_value: number;
  margin_required: number;
  stop_loss_price?: number;
  take_profit_price?: number;
  trailing_stop_distance?: number;
  order_group_id?: string;
  parent_order_id?: string;
  executed_at?: string;
  cancelled_at?: string;
  expiration_date?: string;
  rejected_reason?: string;
}

// Order Request Types
export interface BaseOrderRequest {
  symbol: string;
  direction: OrderDirection;
  quantity: number;
  asset_class: AssetCategory;
  [key: string]: unknown;
}

export interface MarketOrderRequest extends BaseOrderRequest {
  order_type: "market";
}

export interface LimitOrderRequest extends BaseOrderRequest {
  order_type: "limit";
  price: number;
}

export interface StopOrderRequest extends BaseOrderRequest {
  order_type: "stop";
  stop_price: number;
}

export interface StopLimitOrderRequest extends BaseOrderRequest {
  order_type: "stop_limit";
  stop_price: number;
  limit_price: number;
}

export type OrderRequest =
  | MarketOrderRequest
  | LimitOrderRequest
  | StopOrderRequest
  | StopLimitOrderRequest;

// Risk Management Types
export interface RiskManagementConfig {
  enableStopLoss: boolean;
  stopLossPrice?: number;
  stopLossDistance?: number;
  enableTakeProfit: boolean;
  takeProfitPrice?: number;
  takeProfitDistance?: number;
  enableTrailingStop: boolean;
  trailingStopDistance?: number;
  [key: string]: unknown;
}

// Position Types
export interface Position {
  id: string;
  user_id: string;
  symbol: string;
  direction: OrderDirection;
  quantity: number;
  entryPrice: number;
  currentPrice?: number;
  marginRequired: number;
  leverage?: number;
  unrealizedPnl: number;
  tp?: number | null;
  sl?: number | null;
  rollover_charges?: number;
  createdAt: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ClosedPosition {
  id: string;
  symbol: string;
  direction: OrderDirection;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercentage: number;
  openDate: string;
  closeDate: string;
  [key: string]: unknown;
}

// Order Group Types
export interface OrderGroup {
  id: string;
  primaryOrder: EnhancedOrder;
  stopLossOrder?: EnhancedOrder;
  takeProfitOrder?: EnhancedOrder;
  trailingStopOrder?: EnhancedOrder;
  [key: string]: unknown;
}

// WebSocket Message Types
export type WebSocketEventType =
  | "ACCOUNT_METRICS_UPDATE"
  | "ORDER_FILLED"
  | "ORDER_PENDING"
  | "ORDER_CANCELLED"
  | "POSITION_CLOSED";

export interface WebSocketMessage<T extends WebSocketEventType, P = unknown> {
  type: T;
  payload: P;
  [key: string]: unknown;
}
