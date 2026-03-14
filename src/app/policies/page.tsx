import { requireServerSession } from "@/lib/auth-server";
import { loadPolicies } from "@/lib/live-data";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PoliciesTable } from "@/components/policies/policies-table";
import { PageShell } from "@/components/page-shell";

export default async function PoliciesPage() {
  await requireServerSession({
    nextPath: "/policies",
  });
  const policiesData = await loadPolicies();

  return (
    <PageShell
      eyebrow="Policies"
      title="Policy portfolio"
      description="High-priority policy view first: coverage, premium, renewal, and risk context in one operational table."
    >
      <ProtectedRoute
        title="Policy portfolio"
        description="Portfolio records are now restricted to authenticated users with a valid workspace role."
      >
        <PoliciesTable
          records={policiesData.records}
          mode={policiesData.mode}
          message={policiesData.message}
        />
      </ProtectedRoute>
    </PageShell>
  );
}
