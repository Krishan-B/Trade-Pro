import React from "react";
import type { Asset } from "@/hooks/useMarketData";

export interface StubProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string | number;
}

export interface AdvancedOrderFormProps extends StubProps {
  currentPrice: number;
  symbol: string;
  onOrderSubmit: (
    values: AdvancedOrderFormValues,
    action: "buy" | "sell"
  ) => void;
  availableFunds?: number;
  assetCategory?: string;
  onAssetCategoryChange?: (category: string) => void;
  marketData?: Asset[];
  isLoading?: boolean;
}

export const AdvancedOrderForm: React.FC<AdvancedOrderFormProps> = ({
  className,
  variant,
  size,
  currentPrice,
  symbol,
  onOrderSubmit,
  availableFunds,
  assetCategory,
  onAssetCategoryChange,
  marketData,
  isLoading,
  ...rest
}) => (
  <div className={className} {...rest}>
    AdvancedOrderForm (stub) <br />
    currentPrice: {currentPrice} <br />
    symbol: {symbol} <br />
    availableFunds: {availableFunds} <br />
    assetCategory: {assetCategory} <br />
    isLoading: {String(isLoading)} <br />
    <button onClick={() => onOrderSubmit({ orderType: "market" }, "buy")}>
      Submit Order
    </button>
  </div>
);
interface OrderTypeSelectorProps extends StubProps {
  orderType: "market" | "entry";
  onOrderTypeChange: (type: string) => void;
  disabled?: boolean;
}

export const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  className,
  variant,
  size,
  orderType,
  onOrderTypeChange,
  disabled,
  ...rest
}) => (
  <div className={className} {...rest}>
    OrderTypeSelector (stub) <br />
    orderType: {orderType} <br />
    <button
      onClick={() =>
        onOrderTypeChange(orderType === "market" ? "entry" : "market")
      }
      disabled={disabled}
    >
      Toggle Order Type
    </button>
  </div>
);
interface TradeSummaryProps extends StubProps {
  currentPrice: number;
  parsedAmount: number;
  fee: number;
  total: number;
  isLoading?: boolean;
}

export const TradeSummary: React.FC<TradeSummaryProps> = ({
  className,
  variant,
  size,
  currentPrice,
  parsedAmount,
  fee,
  total,
  isLoading,
  ...rest
}) => (
  <div className={className} {...rest}>
    TradeSummary (stub) <br />
    currentPrice: {currentPrice} <br />
    parsedAmount: {parsedAmount} <br />
    fee: {fee} <br />
    total: {total} <br />
    isLoading: {String(isLoading)}
  </div>
);
interface MarketHoursDisplayProps extends StubProps {
  marketType?: string;
  isOpen?: boolean;
  showDetails?: boolean;
}

export const MarketHoursDisplay: React.FC<MarketHoursDisplayProps> = ({
  className,
  variant,
  size,
  marketType,
  isOpen,
  showDetails,
  ...rest
}) => (
  <div className={className} {...rest}>
    MarketHoursDisplay (stub) <br />
    marketType: {marketType} <br />
    isOpen: {String(isOpen)} <br />
    showDetails: {String(showDetails)}
  </div>
);

export type AdvancedOrderFormValues = {
  orderType: string;
  units?: number;
  orderRate?: number;
  stopLoss?: number;
  takeProfit?: number;
  // Add more fields as needed for your form
};
