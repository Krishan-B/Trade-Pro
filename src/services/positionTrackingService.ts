import { supabase } from "@/integrations/supabase/client";
import type {
  RealtimePostgresChangesPayload,
  RealtimeChannel,
} from "@supabase/supabase-js";

// Core position type matching the database schema
export interface Position {
  // Base fields
  id: string;
  user_id: string;
  symbol: string;
  direction: "buy" | "sell";
  units: number;
  entry_price: number;
  quantity: number;
  leverage: number;
  status: "open" | "closed";
  created_at: string;

  // Extended fields
  current_price: number;
  margin_used: number;
  position_value: number;
  unrealized_pnl: number | null;
  daily_pnl: number | null;
  total_fees: number | null;
  swap_charges: number | null;
  asset_class: string;
  pip_difference: number | null;
  stop_loss: number | null;
  take_profit: number | null;
}

// Real-time update type
export interface PositionUpdate {
  id: string;
  position_id: string;
  timestamp: string;
  price_update: number;
  pnl_change: number;
  unrealized_pnl: number;
  market_session: string;
}

export const positionTrackingService = {
  async fetchPositions(userId: string): Promise<Position[]> {
    const { data, error } = await supabase
      .from("positions")
      .select("*, positions_ext (*)")
      .eq("user_id", userId)
      .eq("status", "open")
      .order("entry_price", { ascending: false });

    if (error) throw error;

    // Transform the joined data into our Position interface
    interface PositionRow {
      id: string;
      user_id: string;
      symbol: string;
      direction?: string;
      quantity: number;
      entry_price: number;
      leverage: number;
      status: string;
      created_at: string;
      positions_ext?: {
        current_price?: number;
        margin_used?: number;
        position_value?: number;
        unrealized_pnl?: number | null;
        daily_pnl?: number | null;
        total_fees?: number | null;
        swap_charges?: number | null;
        asset_class?: string;
        pip_difference?: number | null;
        stop_loss?: number | null;
        take_profit?: number | null;
      };
    }

    return ((data as PositionRow[]) || []).map(
      (row): Position => ({
        id: row.id,
        user_id: row.user_id,
        symbol: row.symbol,
        direction: (row.direction?.toLowerCase() || "buy") as "buy" | "sell",
        units: row.quantity,
        entry_price: row.entry_price,
        quantity: row.quantity,
        leverage: row.leverage,
        status: (row.status?.toLowerCase() || "closed") as "open" | "closed",
        created_at: row.created_at,
        current_price: row.positions_ext?.current_price || row.entry_price,
        margin_used: row.positions_ext?.margin_used || 0,
        position_value: row.positions_ext?.position_value || 0,
        unrealized_pnl: row.positions_ext?.unrealized_pnl || null,
        daily_pnl: row.positions_ext?.daily_pnl || null,
        total_fees: row.positions_ext?.total_fees || null,
        swap_charges: row.positions_ext?.swap_charges || null,
        asset_class: row.positions_ext?.asset_class || "unknown",
        pip_difference: row.positions_ext?.pip_difference || null,
        stop_loss: row.positions_ext?.stop_loss || null,
        take_profit: row.positions_ext?.take_profit || null,
      })
    );
  },

  async updatePositionPrice(
    positionId: string,
    newPrice: number
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc("update_position_realtime", {
      p_position_id: positionId,
      p_new_price: newPrice,
    });

    if (error) throw error;
    return !!data;
  },

  async calculateRealtimePnL(
    positionId: string,
    newPrice: number
  ): Promise<{ unrealized_pnl: number; daily_pnl: number } | null> {
    const { data, error } = await supabase.rpc("calculate_realtime_pnl", {
      p_position_id: positionId,
      p_new_price: newPrice,
    });

    if (error) throw error;
    return data?.[0] || null;
  },

  subscribeToPositionUpdates(
    userId: string,
    onPositionUpdate: (position: Position) => void,
    onPositionUpdateEvent: (update: PositionUpdate) => void
  ) {
    return supabase
      .channel("positions")
      .on<RealtimePostgresChangesPayload<Position>>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "positions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const position = payload.new as Position;
          if (position && "id" in position) {
            onPositionUpdate(position);
          }
        }
      )
      .on<RealtimePostgresChangesPayload<PositionUpdate>>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "position_updates",
        },
        (payload) => {
          const update = payload.new as PositionUpdate;
          if (update && "id" in update) {
            onPositionUpdateEvent(update);
          }
        }
      );
  },

  unsubscribeFromPositionUpdates(channel: RealtimeChannel) {
    return supabase.removeChannel(channel);
  },
};
