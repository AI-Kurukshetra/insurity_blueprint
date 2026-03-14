"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { canAccessRole, roleLabels, type UserRole } from "@/lib/auth";

type ProtectedRouteProps = {
  title: string;
  description: string;
  children: ReactNode;
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({
  title,
  description,
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authError, isAuthenticated, isConfigured, loading, profile, role } = useAuth();

  useEffect(() => {
    if (!loading && isConfigured && !isAuthenticated) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    }
  }, [isAuthenticated, isConfigured, loading, pathname, router]);

  if (loading) {
    return (
      <section className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Access</p>
        <h2 className="section-title">Checking your session</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          The app is verifying whether you are signed in.
        </p>
      </section>
    );
  }

  if (!isConfigured) {
    return (
      <section className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Access</p>
        <h2 className="section-title">Supabase auth is not configured</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          Add the publishable key and URL before testing authenticated screens.
        </p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Protected View</p>
        <h2 className="section-title">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700">{description}</p>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          Redirecting to sign-in before opening{" "}
          <span className="font-semibold text-stone-950">{pathname}</span>.
        </p>
        <div className="mt-5">
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  if (authError) {
    return (
      <section className="rounded-[1.8rem] border border-rose-200 bg-rose-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Access Error</p>
        <h2 className="section-title">Profile lookup failed</h2>
        <p className="mt-3 text-sm leading-7 text-rose-900">{authError}</p>
        <p className="mt-3 text-sm leading-7 text-rose-900">
          Apply the updated `profiles` policies and trigger in `supabase/schema.sql`, then
          reload the app.
        </p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Profile</p>
        <h2 className="section-title">Finishing account setup</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          Your account is signed in, but the role profile has not loaded yet.
        </p>
      </section>
    );
  }

  if (!canAccessRole(role, allowedRoles)) {
    return (
      <section className="rounded-[1.8rem] border border-amber-200 bg-amber-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Restricted</p>
        <h2 className="section-title">This workspace is not assigned to your role</h2>
        <p className="mt-3 text-sm leading-7 text-amber-950">
          You are signed in as <span className="font-semibold">{roleLabels[profile.role]}</span>.
          This route is reserved for {allowedRoles?.map((item) => roleLabels[item]).join(", ")}.
        </p>
        <div className="mt-5">
          <Link
            href="/"
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Return to dashboard
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
