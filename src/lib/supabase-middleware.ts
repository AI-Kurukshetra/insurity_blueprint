import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publishableKey, supabaseConfig, url } from "@/lib/supabase";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  if (!supabaseConfig.isConfigured || !url || !publishableKey) {
    return {
      response,
      user: null,
    };
  }

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    response,
    user,
  };
}
