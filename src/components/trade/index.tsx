import React from "react";
export {
  AdvancedOrderForm,
  OrderTypeSelector,
  TradeSummary,
  MarketHoursDisplay,
} from "./AdvancedOrderForm";
export { MarketStatusAlert } from "./MarketStatusAlert";
export { StopLossCheckbox } from "./StopLossCheckbox";
export { TakeProfitCheckbox } from "./TakeProfitCheckbox";
export { TradeSlidePanelOptionCheckbox } from "./TradeSlidePanelOptionCheckbox";
export { UnitsInput } from "./UnitsInput";

interface TradeButtonProps {
  variant?: string;
  className?: string;
  label?: string;
  size?: string;
}

export const TradeButton: React.FC<TradeButtonProps> = ({
  variant,
  className,
  label,
  size,
}) => {
  return (
    <button className={className} data-variant={variant} data-size={size}>
      {label || "Trade"} {size && <span>({size})</span>}
    </button>
  );
};
