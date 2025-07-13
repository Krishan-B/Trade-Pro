import { create } from 'zustand';

interface TradePanelState {
  open: boolean;
  openTradePanel: () => void;
  closeTradePanel: () => void;
  setOpen: (open: boolean) => void;
}

export const useTradePanelStore = create<TradePanelState>((set) => ({
  open: false,
  openTradePanel: () => set({ open: true }),
  closeTradePanel: () => set({ open: false }),
  setOpen: (open) => set({ open }),
}));