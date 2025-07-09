import React from "react";
import type { Asset } from "@/hooks/useMarketData";

interface MarketHeaderProps {
  selectedAsset: Asset;
  marketIsOpen: boolean;
}
const MarketHeader: React.FC<MarketHeaderProps> = ({
  selectedAsset,
  marketIsOpen,
}) => (
  <div>
    MarketHeader (stub)
    <div>
      selectedAsset: {selectedAsset ? JSON.stringify(selectedAsset) : "none"}
    </div>
    <div>marketIsOpen: {String(marketIsOpen)}</div>
  </div>
);
export default MarketHeader;
