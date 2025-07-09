import React from "react";

interface TradeSlidePanelOptionCheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  onCheckedChange?: () => void;
  tooltip?: string;
  disabled?: boolean;
}

export const TradeSlidePanelOptionCheckbox: React.FC<
  TradeSlidePanelOptionCheckboxProps
> = ({ id, label, checked, onCheckedChange, tooltip, disabled }) => (
  <div>
    TradeSlidePanelOptionCheckbox (stub) <br />
    id: {id} <br />
    label: {label} <br />
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onCheckedChange}
      disabled={disabled}
      title={tooltip}
    />
  </div>
);
