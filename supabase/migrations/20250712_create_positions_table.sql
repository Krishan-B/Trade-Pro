CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  asset_id UUID REFERENCES assets(id),
  side VARCHAR(5) CHECK (side IN ('LONG', 'SHORT')),
  quantity DECIMAL(15,4) NOT NULL,
  entry_price DECIMAL(15,5) NOT NULL,
  current_price DECIMAL(15,5),
  leverage INTEGER,
  margin_required DECIMAL(15,2),
  unrealized_pnl DECIMAL(15,2),
  rollover_charges DECIMAL(15,2) DEFAULT 0.00,
  take_profit DECIMAL(15,5),
  stop_loss DECIMAL(15,5),
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
