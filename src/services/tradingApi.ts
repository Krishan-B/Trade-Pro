import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { safeFetch } from "./safeFetch";
import type {
  Position,
  OrderRequest,
  EnhancedOrder,
  RiskManagementConfig,
} from "@shared/types/trading";
import { omitUndefined, normalizeDates } from "@/utils/objectUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function useOrderApi() {
  const { session } = useAuth();
  const token = session?.access_token;

  // Get positions
  const getPositions = useCallback(async (): Promise<Position[]> => {
    if (!token) throw new Error("Not authenticated");
    return safeFetch(`${API_URL}/positions`, {
      headers: authHeaders(token),
    });
  }, [token]);

  // Close position
  const closePosition = useCallback(
    async (id: string): Promise<void> => {
      if (!token) throw new Error("Not authenticated");
      return safeFetch(`${API_URL}/positions/${id}/close`, {
        method: "POST",
        headers: authHeaders(token),
      });
    },
    [token]
  );

  // Place market order
  const placeMarketOrder = useCallback(
    async (order: OrderRequest): Promise<EnhancedOrder> => {
      if (!token) throw new Error("Not authenticated");
      return safeFetch(`${API_URL}/orders/market`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(omitUndefined(normalizeDates(order))),
      });
    },
    [token]
  );

  // Place entry order
  const placeEntryOrder = useCallback(
    async (order: OrderRequest): Promise<EnhancedOrder> => {
      if (!token) throw new Error("Not authenticated");
      return safeFetch(`${API_URL}/orders/entry`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(omitUndefined(normalizeDates(order))),
      });
    },
    [token]
  );

  // Get orders
  const getOrders = useCallback(async (): Promise<EnhancedOrder[]> => {
    if (!token) throw new Error("Not authenticated");
    return safeFetch(`${API_URL}/orders`, {
      headers: authHeaders(token),
    });
  }, [token]);

  // Get pending orders
  const getPendingOrders = useCallback(async (): Promise<EnhancedOrder[]> => {
    if (!token) throw new Error("Not authenticated");
    return safeFetch(`${API_URL}/orders/pending`, {
      headers: authHeaders(token),
    });
  }, [token]);

  // Modify order
  const modifyOrder = useCallback(
    async (
      id: string,
      config: RiskManagementConfig
    ): Promise<EnhancedOrder> => {
      if (!token) throw new Error("Not authenticated");
      return safeFetch(`${API_URL}/orders/${id}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(omitUndefined(normalizeDates(config))),
      });
    },
    [token]
  );

  // Cancel order
  const cancelOrder = useCallback(
    async (id: string): Promise<void> => {
      if (!token) throw new Error("Not authenticated");
      return safeFetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });
    },
    [token]
  );

  return {
    placeMarketOrder,
    placeEntryOrder,
    getOrders,
    getPendingOrders,
    modifyOrder,
    cancelOrder,
    getPositions,
    closePosition,
  };
}
