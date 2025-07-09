/**
 * Analytics Types for Trade-Pro
 * Contains type definitions for analytics and metrics
 */

import { PositionSide } from "./domain";

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
  valueAtRisk?: number; // Value at Risk
  betaToMarket?: number; // Portfolio beta
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
