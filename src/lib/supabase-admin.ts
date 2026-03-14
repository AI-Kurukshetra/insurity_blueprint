import { createClient } from "@supabase/supabase-js";
import { url } from "@/lib/supabase";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdminConfig = {
  isConfigured: Boolean(url && serviceRoleKey),
};

export function createSupabaseAdminClient() {
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
