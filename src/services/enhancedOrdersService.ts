import { supabase } from "@/integrations/supabase/client";
import type {
  EnhancedOrder,
  EnhancedOrderType,
  StopLossTakeProfitConfig,
} from "@/types/enhanced-orders";
import { omitUndefined, normalizeDates } from "@/utils/objectUtils";

export const enhancedOrdersService = {
  async fetchOrders(userId: string): Promise<EnhancedOrder[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Define a type for the raw order from Supabase
    interface RawOrder {
      [key: string]: unknown;
      name?: string;
      symbol?: string;
      price?: number;
      change_percentage?: number;
      market_type?: string;
      order_type?: string;
      order_category?: string;
      direction?: string;
      stop_loss_price?: number;
      take_profit_price?: number;
      trailing_stop_distance?: number;
      order_group_id?: string;
      parent_order_id?: string;
    }

    const enhancedOrders: EnhancedOrder[] = (data || []).map((order) => {
      const raw = order;
      return {
        ...order,
        order_type: raw.order_type,
        order_category: (raw.order_category || "primary") as
          | "primary"
          | "stop_loss"
          | "take_profit"
          | "trailing_stop",
        direction: raw.direction as "buy" | "sell",
        stop_loss_price: raw.stop_loss_price,
        take_profit_price: raw.take_profit_price,
        trailing_stop_distance: raw.trailing_stop_distance,
        order_group_id: raw.order_group_id,
        parent_order_id: raw.parent_order_id,
      };
    });

    return enhancedOrders;
  },

  async placeEnhancedOrder(
    userId: string,
    symbol: string,
    assetClass: string,
    direction: "buy" | "sell",
    units: number,
    price: number,
    orderType: EnhancedOrderType,
    slTpConfig?: StopLossTakeProfitConfig
  ) {
    const orderGroupId = crypto.randomUUID();

    // Create primary order with only defined optional fields
    const primaryOrderData = omitUndefined(
      normalizeDates({
        user_id: userId,
        symbol,
        asset_class: assetClass,
        order_type: orderType,
        order_category: "primary",
        direction,
        units,
        requested_price: price,
        position_value: units * price,
        margin_required: units * price * 0.1, // 10% margin requirement
        order_group_id: orderGroupId,
        status: "pending",
      })
    );

    const { data: primaryOrder, error: primaryError } = await supabase
      .from("orders")
      .insert(primaryOrderData)
      .select()
      .single();

    if (primaryError) throw primaryError;

    // Create stop-loss order if enabled
    if (slTpConfig?.enableStopLoss && slTpConfig.stopLossPrice) {
      const stopLossData = omitUndefined(
        normalizeDates({
          user_id: userId,
          symbol,
          asset_class: assetClass,
          order_type: "stop_loss",
          order_category: "stop_loss",
          direction: direction === "buy" ? "sell" : "buy", // Opposite direction
          units,
          requested_price: slTpConfig.stopLossPrice,
          position_value: units * slTpConfig.stopLossPrice,
          margin_required: 0,
          stop_loss_price: slTpConfig.stopLossPrice,
          order_group_id: orderGroupId,
          status: "pending",
          parent_order_id: primaryOrder?.id,
        })
      );

      const { error: slError } = await supabase
        .from("orders")
        .insert(stopLossData);

      if (slError) throw slError;
    }

    // Create take-profit order if enabled
    if (slTpConfig?.enableTakeProfit && slTpConfig.takeProfitPrice) {
      const takeProfitData = omitUndefined(
        normalizeDates({
          user_id: userId,
          symbol,
          asset_class: assetClass,
          order_type: "take_profit",
          order_category: "take_profit",
          direction: direction === "buy" ? "sell" : "buy", // Opposite direction
          units,
          requested_price: slTpConfig.takeProfitPrice,
          position_value: units * slTpConfig.takeProfitPrice,
          margin_required: 0,
          take_profit_price: slTpConfig.takeProfitPrice,
          order_group_id: orderGroupId,
          status: "pending",
          parent_order_id: primaryOrder?.id,
        })
      );

      const { error: tpError } = await supabase
        .from("orders")
        .insert(takeProfitData);

      if (tpError) throw tpError;
    }

    // Create trailing stop order if enabled
    if (slTpConfig?.enableTrailingStop && slTpConfig.trailingStopDistance) {
      const trailingStopData = omitUndefined(
        normalizeDates({
          user_id: userId,
          symbol,
          asset_class: assetClass,
          order_type: "trailing_stop",
          order_category: "trailing_stop",
          direction: direction === "buy" ? "sell" : "buy", // Opposite direction
          units,
          requested_price: price, // Will be adjusted dynamically
          position_value: units * price,
          margin_required: 0,
          trailing_stop_distance: slTpConfig.trailingStopDistance,
          order_group_id: orderGroupId,
          status: "pending",
          parent_order_id: primaryOrder?.id,
        })
      );

      const { error: tsError } = await supabase
        .from("orders")
        .insert(trailingStopData);

      if (tsError) throw tsError;
    }

    return primaryOrder;
  },

  async cancelOrder(orderId: string) {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) throw error;
  },

  async modifyOrder(orderId: string, updates: Partial<EnhancedOrder>) {
    const { error } = await supabase
      .from("orders")
      .update(omitUndefined(normalizeDates(updates)))
      .eq("id", orderId);

    if (error) throw error;
  },
};
