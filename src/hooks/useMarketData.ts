import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  market_cap: number;
  market_type: string;
}

interface UseMarketDataOptions {
  refetchInterval?: number;
}

export const useMarketData = (marketTypes: string[], options: UseMarketDataOptions = {}) => {
  const [marketData, setMarketData] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    const { data, error: rpcError } = await supabase.functions.invoke('fetch-market-data', {
      body: { market_types: marketTypes },
    });

    if (rpcError) {
      setError(rpcError.message);
    } else {
      setMarketData(data || []);
    }

    setIsLoading(false);
    setIsFetching(false);
  }, [marketTypes]);

  useEffect(() => {
    fetchData();

    if (options.refetchInterval) {
      const intervalId = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, options.refetchInterval]);

  return { marketData, isLoading, isFetching, error, refetch: fetchData };
};

