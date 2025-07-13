import { useQuery } from '@tanstack/react-query';
import { MarketData } from '../../supabase/functions/get-market-data-new/types';

const fetchMarketData = async (symbols: string[]): Promise<MarketData[]> => {
  const response = await fetch('/api/get-market-data-new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbols }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useMarketData = (symbols: string[]) => {
  return useQuery({
    queryKey: ['marketData', symbols],
    queryFn: () => fetchMarketData(symbols),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
