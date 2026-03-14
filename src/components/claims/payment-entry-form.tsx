"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

type PaymentEntryFormProps = {
  claimId: string | null;
  policyId: string | null;
  claimNumber: string;
};

export function PaymentEntryForm({
  claimId,
  policyId,
  claimNumber,
}: PaymentEntryFormProps) {
  const router = useRouter();
  const { role } = useAuth();
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("Advance");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [message, setMessage] = useState(
    "Record claim payments here so financial progress is visible on the claim timeline."
  );

  if (role !== "admin") {
    return (
      <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Payments</p>
        <h2 className="section-title">Payment updates</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          Only administrators can log payment records. Assigned users can still review payment history below.
        </p>
      </article>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured || !claimId) {
      setStatus("error");
      setMessage("Live payment logging requires Supabase configuration and an accessible claim record.");
      return;
    }

    setStatus("loading");

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.from("payments").insert({
        claim_id: claimId,
        policy_id: policyId,
        amount: Number(amount || 0),
        payment_type: paymentType,
        status: paymentStatus,
        reference_number: referenceNumber || null,
      });

      if (error) {
        setStatus("error");
        setMessage(
          error.message.toLowerCase().includes("row-level security")
            ? "Supabase rejected the payment insert. Apply `supabase/claim-workflow-policies.sql` in the active project."
            : error.message
        );
        return;
      }

      setStatus("success");
      setMessage(`Payment record added to ${claimNumber}.`);
      setAmount("");
      setReferenceNumber("");
      setPaymentType("Advance");
      setPaymentStatus("Pending");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Payment insert failed.");
    }
  }

  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <p className="section-eyebrow">Payments</p>
      <h2 className="section-title">Log a payment update</h2>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Amount</span>
            <input
              type="number"
              min="0"
              step="100"
              required
              value={amount}
              onChange={(currentEvent) => setAmount(currentEvent.target.value)}
              placeholder="25000"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Payment type</span>
            <select
              value={paymentType}
              onChange={(currentEvent) => setPaymentType(currentEvent.target.value)}
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            >
              <option value="Advance">Advance</option>
              <option value="Reimbursement">Reimbursement</option>
              <option value="Vendor payment">Vendor payment</option>
              <option value="Settlement">Settlement</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Status</span>
            <select
              value={paymentStatus}
              onChange={(currentEvent) => setPaymentStatus(currentEvent.target.value)}
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Reference number</span>
            <input
              type="text"
              value={referenceNumber}
              onChange={(currentEvent) => setReferenceNumber(currentEvent.target.value)}
              placeholder="ACH-2026-001"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={status === "loading" || !claimId}
          className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Saving..." : "Add payment record"}
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
