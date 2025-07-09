// Minimal tradingApi stub
export function useOrderApi() {
  return {
    placeMarketOrder: async () => ({}),
    placeEntryOrder: async () => ({}),
    isLoading: false,
    error: "",
    getOrders: () => [],
    getPendingOrders: () => [],
    cancelOrder: async () => {},
    modifyOrder: async () => {},
    getPositions: () => [],
    closePosition: async () => {},
  };
}
