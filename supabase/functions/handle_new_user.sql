
-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = PUBLIC
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  
  -- Create a lead record
  PERFORM net.http_post(
    url := 'https://' || net.url_host(current_setting('supabase.url')) || '/functions/v1/create-lead',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer " || current_setting("supabase.service_role_key")}',
    body := json_build_object('user', new)
  );

  RETURN new;
END;
$$;

-- Create a trigger to run this function whenever a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
