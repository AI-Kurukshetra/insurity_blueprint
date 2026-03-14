"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { ensureUserProfile, getDefaultRouteForRole, roleLabels } from "@/lib/auth";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

type AuthMode = "sign-in" | "forgot-password";

type SignInState = {
  email: string;
  password: string;
};

type RecoveryState = {
  email: string;
};

const initialSignInState: SignInState = {
  email: "",
  password: "",
};

const initialRecoveryState: RecoveryState = {
  email: "",
};

function getResetRedirectUrl() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return new URL("/reset-password", window.location.origin).toString();
}

function getFriendlyAuthMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit") || normalized.includes("email limit")) {
    return "Email sending is temporarily rate-limited. Please wait a moment and try again.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }

  return message;
}

export function AuthPanel({ nextPath }: { nextPath: string | null }) {
  const router = useRouter();
  const { isAuthenticated, profile } = useAuth();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [signInState, setSignInState] = useState(initialSignInState);
  const [recoveryState, setRecoveryState] = useState(initialRecoveryState);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Sign in with your SmartClaim Pro account. New accounts are created by an administrator."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Authentication is not available yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const client = createSupabaseBrowserClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: signInState.email,
        password: signInState.password,
      });

      if (error || !data.user) {
        setStatus("error");
        setMessage(getFriendlyAuthMessage(error?.message ?? "Sign-in failed."));
        return;
      }

      const profileResult = await ensureUserProfile(client, data.user);

      if (profileResult.error) {
        setStatus("error");
        setMessage(profileResult.error.message);
        return;
      }

      const destination = nextPath ?? getDefaultRouteForRole(profileResult.data?.role);
      setStatus("success");
      setMessage("Sign-in successful. Redirecting to your workspace.");
      router.replace(destination);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(
        getFriendlyAuthMessage(error instanceof Error ? error.message : "Sign-in failed.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Authentication is not available yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.auth.resetPasswordForEmail(recoveryState.email, {
        redirectTo: getResetRedirectUrl(),
      });

      if (error) {
        setStatus("error");
        setMessage(getFriendlyAuthMessage(error.message));
        return;
      }

      setStatus("success");
      setMessage("Password reset email sent. Open the link to choose a new password.");
    } catch (error) {
      setStatus("error");
      setMessage(
        getFriendlyAuthMessage(
          error instanceof Error ? error.message : "Password reset request failed."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthenticated && profile) {
    return (
      <article className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Account</p>
        <h2 className="section-title">You are already signed in</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          This account is active as <span className="font-semibold">{roleLabels[profile.role]}</span>.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              router.push(nextPath ?? getDefaultRouteForRole(profile.role));
            }}
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Open workspace
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
          >
            Go to dashboard
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <p className="section-eyebrow">Authentication</p>
      <h2 className="section-title">Sign in or create an account</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-stone-700">
        Access your workspace or request a password reset. Account setup is managed by administrators.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={
            mode === "sign-in"
              ? "rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white"
              : "rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
          }
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("forgot-password")}
          className={
            mode === "forgot-password"
              ? "rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white"
              : "rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
          }
        >
          Reset password
        </button>
      </div>

      {mode === "sign-in" ? (
        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Email address</span>
            <input
              type="email"
              required
              value={signInState.email}
              onChange={(event) =>
                setSignInState((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="team@example.com"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Password</span>
            <input
              type="password"
              required
              value={signInState.password}
              onChange={(event) =>
                setSignInState((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Enter your password"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordRecovery} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Email address</span>
            <input
              type="email"
              required
              value={recoveryState.email}
              onChange={(event) =>
                setRecoveryState({ email: event.target.value })
              }
              placeholder="team@example.com"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <p className="text-sm leading-7 text-stone-700">
            We will email a recovery link that opens the in-app password update screen.
          </p>
          <p className="text-sm leading-7 text-stone-700">
            Need a new account? Contact an administrator to provision access.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending reset email..." : "Send reset email"}
          </button>
        </form>
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
        {message}
      </div>
    </article>
  );
}
