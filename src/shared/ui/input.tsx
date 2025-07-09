// ...existing code...
import * as React from "react";

// Update the import path if needed, or create the utils file with a cn function.
import { cn } from "../utils";
// If your utils file is elsewhere, adjust the path accordingly.

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  // eslint-disable-next-line react/prop-types
  const { className, type, ...rest } = props;
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...rest}
    />
  );
});
Input.displayName = "Input";

export { Input };
