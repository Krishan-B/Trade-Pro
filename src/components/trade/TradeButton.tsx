
import { Button, ButtonProps } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTradePanelStore } from "../../hooks/useTradePanelStore";
import React from "react";

interface TradeButtonProps extends ButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  showIcon?: boolean;
  label?: string;
}

export const TradeButton = React.forwardRef<HTMLButtonElement, TradeButtonProps>(
  (
    {
      variant = "default",
      size,
      showIcon = true,
      label = "New Trade",
      className,
      ...props
    },
    ref
  ) => {
    const { openTradePanel } = useTradePanelStore();

    return (
      <Button
        variant={variant}
        size={size}
        onClick={openTradePanel}
        className={className}
        ref={ref}
        {...props}
      >
        {showIcon && <Plus className="h-4 w-4 mr-2" />}
        {label}
      </Button>
    );
  }
);

TradeButton.displayName = "TradeButton";
