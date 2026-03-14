import type { PostgrestError, SupabaseClient, User } from "@supabase/supabase-js";

export const userRoles = ["policyholder", "broker", "adjuster", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  organization_name: string | null;
  created_at: string;
};

type ProfileOverrides = {
  email?: string | null;
  fullName?: string | null;
  role?: UserRole | null;
  organizationName?: string | null;
};

type ProfileResult = {
  data: UserProfile | null;
  error: PostgrestError | null;
};

export const roleLabels: Record<UserRole, string> = {
  policyholder: "Policyholder",
  broker: "Broker",
  adjuster: "Adjuster",
  admin: "Admin",
};

export function normalizeUserRole(value: string | null | undefined): UserRole | null {
  if (!value) {
    return null;
  }

  return userRoles.includes(value as UserRole) ? (value as UserRole) : null;
}

export function getDefaultRouteForRole(role: UserRole | null | undefined) {
  switch (role) {
    case "policyholder":
      return "/portal";
    case "broker":
      return "/broker";
    case "adjuster":
      return "/claims";
    case "admin":
      return "/";
    default:
      return "/";
  }
}

export function canAccessRole(
  role: UserRole | null | undefined,
  allowedRoles?: readonly UserRole[]
) {
  if (!allowedRoles?.length) {
    return true;
  }

  return Boolean(role && allowedRoles.includes(role));
}

export async function fetchUserProfile(
  client: SupabaseClient,
  userId: string
): Promise<ProfileResult> {
  const { data, error } = await client
    .from("profiles")
    .select("id, email, full_name, role, organization_name, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (!data || error) {
    return {
      data: null,
      error,
    };
  }

  const role = normalizeUserRole(data.role);

  return {
    data: {
      ...data,
      role: role ?? "policyholder",
    },
    error: null,
  };
}

export async function upsertUserProfile(
  client: SupabaseClient,
  user: User,
  overrides: ProfileOverrides = {}
): Promise<ProfileResult> {
  const metadata = user.user_metadata ?? {};
  const role =
    overrides.role ??
    normalizeUserRole(metadata.role as string | null | undefined) ??
    "policyholder";

  const { data, error } = await client
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: overrides.email ?? user.email ?? null,
        full_name:
          overrides.fullName ??
          (metadata.full_name as string | undefined) ??
          (metadata.fullName as string | undefined) ??
          null,
        role,
        organization_name:
          overrides.organizationName ??
          (metadata.organization_name as string | undefined) ??
          (metadata.organizationName as string | undefined) ??
          null,
      },
      { onConflict: "id" }
    )
    .select("id, email, full_name, role, organization_name, created_at")
    .single();

  if (!data || error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data: {
      ...data,
      role: normalizeUserRole(data.role) ?? "policyholder",
    },
    error: null,
  };
}

export async function ensureUserProfile(
  client: SupabaseClient,
  user: User,
  overrides: ProfileOverrides = {}
): Promise<ProfileResult> {
  const existing = await fetchUserProfile(client, user.id);

  if (existing.data) {
    return existing;
  }

  return upsertUserProfile(client, user, overrides);
}
