CREATE TABLE public.market_data_cache (
    symbol TEXT PRIMARY KEY,
    name TEXT,
    live_price REAL,
    buy_price REAL,
    sell_price REAL,
    change_percent_24h REAL,
    volume BIGINT,
    cached_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.market_data_cache
    FOR SELECT
    USING (true);