import Link from "next/link";
import { notFound } from "next/navigation";
import { requireServerSession } from "@/lib/auth-server";
import { loadClaimDetail } from "@/lib/live-data";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ClaimEventForm } from "@/components/claims/claim-event-form";
import { PaymentEntryForm } from "@/components/claims/payment-entry-form";
import { LiveStatusBanner } from "@/components/live-status-banner";
import { PageShell } from "@/components/page-shell";
import { currency } from "@/lib/supabase";

type ClaimDetailPageProps = {
  params: Promise<{
    claimNumber: string;
  }>;
};

export default async function ClaimDetailPage({ params }: ClaimDetailPageProps) {
  await requireServerSession({
    nextPath: "/claims",
    allowedRoles: ["broker", "adjuster", "admin"],
  });

  const resolvedParams = await params;
  const claimNumber = decodeURIComponent(resolvedParams.claimNumber);
  const detail = await loadClaimDetail(claimNumber);

  if (!detail.claim) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Claim Detail"
      title={detail.claim.claimNumber}
      description="Review claim context, policy exposure, uploaded evidence, and the operational timeline in one workspace."
      cta={
        <Link
          href="/claims"
          className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
        >
          Back to claims
        </Link>
      }
    >
      <ProtectedRoute
        title="Claim detail"
        description="Claim detail is restricted to assigned brokers, adjusters, and administrators."
        allowedRoles={["broker", "adjuster", "admin"]}
      >
        <div className="mb-6">
          <LiveStatusBanner mode={detail.mode} message={detail.message} />
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-eyebrow">Claim Overview</p>
                <h2 className="section-title">{detail.claim.holderName}</h2>
              </div>
              <span className="status-pill watch">{detail.claim.status}</span>
            </div>
            <p className="mt-5 text-sm leading-7 text-stone-700">{detail.claim.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="metric-card">
                <p className="metric-label">Severity</p>
                <p className="metric-value text-xl">{detail.claim.severity}</p>
              </article>
              <article className="metric-card">
                <p className="metric-label">Reserve</p>
                <p className="metric-value text-xl">{currency.format(detail.claim.reserveAmount)}</p>
              </article>
              <article className="metric-card">
                <p className="metric-label">Incident date</p>
                <p className="metric-value text-xl">{detail.claim.incidentDate}</p>
              </article>
              <article className="metric-card">
                <p className="metric-label">Policy</p>
                <p className="metric-value text-xl">{detail.claim.policyNumber}</p>
              </article>
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-stone-200 bg-[#f7f1e5] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <p className="section-eyebrow">Policy Context</p>
            <h2 className="section-title">{detail.claim.policyNumber}</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-stone-700">
              <p><span className="font-semibold text-stone-950">Holder:</span> {detail.claim.holderName}</p>
              <p><span className="font-semibold text-stone-950">Coverage:</span> {detail.claim.policyCoverage}</p>
              <p><span className="font-semibold text-stone-950">Status:</span> {detail.claim.policyStatus}</p>
              <p><span className="font-semibold text-stone-950">Renewal:</span> {detail.claim.policyRenewal}</p>
              <p><span className="font-semibold text-stone-950">Premium:</span> {currency.format(detail.claim.policyPremium)}</p>
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-6">
            <ClaimEventForm claimId={detail.claim.uuid} claimNumber={detail.claim.claimNumber} />
            <PaymentEntryForm
              claimId={detail.claim.uuid}
              policyId={detail.claim.policyId}
              claimNumber={detail.claim.claimNumber}
            />
          </div>

          <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-eyebrow">Timeline</p>
                <h2 className="section-title">Operational history</h2>
              </div>
              <span className="status-pill stable">{detail.events.length} events</span>
            </div>
            <div className="mt-5 space-y-4">
              {detail.events.length === 0 ? (
                <p className="text-sm leading-7 text-stone-700">
                  No claim events are visible yet. Log the first update to start the timeline.
                </p>
              ) : (
                detail.events.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-[1.3rem] border border-stone-200 bg-stone-50/80 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-stone-950">{event.eventType}</p>
                      <span className="text-xs uppercase tracking-[0.16em] text-stone-500">
                        {event.createdAt}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-stone-700">{event.notes}</p>
                  </article>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-eyebrow">Documents</p>
                <h2 className="section-title">Evidence on file</h2>
              </div>
              <span className="status-pill stable">{detail.documents.length} files</span>
            </div>
            <div className="mt-5 space-y-3">
              {detail.documents.length === 0 ? (
                <p className="text-sm leading-7 text-stone-700">
                  No evidence has been uploaded for this claim yet.
                </p>
              ) : (
                detail.documents.map((document) => (
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

          <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-eyebrow">Payments</p>
                <h2 className="section-title">Financial activity</h2>
              </div>
              <span className="status-pill stable">{detail.payments.length} records</span>
            </div>
            <div className="mt-5 space-y-3">
              {detail.payments.length === 0 ? (
                <p className="text-sm leading-7 text-stone-700">
                  No payment records have been logged for this claim yet.
                </p>
              ) : (
                detail.payments.map((payment) => (
                  <article
                    key={payment.id}
                    className="rounded-[1.3rem] border border-stone-200 bg-stone-50/80 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-stone-950">
                          {currency.format(payment.amount)}
                        </p>
                        <p className="mt-1 text-sm text-stone-700">
                          {payment.paymentType} | {payment.referenceNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="status-pill stable">{payment.status}</span>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-500">
                          {payment.createdAt}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </article>
        </section>
      </ProtectedRoute>
    </PageShell>
  );
}
