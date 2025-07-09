import React from "react";
import type { Asset } from "@/hooks/useMarketData";

interface MarketContainerProps {
  marketData: Asset[];
  isLoading: boolean;
  error: Error | null;
}

const MarketContainer: React.FC<MarketContainerProps> = () => (
  <div>MarketContainer (stub)</div>
);

export default MarketContainer;
