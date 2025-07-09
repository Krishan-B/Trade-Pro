import React from "react";

export interface TradeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
}

const TradeButton: React.FC<TradeButtonProps> = ({
  variant,
  size,
  className,
  children,
  ...rest
}) => (
  <button
    className={[
      className,
      variant ? `btn-${variant}` : "",
      size ? `btn-${size}` : "",
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children || "TradeButton (stub)"}
  </button>
);

export default TradeButton;
