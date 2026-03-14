"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { getDefaultRouteForRole, roleLabels } from "@/lib/auth";

export function LoginStateCard() {
  const { authError, isAuthenticated, loading, profile, user } = useAuth();

  if (loading) {
    return (
      <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Session</p>
        <h2 className="section-title">Checking sign-in state</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          The app is verifying whether a valid Supabase session already exists.
        </p>
      </article>
    );
  }

  if (!isAuthenticated) {
    return (
      <article className="rounded-[1.8rem] border border-stone-200 bg-[#f7f1e5] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Auth notes</p>
        <h2 className="section-title">What this flow expects</h2>
        <div className="mt-5 space-y-4 text-sm leading-7 text-stone-700">
          <p>
            Enable email and password auth in Supabase. New accounts store a linked role
            profile in the `profiles` table.
          </p>
          <p>
            If email confirmation is on, use the login page as the confirmation redirect
            target so verified users return to the app cleanly.
          </p>
          <p>
            Supported roles are policyholder, broker, adjuster, and admin. Access to the
            claims, portal, and broker routes is now role-aware.
          </p>
          <p>
            Apply the updated SQL trigger and RLS policies before testing. Without them,
            the app can authenticate but cannot load the account profile.
          </p>
        </div>
      </article>
    );
  }

  if (authError) {
    return (
      <article className="rounded-[1.8rem] border border-rose-200 bg-rose-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Profile error</p>
        <h2 className="section-title">The account is signed in but the profile is not ready</h2>
        <p className="mt-3 text-sm leading-7 text-rose-900">{authError}</p>
      </article>
    );
  }

  return (
    <article className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <p className="section-eyebrow">Session active</p>
      <h2 className="section-title">You are already signed in</h2>
      <p className="mt-3 text-sm leading-7 text-stone-700">
        Auth is working for{" "}
        <span className="font-semibold text-stone-950">
          {profile?.full_name ?? user?.email}
        </span>
        {profile ? ` as ${roleLabels[profile.role]}.` : "."} You can move straight into
        the protected workflow areas.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={getDefaultRouteForRole(profile?.role)}
          className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Open default workspace
        </Link>
        <Link
          href="/"
          className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
        >
          Open dashboard
        </Link>
      </div>
    </article>
  );
}
