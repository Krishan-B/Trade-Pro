import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Account {
  id: string;
  users: { username: string }[] | null; // Correctly type 'users' as an array of objects
}

interface Position {
  account_id: string;
  unrealized_pnl: number;
}

interface ClosedTrade {
  account_id: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
}

const getLeaderboard = async () => {
  // 1. Fetch all accounts with their associated user's username
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('id, users(username)');
  if (accountsError) throw new Error(`Failed to fetch accounts: ${accountsError.message}`);

  const accountIds = (accounts as Account[]).map(a => a.id);

  // 2. Fetch all positions to get unrealized P/L
  const { data: allPositions, error: positionsError } = await supabase
    .from('positions')
    .select('account_id, unrealized_pnl')
    .in('account_id', accountIds);
  if (positionsError) throw new Error(`Failed to fetch positions: ${positionsError.message}`);

  // 3. Fetch all closed trades to calculate realized P/L
  const { data: allClosedTrades, error: tradesError } = await supabase
    .from('orders')
    .select('account_id, entry_price, exit_price, quantity, side')
    .in('account_id', accountIds)
    .eq('status', 'FILLED')
    .not('exit_price', 'is', null);
  if (tradesError) throw new Error(`Failed to fetch closed trades: ${tradesError.message}`);

  // 4. Process data in memory to calculate total P/L for each user
  const userPnlMap = new Map<string, { username: string, pnl: number }>();

  // Initialize map with all users
  for (const acc of accounts as Account[]) {
    // Handle 'users' as an array and ensure it's not empty
    if (acc.users && acc.users.length > 0) {
      userPnlMap.set(acc.id, { username: acc.users[0].username, pnl: 0 });
    }
  }

  // Add unrealized P/L from open positions
  for (const pos of allPositions as Position[]) {
    const userData = userPnlMap.get(pos.account_id);
    if (userData) {
      userData.pnl += pos.unrealized_pnl || 0;
    }
  }

  // Add realized P/L from closed trades
  for (const trade of allClosedTrades as ClosedTrade[]) {
    const direction = trade.side === 'BUY' ? 1 : -1;
    const pnl = (trade.exit_price - trade.entry_price) * trade.quantity * direction;
    const userData = userPnlMap.get(trade.account_id);
    if (userData) {
      userData.pnl += pnl;
    }
  }

  // 5. Convert map to an array, sort by total P/L, and assign ranks
  const leaderboard = Array.from(userPnlMap.values())
    .map(data => ({
      username: data.username,
      total_pnl: data.pnl,
    }))
    .sort((a, b) => b.total_pnl - a.total_pnl)
    .slice(0, 100) // Consider top 100 for ranking
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

  return leaderboard.slice(0, 10); // Return only the top 10
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leaderboard = await getLeaderboard();
    return new Response(JSON.stringify({ success: true, data: leaderboard }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
