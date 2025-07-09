import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
}

export const Button: React.FC<ButtonProps> = ({
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
    {children || "Button (stub)"}
  </button>
);
