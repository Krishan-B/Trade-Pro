import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const getLeaderboard = async () => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, accounts(balance, positions(unrealized_pnl))')
    .order('balance', { foreignTable: 'accounts', ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to fetch leaderboard data: ${error.message}`);
  }

  const leaderboard = users.map(user => {
    const account = user.accounts[0];
    const totalPnl = account.positions.reduce((acc: number, pos: { unrealized_pnl: number }) => acc + pos.unrealized_pnl, 0);
    const equity = account.balance + totalPnl;
    return {
      username: user.username,
      equity: equity,
      rank: 0, // will be set later
    };
  });

  // Sort by equity and assign rank
  leaderboard.sort((a, b) => b.equity - a.equity);
  leaderboard.forEach((user, index) => {
    user.rank = index + 1;
  });

  return leaderboard;
};

serve(async (req: Request) => {
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
});
