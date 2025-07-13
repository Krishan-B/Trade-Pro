import { useMemo } from 'react';
import { useMarketData } from './useMarketData';
import { MarketData } from '../../supabase/functions/get-market-data-new/types';

// Extend MarketData to include the 'price' property expected by components
export type Asset = MarketData & { price: number };

interface UseCombinedMarketDataOptions {
  limit?: number;
  sortBy?: keyof Asset;
  order?: 'asc' | 'desc';
  filter?: (asset: Asset) => boolean;
  refetchInterval?: number;
}

export const useCombinedMarketData = (marketTypes: string[], options: UseCombinedMarketDataOptions = {}) => {
  const {
    limit,
    sortBy = 'volume',
    order = 'desc',
    filter,
    refetchInterval
  } = options;

  const { 
    data: marketData, 
    isLoading, 
    error, 
    refetch, 
    isFetching 
  } = useMarketData(marketTypes, {
    refetchInterval: refetchInterval
  });

  const processedData = useMemo(() => {
    if (!Array.isArray(marketData)) {
      return [];
    }

    // 1. Map to add the 'price' property
    let result: Asset[] = marketData.map(asset => ({
      ...asset,
      price: asset.live_price,
    }));
    
    // 2. Apply filter if provided
    if (filter) {
      result = result.filter(filter);
    }
    
    // 3. Sort the data
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return order === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return order === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    
    // 4. Apply limit if provided
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    
    return result;
  }, [marketData, sortBy, order, filter, limit]);

  return {
    marketData: processedData,
    isLoading,
    isFetching,
    error,
    refetch
  };
};
