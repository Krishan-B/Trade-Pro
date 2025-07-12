CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  asset_id UUID REFERENCES assets(id),
  order_type VARCHAR(50) CHECK (order_type IN ('MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT')),
  side VARCHAR(4) CHECK (side IN ('BUY', 'SELL')),
  quantity DECIMAL(15,4) NOT NULL,
  price DECIMAL(15,5),
  stop_price DECIMAL(15,5),
  status VARCHAR(50) CHECK (status IN ('PENDING', 'FILLED', 'CANCELLED', 'REJECTED')),
  filled_quantity DECIMAL(15,4) DEFAULT 0,
  avg_fill_price DECIMAL(15,5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  filled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);
