import React from 'react';

interface AssetPerformanceListProps {
  assets: Array<{
    symbol: string;
    name: string;
    pnl: number;
  }>;
  title: string;
}

const AssetPerformanceList: React.FC<AssetPerformanceListProps> = ({ assets, title }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ul className="space-y-2">
        {assets.map((asset) => (
          <li key={asset.symbol} className="flex justify-between items-center p-2 rounded-md bg-muted">
            <div>
              <p className="font-semibold">{asset.symbol}</p>
              <p className="text-sm text-muted-foreground">{asset.name}</p>
            </div>
            <p className={`font-semibold ${asset.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {asset.pnl.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetPerformanceList;