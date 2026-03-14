import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publishableKey, supabaseConfig, url } from "@/lib/supabase";

export async function createSupabaseServerClient() {
  if (!supabaseConfig.isConfigured || !url || !publishableKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components cannot always mutate cookies directly.
        }
      },
    },
  });
}
