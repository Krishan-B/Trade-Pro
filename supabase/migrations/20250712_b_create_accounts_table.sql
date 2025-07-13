CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  account_type VARCHAR(50) CHECK (account_type IN ('DEMO', 'COMPETITION')),
  balance DECIMAL(15,2) DEFAULT 0.00,
  equity DECIMAL(15,2) GENERATED ALWAYS AS (balance + unrealized_pnl) STORED,
  margin_used DECIMAL(15,2) DEFAULT 0.00,
  unrealized_pnl DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reset_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);
