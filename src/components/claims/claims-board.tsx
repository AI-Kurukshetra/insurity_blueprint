import Link from "next/link";
import { LiveStatusBanner } from "@/components/live-status-banner";
import type { ClaimRecord } from "@/lib/sample-data";
import { currency } from "@/lib/supabase";

type ClaimsBoardProps = {
  records: ClaimRecord[];
  mode: "live" | "fallback";
  message: string;
};

export function ClaimsBoard({ records, mode, message }: ClaimsBoardProps) {
  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-eyebrow">Open Claims</p>
          <h2 className="section-title">Adjuster queue</h2>
        </div>
        <span className={`status-pill ${mode === "live" ? "healthy" : "watch"}`}>
          {mode === "live" ? "Live claims" : "Seeded claims"}
        </span>
      </div>

      <div className="mt-5">
        <LiveStatusBanner mode={mode} message={message} />
      </div>

      <div className="mt-5 space-y-4">
        {records.map((claim) => (
          <article
            key={claim.id}
            className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-stone-500">{claim.id}</p>
                <h3 className="mt-1 text-xl font-semibold text-stone-950">
                  {claim.account}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700">
                  {claim.summary}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className={`status-pill ${claim.tone}`}>{claim.status}</span>
                <p className="mt-3 text-lg font-semibold text-stone-950">
                  {currency.format(claim.reserve)}
                </p>
                <p className="text-sm text-stone-500">{claim.stage}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/claims/${encodeURIComponent(claim.id)}`}
                className="text-sm font-semibold text-teal-900"
              >
                Open claim detail
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {claim.tags.map((tag) => (
                <span
                  key={`${claim.id}-${tag}`}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}
