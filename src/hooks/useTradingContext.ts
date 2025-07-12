import { createContext, useContext } from 'react';
import { useTrading } from './useTrading';

export const TradingContext = createContext<ReturnType<typeof useTrading> | null>(null);

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};
