import { Order, Position, Account, AssetClass } from '@shared/types';
import MarketDataService from './services/marketDataService';

export const orders: Order[] = [];
export const positions: Position[] = [];

export const account: Account = {
    user_id: "test-user",
    balance: 10000,
    bonus: 0,
    realizedPnl: 0,
    equity: 10000,
    usedMargin: 0,
    availableFunds: 10000,
    marginLevel: 0,
    exposure: 0,
};

export function getLeverageForAssetClass(assetClass: AssetClass): number {
    switch (assetClass.toUpperCase()) {
        case "STOCKS":
            return 20;
        case "INDICES":
            return 50;
        case "COMMODITIES":
            return 50;
        case "FOREX":
            return 100;
        case "CRYPTO":
            return 50;
        default:
            return 1;
    }
}

// Updated to use real market data
export async function getMarketPrice(symbol: string): Promise<number> {
    const marketDataService = MarketDataService.getInstance();
    try {
        return await marketDataService.getCurrentPrice(symbol);
    } catch (error) {
        console.error(`Error fetching real price for ${symbol}, using fallback:`, error);
        // Fallback to a reasonable price if Yahoo Finance fails
        return 100 + Math.random() * 200; // Between 100-300
    }
}

// Keep the synchronous version for backward compatibility
export function getMarketPriceSync(symbol: string): number {
    return Math.round((Math.random() * 900 + 100) * 100) / 100;
}
