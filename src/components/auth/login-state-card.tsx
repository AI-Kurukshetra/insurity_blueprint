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
          The app is verifying whether a valid session already exists.
        </p>
      </article>
    );
  }

  if (!isAuthenticated) {
    return (
      <article className="rounded-[1.8rem] border border-stone-200 bg-[#f7f1e5] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Platform Overview</p>
        <h2 className="section-title">Role-based insurance operations</h2>
        <div className="mt-5 space-y-4 text-sm leading-7 text-stone-700">
          <p>
            SmartClaim Pro connects administrators, brokers, adjusters, and policyholders in one secure workspace.
          </p>
          <p>
            Teams can manage policies, track claims, upload evidence, review claim timelines, and monitor AI-assisted triage from one app.
          </p>
          <p>
            Each role sees only the routes and records assigned to them, so claims and account access stay scoped correctly.
          </p>
          <p>
            If you need access, request an account from an administrator and sign in with the credentials provided.
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
        Signed in as{" "}
        <span className="font-semibold text-stone-950">
          {profile?.full_name ?? user?.email}
        </span>
        {profile ? ` as ${roleLabels[profile.role]}.` : "."} You can move straight into
        the workspace.
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
