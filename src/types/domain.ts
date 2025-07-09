/**
 * Core domain types for Trade-Pro platform
 * This file defines the main business entities and their relationships
 */

/**
 * Order related types
 */
export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP = "STOP",
  STOP_LIMIT = "STOP_LIMIT",
  TRAILING_STOP = "TRAILING_STOP",
}

export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderStatus {
  PENDING = "PENDING",
  OPEN = "OPEN",
  FILLED = "FILLED",
  PARTIALLY_FILLED = "PARTIALLY_FILLED",
  CANCELED = "CANCELED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export interface BaseOrder {
  id: string;
  userId: string;
  symbol: string;
  assetClass?: string;
  side: OrderSide;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
}

export interface MarketOrder extends BaseOrder {
  orderType: OrderType.MARKET;
  price?: number; // Execution price
}

export interface LimitOrder extends BaseOrder {
  orderType: OrderType.LIMIT | OrderType.STOP_LIMIT;
  limitPrice: number;
  stopPrice?: number; // Only for STOP_LIMIT
}

export interface StopOrder extends BaseOrder {
  orderType: OrderType.STOP;
  stopPrice: number;
}

export interface TrailingStopOrder extends BaseOrder {
  orderType: OrderType.TRAILING_STOP;
  trailingAmount: number;
  trailingPercent: boolean; // true if trailing amount is a percentage
}

export type Order = MarketOrder | LimitOrder | StopOrder | TrailingStopOrder;

/**
 * Position related types
 */
export enum PositionSide {
  LONG = "LONG",
  SHORT = "SHORT",
}

export enum PositionStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  PARTIALLY_CLOSED = "PARTIALLY_CLOSED",
}

export interface Position {
  id: string;
  userId: string;
  accountId: string;
  symbol: string;
  assetClass?: string;
  side: PositionSide;
  quantity: number;
  entryPrice: number;
  currentPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage?: number;
  marginRequired?: number;
  unrealizedPnl?: number;
  status: PositionStatus;
  openedAt: string;
  updatedAt?: string;
  closedAt?: string;
}

/**
 * Asset related types
 */
export enum AssetClass {
  EQUITY = "EQUITY",
  FOREX = "FOREX",
  CRYPTO = "CRYPTO",
  FUTURES = "FUTURES",
  OPTIONS = "OPTIONS",
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  tradable: boolean;
}

/**
 * Market data types
 */
export interface MarketData {
  symbol: string;
  price: number;
  bid?: number;
  ask?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
  volume?: number;
  timestamp: number;
}

/**
 * Error handling types
 */
export interface AppError {
  code: string;
  message: string;
  userMessage?: string;
  details?: unknown;
  retryable: boolean;
}

export type ErrorWithCode = Error & { code: string };

/**
 * API response types
 */
export interface ApiResponse<T> {
  data: T | null;
  error: AppError | null;
}

/**
 * Type guards for runtime type checking
 */
export function isOrder(obj: unknown): obj is Order {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "orderType" in obj &&
    "side" in obj &&
    "quantity" in obj &&
    "status" in obj
  );
}

export function isPosition(obj: unknown): obj is Position {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "side" in obj &&
    "quantity" in obj &&
    "entryPrice" in obj &&
    "status" in obj
  );
}

export function isAppError(obj: unknown): obj is AppError {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "code" in obj &&
    "message" in obj &&
    "retryable" in obj
  );
}

export function isErrorWithCode(error: unknown): error is ErrorWithCode {
  return (
    error instanceof Error &&
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

/**
 * User related types
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum KYCStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  kycStatus?: KYCStatus;
  settings?: UserSettings;
}

export interface UserSettings {
  theme?: "light" | "dark" | "system";
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  defaultLeverage?: number;
  riskLevel?: "low" | "medium" | "high";
  chartPreferences?: Record<string, unknown>;
}

/**
 * Account related types
 */
export enum AccountType {
  DEMO = "DEMO",
  LIVE = "LIVE",
}

export interface Account {
  id: string;
  userId: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  leverage?: number;
  marginUsed?: number;
  marginAvailable?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Transaction related types
 */
export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRADE = "TRADE",
  FEE = "FEE",
  INTEREST = "INTEREST",
  ADJUSTMENT = "ADJUSTMENT",
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  relatedEntityId?: string; // e.g., orderId or positionId
  relatedEntityType?: string; // e.g., "Order" or "Position"
  createdAt: string;
}

/**
 * User related types
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum KYCStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  kycStatus?: KYCStatus;
  settings?: UserSettings;
}

export interface UserSettings {
  theme?: "light" | "dark" | "system";
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  defaultLeverage?: number;
  riskLevel?: "low" | "medium" | "high";
  chartPreferences?: Record<string, unknown>;
}

/**
 * Account related types
 */
export enum AccountType {
  DEMO = "DEMO",
  LIVE = "LIVE",
}

export interface Account {
  id: string;
  userId: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  leverage?: number;
  marginUsed?: number;
  marginAvailable?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Transaction related types
 */
export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRADE = "TRADE",
  FEE = "FEE",
  INTEREST = "INTEREST",
  ADJUSTMENT = "ADJUSTMENT",
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  relatedEntityId?: string; // e.g., orderId or positionId
  relatedEntityType?: string; // e.g., "Order" or "Position"
  createdAt: string;
}

/**
 * User related types
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum KYCStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  kycStatus?: KYCStatus;
  settings?: UserSettings;
}

export interface UserSettings {
  theme?: "light" | "dark" | "system";
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  defaultLeverage?: number;
  riskLevel?: "low" | "medium" | "high";
  chartPreferences?: Record<string, unknown>;
}

/**
 * Account related types
 */
export enum AccountType {
  DEMO = "DEMO",
  LIVE = "LIVE",
}

export interface Account {
  id: string;
  userId: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  leverage?: number;
  marginUsed?: number;
  marginAvailable?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Transaction related types
 */
export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRADE = "TRADE",
  FEE = "FEE",
  INTEREST = "INTEREST",
  ADJUSTMENT = "ADJUSTMENT",
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  relatedEntityId?: string; // e.g., orderId or positionId
  relatedEntityType?: string; // e.g., "Order" or "Position"
  createdAt: string;
}

/**
 * User related types
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum KYCStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  kycStatus?: KYCStatus;
  settings?: UserSettings;
}

export interface UserSettings {
  theme?: "light" | "dark" | "system";
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  defaultLeverage?: number;
  riskLevel?: "low" | "medium" | "high";
  chartPreferences?: Record<string, unknown>;
}

/**
 * Account related types
 */
export enum AccountType {
  DEMO = "DEMO",
  LIVE = "LIVE",
}

export interface Account {
  id: string;
  userId: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  leverage?: number;
  marginUsed?: number;
  marginAvailable?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Transaction related types
 */
export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRADE = "TRADE",
  FEE = "FEE",
  INTEREST = "INTEREST",
  ADJUSTMENT = "ADJUSTMENT",
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  relatedEntityId?: string; // e.g., orderId or positionId
  relatedEntityType?: string; // e.g., "Order" or "Position"
  createdAt: string;
}
