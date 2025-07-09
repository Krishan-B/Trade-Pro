import React from "react";
import type { Asset } from "@/hooks/useMarketData";

interface MarketTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  marketData: Asset[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  onSelectAsset?: (asset: Asset) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const MarketTabs: React.FC<MarketTabsProps> = ({
  activeTab,
  setActiveTab,
  marketData,
  isLoading,
  error,
  searchTerm,
  onSelectAsset,
  containerRef,
}) => {
  if (isLoading) {
    return <div>Loading markets...</div>;
  }

  if (error) {
    return <div>Error loading markets: {error.message}</div>;
  }

  const filteredAssets = marketData.filter(
    (asset) =>
      asset.market_type === activeTab &&
      (searchTerm === "" ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {["Crypto", "Stocks", "Forex", "Commodities"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.symbol}
            className="p-4 border rounded cursor-pointer hover:bg-accent"
            onClick={() => {
              onSelectAsset?.(asset);
              containerRef?.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{asset.name}</h3>
                <p className="text-sm text-muted-foreground">{asset.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${asset.price.toLocaleString()}</p>
                <p
                  className={`text-sm ${asset.change_percentage >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {asset.change_percentage >= 0 ? "+" : ""}
                  {asset.change_percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTabs;
