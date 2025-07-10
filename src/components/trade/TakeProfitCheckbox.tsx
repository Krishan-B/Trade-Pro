import React from "react";

interface TakeProfitCheckboxProps {
  hasTakeProfit: boolean;
  setHasTakeProfit: (value: boolean) => void;
  isExecuting?: boolean;
}

export const TakeProfitCheckbox: React.FC<TakeProfitCheckboxProps> = ({
  hasTakeProfit,
  setHasTakeProfit,
  isExecuting,
}) => (
  <div>
    TakeProfitCheckbox (stub) <br />
    hasTakeProfit: {String(hasTakeProfit)} <br />
    <input
      type="checkbox"
      checked={hasTakeProfit}
      onChange={() => { setHasTakeProfit(!hasTakeProfit); }}
      disabled={isExecuting}
    />
  </div>
);
