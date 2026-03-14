import { LiveStatusBanner } from "@/components/live-status-banner";
import type { DocumentsDataResult } from "@/lib/live-data";

export function RecentDocuments({ data }: { data: DocumentsDataResult }) {
  return (
    <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-eyebrow">Recent Documents</p>
          <h2 className="section-title">Evidence linked to accessible claims</h2>
        </div>
        <span className={`status-pill ${data.mode === "live" ? "healthy" : "watch"}`}>
          {data.records.length} files
        </span>
      </div>

      <div className="mt-5">
        <LiveStatusBanner mode={data.mode} message={data.message} />
      </div>

      <div className="mt-5 space-y-3">
        {data.records.length === 0 ? (
          <p className="text-sm leading-7 text-stone-700">
            Upload the first incident artifact to start the document trail.
          </p>
        ) : (
          data.records.map((document) => (
            <article
              key={document.id}
              className="rounded-[1.3rem] border border-stone-200 bg-stone-50/80 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-stone-950">{document.fileName}</p>
                  <p className="mt-1 text-sm text-stone-700">{document.claimLabel}</p>
                </div>
                <div className="text-right">
                  <span className="status-pill stable">{document.documentType}</span>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                    {document.uploadedAt}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </article>
  );
}
