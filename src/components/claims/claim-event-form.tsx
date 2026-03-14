"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

type ClaimEventFormProps = {
  claimId: string | null;
  claimNumber: string;
};

export function ClaimEventForm({ claimId, claimNumber }: ClaimEventFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [eventType, setEventType] = useState("Coverage review");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [message, setMessage] = useState(
    "Add the next operational update so the claim timeline becomes visible to the assigned team."
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured || !claimId) {
      setStatus("error");
      setMessage("Timeline updates are not available for this claim right now.");
      return;
    }

    setStatus("loading");

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.from("claim_events").insert({
        claim_id: claimId,
        event_type: eventType,
        notes,
        created_by: user?.id ?? null,
      });

      if (error) {
        setStatus("error");
        setMessage(
          error.message.toLowerCase().includes("row-level security")
            ? "This update could not be saved right now. Please verify claim access and try again."
            : error.message
        );
        return;
      }

      setStatus("success");
      setMessage(`Timeline event added to ${claimNumber}.`);
      setNotes("");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Claim event creation failed.");
    }
  }

  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <p className="section-eyebrow">Claim Timeline</p>
      <h2 className="section-title">Log an operational event</h2>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Event type</span>
          <select
            value={eventType}
            onChange={(currentEvent) => setEventType(currentEvent.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
          >
            <option value="Coverage review">Coverage review</option>
            <option value="Document request">Document request</option>
            <option value="Adjuster note">Adjuster note</option>
            <option value="Reserve update">Reserve update</option>
            <option value="Payment review">Payment review</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Notes</span>
          <textarea
            required
            rows={4}
            value={notes}
            onChange={(currentEvent) => setNotes(currentEvent.target.value)}
            placeholder="Capture what changed, what is blocked, or what needs follow-up."
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading" || !claimId}
          className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Saving..." : "Add event"}
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
