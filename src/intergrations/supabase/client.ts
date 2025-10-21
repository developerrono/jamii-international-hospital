// src/integrations/supabase/client.ts

import { createClient } from "@supabase/supabase-js";

// !!! --- CHANGE 1: Use VITE_ prefix --- !!!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const createSupabaseClient = () =>
  createClient(
    supabaseUrl, // The '!' is removed because import.meta.env.VITE_... is typed correctly
    supabaseKey
  );

// !!! --- CHANGE 2: Export the client directly for easy use --- !!!
// If you intend to use this client across your app, you should export the instance
// or a simple wrapper that calls the create function once.
// For example:
// export const supabase = createSupabaseClient();