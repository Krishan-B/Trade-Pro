import React from "react";

interface StopLossCheckboxProps {
  hasStopLoss: boolean;
  setHasStopLoss: (value: boolean) => void;
  isExecuting?: boolean;
}

export const StopLossCheckbox: React.FC<StopLossCheckboxProps> = ({
  hasStopLoss,
  setHasStopLoss,
  isExecuting,
}) => (
  <div>
    StopLossCheckbox (stub) <br />
    hasStopLoss: {String(hasStopLoss)} <br />
    <input
      type="checkbox"
      checked={hasStopLoss}
      onChange={() => { setHasStopLoss(!hasStopLoss); }}
      disabled={isExecuting}
    />
  </div>
);
