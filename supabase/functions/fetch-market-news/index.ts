import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const newsData = [
  {
    id: '1',
    title: 'Global Stocks Rally on Positive Economic Data',
    summary: 'Major stock indices around the world saw significant gains today after the release of strong manufacturing and employment data, signaling a robust economic recovery.',
    source: 'Financial Times',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1621264448270-9ef00e88a435?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    published_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    market_type: 'stocks',
    related_symbols: ['AAPL', 'GOOGL', 'MSFT'],
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'Tech Sector Faces Headwinds as New Regulations Proposed',
    summary: 'Technology stocks experienced a sell-off following the announcement of new regulatory proposals that could impact major tech giants. Investors are wary of the potential for increased compliance costs and restrictions on business models.',
    source: 'Reuters',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    published_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    market_type: 'stocks',
    related_symbols: ['AMZN', 'META'],
    sentiment: 'negative',
  },
  {
    id: '3',
    title: 'Oil Prices Surge as Geopolitical Tensions Rise',
    summary: 'Crude oil prices jumped over 5% today due to escalating geopolitical tensions in key oil-producing regions. The uncertainty has raised concerns about potential supply disruptions.',
    source: 'Bloomberg',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1611942759352-9a8d2086f91b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    market_type: 'commodities',
    related_symbols: ['WTI', 'BRENT'],
    sentiment: 'mixed',
  },
];

serve(async (req: Request) => {
  console.log("fetch-market-news function invoked");
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { market_type } = await req.json();
    const filteredNews = market_type
      ? newsData.filter((item) => item.market_type === market_type)
      : newsData;

    return new Response(JSON.stringify({ data: filteredNews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
