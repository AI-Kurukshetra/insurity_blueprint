import Link from "next/link";
import { requireServerSession } from "@/lib/auth-server";
import {
  loadAiTriage,
  loadClaims,
  loadDashboardSummary,
  loadPolicies,
} from "@/lib/live-data";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AiTriagePanel } from "@/components/claims/ai-triage-panel";
import { LiveStatusBanner } from "@/components/live-status-banner";
import { PageShell } from "@/components/page-shell";
import { currency } from "@/lib/supabase";

export default async function Home() {
  const authState = await requireServerSession({
    nextPath: "/",
  });
  const [policiesData, claimsData, aiTriageData, dashboardSummary] = await Promise.all([
    loadPolicies(4),
    loadClaims(3),
    loadAiTriage(3),
    loadDashboardSummary(authState.profile),
  ]);

  return (
    <PageShell
      eyebrow="Command Center"
      title="SmartClaim Pro"
      description="Hackathon-focused cyber insurance operations platform with policy visibility, claims triage, document workflow, and broker-ready views."
      cta={
        <div className="flex flex-wrap gap-3">
          <Link
            href="/claims"
            className="rounded-full bg-[#f3d27a] px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-[#f7dd94]"
          >
            Open claims queue
          </Link>
          <Link
            href="/policies"
            className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
          >
            Review policies
          </Link>
        </div>
      }
    >
      <ProtectedRoute
        title="SmartClaim Pro dashboard"
        description="Operational insurance data is now available only to authenticated users with a valid workspace profile."
      >
        <div className="mb-6">
          <LiveStatusBanner mode={dashboardSummary.mode} message={dashboardSummary.message} />
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardSummary.metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[1.6rem] border border-stone-200 bg-white/85 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
            >
              <p className="text-sm text-stone-500">{metric.label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold text-stone-950">{metric.value}</p>
                <span className={`status-pill ${metric.tone}`}>{metric.delta}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.8rem] border border-stone-200 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-eyebrow">Policy Snapshot</p>
                <h2 className="section-title">Active cyber portfolio</h2>
              </div>
              <Link href="/policies" className="text-sm font-semibold text-teal-900">
                View all
              </Link>
            </div>
            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-stone-200">
              <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
                <thead className="bg-stone-100 text-stone-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Policy</th>
                    <th className="px-4 py-3 font-medium">Holder</th>
                    <th className="px-4 py-3 font-medium">Premium</th>
                    <th className="px-4 py-3 font-medium">Renewal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {policiesData.records.slice(0, 4).map((policy) => (
                    <tr key={policy.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-stone-950">{policy.id}</p>
                        <p className="text-stone-500">{policy.coverage}</p>
                      </td>
                      <td className="px-4 py-4 text-stone-700">{policy.holder}</td>
                      <td className="px-4 py-4 text-stone-700">
                        {currency.format(policy.premium)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`status-dot ${policy.tone}`} />
                          <span className="text-stone-700">{policy.renewal}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <AiTriagePanel
            records={aiTriageData.records}
            mode={aiTriageData.mode}
            message={aiTriageData.message}
            compact
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.8rem] border border-stone-200 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-eyebrow">Claims Queue</p>
                <h2 className="section-title">Priority incidents</h2>
              </div>
              <Link href="/claims" className="text-sm font-semibold text-teal-900">
                Claims board
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {claimsData.records.slice(0, 3).map((claim) => (
                <article
                  key={claim.id}
                  className="rounded-[1.4rem] border border-stone-200 bg-stone-50/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-stone-500">{claim.id}</p>
                      <h3 className="mt-1 text-lg font-semibold text-stone-950">
                        {claim.account}
                      </h3>
                    </div>
                    <span className={`status-pill ${claim.tone}`}>{claim.status}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    {claim.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-stone-600">
                    <span>{claim.stage}</span>
                    <span>{currency.format(claim.reserve)}</span>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[1.8rem] border border-stone-200 bg-[#f7f1e5] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <p className="section-eyebrow">Operational Timeline</p>
              <h2 className="section-title">What the platform is doing now</h2>
              <div className="mt-5 space-y-4">
                {dashboardSummary.timeline.map((event) => (
                  <div key={event.title} className="flex gap-4">
                    <div className={`mt-1 h-3 w-3 rounded-full ${event.dot}`} />
                    <div>
                      <p className="text-sm text-stone-500">{event.time}</p>
                      <p className="mt-1 font-semibold text-stone-950">{event.title}</p>
                      <p className="mt-1 text-sm leading-7 text-stone-700">
                        {event.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.8rem] border border-stone-200 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-eyebrow">Broker View</p>
                  <h2 className="section-title">Top accounts to retain</h2>
                </div>
                <Link href="/broker" className="text-sm font-semibold text-teal-900">
                  Broker workspace
                </Link>
              </div>
              {dashboardSummary.brokerAccounts.length === 0 ? (
                <p className="mt-5 text-sm leading-7 text-stone-700">
                  No accessible accounts are available for this workspace yet.
                </p>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {dashboardSummary.brokerAccounts.map((account) => (
                    <article
                      key={`${account.name}-${account.renewal}`}
                      className="rounded-[1.3rem] border border-stone-200 bg-stone-50/80 p-4"
                    >
                      <p className="font-semibold text-stone-950">{account.name}</p>
                      <p className="mt-1 text-sm text-stone-600">{account.owner}</p>
                      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                        <span className={`status-pill ${account.tone}`}>{account.health}</span>
                        <span className="text-stone-600">{account.renewal}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>
          </div>
        </section>

      </ProtectedRoute>
    </PageShell>
  );
}
