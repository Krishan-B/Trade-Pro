import { Order, Position, Account, AssetClass } from '@shared/types';

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

export function getMarketPrice(symbol: string): number {
    return Math.round((Math.random() * 900 + 100) * 100) / 100;
}
