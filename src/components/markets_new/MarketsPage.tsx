import React from 'react';
import AssetClassSection from './AssetClassSection';
import { ASSET_CLASSES } from './constants';

const MarketsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Markets</h1>
      <div>
        {ASSET_CLASSES.map((assetClass) => (
          <AssetClassSection
            key={assetClass.title}
            title={assetClass.title}
            symbols={assetClass.symbols}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketsPage;