
import React from 'react';
import WatchlistHeader from './WatchlistHeader';
import WatchlistLoading from './WatchlistLoading';
import WatchlistTableHeader from './WatchlistTableHeader';
import WatchlistTableRow from './WatchlistTableRow';
import AssetCard from './AssetCard';
import { useWatchlistData } from '@/hooks/useWatchlistData';

interface Asset {
  id?: string;
  name: string;
  symbol: string;
  price: number;
  change_percentage: number;
  volume: string;
  market_type: string;
  market_cap?: string;
}

interface WatchlistTableProps {
  onAssetSelect: (asset: Asset) => void;
}

const WatchlistTable = ({ onAssetSelect }: WatchlistTableProps) => {
  const { watchlist, isLoading, handleRefreshData } = useWatchlistData();

  if (isLoading) {
    return <WatchlistLoading />;
  }

  return (
    <div>
      <WatchlistHeader onRefresh={handleRefreshData} />
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <WatchlistTableHeader />
          <tbody>
            {watchlist.map((asset) => (
              <WatchlistTableRow
                key={asset.symbol}
                asset={asset}
                onSelect={onAssetSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {watchlist.map((asset) => (
          <AssetCard
            key={asset.symbol}
            asset={asset}
            onSelect={onAssetSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default WatchlistTable;
