"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

export function ResetPasswordPanel() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(supabaseConfig.isConfigured);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Open this screen from the password reset email to continue."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabaseConfig.isConfigured) {
      return;
    }

    const client = createSupabaseBrowserClient();
    let isActive = true;

    async function checkSession() {
      const {
        data: { session },
      } = await client.auth.getSession();

      if (!isActive) {
        return;
      }

      setHasRecoverySession(Boolean(session?.user));
      setCheckingSession(false);
      setMessage(
        session?.user
          ? "Recovery session detected. Set a new password to finish the reset flow."
          : "No recovery session found. Request a reset link from the login page first."
      );
    }

    void checkSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (!isActive) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasRecoverySession(Boolean(session?.user));
        setCheckingSession(false);
        setMessage("Recovery session detected. Set a new password to finish the reset flow.");
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Password reset is not available yet.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.auth.updateUser({
        password,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("success");
      setMessage("Password updated. Redirecting to sign-in.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Password update failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkingSession) {
    return (
      <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Recovery</p>
        <h2 className="section-title">Checking reset session</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          Verifying your password recovery link.
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <p className="section-eyebrow">Recovery</p>
      <h2 className="section-title">Set a new password</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-stone-700">{message}</p>

      {hasRecoverySession ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">New password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Confirm password</span>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat the password"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Back to login
          </Link>
        </div>
      )}

      <div
        className={`mt-5 rounded-[1.2rem] border px-4 py-3 text-sm ${
          status === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : status === "error"
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-stone-200 bg-stone-50 text-stone-700"
        }`}
      >
        {status === "idle"
          ? "Use the reset email link to open this page with a valid recovery session."
          : message}
      </div>
    </article>
  );
}
