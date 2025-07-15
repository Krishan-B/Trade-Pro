import React from 'react';
import { MarketData } from '../../../supabase/functions/get-market-data-new/types';
import AssetRow from './AssetRow';

interface MarketsTableProps {
  assets: MarketData[];
}

const MarketsTable: React.FC<MarketsTableProps> = ({ assets }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-white">
        <thead className="border-b border-gray-700 text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-2 text-center w-12"></th>
            <th scope="col" className="py-3 px-4 text-left">Asset</th>
            <th scope="col" className="py-3 px-4 text-right">Buy</th>
            <th scope="col" className="py-3 px-4 text-right">Sell</th>
            <th scope="col" className="py-3 px-4 text-right">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <AssetRow key={asset.symbol} asset={asset} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketsTable;