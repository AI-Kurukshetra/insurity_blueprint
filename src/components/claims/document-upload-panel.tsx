"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import type { ClaimOption } from "@/lib/live-data";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

type UploadState = {
  claimId: string;
  documentType: string;
};

const bucketName = "claim-documents";

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function getFriendlyUploadMessage(message: string, stage: "storage" | "documents") {
  const normalized = message.toLowerCase();

  if (normalized.includes("row-level security")) {
    if (stage === "storage") {
      return "Upload access is unavailable right now. Please verify document permissions and try again.";
    }

    return "The document could not be attached to this claim right now. Please verify claim access and try again.";
  }

  return message;
}

export function DocumentUploadPanel({
  initialClaims,
}: {
  initialClaims: ClaimOption[];
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [formState, setFormState] = useState<UploadState>({
    claimId: initialClaims[0]?.id ?? "",
    documentType: "incident-report",
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    initialClaims.length === 0
      ? "No accessible claims are available for upload yet."
      : "Upload evidence and attach it to a claim."
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfig.isConfigured) {
      setStatus("error");
      setMessage("Document upload is not available right now.");
      return;
    }

    if (!file) {
      setStatus("error");
      setMessage("Choose a file before uploading.");
      return;
    }

    const claim = initialClaims.find((item) => item.id === formState.claimId);
    if (!claim) {
      setStatus("error");
      setMessage("Choose a valid claim before uploading.");
      return;
    }

    setStatus("loading");

    try {
      const client = createSupabaseBrowserClient();
      const filePath = `${claim.id}/${Date.now()}-${sanitizeFileName(file.name)}`;

      const { error: storageError } = await client.storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: false,
        });

      if (storageError) {
        setStatus("error");
        setMessage(getFriendlyUploadMessage(storageError.message, "storage"));
        return;
      }

      const { error: documentError } = await client.from("documents").insert({
        claim_id: claim.id,
        policy_id: claim.policy_id,
        file_name: file.name,
        bucket_path: filePath,
        document_type: formState.documentType,
        uploaded_by: user?.id ?? null,
      });

      if (documentError) {
        await client.storage.from(bucketName).remove([filePath]);
        setStatus("error");
        setMessage(getFriendlyUploadMessage(documentError.message, "documents"));
        return;
      }

      setStatus("success");
      setMessage(`Uploaded ${file.name} successfully.`);
      setFile(null);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? getFriendlyUploadMessage(error.message, "documents")
          : "Document upload failed."
      );
    }
  }

  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <p className="section-eyebrow">Documents</p>
      <h2 className="section-title">Upload claim evidence</h2>
      <p className="mt-3 text-sm leading-7 text-stone-700">
        Add supporting files so the assigned team can review evidence alongside the claim.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Claim</span>
          <select
            required
            value={formState.claimId}
            onChange={(event) =>
              setFormState((current) => ({ ...current, claimId: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
          >
            {initialClaims.length === 0 ? <option value="">No accessible claims</option> : null}
            {initialClaims.map((claim) => (
              <option key={claim.id} value={claim.id}>
                {claim.claim_number} - {claim.holder_name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Document type</span>
          <select
            value={formState.documentType}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                documentType: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-teal-700"
          >
            <option value="incident-report">Incident report</option>
            <option value="invoice">Invoice</option>
            <option value="forensic-report">Forensic report</option>
            <option value="legal-notice">Legal notice</option>
            <option value="supporting-evidence">Supporting evidence</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">File</span>
          <input
            type="file"
            required
            onChange={handleFileChange}
            className="mt-2 block w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900"
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading" || initialClaims.length === 0 || !file}
          className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Uploading..." : "Upload document"}
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
