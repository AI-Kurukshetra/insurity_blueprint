"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import type { PolicyOption } from "@/lib/live-data";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

type FormState = {
  policyId: string;
  severity: "Low" | "Medium" | "High";
  incidentDate: string;
  reserveAmount: string;
  description: string;
};

const initialState: FormState = {
  policyId: "",
  severity: "Medium",
  incidentDate: "",
  reserveAmount: "",
  description: "",
};

function buildClaimNumber() {
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `CLM-${suffix}`;
}

export function ClaimSubmissionForm({
  initialPolicies,
}: {
  initialPolicies: PolicyOption[];
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [policies] = useState<PolicyOption[]>(initialPolicies);
  const [formState, setFormState] = useState<FormState>({
    ...initialState,
    policyId: initialPolicies[0]?.id || "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    initialPolicies.length === 0
      ? "No policies are available for claim submission yet."
      : "Create a new claim directly in Supabase. This requires the insert policy in the incremental SQL file."
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Supabase configuration is missing.");
      return;
    }

    setStatus("loading");

    try {
      const client = createSupabaseBrowserClient();
      const claimNumber = buildClaimNumber();

      const { error } = await client.from("claims").insert({
        claim_number: claimNumber,
        policy_id: formState.policyId,
        reported_by: user?.id ?? null,
        status: "Open",
        severity: formState.severity,
        incident_date: formState.incidentDate || null,
        reserve_amount: Number(formState.reserveAmount || 0),
        description: formState.description,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("success");
      setMessage(`Claim ${claimNumber} created successfully.`);
      setFormState((current) => ({
        ...initialState,
        policyId: current.policyId,
      }));
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Claim submission failed.");
    }
  }

  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <p className="section-eyebrow">New Claim</p>
      <h2 className="section-title">Submit a first notice of loss</h2>
      <p className="mt-3 text-sm leading-7 text-stone-700">
        This is the next critical workflow after authentication. It creates a claim
        record in Supabase and drops it into the live claims queue.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Policy</span>
          <select
            required
            value={formState.policyId}
            onChange={(event) =>
              setFormState((current) => ({ ...current, policyId: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
          >
            {policies.length === 0 ? (
              <option value="">No live policies available</option>
            ) : null}
            {policies.map((policy) => (
              <option key={policy.id} value={policy.id}>
                {policy.policy_number} - {policy.holder_name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Severity</span>
            <select
              value={formState.severity}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  severity: event.target.value as FormState["severity"],
                }))
              }
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Incident date</span>
            <input
              type="date"
              required
              value={formState.incidentDate}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  incidentDate: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Initial reserve amount</span>
          <input
            type="number"
            min="0"
            step="100"
            value={formState.reserveAmount}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                reserveAmount: event.target.value,
              }))
            }
            placeholder="50000"
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Loss narrative</span>
          <textarea
            required
            rows={5}
            value={formState.description}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Describe the incident, impact, and what documentation is already available."
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading" || policies.length === 0}
          className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Submitting claim..." : "Create claim"}
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
