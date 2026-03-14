"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { roleLabels } from "@/lib/auth";

export function AuthStatus() {
  const router = useRouter();
  const { isAuthenticated, isConfigured, loading, profile, signOut, user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-200">
        Checking session...
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-200">
        Authentication unavailable
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-[#f3d27a] px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-[#f7dd94]"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-3">
      <div className="text-right">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Signed in</p>
        <p className="text-sm font-medium text-white">
          {profile?.full_name ?? user?.email ?? "Authenticated user"}
        </p>
        <p className="text-xs text-slate-300">
          {profile ? roleLabels[profile.role] : "Profile pending"}
        </p>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
