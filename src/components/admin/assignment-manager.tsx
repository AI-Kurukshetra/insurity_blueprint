"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type {
  AdminAssignmentsDataResult,
  AdminClaimAssignmentRecord,
  AdminPolicyAssignmentRecord,
} from "@/lib/live-data";

type AssignmentManagerProps = {
  data: AdminAssignmentsDataResult;
};

export function AssignmentManager({ data }: AssignmentManagerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("Manage policy and claim assignments from the app.");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [policyCreateForm, setPolicyCreateForm] = useState({
    policyNumber: "",
    holderName: "",
    coverageSummary: "",
    premium: "",
    status: "Active",
    renewalDate: "",
    riskScore: "35",
  });
  const [policyForm, setPolicyForm] = useState({
    profileId: data.profiles[0]?.id ?? "",
    policyId: data.policies[0]?.id ?? "",
    assignmentRole: "policyholder",
  });
  const [claimForm, setClaimForm] = useState({
    profileId:
      data.profiles.find((profile) => profile.role === "adjuster")?.id ??
      data.profiles[0]?.id ??
      "",
    claimId: data.claims[0]?.id ?? "",
    assignmentRole: "adjuster",
  });

  const policyEligibleProfiles = useMemo(
    () => data.profiles.filter((profile) => profile.role === "policyholder" || profile.role === "broker"),
    [data.profiles]
  );
  const claimEligibleProfiles = useMemo(
    () => data.profiles.filter((profile) => profile.role === "adjuster" || profile.role === "admin"),
    [data.profiles]
  );
  const canCreatePolicyAssignment = policyEligibleProfiles.length > 0 && data.policies.length > 0;
  const canCreateClaimAssignment = claimEligibleProfiles.length > 0 && data.claims.length > 0;

  function refreshAfterMutation(nextMessage: string, nextStatus: "success" | "error") {
    setStatus(nextStatus);
    setMessage(nextMessage);
    startTransition(() => {
      router.refresh();
    });
  }

  function getFriendlyAdminMessage(message: string) {
    return message.toLowerCase().includes("row-level security")
      ? "Supabase rejected the write. Apply `supabase/claim-workflow-policies.sql` in the active project."
      : message;
  }

  async function handleCreatePolicy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.from("policies").insert({
        policy_number: policyCreateForm.policyNumber,
        holder_name: policyCreateForm.holderName,
        coverage_summary: policyCreateForm.coverageSummary,
        premium: Number(policyCreateForm.premium || 0),
        status: policyCreateForm.status,
        renewal_date: policyCreateForm.renewalDate || null,
        risk_score: Number(policyCreateForm.riskScore || 0),
        created_by: user?.id ?? null,
      });

      if (error) {
        refreshAfterMutation(getFriendlyAdminMessage(error.message), "error");
        return;
      }

      setPolicyCreateForm({
        policyNumber: "",
        holderName: "",
        coverageSummary: "",
        premium: "",
        status: "Active",
        renewalDate: "",
        riskScore: "35",
      });
      refreshAfterMutation("Policy created. It is now available for assignment after refresh.", "success");
    } catch (error) {
      refreshAfterMutation(
        error instanceof Error ? getFriendlyAdminMessage(error.message) : "Policy creation failed.",
        "error"
      );
    }
  }

  async function handleCreatePolicyAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.from("policy_assignments").insert({
        policy_id: policyForm.policyId,
        profile_id: policyForm.profileId,
        assignment_role: policyForm.assignmentRole,
        provisioning_source: "manual",
      });

      if (error) {
        refreshAfterMutation(getFriendlyAdminMessage(error.message), "error");
        return;
      }

      refreshAfterMutation("Policy assignment created.", "success");
    } catch (error) {
      refreshAfterMutation(
        error instanceof Error ? getFriendlyAdminMessage(error.message) : "Policy assignment failed.",
        "error"
      );
    }
  }

  async function handleCreateClaimAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client.from("claim_assignments").insert({
        claim_id: claimForm.claimId,
        profile_id: claimForm.profileId,
        assignment_role: claimForm.assignmentRole,
        provisioning_source: "manual",
      });

      if (error) {
        refreshAfterMutation(getFriendlyAdminMessage(error.message), "error");
        return;
      }

      refreshAfterMutation("Claim assignment created.", "success");
    } catch (error) {
      refreshAfterMutation(
        error instanceof Error ? getFriendlyAdminMessage(error.message) : "Claim assignment failed.",
        "error"
      );
    }
  }

  async function deletePolicyAssignment(assignment: AdminPolicyAssignmentRecord) {
    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client
        .from("policy_assignments")
        .delete()
        .eq("id", assignment.id);

      if (error) {
        refreshAfterMutation(getFriendlyAdminMessage(error.message), "error");
        return;
      }

      refreshAfterMutation("Policy assignment removed.", "success");
    } catch (error) {
      refreshAfterMutation(
        error instanceof Error
          ? getFriendlyAdminMessage(error.message)
          : "Policy assignment removal failed.",
        "error"
      );
    }
  }

  async function deleteClaimAssignment(assignment: AdminClaimAssignmentRecord) {
    try {
      const client = createSupabaseBrowserClient();
      const { error } = await client
        .from("claim_assignments")
        .delete()
        .eq("id", assignment.id);

      if (error) {
        refreshAfterMutation(getFriendlyAdminMessage(error.message), "error");
        return;
      }

      refreshAfterMutation("Claim assignment removed.", "success");
    } catch (error) {
      refreshAfterMutation(
        error instanceof Error
          ? getFriendlyAdminMessage(error.message)
          : "Claim assignment removal failed.",
        "error"
      );
    }
  }

  return (
    <section className="grid gap-6">
      <div
        className={`rounded-[1.2rem] border px-4 py-3 text-sm ${
          status === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : status === "error"
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-stone-200 bg-stone-50 text-stone-700"
        }`}
      >
        {message}
      </div>

      <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <p className="section-eyebrow">Policy Creation</p>
        <h2 className="section-title">Create a policy record</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">
          Create a policy here, then assign it to a broker or policyholder below.
        </p>
        <form onSubmit={handleCreatePolicy} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Policy number</span>
              <input
                type="text"
                required
                value={policyCreateForm.policyNumber}
                onChange={(event) =>
                  setPolicyCreateForm((current) => ({
                    ...current,
                    policyNumber: event.target.value,
                  }))
                }
                placeholder="POL-CY-2001"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Holder name</span>
              <input
                type="text"
                required
                value={policyCreateForm.holderName}
                onChange={(event) =>
                  setPolicyCreateForm((current) => ({
                    ...current,
                    holderName: event.target.value,
                  }))
                }
                placeholder="Broker Client Co"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Coverage summary</span>
            <input
              type="text"
              required
              value={policyCreateForm.coverageSummary}
              onChange={(event) =>
                setPolicyCreateForm((current) => ({
                  ...current,
                  coverageSummary: event.target.value,
                }))
              }
              placeholder="Cyber Liability - $1M limit"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Premium</span>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={policyCreateForm.premium}
                onChange={(event) =>
                  setPolicyCreateForm((current) => ({
                    ...current,
                    premium: event.target.value,
                  }))
                }
                placeholder="85000"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Status</span>
              <select
                value={policyCreateForm.status}
                onChange={(event) =>
                  setPolicyCreateForm((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              >
                <option value="Active">Active</option>
                <option value="Monitored">Monitored</option>
                <option value="Healthy">Healthy</option>
                <option value="Escalated">Escalated</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Renewal date</span>
              <input
                type="date"
                value={policyCreateForm.renewalDate}
                onChange={(event) =>
                  setPolicyCreateForm((current) => ({
                    ...current,
                    renewalDate: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Risk score</span>
              <input
                type="number"
                min="0"
                max="100"
                value={policyCreateForm.riskScore}
                onChange={(event) =>
                  setPolicyCreateForm((current) => ({
                    ...current,
                    riskScore: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={
              isPending ||
              !policyCreateForm.policyNumber ||
              !policyCreateForm.holderName ||
              !policyCreateForm.coverageSummary
            }
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Saving..." : "Create policy"}
          </button>
        </form>
      </article>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <p className="section-eyebrow">Policy Assignments</p>
          <h2 className="section-title">Link users to policies</h2>
          {!canCreatePolicyAssignment ? (
            <p className="mt-3 text-sm leading-7 text-stone-700">
              Add at least one policyholder or broker profile and one policy record before
              creating policy assignments.
            </p>
          ) : null}
          <form onSubmit={handleCreatePolicyAssignment} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">User</span>
              <select
                value={policyForm.profileId}
                onChange={(event) =>
                  setPolicyForm((current) => ({ ...current, profileId: event.target.value }))
                }
                disabled={!canCreatePolicyAssignment}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              >
                {policyEligibleProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.label} ({profile.role})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Policy</span>
              <select
                value={policyForm.policyId}
                onChange={(event) =>
                  setPolicyForm((current) => ({ ...current, policyId: event.target.value }))
                }
                disabled={!canCreatePolicyAssignment}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              >
                {data.policies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Assignment role</span>
              <select
                value={policyForm.assignmentRole}
                onChange={(event) =>
                  setPolicyForm((current) => ({
                    ...current,
                    assignmentRole: event.target.value,
                  }))
                }
                disabled={!canCreatePolicyAssignment}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              >
                <option value="policyholder">Policyholder</option>
                <option value="broker">Broker</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={
                isPending || !canCreatePolicyAssignment || !policyForm.profileId || !policyForm.policyId
              }
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Saving..." : "Create policy assignment"}
            </button>
          </form>
        </article>

        <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <p className="section-eyebrow">Claim Assignments</p>
          <h2 className="section-title">Link adjusters to claims</h2>
          {!canCreateClaimAssignment ? (
            <p className="mt-3 text-sm leading-7 text-stone-700">
              Add at least one adjuster or admin profile and one claim record before
              creating claim assignments.
            </p>
          ) : null}
          <form onSubmit={handleCreateClaimAssignment} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">User</span>
              <select
                value={claimForm.profileId}
                onChange={(event) =>
                  setClaimForm((current) => ({ ...current, profileId: event.target.value }))
                }
                disabled={!canCreateClaimAssignment}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              >
                {claimEligibleProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.label} ({profile.role})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Claim</span>
              <select
                value={claimForm.claimId}
                onChange={(event) =>
                  setClaimForm((current) => ({ ...current, claimId: event.target.value }))
                }
                disabled={!canCreateClaimAssignment}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              >
                {data.claims.map((claim) => (
                  <option key={claim.id} value={claim.id}>
                    {claim.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Assignment role</span>
              <select
                value={claimForm.assignmentRole}
                onChange={(event) =>
                  setClaimForm((current) => ({
                    ...current,
                    assignmentRole: event.target.value,
                  }))
                }
                disabled={!canCreateClaimAssignment}
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
              >
                <option value="adjuster">Adjuster</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={
                isPending || !canCreateClaimAssignment || !claimForm.profileId || !claimForm.claimId
              }
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Saving..." : "Create claim assignment"}
            </button>
          </form>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-eyebrow">Current Policy Assignments</p>
              <h2 className="section-title">Assigned portal and broker access</h2>
            </div>
            <span className="status-pill stable">{data.policyAssignments.length} records</span>
          </div>
          <div className="mt-5 space-y-3">
            {data.policyAssignments.length === 0 ? (
              <p className="text-sm leading-7 text-stone-700">No policy assignments found.</p>
            ) : (
              data.policyAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className="rounded-[1.3rem] border border-stone-200 bg-stone-50/80 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-950">{assignment.profileLabel}</p>
                      <p className="mt-1 text-sm text-stone-700">{assignment.policyLabel}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                        {assignment.assignmentRole} | {assignment.provisioningSource}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deletePolicyAssignment(assignment)}
                      disabled={isPending}
                      className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-eyebrow">Current Claim Assignments</p>
              <h2 className="section-title">Assigned adjuster access</h2>
            </div>
            <span className="status-pill stable">{data.claimAssignments.length} records</span>
          </div>
          <div className="mt-5 space-y-3">
            {data.claimAssignments.length === 0 ? (
              <p className="text-sm leading-7 text-stone-700">No claim assignments found.</p>
            ) : (
              data.claimAssignments.map((assignment) => (
                <article
                  key={assignment.id}
                  className="rounded-[1.3rem] border border-stone-200 bg-stone-50/80 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-950">{assignment.profileLabel}</p>
                      <p className="mt-1 text-sm text-stone-700">{assignment.claimLabel}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                        {assignment.assignmentRole} | {assignment.provisioningSource}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteClaimAssignment(assignment)}
                      disabled={isPending}
                      className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
    </section>
  );
}
