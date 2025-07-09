import React from "react";

interface TradingViewChartProps {
  symbol?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol }) => (
  <div>
    TradingViewChart (stub)
    {symbol && <div>symbol: {symbol}</div>}
  </div>
);
export default TradingViewChart;
