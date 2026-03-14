import { LiveStatusBanner } from "@/components/live-status-banner";
import type { PolicyRecord } from "@/lib/sample-data";
import { currency } from "@/lib/supabase";

type PoliciesTableProps = {
  records: PolicyRecord[];
  mode: "live" | "fallback";
  message: string;
};

export function PoliciesTable({ records, mode, message }: PoliciesTableProps) {
  return (
    <section className="rounded-[1.8rem] border border-stone-200 bg-white/85 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <div className="grid gap-4 md:grid-cols-4">
        <article className="metric-card">
          <p className="metric-label">Policies shown</p>
          <p className="metric-value">{records.length}</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Renewals in focus</p>
          <p className="metric-value">
            {records.filter((record) => record.tone === "watch" || record.tone === "urgent").length}
          </p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Average premium</p>
          <p className="metric-value">
            {currency.format(
              records.reduce((sum, record) => sum + record.premium, 0) /
                Math.max(records.length, 1)
            )}
          </p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Data mode</p>
          <p className="metric-value text-xl">{mode === "live" ? "Live" : "Seeded"}</p>
        </article>
      </div>

      <div className="mt-6">
        <LiveStatusBanner mode={mode} message={message} />
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-stone-200">
        <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
          <thead className="bg-stone-100 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Policy</th>
              <th className="px-4 py-3 font-medium">Holder</th>
              <th className="px-4 py-3 font-medium">Coverage</th>
              <th className="px-4 py-3 font-medium">Premium</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Renewal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {records.map((policy) => (
              <tr key={policy.id}>
                <td className="px-4 py-4 font-medium text-stone-950">{policy.id}</td>
                <td className="px-4 py-4 text-stone-700">{policy.holder}</td>
                <td className="px-4 py-4 text-stone-700">{policy.coverage}</td>
                <td className="px-4 py-4 text-stone-700">{currency.format(policy.premium)}</td>
                <td className="px-4 py-4">
                  <span className={`status-pill ${policy.tone}`}>{policy.risk}</span>
                </td>
                <td className="px-4 py-4 text-stone-700">{policy.renewal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
