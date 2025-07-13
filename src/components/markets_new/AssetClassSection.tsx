import React, { useState } from 'react';
import MarketsTable from './MarketsTable';
import { useMarketData } from '../../hooks/useMarketData';

interface AssetClassSectionProps {
  title: string;
  symbols: string[];
}

const AssetClassSection: React.FC<AssetClassSectionProps> = ({ title, symbols }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: assets, isLoading, error } = useMarketData(symbols);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-2xl font-bold text-white mb-4 flex justify-between items-center"
      >
        <span>{title}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>^</span>
      </button>
      {isOpen && (
        <div>
          {isLoading && <p className="text-white">Loading...</p>}
          {error && <p className="text-red-500">Error fetching data.</p>}
          {!isLoading && !error && assets && <MarketsTable assets={assets} />}
        </div>
      )}
    </div>
  );
};

export default AssetClassSection;