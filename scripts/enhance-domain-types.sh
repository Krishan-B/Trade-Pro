#!/usr/bin/env bash

# Script to enhance domain types with missing type declarations
# This helps establish a strong typing foundation for the application

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Domain Types Enhancement =====${NC}"
echo "This script will enhance domain types with additional needed types."

# Backup existing domain.ts
BACKUP_DIR="./typescript-fix/backups/types/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp ./src/types/domain.ts "$BACKUP_DIR/"

# Create additional types file for API responses and common patterns
cat > ./src/types/api.ts << EOL
/**
 * API Types for Trade-Pro
 * Contains type definitions for API requests, responses and related utilities
 */

import { AppError } from './domain';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: AppError | null;
  status?: number;
  metadata?: {
    timestamp: number;
    requestId?: string;
    [key: string]: unknown;
  };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/**
 * API request parameters with pagination
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters for list endpoints
 */
export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | null | undefined;
}

/**
 * Common query parameters
 */
export type QueryParams = PaginationParams & FilterParams;

/**
 * Type guard for API responses
 */
export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('data' in obj || 'error' in obj)
  );
}

/**
 * Type guard for paginated responses
 */
export function isPaginatedResponse<T>(obj: unknown): obj is PaginatedApiResponse<T> {
  return (
    isApiResponse<T[]>(obj) &&
    'pagination' in obj &&
    typeof obj.pagination === 'object'
  );
}
EOL

# Create error handling types
cat > ./src/types/errors.ts << EOL
/**
 * Error Types for Trade-Pro
 * Contains type definitions for error handling and error classification
 */

import { AppError } from './domain';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = 'INFO',       // Informational message, not a true error
  WARNING = 'WARNING', // Warning that doesn't prevent functionality
  ERROR = 'ERROR',     // Standard error, affects functionality but not critical
  CRITICAL = 'CRITICAL', // Critical error, affects core functionality
  FATAL = 'FATAL'      // Fatal error, application cannot function
}

/**
 * Error categories for better classification
 */
export enum ErrorCategory {
  NETWORK = 'NETWORK',         // Network/API related errors
  VALIDATION = 'VALIDATION',   // Input validation errors
  AUTHENTICATION = 'AUTHENTICATION', // Auth related errors
  AUTHORIZATION = 'AUTHORIZATION',   // Permission related errors
  DATA = 'DATA',               // Data processing/integrity errors
  BUSINESS_LOGIC = 'BUSINESS_LOGIC', // Business rule violations
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE', // External service errors
  INTERNAL = 'INTERNAL',       // Internal application errors
  UNKNOWN = 'UNKNOWN'          // Unclassified errors
}

/**
 * Enhanced error object with additional metadata
 */
export interface EnhancedError extends AppError {
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  timestamp?: number;
  requestId?: string;
  path?: string;
  originalError?: unknown;
  actionRequired?: boolean;
  suggestedAction?: string;
}

/**
 * Error with field validation details
 */
export interface ValidationError extends EnhancedError {
  category: ErrorCategory.VALIDATION;
  fieldErrors?: {
    [field: string]: string;
  };
}

/**
 * Type guard for ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'category' in error &&
    (error as ValidationError).category === ErrorCategory.VALIDATION &&
    'fieldErrors' in error
  );
}

/**
 * Type guard for EnhancedError
 */
export function isEnhancedError(error: unknown): error is EnhancedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'retryable' in error
  );
}

/**
 * Create proper error object from unknown error
 */
export function toAppError(error: unknown): AppError {
  if (isEnhancedError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      retryable: false,
      details: error
    };
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    retryable: false,
    details: error
  };
}
EOL

# Create analytics types
cat > ./src/types/analytics.ts << EOL
/**
 * Analytics Types for Trade-Pro
 * Contains type definitions for analytics and metrics
 */

import { PositionSide } from './domain';

/**
 * Portfolio summary metrics
 */
export interface PortfolioMetrics {
  totalValue: number;
  cashBalance: number;
  openPositionsValue: number;
  totalPnL: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  ytdPnL: number;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  sharpeRatio?: number;
  sortinoRatio?: number;
  maxDrawdown?: number;
  winRate?: number;
  averageWin?: number;
  averageLoss?: number;
  profitFactor?: number;
  expectancy?: number;
}

/**
 * Risk metrics
 */
export interface RiskMetrics {
  valueAtRisk?: number;    // Value at Risk
  betaToMarket?: number;   // Portfolio beta
  portfolioVolatility?: number;
  diversificationScore?: number;
  marginUtilization?: number;
  exposureByAssetClass?: {
    [assetClass: string]: number;
  };
}

/**
 * Position metrics
 */
export interface PositionMetrics {
  id: string;
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  leverage?: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
  daysHeld: number;
  breakEvenPrice?: number;
  marginUsed?: number;
  riskToReward?: number;
}

/**
 * Trading activity metrics
 */
export interface TradingActivityMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  averageHoldingPeriod: number;
  mostTradedAssets: Array<{
    symbol: string;
    tradeCount: number;
  }>;
  tradingFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}
EOL

# Update domain.ts with additional types
cat >> ./src/types/domain.ts << EOL

/**
 * User related types
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

export enum KYCStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
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
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  defaultLeverage?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  chartPreferences?: Record<string, unknown>;
}

/**
 * Account related types
 */
export enum AccountType {
  DEMO = "DEMO",
  LIVE = "LIVE"
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
  ADJUSTMENT = "ADJUSTMENT"
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
EOL

# Create index.ts to export all types
cat > ./src/types/index.ts << EOL
/**
 * Export all types from the types directory
 * This makes it easier to import types throughout the application
 */

// Re-export all types
export * from './domain';
export * from './api';
export * from './errors';
export * from './analytics';

// Add any additional type exports here
EOL

echo -e "${GREEN}Domain types enhanced!${NC}"
echo -e "${YELLOW}Added:${NC}"
echo "- API response types (src/types/api.ts)"
echo "- Error handling types (src/types/errors.ts)"
echo "- Analytics types (src/types/analytics.ts)"
echo "- Additional domain types (User, Account, Transaction)"
echo "- Type index file for easier imports"

echo -e "${BLUE}Next steps:${NC}"
echo "1. Review the added types and ensure they match your application needs"
echo "2. Start using these types in your application code"
echo "3. Replace 'any' types with these specific types"
echo "4. Add type guards where needed"
