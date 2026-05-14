import { createClient, SupabaseClient } from "@supabase/supabase-js";

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

console.log("🔍 Supabase Environment Debug:");
console.log("  URL:", envUrl ? "✓ Set" : "✗ MISSING");
console.log("  Key:", envKey ? "✓ Set (length: " + envKey.length + ")" : "✗ MISSING");

export const isSupabaseConfigured = 
  Boolean(envUrl) && 
  Boolean(envKey) &&
  !envUrl.includes("your-project") &&
  !envKey.includes("your-anon-key") &&
  envUrl.startsWith("https://") &&
  envKey.startsWith("eyJ");

console.log("  Configured:", isSupabaseConfigured);

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(envUrl, envKey)
  : createClient("https://placeholder.supabase.co", "placeholder-key");

export const supabaseUrl = envUrl;
export const supabaseAnonKey = envKey;

export function getSupabaseConfig() {
  return {
    configured: isSupabaseConfigured,
    url: envUrl ? "✓ Set" : "✗ Missing",
    key: envKey ? "✓ Set" : "✗ Missing",
  };
}