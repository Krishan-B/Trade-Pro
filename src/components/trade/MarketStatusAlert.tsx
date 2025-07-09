import React from "react";

interface MarketStatusAlertProps {
  marketType?: string;
}

export const MarketStatusAlert: React.FC<MarketStatusAlertProps> = ({
  marketType,
}) => (
  <div>
    MarketStatusAlert (stub) <br />
    marketType: {marketType}
  </div>
);
