import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient: SupabaseClient | null = null;

export const supabaseConfig = {
  url,
  publishableKey,
  isConfigured: Boolean(url && publishableKey),
};

export function createSupabaseBrowserClient() {
  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  if (!browserClient) {
    browserClient = createBrowserClient(url, publishableKey);
  }

  return browserClient;
}

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
