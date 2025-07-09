import { renderHook, act } from "@testing-library/react"; // Changed from @testing-library/react-hooks
import { useTrading } from "../useTrading";
import { useOrderApi } from "@/services/tradingApi";
import { EnhancedOrder, OrderRequest } from "@shared/types/trading";

import { vi } from 'vitest';

// Mock the trading API
vi.mock("@/services/tradingApi");

const mockOrderApi = {
  placeMarketOrder: vi.fn(),
  placeEntryOrder: vi.fn(),
  modifyOrder: vi.fn(),
  cancelOrder: vi.fn(),
  getPositions: vi.fn(),
  closePosition: vi.fn(),
};

(useOrderApi as ReturnType<typeof vi.fn>).mockReturnValue(mockOrderApi);

describe("useTrading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOrder: EnhancedOrder = {
    id: "test-order-1",
    user_id: "test-user",
    symbol: "BTC/USD",
    asset_class: "Crypto",
    order_type: "market",
    order_category: "primary",
    direction: "buy",
    quantity: 1,
    price: 50000,
    status: "pending",
    created_at: new Date().toISOString(),
    position_value: 50000,
    margin_required: 5000,
  };

  const mockRequest: OrderRequest = {
    symbol: "BTC/USD",
    direction: "buy",
    quantity: 1,
    asset_class: "Crypto",
    order_type: "market",
  };

  describe("placeOrder", () => {
    it("should place a market order successfully", async () => {
      mockOrderApi.placeMarketOrder.mockResolvedValueOnce(mockOrder);

      const { result } = renderHook(() => useTrading());

      let order;
      await act(async () => {
        order = await result.current.placeOrder(mockRequest);
      });

      expect(order).toEqual(mockOrder);
      expect(mockOrderApi.placeMarketOrder).toHaveBeenCalledWith(mockRequest);
      expect(result.current.isLoading).toBe(false);
    });

    it("should place an entry order successfully", async () => {
      const entryRequest = {
        ...mockRequest,
        order_type: "limit" as const,
        price: 49000,
      };
      mockOrderApi.placeEntryOrder.mockResolvedValueOnce(mockOrder);

      const { result } = renderHook(() => useTrading());

      let order;
      await act(async () => {
        order = await result.current.placeOrder(entryRequest);
      });

      expect(order).toEqual(mockOrder);
      expect(mockOrderApi.placeEntryOrder).toHaveBeenCalledWith(entryRequest);
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle order placement errors", async () => {
      const error = new Error("Failed to place order");
      mockOrderApi.placeMarketOrder.mockRejectedValueOnce(error);

      const onOrderError = vi.fn();
      const { result } = renderHook(() => useTrading({ onOrderError }));

      await act(async () => {
        try {
          await result.current.placeOrder(mockRequest);
        } catch (e) {
          expect(e).toBe(error);
        }
      });

      expect(onOrderError).toHaveBeenCalledWith(error);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("updateOrderRiskManagement", () => {
    it("should update order risk management successfully", async () => {
      const riskConfig = {
        enableStopLoss: true,
        stopLossPrice: 48000,
        enableTakeProfit: true,
        takeProfitPrice: 52000,
        enableTrailingStop: false,
      };

      mockOrderApi.modifyOrder.mockResolvedValueOnce({
        ...mockOrder,
        ...riskConfig,
      });

      const { result } = renderHook(() => useTrading());

      let updatedOrder;
      await act(async () => {
        updatedOrder = await result.current.updateOrderRiskManagement(
          mockOrder.id,
          riskConfig
        );
      });

      expect(updatedOrder).toEqual({ ...mockOrder, ...riskConfig });
      expect(mockOrderApi.modifyOrder).toHaveBeenCalledWith(
        mockOrder.id,
        riskConfig
      );
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("closeExistingPosition", () => {
    it("should close a position successfully", async () => {
      mockOrderApi.closePosition.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useTrading());

      await act(async () => {
        await result.current.closeExistingPosition("test-position-1");
      });

      expect(mockOrderApi.closePosition).toHaveBeenCalledWith(
        "test-position-1"
      );
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("cancelExistingOrder", () => {
    it("should cancel an order successfully", async () => {
      mockOrderApi.cancelOrder.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useTrading());

      await act(async () => {
        await result.current.cancelExistingOrder("test-order-1");
      });

      expect(mockOrderApi.cancelOrder).toHaveBeenCalledWith("test-order-1");
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("fetchPositions", () => {
    it("should fetch positions successfully", async () => {
      const mockPositions = [
        {
          id: "test-position-1",
          symbol: "BTC/USD",
          direction: "buy",
          quantity: 1,
          entryPrice: 50000,
          marginRequired: 5000,
          unrealizedPnl: 1000,
          createdAt: new Date().toISOString(),
        },
      ];

      mockOrderApi.getPositions.mockResolvedValueOnce(mockPositions);

      const { result } = renderHook(() => useTrading());

      let positions;
      await act(async () => {
        positions = await result.current.fetchPositions();
      });

      expect(positions).toEqual(mockPositions);
      expect(mockOrderApi.getPositions).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
