import React from "react";
import { useCombinedMarketData } from "@/hooks/useCombinedMarketData";
import MarketContainer from "@/components/markets/MarketContainer";
import { withErrorBoundary } from "@/shared/hoc/withErrorBoundary";

const MarketsPage: React.FC = () => {
  // Use the combined market data hook with a 1-minute refetch interval for more real-time market data
  const { marketData, isLoading, error } = useCombinedMarketData(
    ["Crypto"], // Default to Crypto tab
    { refetchInterval: 1000 * 60 } // Refresh every minute
  );

  return (
    <MarketContainer
      marketData={marketData}
      isLoading={isLoading}
      error={error}
    />
  );
};

const MarketsPageWrapped = withErrorBoundary(MarketsPage);
export { MarketsPageWrapped };
export default MarketsPageWrapped;
