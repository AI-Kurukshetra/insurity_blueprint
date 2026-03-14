import { requireServerSession } from "@/lib/auth-server";
import {
  loadAiTriage,
  loadClaims,
  loadClaimOptions,
  loadDocuments,
  loadPolicyOptions,
} from "@/lib/live-data";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AiTriagePanel } from "@/components/claims/ai-triage-panel";
import { ClaimsBoard } from "@/components/claims/claims-board";
import { ClaimSubmissionForm } from "@/components/claims/claim-submission-form";
import { DocumentUploadPanel } from "@/components/claims/document-upload-panel";
import { RecentDocuments } from "@/components/claims/recent-documents";
import { PageShell } from "@/components/page-shell";

export default async function ClaimsPage() {
  await requireServerSession({
    nextPath: "/claims",
    allowedRoles: ["broker", "adjuster", "admin"],
  });
  const [claimsData, policyOptions, claimOptions, documentsData, aiTriageData] = await Promise.all([
    loadClaims(),
    loadPolicyOptions(),
    loadClaimOptions(),
    loadDocuments(),
    loadAiTriage(),
  ]);

  return (
    <PageShell
      eyebrow="Claims"
      title="Claims operations board"
      description="This is the highest-value workflow from the brief. Intake, prioritization, evidence readiness, and payment path all sit here."
    >
      <ProtectedRoute
        title="Claims operations board"
        description="Claims are now treated as an authenticated workspace for adjusters, brokers, and internal operations users."
        allowedRoles={["broker", "adjuster", "admin"]}
      >
        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-6">
            <ClaimSubmissionForm initialPolicies={policyOptions} />
            <DocumentUploadPanel initialClaims={claimOptions} />
            <ClaimsBoard
              records={claimsData.records}
              mode={claimsData.mode}
              message={claimsData.message}
            />
          </div>

          <AiTriagePanel
            records={aiTriageData.records}
            mode={aiTriageData.mode}
            message={aiTriageData.message}
          />
        </section>

        <RecentDocuments data={documentsData} />
      </ProtectedRoute>
    </PageShell>
  );
}
