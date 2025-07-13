import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/utils.ts'
import { MarketData } from './types.ts'
import { fetchFromYahoo, transformYahooData } from './utils.ts'

const CACHE_DURATION_MINUTES = 5;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symbols } = await req.json();

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid "symbols" array in request body' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const fiveMinutesAgo = new Date(Date.now() - CACHE_DURATION_MINUTES * 60 * 1000).toISOString();

    // 1. Check for fresh data in the cache
    const { data: cachedData, error: cacheError } = await supabaseClient
      .from('market_data_cache')
      .select('*')
      .in('symbol', symbols)
      .gte('cached_at', fiveMinutesAgo);

    if (cacheError) {
      console.error('Error checking cache:', cacheError.message);
      // Non-fatal, proceed to fetch from API
    }

    const cachedSymbols = cachedData?.map(d => d.symbol) || [];
    const symbolsToFetch = symbols.filter(s => !cachedSymbols.includes(s));

    let finalData: MarketData[] = cachedData || [];

    // 2. Fetch missing data from API
    if (symbolsToFetch.length > 0) {
      console.log(`Cache miss for: ${symbolsToFetch.join(', ')}. Fetching from API.`);
      const yahooData = await fetchFromYahoo(symbolsToFetch);
      const fetchedData = transformYahooData(yahooData);

      if (fetchedData.length > 0) {
        // 3. Insert new data into cache
        const { error: insertError } = await supabaseClient
          .from('market_data_cache')
          .insert(fetchedData.map(d => ({ ...d, cached_at: new Date() }))); // Add timestamp

        if (insertError) {
          console.error('Error inserting into cache:', insertError.message);
          // Non-fatal
        }
        finalData = [...finalData, ...fetchedData];
      }
    } else {
      console.log(`Cache hit for all symbols: ${symbols.join(', ')}`);
    }

    return new Response(
      JSON.stringify(finalData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e))
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})