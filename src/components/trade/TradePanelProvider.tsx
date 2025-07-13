
import { ReactNode } from 'react';
import { TradeSlidePanel } from './TradeSlidePanel';
import ErrorBoundary from '../ErrorBoundary';
import { useTradePanelStore } from '../../hooks/useTradePanelStore';

export function TradePanelProvider({ children }: { children: ReactNode }) {
  const { open, setOpen } = useTradePanelStore();

  return (
    <>
      {children}
      <ErrorBoundary>
        <TradeSlidePanel
          open={open}
          onOpenChange={setOpen}
        />
      </ErrorBoundary>
    </>
  );
}
