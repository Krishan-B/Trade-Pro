import React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  variant?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  className,
  variant,
  ...rest
}) => (
  <div
    className={["spinner", className, variant ? `spinner-${variant}` : ""]
      .filter(Boolean)
      .join(" ")}
    style={{ width: size, height: size }}
    {...rest}
  >
    Loading...
  </div>
);

export default Spinner;
