import React from 'react';
import { useTrading } from '../hooks/useTrading';
import { TradingContext } from '../hooks/useTradingContext';

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const trading = useTrading();
  return <TradingContext.Provider value={trading}>{children}</TradingContext.Provider>;
};
