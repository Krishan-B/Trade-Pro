import React from "react";
import type { Asset } from "@/hooks/useMarketData";

interface MarketChartSectionProps {
  chartSectionRef: React.RefObject<HTMLDivElement | null>;
  selectedAsset: Asset;
  marketIsOpen: boolean;
}

const MarketChartSection: React.FC<MarketChartSectionProps> = ({
  chartSectionRef,
  selectedAsset,
  marketIsOpen,
}) => (
  <div ref={chartSectionRef}>
    MarketChartSection (stub)
    <div>
      selectedAsset: {selectedAsset ? JSON.stringify(selectedAsset) : "none"}
    </div>
    <div>marketIsOpen: {String(marketIsOpen)}</div>
  </div>
);

export default MarketChartSection;
