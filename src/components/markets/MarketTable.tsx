import React, { useMemo } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { MarketData } from '../../../../supabase/functions/get-market-data-new/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const assetCategories: Record<string, string[]> = {
  "Stocks": ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"],
  "Cryptocurrencies": ["BTC-USD", "ETH-USD", "SOL-USD", "ADA-USD"],
  "Indices": ["^GSPC", "^IXIC", "^DJI", "^FTSE"],
  "Currencies/Forex": ["EURUSD=X", "JPY=X", "GBPUSD=X", "USDCAD=X"],
  "Commodities": ["GC=F", "CL=F", "SI=F"]
};

const allSymbols = Object.values(assetCategories).flat();

const MarketTable = () => {
  const { data, isLoading, error } = useMarketData(allSymbols);

  const dataByCategory = useMemo(() => {
    if (!data) return {};
    
    const symbolToCategoryMap = new Map<string, string>();
    for (const [category, symbols] of Object.entries(assetCategories)) {
      for (const symbol of symbols) {
        symbolToCategoryMap.set(symbol, category);
      }
    }

    const groupedData: Record<string, typeof data> = {};
    for (const item of data) {
      const category = symbolToCategoryMap.get(item.symbol);
      if (category) {
        if (!groupedData[category]) {
          groupedData[category] = [];
        }
        groupedData[category].push(item);
      }
    }
    return groupedData;
  }, [data]);

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full my-2" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <Table>
      <TableCaption>A list of real-time market data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Asset Name</TableHead>
          <TableHead>Ticker Symbol</TableHead>
          <TableHead>Live Price</TableHead>
          <TableHead>24h Change ($)</TableHead>
          <TableHead>24h Change (%)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(dataByCategory).map(([category, items]) => (
          <React.Fragment key={category}>
            <TableRow>
              <TableCell colSpan={5} className="font-bold text-lg">{category}</TableCell>
            </TableRow>
            {items.map((item: MarketData) => (
                <TableRow key={item.symbol}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell>${item.live_price.toFixed(2)}</TableCell>
                  <TableCell className={cn(item.change_percent_24h > 0 ? "text-green-500" : "text-red-500")}>
                    ${item.change_percent_24h.toFixed(2)}
                  </TableCell>
                  <TableCell className={cn(item.change_percent_24h > 0 ? "text-green-500" : "text-red-500")}>
                    {item.change_percent_24h.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default MarketTable;