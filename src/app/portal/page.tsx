import { requireServerSession } from "@/lib/auth-server";
import {
  loadPortalClaimsData,
  loadPortalData,
  loadPortalDocumentsData,
} from "@/lib/live-data";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LiveStatusBanner } from "@/components/live-status-banner";
import { PageShell } from "@/components/page-shell";

export default async function PortalPage() {
  const authState = await requireServerSession({
    nextPath: "/portal",
    allowedRoles: ["policyholder", "broker", "admin"],
  });
  const [portalData, claimsData, documentsData] = await Promise.all([
    loadPortalData(authState.profile),
    loadPortalClaimsData(authState.profile, 5),
    loadPortalDocumentsData(authState.profile, 5),
  ]);
  const policy = portalData.policy;

  return (
    <PageShell
      eyebrow="Policyholder Portal"
      title="Customer self-service"
      description="A simplified policyholder experience helps satisfy the brief without building a full enterprise administration console."
    >
      <ProtectedRoute
        title="Customer self-service"
        description="The policyholder portal now requires an authenticated session before coverage and claim data are shown."
        allowedRoles={["policyholder", "broker", "admin"]}
      >
        <div className="mb-6">
          <LiveStatusBanner mode={portalData.mode} message={portalData.message} />
        </div>
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <p className="section-eyebrow">Coverage Summary</p>
            <h2 className="section-title">
              {policy ? policy.holder : "No assigned policy yet"}
            </h2>
            {policy ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <article className="metric-card">
                  <p className="metric-label">Policy number</p>
                  <p className="metric-value text-xl">{policy.id}</p>
                </article>
                <article className="metric-card">
                  <p className="metric-label">Coverage</p>
                  <p className="metric-value text-xl">{policy.coverage}</p>
                </article>
                <article className="metric-card">
                  <p className="metric-label">Renewal</p>
                  <p className="metric-value text-xl">{policy.renewal}</p>
                </article>
                <article className="metric-card">
                  <p className="metric-label">Risk status</p>
                  <p className="metric-value text-xl">{policy.risk}</p>
                </article>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-stone-700">
                This portal now relies on explicit policy assignments. Link this user to a
                policy before showing coverage, claims, or payment details.
              </p>
            )}
          </article>

          <article className="rounded-[1.8rem] border border-stone-200 bg-[#f7f1e5] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <p className="section-eyebrow">Self-Service Actions</p>
            <h2 className="section-title">What the insured can do</h2>
            <div className="mt-5 space-y-3">
              {portalData.items.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.3rem] border border-stone-200 bg-white/85 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-950">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-stone-700">
                        {item.detail}
                      </p>
                    </div>
                    <span className={`status-pill ${item.tone}`}>{item.state}</span>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-eyebrow">Claims</p>
                <h2 className="section-title">Recent claim activity</h2>
              </div>
              <span className={`status-pill ${claimsData.mode === "live" ? "healthy" : "watch"}`}>
                {claimsData.records.length} records
              </span>
            </div>
            <div className="mt-5">
              <LiveStatusBanner mode={claimsData.mode} message={claimsData.message} />
            </div>
            <div className="mt-5 space-y-3">
              {claimsData.records.length === 0 ? (
                <p className="text-sm leading-7 text-stone-700">
                  {policy
                    ? "No claims are linked to this assigned policy yet. New first notice of loss activity will appear here automatically."
                    : "Claims will appear here after an admin links this user to a policy and the first claim is created."}
                </p>
              ) : (
                claimsData.records.map((claim) => (
                  <article
                    key={claim.id}
                    className="rounded-[1.3rem] border border-stone-200 bg-stone-50/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-stone-950">{claim.id}</p>
                        <p className="mt-1 text-sm text-stone-700">{claim.summary}</p>
                      </div>
                      <span className={`status-pill ${claim.tone}`}>{claim.status}</span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-stone-500">
                      {claim.stage}
                    </p>
                  </article>
                ))
              )}
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-eyebrow">Documents</p>
                <h2 className="section-title">Uploaded evidence</h2>
              </div>
              <span className={`status-pill ${documentsData.mode === "live" ? "healthy" : "watch"}`}>
                {documentsData.records.length} files
              </span>
            </div>
            <div className="mt-5">
              <LiveStatusBanner mode={documentsData.mode} message={documentsData.message} />
            </div>
            <div className="mt-5 space-y-3">
              {documentsData.records.length === 0 ? (
                <p className="text-sm leading-7 text-stone-700">
                  {policy
                    ? "Uploaded claim evidence will appear here once documents are attached to the assigned claims."
                    : "Documents will appear here after policy assignment and evidence upload are both in place."}
                </p>
              ) : (
                documentsData.records.map((document) => (
                  <article
                    key={document.id}
                    className="rounded-[1.3rem] border border-stone-200 bg-stone-50/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-stone-950">{document.fileName}</p>
                        <p className="mt-1 text-sm text-stone-700">{document.claimLabel}</p>
                      </div>
                      <span className="status-pill stable">{document.documentType}</span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-stone-500">
                      {document.uploadedAt}
                    </p>
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
