import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Position {
  account_id: string;
  asset_id: string;
  quantity: number;
  entry_price: number;
  side: 'LONG' | 'SHORT';
  margin_required: number;
  assets: {
    symbol: string;
    name: string;
    current_price: number;
  };
}

interface Trade {
  account_id: string;
  asset_id: string;
  quantity: number;
  entry_price: number;
  exit_price: number;
  side: 'BUY' | 'SELL';
  status: 'FILLED';
  assets: {
    symbol: string;
    name: string;
    current_price: number;
  };
}

const getPortfolioAnalytics = async (supabase: SupabaseClient, userId: string) => {
  // 1. Fetch user's primary account
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('id, balance, margin_used')
    .eq('user_id', userId)
    .single();

  if (accountError) throw new Error(`Failed to fetch account: ${accountError.message}`);

  // 2. Fetch open positions
  const { data: positions, error: positionsError } = await supabase
    .from('positions')
    .select('*, assets(*)')
    .eq('account_id', account.id);

  if (positionsError) throw new Error(`Failed to fetch positions: ${positionsError.message}`);

  // 3. Calculate unrealized P&L and total portfolio value from open positions
  let unrealizedPnl = 0;
  let portfolioValue = 0;
  let totalMarginUsed = 0;

  for (const pos of positions as Position[]) {
    const direction = pos.side === 'LONG' ? 1 : -1;
    const pnl = (pos.assets.current_price - pos.entry_price) * pos.quantity * direction;
    unrealizedPnl += pnl;
    portfolioValue += pos.quantity * pos.assets.current_price;
    totalMarginUsed += pos.margin_required;
  }

  const equity = account.balance + unrealizedPnl;

  // 4. Fetch closed trades to calculate realized P&L and other stats
  const { data: closedTrades, error: tradesError } = await supabase
    .from('orders')
    .select('*, assets(*)')
    .eq('account_id', account.id)
    .eq('status', 'FILLED')
    .not('exit_price', 'is', null);

  if (tradesError) throw new Error(`Failed to fetch closed trades: ${tradesError.message}`);
  
  let realizedPnl = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  let grossProfit = 0;
  let grossLoss = 0;

  for (const trade of closedTrades as Trade[]) {
      const direction = trade.side === 'BUY' ? 1 : -1;
      const pnl = (trade.exit_price - trade.entry_price) * trade.quantity * direction;
      realizedPnl += pnl;
      if (pnl > 0) {
          winningTrades++;
          grossProfit += pnl;
      } else {
          losingTrades++;
          grossLoss += Math.abs(pnl);
      }
  }

  const totalTrades = winningTrades + losingTrades;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

  // 5. Format data for the frontend
  const topHoldings = (positions as Position[]).slice(0, 5).map(pos => ({
    symbol: pos.assets.symbol,
    name: pos.assets.name,
    value: pos.quantity * pos.assets.current_price,
    allocation: (pos.quantity * pos.assets.current_price / portfolioValue) * 100,
    change_percent: ((pos.assets.current_price - pos.entry_price) / pos.entry_price) * 100,
    quantity: pos.quantity,
    price: pos.assets.current_price,
    entry_price: pos.entry_price,
    pnl: (pos.assets.current_price - pos.entry_price) * pos.quantity * (pos.side === 'LONG' ? 1 : -1),
  }));

  return {
    portfolio_value: portfolioValue,
    daily_change: 0, // Placeholder - requires historical data
    daily_change_percent: 0, // Placeholder
    total_gain: unrealizedPnl + realizedPnl,
    total_gain_percent: ((unrealizedPnl + realizedPnl) / account.balance) * 100,
    cash_balance: account.balance,
    locked_funds: totalMarginUsed,
    margin_level: totalMarginUsed > 0 ? (equity / totalMarginUsed) * 100 : 0,
    equity: equity,
    win_rate: winRate,
    profit_factor: profitFactor,
    allocation: {}, // Placeholder
    performance: {}, // Placeholder
    top_holdings: topHoldings,
    recent_trades: [], // Placeholder
  };
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the user's authorization context
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { userId } = await req.json() as { userId: string };
    if (!userId) throw new Error("User ID is required");

    const analytics = await getPortfolioAnalytics(supabase, userId);

    return new Response(JSON.stringify({ success: true, data: analytics }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
