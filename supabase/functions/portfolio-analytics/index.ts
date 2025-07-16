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
  updated_at: string; // Assuming this timestamp marks the trade closure
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
    .not('exit_price', 'is', null)
    .order('updated_at', { ascending: true }); // Order trades chronologically

  if (tradesError) throw new Error(`Failed to fetch closed trades: ${tradesError.message}`);
  
  let realizedPnl = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  const pnlHistory: { date: string; pnl: number; cumulativePnl: number }[] = [];
  let cumulativePnl = 0;

  for (const trade of closedTrades as Trade[]) {
      const direction = trade.side === 'BUY' ? 1 : -1;
      const pnl = (trade.exit_price - trade.entry_price) * trade.quantity * direction;
      
      realizedPnl += pnl;
      cumulativePnl += pnl;

      if (pnl > 0) {
          winningTrades++;
          grossProfit += pnl;
      } else {
          losingTrades++;
          grossLoss += Math.abs(pnl);
      }

      pnlHistory.push({
        date: trade.updated_at,
        pnl,
        cumulativePnl,
      });
  }

  const totalTrades = winningTrades + losingTrades;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

  // 5. Calculate Top/Worst Performing Assets
  const assetPnlMap = new Map<string, { name: string, pnl: number }>();

  // Process closed trades
  for (const trade of closedTrades as Trade[]) {
    const pnl = (trade.exit_price - trade.entry_price) * trade.quantity * (trade.side === 'BUY' ? 1 : -1);
    const assetData = assetPnlMap.get(trade.assets.symbol) || { name: trade.assets.name, pnl: 0 };
    assetData.pnl += pnl;
    assetPnlMap.set(trade.assets.symbol, assetData);
  }

  // Process open positions (unrealized P&L)
  for (const pos of positions as Position[]) {
    const pnl = (pos.assets.current_price - pos.entry_price) * pos.quantity * (pos.side === 'LONG' ? 1 : -1);
    const assetData = assetPnlMap.get(pos.assets.symbol) || { name: pos.assets.name, pnl: 0 };
    assetData.pnl += pnl;
    assetPnlMap.set(pos.assets.symbol, assetData);
  }

  const sortedAssets = Array.from(assetPnlMap.entries()).map(([symbol, data]) => ({
    symbol,
    name: data.name,
    pnl: data.pnl,
  })).sort((a, b) => b.pnl - a.pnl);

  const topPerformers = sortedAssets.slice(0, 5);
  const worstPerformers = sortedAssets.slice(-5).reverse();

  // 6. Format data for the frontend
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

  const allocation = (positions as Position[]).reduce((acc, pos) => {
    const value = pos.quantity * pos.assets.current_price;
    acc[pos.assets.symbol] = (acc[pos.assets.symbol] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const totalAllocationValue = Object.values(allocation).reduce((sum, value) => sum + value, 0);

  for (const symbol in allocation) {
    allocation[symbol] = (allocation[symbol] / totalAllocationValue) * 100;
  }

  return {
    portfolio_value: portfolioValue,
    daily_change: 0, // Placeholder - requires historical data from a separate table/service
    daily_change_percent: 0, // Placeholder
    total_gain: unrealizedPnl + realizedPnl,
    total_gain_percent: ((unrealizedPnl + realizedPnl) / account.balance) * 100,
    cash_balance: account.balance,
    locked_funds: totalMarginUsed,
    margin_level: totalMarginUsed > 0 ? (equity / totalMarginUsed) * 100 : 0,
    equity: equity,
    win_rate: winRate,
    profit_factor: profitFactor,
    allocation: allocation,
    performance: {
      pnl_history: pnlHistory,
    },
    top_holdings: topHoldings,
    top_performers: topPerformers,
    worst_performers: worstPerformers,
    recent_trades: (closedTrades as Trade[]).map(trade => ({
      id: `${trade.asset_id}-${trade.updated_at}`,
      symbol: trade.assets.symbol,
      name: trade.assets.name,
      type: trade.side,
      quantity: trade.quantity,
      price: trade.exit_price,
      total: trade.exit_price * trade.quantity,
      date: trade.updated_at,
    })),
  };
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the user's authorization context
    const supabase = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { userId } = await req.json() as { userId: string };
    if (!userId) throw new Error("User ID is required");

    const analytics = await getPortfolioAnalytics(supabase, userId);

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
