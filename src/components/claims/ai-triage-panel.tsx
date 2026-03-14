import { LiveStatusBanner } from "@/components/live-status-banner";
import type { AiTriageCardRecord } from "@/lib/live-data";

type AiTriagePanelProps = {
  records: AiTriageCardRecord[];
  mode: "live" | "fallback";
  message: string;
  compact?: boolean;
};

export function AiTriagePanel({
  records,
  mode,
  message,
  compact = false,
}: AiTriagePanelProps) {
  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-[linear-gradient(145deg,rgba(10,50,44,0.96),rgba(8,30,53,0.92))] p-6 text-white shadow-[0_12px_40px_rgba(15,23,42,0.18)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-eyebrow text-teal-100/80">AI Triage</p>
          <h2 className="section-title max-w-md text-white">
            Explainable recommendations for claim prioritization
          </h2>
        </div>
        <span className={`status-pill ${mode === "live" ? "healthy" : "watch"}`}>
          {mode === "live" ? "Available" : "Review"}
        </span>
      </div>

      <div className="mt-5">
        <LiveStatusBanner mode={mode} message={message} />
      </div>

      <div className="mt-5 space-y-4">
        {records.length === 0 ? (
          <p className="text-sm leading-7 text-slate-200">
            No accessible claims are available for triage yet.
          </p>
        ) : (
          records.map((item) => (
            <article
              key={item.claimId}
              className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-300">{item.claimId}</p>
                  <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                </div>
                <span className={`status-pill ${item.tone}`}>{item.label}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-200">{item.summary}</p>
              {!compact ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.reasons.map((reason) => (
                    <span
                      key={`${item.claimId}-${reason}`}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </article>
  );
}
