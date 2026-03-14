import { redirect } from "next/navigation";
import { canAccessRole, fetchUserProfile, getDefaultRouteForRole, type UserProfile, type UserRole } from "@/lib/auth";
import { supabaseConfig } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type ServerAuthState = {
  isConfigured: boolean;
  user: { id: string; email?: string | null } | null;
  profile: UserProfile | null;
  error: string | null;
};

function buildLoginPath(nextPath: string) {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export async function getServerAuthState(): Promise<ServerAuthState> {
  if (!supabaseConfig.isConfigured) {
    return {
      isConfigured: false,
      user: null,
      profile: null,
      error: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      isConfigured: true,
      user: null,
      profile: null,
      error: userError?.message ?? null,
    };
  }

  const profileResult = await fetchUserProfile(supabase, user.id);

  return {
    isConfigured: true,
    user: {
      id: user.id,
      email: user.email,
    },
    profile: profileResult.data,
    error: profileResult.error?.message ?? null,
  };
}

export async function requireServerSession(options: {
  nextPath: string;
  allowedRoles?: UserRole[];
}) {
  const authState = await getServerAuthState();

  if (!authState.isConfigured || !authState.user) {
    redirect(buildLoginPath(options.nextPath));
  }

  if (!authState.profile) {
    redirect(buildLoginPath(options.nextPath));
  }

  if (!canAccessRole(authState.profile.role, options.allowedRoles)) {
    redirect(getDefaultRouteForRole(authState.profile.role));
  }

  return authState;
}

export async function redirectAuthenticatedUserFromAuthPage() {
  const authState = await getServerAuthState();

  if (authState.user && authState.profile) {
    redirect(getDefaultRouteForRole(authState.profile.role));
  }

  return authState;
}
