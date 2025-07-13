CREATE TABLE account_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance NUMERIC(15, 2) DEFAULT 0.00,
    bonus NUMERIC(15, 2) DEFAULT 0.00,
    available_margin NUMERIC(15, 2) DEFAULT 0.00,
    used_margin NUMERIC(15, 2) DEFAULT 0.00,
    unrealized_pl NUMERIC(15, 2) DEFAULT 0.00,
    realized_pl NUMERIC(15, 2) DEFAULT 0.00,
    account_equity NUMERIC(15, 2) DEFAULT 0.00,
    buying_power NUMERIC(15, 2) DEFAULT 0.00,
    exposure NUMERIC(15, 2) DEFAULT 0.00,
    margin_level NUMERIC(10, 2) DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to create account_metrics on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.account_metrics (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE account_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own account metrics"
ON account_metrics
FOR SELECT
TO authenticated
USING (user_id = auth.uid());