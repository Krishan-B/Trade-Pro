import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { ArrowUp, ArrowDown, Star, Bell } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { ErrorHandler } from "@/services/errorHandling";
import { formatCurrency, formatNumber } from "@/utils/formatUtils";

interface Asset {
  id?: string;
  name: string;
  symbol: string;
  price: number;
  change_percentage: number;
  volume: string;
  market_cap?: string;
  market_type: string;
  // We'll simulate these values're not in the original data
  day_low?: number;
  day_high?: number;
  buy_price?: number;
  sell_price?: number;
}

interface MarketListProps {
  isLoading: boolean;
  error: Error | null;
  filteredMarketData: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

const MarketList = ({
  isLoading,
  error,
  filteredMarketData,
  onSelectAsset,
}: MarketListProps) => {
  // Helper to calculate simulated day low/high and buy/sell prices
  const getEnhancedAssetData = (asset: Asset) => {
    // Simulate day low/high as ±2% from current price
    const dayLow = asset.price * 0.98;
    const dayHigh = asset.price * 1.02;

    // Simulate buy/sell prices (spread)
    const sellPrice = asset.price * 0.997; // 0.3% lower
    const buyPrice = asset.price * 1.003; // 0.3% higher

    return {
      ...asset,
      day_low: dayLow,
      day_high: dayHigh,
      sell_price: sellPrice,
      buy_price: buyPrice,
    };
  };

  const handleAddToWatchlist = async (e: React.MouseEvent, asset: Asset) => {
    e.stopPropagation(); // Prevent row click
    try {
      // In a real app, this would call an API to add the asset to the watchlist
      // Simulate API call
      await Promise.resolve();
      ErrorHandler.handleSuccess("Added to watchlist", {
        description: `${asset.name} (${asset.symbol}) has been added to your watchlist.`,
      });
    } catch (error) {
      ErrorHandler.handleError(error, {
        description: `Failed to add ${asset.name} to your watchlist`,
        retryFn: async () => handleAddToWatchlist(e, asset),
      });
    }
  };

  const handleSetAlert = async (e: React.MouseEvent, asset: Asset) => {
    e.stopPropagation(); // Prevent row click
    try {
      // In a real app, this would call an API to set up the price alert
      // Simulate API call
      await Promise.resolve();
      ErrorHandler.handleSuccess("Price alert", {
        description: `Set a price alert for ${asset.name} (${asset.symbol}).`,
      });
    } catch (error) {
      ErrorHandler.handleError(error, {
        description: `Failed to set price alert for ${asset.name}`,
        retryFn: async () => handleSetAlert(e, asset),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading market data. Please try again.
      </div>
    );
  }

  if (filteredMarketData.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No markets found matching your search.
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead className="font-semibold py-3 px-2 text-left">
                  Symbol
                </TableHead>
                <TableHead className="font-semibold py-3 px-2 text-left">
                  Asset Name
                </TableHead>
                <TableHead className="font-semibold py-3 px-2 text-right">
                  24h Change
                </TableHead>
                <TableHead className="font-semibold py-3 px-2 text-right">
                  Day Range
                </TableHead>
                <TableHead className="font-semibold py-3 px-2 text-right">
                  Sell Price
                </TableHead>
                <TableHead className="font-semibold py-3 px-2 text-right">
                  Buy Price
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarketData.map((asset) => {
                const enhancedAsset = getEnhancedAssetData(asset);
                return (
                  <TableRow
                    key={asset.symbol}
                    className="cursor-pointer border-b hover:bg-muted/40"
                    onClick={() => { onSelectAsset(enhancedAsset); }}
                  >
                    <TableCell className="font-medium py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center text-xs text-primary font-bold">
                          {asset.symbol.substring(0, 2)}
                        </div>
                        <span>{asset.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-2">{asset.name}</TableCell>
                    <TableCell
                      className={`py-3 px-2 text-right ${asset.change_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      <span className="flex items-center justify-end">
                        {asset.change_percentage >= 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="mr-1 h-4 w-4" />
                        )}
                        {formatNumber(Math.abs(asset.change_percentage), 2)}%
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end text-xs text-muted-foreground">
                        <span>{formatCurrency(enhancedAsset.day_low)}</span>
                        <span className="mx-1">-</span>
                        <span>{formatCurrency(enhancedAsset.day_high)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-2 text-right font-mono text-warning">
                      {formatCurrency(enhancedAsset.sell_price)}
                    </TableCell>
                    <TableCell className="py-3 px-2 text-right font-mono text-success">
                      {formatCurrency(enhancedAsset.buy_price)}
                    </TableCell>
                    <TableCell className="py-3 px-2">
                      <div className="flex justify-center items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleAddToWatchlist(e, asset)}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add to Watchlist</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleSetAlert(e, asset)}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Set Price Alert</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MarketList;
