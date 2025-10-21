// Replace @supabase/ssr with the standard client
import { createClient } from '@supabase/supabase-js';

// 1. Reference the variables using Vite's 'import.meta.env' syntax
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Add validation to ensure they were loaded
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Key not found in environment variables (check your .env file and VITE_ prefix)');
}

// 3. Create and export the client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// This ensures you are using a named export, which fixes your previous error:
// import { supabase } from '...';