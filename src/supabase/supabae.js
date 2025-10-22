// /src/intergrations/supabase/client.ts

import { createClient } from "@supabase/supabase-js";

// Ensure you have a .env file in your root folder with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // This check provides a helpful error if the .env variables aren't loaded correctly
  throw new Error("Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) not found. Check your .env file and ensure you've restarted your dev server.");
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey);