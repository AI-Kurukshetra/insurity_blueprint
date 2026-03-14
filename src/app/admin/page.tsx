import { requireServerSession } from "@/lib/auth-server";
import { loadAdminAssignmentsData } from "@/lib/live-data";
import { AssignmentManager } from "@/components/admin/assignment-manager";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageShell } from "@/components/page-shell";

export default async function AdminPage() {
  await requireServerSession({
    nextPath: "/admin",
    allowedRoles: ["admin"],
  });

  const adminData = await loadAdminAssignmentsData();

  return (
    <PageShell
      eyebrow="Administration"
      title="Assignment control center"
      description="Manage which users can access which policies and claims from one admin workspace."
    >
      <ProtectedRoute
        title="Assignment control center"
        description="Assignment management is restricted to administrators."
        allowedRoles={["admin"]}
      >
        <AssignmentManager data={adminData} />
      </ProtectedRoute>
    </PageShell>
  );
}
