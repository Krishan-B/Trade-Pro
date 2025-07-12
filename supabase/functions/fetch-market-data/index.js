const { createHandler, SupabaseClient } = require('@supabase/functions');
const axios = require('axios');

const handler = async (req, res) => {
  const supabase = new SupabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const market = req.body.market;
  let data = [];

  try {
    const apiKey = process.env.YAHOO_FINANCE_API_KEY;
    const symbols = await getSymbolsForMarket(market);
    for (const symbol of symbols) {
      const assetData = await fetchYahooFinanceData(symbol, apiKey);
      data.push(assetData);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data });
};

async function getSymbolsForMarket(market) {
  // Fetch symbols from your database or a predefined list
  // For example:
  const { data, error } = await supabase.from('assets').select('symbol').eq('asset_class', market);
  if (error) throw error;
  return data.map(asset => asset.symbol);
}

async function fetchYahooFinanceData(symbol, apiKey) {
  const response = await axios.get(`https://yfapi.net/v6/finance/quote`, {
    params: {
      region: 'US',
      lang: 'en',
      symbols: symbol
    },
    headers: {
      'x-api-key': apiKey
    }
  });
  // Process response and return asset data
  const quote = response.data.quoteResponse.result[0];
  return {
    name: quote.longName,
    symbol: quote.symbol,
    price: quote.regularMarketPrice,
    change_percentage: quote.regularMarketChangePercent,
    volume: quote.regularMarketVolume,
    market_cap: quote.marketCap,
    market_type: market
  };
}

module.exports = { handler };
