import { useCallback, useState } from "react";
import { useOrderApi } from "@/services/tradingApi";
import {
  OrderRequest,
  Position,
  EnhancedOrder,
  RiskManagementConfig,
} from "@shared/types/trading";
import { ErrorHandler } from "@/services/errorHandling";

interface UseTradingOptions {
  onOrderSuccess?: (order: EnhancedOrder) => void;
  onOrderError?: (error: Error) => void;
}

export function useTrading(options: UseTradingOptions = {}) {
  const {
    placeMarketOrder,
    placeEntryOrder,
    modifyOrder,
    cancelOrder,
    getPositions,
    closePosition,
  } = useOrderApi();

  const [isLoading, setIsLoading] = useState(false);

  const placeOrder = useCallback(
    async (request: OrderRequest, riskConfig?: RiskManagementConfig) => {
      setIsLoading(true);
      try {
        const order =
          request.order_type === "market"
            ? await placeMarketOrder(request)
            : await placeEntryOrder(request);

        if (riskConfig && order.id) {
          await modifyOrder(order.id, riskConfig);
        }

        options.onOrderSuccess?.(order);
        return order;
      } catch (error) {
        const err = error as Error;
        ErrorHandler.handleError(
          ErrorHandler.createError({
            code: "order_placement_error",
            message: "Failed to place order",
            details: { error: err, request },
          })
        );
        options.onOrderError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [placeMarketOrder, placeEntryOrder, modifyOrder, options]
  );

  const updateOrderRiskManagement = useCallback(
    async (orderId: string, config: RiskManagementConfig) => {
      setIsLoading(true);
      try {
        const updatedOrder = await modifyOrder(orderId, config);
        return updatedOrder;
      } catch (error) {
        const err = error as Error;
        ErrorHandler.handleError(
          ErrorHandler.createError({
            code: "order_update_error",
            message: "Failed to update order",
            details: { error: err, orderId, config },
          })
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [modifyOrder]
  );

  const closeExistingPosition = useCallback(
    async (positionId: string) => {
      setIsLoading(true);
      try {
        await closePosition(positionId);
      } catch (error) {
        const err = error as Error;
        ErrorHandler.handleError(
          ErrorHandler.createError({
            code: "position_close_error",
            message: "Failed to close position",
            details: { error: err, positionId },
          })
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [closePosition]
  );

  const cancelExistingOrder = useCallback(
    async (orderId: string) => {
      setIsLoading(true);
      try {
        await cancelOrder(orderId);
      } catch (error) {
        const err = error as Error;
        ErrorHandler.handleError(
          ErrorHandler.createError({
            code: "order_cancel_error",
            message: "Failed to cancel order",
            details: { error: err, orderId },
          })
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cancelOrder]
  );

  const fetchPositions = useCallback(async (): Promise<Position[]> => {
    setIsLoading(true);
    try {
      const positions = await getPositions();
      return positions;
    } catch (error) {
      const err = error as Error;
      ErrorHandler.handleError(
        ErrorHandler.createError({
          code: "fetch_positions_error",
          message: "Failed to fetch positions",
          details: { error: err },
        })
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getPositions]);

  return {
    isLoading,
    placeOrder,
    updateOrderRiskManagement,
    closeExistingPosition,
    cancelExistingOrder,
    fetchPositions,
  };
}
