import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/utils";
import { MarketData } from "../_shared/types";

console.log("Hello from fetch-market-data!");

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract symbol from request body
    const { symbol = 'IBM' } = await req.json();

    // Create a Supabase client using the user's authorization token
    const supabaseClient = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 1. Check for fresh data in Supabase first (cache)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data: existingData, error: existingError } = await supabaseClient
      .from('market_data')
      .select('*')
      .eq('symbol', symbol)
      .gte('timestamp', fiveMinutesAgo)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    // If fresh data exists, return it from cache
    if (existingData) {
      console.log(`Cache hit for symbol: ${symbol}. Returning existing data.`);
      return new Response(JSON.stringify({ data: existingData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Log other errors, but ignore 'PGRST116' (single row not found), which is expected on a cache miss.
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking cache:', existingError.message);
      // Depending on policy, we could fail here or proceed to API.
      // For resilience, we'll proceed.
    }

    console.log(`Cache miss for symbol: ${symbol}. Fetching from external API.`);

    // 2. Fetch data from external API (Alpha Vantage)
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`);
    if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
    }
    const externalData = await response.json();

    // Simplified data transformation
    const timeSeries = externalData['Time Series (5min)'];
    if (!timeSeries) {
        throw new Error("Data format error: 'Time Series (5min)' not found in API response.");
    }
    const latestTimestamp = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTimestamp];

    // Ensure data types match the 'MarketData' interface
    const marketData: MarketData = {
      symbol: symbol,
      timestamp: new Date(latestTimestamp),
      open: parseFloat(latestData['1. open']),
      high: parseFloat(latestData['2. high']),
      low: parseFloat(latestData['3. low']),
      close: parseFloat(latestData['4. close']),
      volume: parseInt(latestData['5. volume'], 10),
    };

    // 3. Insert new data into Supabase
    const { data, error } = await supabaseClient
      .from('market_data')
      .insert(marketData)
      .select();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    // Type-safe error handling
    const error = e instanceof Error ? e : new Error(String(e));
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}
