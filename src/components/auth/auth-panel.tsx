"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import {
  ensureUserProfile,
  getDefaultRouteForRole,
  roleLabels,
  userRoles,
  type UserRole,
} from "@/lib/auth";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

type AuthMode = "sign-in" | "create-account" | "forgot-password";

type SignInState = {
  email: string;
  password: string;
};

type SignUpState = {
  fullName: string;
  organizationName: string;
  role: UserRole;
  email: string;
  password: string;
  confirmPassword: string;
};

type RecoveryState = {
  email: string;
};

const initialSignInState: SignInState = {
  email: "",
  password: "",
};

const initialSignUpState: SignUpState = {
  fullName: "",
  organizationName: "",
  role: "policyholder",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialRecoveryState: RecoveryState = {
  email: "",
};

function getLoginRedirectUrl(nextPath: string | null) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const url = new URL("/login", window.location.origin);

  if (nextPath) {
    url.searchParams.set("next", nextPath);
  }

  return url.toString();
}

function getResetRedirectUrl() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return new URL("/reset-password", window.location.origin).toString();
}

function getFriendlyAuthMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit") || normalized.includes("email limit")) {
    return "Supabase email sending is rate-limited right now. For local testing, disable email confirmation in Supabase Auth or configure custom SMTP.";
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
  const [signUpState, setSignUpState] = useState(initialSignUpState);
  const [recoveryState, setRecoveryState] = useState(initialRecoveryState);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Sign in with your SmartClaim Pro account, or create a new role-based workspace profile."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Supabase keys are missing. Add them before testing authentication.");
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

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Supabase keys are missing. Add them before testing authentication.");
      return;
    }

    if (signUpState.password !== signUpState.confirmPassword) {
      setStatus("error");
      setMessage("Password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const client = createSupabaseBrowserClient();
      const { data, error } = await client.auth.signUp({
        email: signUpState.email,
        password: signUpState.password,
        options: {
          emailRedirectTo: getLoginRedirectUrl(nextPath),
          data: {
            full_name: signUpState.fullName,
            organization_name: signUpState.organizationName,
            role: signUpState.role,
          },
        },
      });

      if (error || !data.user) {
        setStatus("error");
        setMessage(getFriendlyAuthMessage(error?.message ?? "Account creation failed."));
        return;
      }

      if (!data.session) {
        setStatus("success");
        setMessage(
          "Account created. Check your email to confirm the address, then sign in."
        );
        setMode("sign-in");
        setSignInState({
          email: signUpState.email,
          password: "",
        });
        setSignUpState(initialSignUpState);
        return;
      }

      const profileResult = await ensureUserProfile(client, data.user, {
        email: signUpState.email,
        fullName: signUpState.fullName,
        organizationName: signUpState.organizationName,
        role: signUpState.role,
      });

      if (profileResult.error) {
        setStatus("error");
        setMessage(profileResult.error.message);
        return;
      }

      const destination = nextPath ?? getDefaultRouteForRole(profileResult.data?.role);
      setStatus("success");
      setMessage("Account created. Redirecting to your workspace.");
      router.replace(destination);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(
        getFriendlyAuthMessage(
          error instanceof Error ? error.message : "Account creation failed."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Supabase keys are missing. Add them before testing authentication.");
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
        End-app access is now based on real Supabase email and password authentication,
        backed by a role profile in the `profiles` table.
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
          onClick={() => setMode("create-account")}
          className={
            mode === "create-account"
              ? "rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white"
              : "rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
          }
        >
          Create account
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
      ) : mode === "create-account" ? (
        <form onSubmit={handleCreateAccount} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Full name</span>
            <input
              type="text"
              required
              value={signUpState.fullName}
              onChange={(event) =>
                setSignUpState((current) => ({ ...current, fullName: event.target.value }))
              }
              placeholder="Jordan Lee"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Organization</span>
              <input
                type="text"
                value={signUpState.organizationName}
                onChange={(event) =>
                  setSignUpState((current) => ({
                    ...current,
                    organizationName: event.target.value,
                  }))
                }
                placeholder="Northstar HealthTech"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Role</span>
              <select
                value={signUpState.role}
                onChange={(event) =>
                  setSignUpState((current) => ({
                    ...current,
                    role: event.target.value as UserRole,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              >
                {userRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Email address</span>
            <input
              type="email"
              required
              value={signUpState.email}
              onChange={(event) =>
                setSignUpState((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="team@example.com"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={signUpState.password}
                onChange={(event) =>
                  setSignUpState((current) => ({ ...current, password: event.target.value }))
                }
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
                value={signUpState.confirmPassword}
                onChange={(event) =>
                  setSignUpState((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                placeholder="Repeat the password"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
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
            Supabase will email a recovery link that redirects the user to the in-app
            password update screen.
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
