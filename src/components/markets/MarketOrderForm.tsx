import React from "react";
import type { Asset } from "@/hooks/useMarketData";

interface MarketOrderFormProps {
  selectedAsset: Asset;
}
const MarketOrderForm: React.FC<MarketOrderFormProps> = ({ selectedAsset }) => (
  <div>
    MarketOrderForm (stub)
    <div>
      selectedAsset: {selectedAsset ? JSON.stringify(selectedAsset) : "none"}
    </div>
  </div>
);
export default MarketOrderForm;
