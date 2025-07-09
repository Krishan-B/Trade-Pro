import React from "react";

interface UnitsInputProps {
  units: string;
  setUnits: (value: string) => void;
  isExecuting?: boolean;
  requiredFunds?: number;
  canAfford?: boolean;
  availableFunds?: number;
}

export const UnitsInput: React.FC<UnitsInputProps> = ({
  units,
  setUnits,
  isExecuting,
  requiredFunds,
  canAfford,
  availableFunds,
}) => (
  <div>
    UnitsInput (stub) <br />
    units: {units} <br />
    requiredFunds: {requiredFunds} <br />
    canAfford: {String(canAfford)} <br />
    availableFunds: {availableFunds} <br />
    <input
      type="text"
      value={units}
      onChange={(e) => setUnits(e.target.value)}
      disabled={isExecuting}
    />
  </div>
);
