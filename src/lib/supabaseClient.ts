import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;


if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not defined. Please check your .env file and restart the development server.');
  throw new Error('VITE_SUPABASE_URL is required.');
}
if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined. Please check your .env file and restart the development server.');
  throw new Error('VITE_SUPABASE_ANON_KEY is required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
