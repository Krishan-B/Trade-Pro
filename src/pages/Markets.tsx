import React from 'react';
import { useCombinedMarketData } from '@/hooks/useCombinedMarketData';
import MarketsTable from '@/components/markets/MarketsTable';

const MarketsPage: React.FC = () => {
  const { marketData, isLoading, error } = useCombinedMarketData(['crypto', 'stock', 'forex']);

  const assets = Array.isArray(marketData) ? marketData : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Markets</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading market data.</p>}
      <MarketsTable assets={assets} />
    </div>
  );
};

export default MarketsPage;