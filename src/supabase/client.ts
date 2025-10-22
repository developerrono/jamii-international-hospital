// /src/intergrations/supabase/client.ts (Hardcoded for immediate progress)

import { createClient } from "@supabase/supabase-js"; 

// 🛑🛑 TEMPORARY HARDCODED CREDENTIALS 🛑🛑
// You MUST replace these with your actual URL and KEY from your Supabase Project Settings.
const supabaseUrl = "https://scemivmaleextlvmcywu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZW1pdm1hbGVleHRsdm1jeXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNjYwNDYsImV4cCI6MjA3NjY0MjA0Nn0.yNAPil2zvFFeGPE4U5GVkNAIm9R5wa3rdj9VCG5bbEI";

// The error check is removed to allow initialization
// if (!supabaseUrl || !supabaseAnonKey) { ... } 

// Create and export the initialized client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);