"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

export function MagicLinkPanel() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Use demo access to bypass email limits, or send a magic link if you still want email login."
  );
  const [mode, setMode] = useState<"anonymous" | "email" | null>(null);

  async function handleAnonymousSignIn() {
    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Supabase keys are missing. Add them before testing authentication.");
      return;
    }

    setMode("anonymous");

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.auth.signInAnonymously();

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("success");
      setMessage("Signed in as a demo user. You can now access protected routes.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Anonymous sign-in failed."
      );
    } finally {
      setMode(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Supabase keys are missing. Add them before testing authentication.");
      return;
    }

    setMode("email");

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("success");
      setMessage("Magic link sent. Check the inbox for the email address you entered.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Authentication request failed."
      );
    } finally {
      setMode(null);
    }
  }

  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <p className="section-eyebrow">Authentication</p>
      <h2 className="section-title">Demo access or magic link</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-stone-700">
        Demo access is the fastest hackathon path. Magic links remain available, but
        hosted Supabase projects can hit email sending limits quickly.
      </p>

      <div className="mt-6 rounded-[1.4rem] border border-stone-200 bg-stone-50/90 p-4">
        <p className="text-sm font-semibold text-stone-950">Recommended</p>
        <p className="mt-2 text-sm leading-7 text-stone-700">
          Continue as a demo user. This still creates a real Supabase user session for
          the protected routes.
        </p>
        <button
          type="button"
          onClick={handleAnonymousSignIn}
          disabled={mode !== null}
          className="mt-4 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mode === "anonymous" ? "Signing in..." : "Continue as demo user"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="team@example.com"
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
          />
        </label>
        <button
          type="submit"
          disabled={mode !== null}
          className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mode === "email" ? "Sending magic link..." : "Send magic link"}
        </button>
      </form>

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
