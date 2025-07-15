import React from 'react';
import { MarketData } from '../../../supabase/functions/get-market-data-new/types';

import { useWatchlistStore } from '../../stores/useWatchlistStore';

interface AssetRowProps {
  asset: MarketData;
}

interface AddToWatchlistButtonProps {
  symbol: string;
}

const AddToWatchlistButton: React.FC<AddToWatchlistButtonProps> = ({ symbol }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const isInWatchlist = watchlist.includes(symbol);

  const handleClick = () => {
    if (isInWatchlist) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist(symbol);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-2xl ${
        isInWatchlist ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
      }`}
    >
      {isInWatchlist ? '★' : '☆'}
    </button>
  );
};

const AssetRow: React.FC<AssetRowProps> = ({ asset }) => {
  const isPositiveChange = asset.change_percent_24h >= 0;

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
      <td className="py-4 px-2 text-center">
        <AddToWatchlistButton symbol={asset.symbol} />
      </td>
      <td className="py-4 px-4">
        <div className="font-semibold">{asset.name}</div>
        <div className="text-xs text-gray-400">{asset.symbol}</div>
      </td>
      <td className="py-4 px-4 text-right font-mono text-green-400">
        {asset.buy_price.toFixed(4)}
      </td>
      <td className="py-4 px-4 text-right font-mono text-red-400">
        {asset.sell_price.toFixed(4)}
      </td>
      <td 
        className={`py-4 px-4 text-right font-mono ${
          isPositiveChange ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {isPositiveChange ? '+' : ''}
        {asset.change_percent_24h.toFixed(2)}%
      </td>
    </tr>
  );
};

export default AssetRow;