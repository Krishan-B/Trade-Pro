-- Enable RLS (if not already)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts for authenticated users
CREATE POLICY "Allow insert for authenticated users"
  ON public.leads
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);