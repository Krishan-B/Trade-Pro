CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  asset_class VARCHAR(50) CHECK (asset_class IN ('FOREX', 'STOCKS', 'INDICES', 'COMMODITIES', 'CRYPTO')),
  base_currency VARCHAR(10),
  quote_currency VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  leverage_max INTEGER,
  spread_base DECIMAL(8,5),
  contract_size DECIMAL(15,2) DEFAULT 1.00
);
