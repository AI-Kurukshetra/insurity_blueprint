import { requireServerSession } from "@/lib/auth-server";
import { loadBrokerData } from "@/lib/live-data";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LiveStatusBanner } from "@/components/live-status-banner";
import { PageShell } from "@/components/page-shell";

export default async function BrokerPage() {
  const authState = await requireServerSession({
    nextPath: "/broker",
    allowedRoles: ["broker", "admin"],
  });
  const brokerData = await loadBrokerData(authState.profile);

  return (
    <PageShell
      eyebrow="Broker Workspace"
      title="Broker and agent dashboard"
      description="This route covers the brief's agent or broker requirement with a renewal and claims summary tailored to book managers."
    >
      <ProtectedRoute
        title="Broker and agent dashboard"
        description="Broker-facing client data is now behind sign-in so the demo has a real protected workspace."
        allowedRoles={["broker", "admin"]}
      >
        <div className="mb-6">
          <LiveStatusBanner mode={brokerData.mode} message={brokerData.message} />
        </div>
        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <p className="section-eyebrow">Book Overview</p>
            <h2 className="section-title">Accounts under management</h2>
            {brokerData.accounts.length === 0 ? (
              <p className="mt-5 text-sm leading-7 text-stone-700">
                No client accounts are assigned to this broker yet. Add policy assignments
                in Supabase before expecting the broker workspace to populate.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {brokerData.accounts.map((account) => (
                  <article
                    key={account.name}
                    className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-stone-950">{account.name}</p>
                        <p className="mt-1 text-sm text-stone-600">{account.owner}</p>
                      </div>
                      <span className={`status-pill ${account.tone}`}>{account.health}</span>
                    </div>
                    <div className="mt-4 grid gap-4 text-sm text-stone-700 sm:grid-cols-3">
                      <p>Renewal: {account.renewal}</p>
                      <p>Claims open: {account.openClaims}</p>
                      <p>Premium: {account.premium}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-[1.8rem] border border-stone-200 bg-[linear-gradient(145deg,rgba(244,248,251,0.94),rgba(221,235,245,0.94))] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <p className="section-eyebrow">Retention Focus</p>
            <h2 className="section-title">Broker priorities this week</h2>
            {brokerData.accounts.length === 0 ? (
              <div className="mt-5 space-y-4">
                <article className="rounded-[1.4rem] border border-white/80 bg-white/80 p-4">
                  <p className="font-semibold text-stone-950">Assignment needed</p>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    This broker workspace stays empty until an admin links one or more
                    policies to the signed-in broker.
                  </p>
                </article>
                <article className="rounded-[1.4rem] border border-white/80 bg-white/80 p-4">
                  <p className="font-semibold text-stone-950">What unlocks next</p>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    Assigned renewals, open-claim counts, and client retention focus will
                    appear automatically once those policy assignments exist.
                  </p>
                </article>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <article className="rounded-[1.4rem] border border-white/80 bg-white/80 p-4">
                  <p className="font-semibold text-stone-950">Renewal prep</p>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    Prioritize accounts with near-term renewals and open claims before the
                    next pricing conversation.
                  </p>
                </article>
                <article className="rounded-[1.4rem] border border-white/80 bg-white/80 p-4">
                  <p className="font-semibold text-stone-950">Client reassurance</p>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    Use the assigned book view to answer status questions from clients
                    without exposing unrelated accounts.
                  </p>
                </article>
                <article className="rounded-[1.4rem] border border-white/80 bg-white/80 p-4">
                  <p className="font-semibold text-stone-950">Retention focus</p>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    Accounts marked watch or urgent are the best MVP candidates for broker
                    follow-up and renewal coaching.
                  </p>
                </article>
              </div>
            )}
          </article>
        </section>
      </ProtectedRoute>
    </PageShell>
  );
}
