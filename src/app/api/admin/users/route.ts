import { NextResponse } from "next/server";
import { getServerAuthState } from "@/lib/auth-server";
import { normalizeUserRole } from "@/lib/auth";
import { createSupabaseAdminClient, supabaseAdminConfig } from "@/lib/supabase-admin";

type CreateAdminUserPayload = {
  email?: string;
  password?: string;
  fullName?: string;
  organizationName?: string;
  role?: string;
};

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const authState = await getServerAuthState();

  if (!authState.isConfigured) {
    return badRequest("Authentication is unavailable.", 503);
  }

  if (!authState.user || authState.profile?.role !== "admin") {
    return badRequest("Only administrators can create accounts.", 403);
  }

  if (!supabaseAdminConfig.isConfigured) {
    return badRequest(
      "Admin account creation is unavailable until the service role key is configured.",
      503
    );
  }

  const body = (await request.json()) as CreateAdminUserPayload;
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const fullName = body.fullName?.trim() ?? "";
  const organizationName = body.organizationName?.trim() ?? "";
  const role = normalizeUserRole(body.role);

  if (!email) {
    return badRequest("Email is required.");
  }

  if (password.length < 8) {
    return badRequest("Password must be at least 8 characters.");
  }

  if (!fullName) {
    return badRequest("Full name is required.");
  }

  if (!role) {
    return badRequest("Choose a valid role.");
  }

  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        organization_name: organizationName || null,
        role,
      },
    });

    if (error || !data.user) {
      return badRequest(error?.message ?? "Account creation failed.", 400);
    }

    return NextResponse.json({
      userId: data.user.id,
      email: data.user.email,
    });
  } catch (error) {
    return badRequest(
      error instanceof Error ? error.message : "Account creation failed.",
      500
    );
  }
}
