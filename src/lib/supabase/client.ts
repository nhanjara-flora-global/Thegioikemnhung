import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

// Dùng trong Client Component ('use client').
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
