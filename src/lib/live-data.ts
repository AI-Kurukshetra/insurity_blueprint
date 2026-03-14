import type { UserProfile } from "@/lib/auth";
import type { ClaimRecord, PolicyRecord } from "@/lib/records";
import { currency, supabaseConfig } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type PolicyRow = {
  id: string;
  policy_number: string | null;
  holder_name: string | null;
  coverage_summary: string | null;
  premium: number | null;
  renewal_date: string | null;
  risk_score: number | null;
  status: string | null;
};

type ClaimRow = {
  claim_number: string | null;
  status: string | null;
  severity: string | null;
  reserve_amount: number | null;
  description: string | null;
  incident_date: string | null;
  policies:
    | {
        policy_number: string | null;
        holder_name: string | null;
      }
    | {
        policy_number: string | null;
        holder_name: string | null;
      }[]
    | null;
};

export type PolicyOption = {
  id: string;
  policy_number: string;
  holder_name: string;
};

export type ClaimOption = {
  id: string;
  claim_number: string;
  holder_name: string;
  policy_id: string | null;
};

type ProfileScopedIds = {
  policyIds: string[] | null;
  claimIds: string[] | null;
};

export type PoliciesDataResult = {
  records: PolicyRecord[];
  mode: "live" | "fallback";
  message: string;
};

export type ClaimsDataResult = {
  records: ClaimRecord[];
  mode: "live" | "fallback";
  message: string;
};

export type PortalDataResult = {
  policy: PolicyRecord | null;
  items: PortalItemRecord[];
  mode: "live" | "fallback";
  message: string;
};

export type PortalItemRecord = {
  title: string;
  detail: string;
  state: string;
  tone: "healthy" | "stable" | "watch" | "urgent";
};

export type BrokerBookRecord = {
  name: string;
  owner: string;
  health: string;
  tone: "healthy" | "stable" | "watch" | "urgent";
  renewal: string;
  openClaims: number;
  premium: string;
};

export type BrokerDataResult = {
  accounts: BrokerBookRecord[];
  mode: "live" | "fallback";
  message: string;
};

export type DashboardMetricRecord = {
  label: string;
  value: string;
  delta: string;
  tone: "healthy" | "stable" | "watch" | "urgent";
};

export type DashboardTimelineRecord = {
  time: string;
  title: string;
  detail: string;
  dot: string;
};

export type DashboardSummaryResult = {
  metrics: DashboardMetricRecord[];
  timeline: DashboardTimelineRecord[];
  brokerAccounts: BrokerBookRecord[];
  mode: "live" | "fallback";
  message: string;
};

export type AdminProfileOption = {
  id: string;
  label: string;
  role: string;
};

export type AdminPolicyOption = {
  id: string;
  label: string;
};

export type AdminClaimOption = {
  id: string;
  label: string;
};

export type AdminPolicyAssignmentRecord = {
  id: string;
  profileId: string;
  profileLabel: string;
  assignmentRole: string;
  policyId: string;
  policyLabel: string;
  provisioningSource: string;
};

export type AdminClaimAssignmentRecord = {
  id: string;
  profileId: string;
  profileLabel: string;
  assignmentRole: string;
  claimId: string;
  claimLabel: string;
  provisioningSource: string;
};

export type AdminAssignmentsDataResult = {
  profiles: AdminProfileOption[];
  policies: AdminPolicyOption[];
  claims: AdminClaimOption[];
  policyAssignments: AdminPolicyAssignmentRecord[];
  claimAssignments: AdminClaimAssignmentRecord[];
};

export type DocumentListRecord = {
  id: string;
  fileName: string;
  documentType: string;
  claimLabel: string;
  uploadedAt: string;
};

export type DocumentsDataResult = {
  records: DocumentListRecord[];
  mode: "live" | "fallback";
  message: string;
};

export type ClaimEventRecord = {
  id: string;
  eventType: string;
  notes: string;
  createdAt: string;
};

export type PaymentRecord = {
  id: string;
  amount: number;
  paymentType: string;
  status: string;
  referenceNumber: string;
  createdAt: string;
};

export type ClaimDetailResult = {
  claim: {
    uuid: string | null;
    claimNumber: string;
    status: string;
    severity: string;
    reserveAmount: number;
    description: string;
    incidentDate: string;
    holderName: string;
    policyNumber: string;
    policyId: string | null;
    policyCoverage: string;
    policyStatus: string;
    policyRenewal: string;
    policyPremium: number;
  } | null;
  events: ClaimEventRecord[];
  documents: DocumentListRecord[];
  payments: PaymentRecord[];
  mode: "live" | "fallback";
  message: string;
};

export type AiTriageCardRecord = {
  claimId: string;
  title: string;
  label: string;
  tone: "healthy" | "stable" | "watch" | "urgent";
  summary: string;
  reasons: string[];
};

export type AiTriageDataResult = {
  records: AiTriageCardRecord[];
  mode: "live" | "fallback";
  message: string;
};

type ClaimTriageRow = {
  id: string;
  claim_number: string | null;
  policy_id: string | null;
  status: string | null;
  severity: string | null;
  reserve_amount: number | null;
  description: string | null;
  incident_date: string | null;
  created_at: string | null;
  policies:
    | {
        policy_number: string | null;
        holder_name: string | null;
      }
    | {
        policy_number: string | null;
        holder_name: string | null;
      }[]
    | null;
};

type DashboardPolicyRow = PolicyRow & {
  created_at: string | null;
};

type DashboardEventRow = {
  event_type: string | null;
  notes: string | null;
  created_at: string | null;
  claims:
    | {
        claim_number: string | null;
        policies:
          | {
              holder_name: string | null;
            }
          | {
              holder_name: string | null;
            }[]
          | null;
      }
    | {
        claim_number: string | null;
        policies:
          | {
              holder_name: string | null;
            }
          | {
              holder_name: string | null;
            }[]
          | null;
      }[]
    | null;
};

type DashboardDocumentRow = {
  claim_id: string | null;
  file_name: string;
  document_type: string;
  created_at: string | null;
  claims:
    | {
        claim_number: string | null;
      }
    | {
        claim_number: string | null;
      }[]
    | null;
  policies:
    | {
        holder_name: string | null;
        policy_number: string | null;
      }
    | {
        holder_name: string | null;
        policy_number: string | null;
      }[]
    | null;
};

type DashboardPaymentRow = {
  amount: number | null;
  status: string | null;
};

function toneFromRisk(riskScore: number | null, status: string | null): PolicyRecord["tone"] {
  if (status?.toLowerCase().includes("cancel")) {
    return "urgent";
  }
  if (riskScore === null) {
    return "stable";
  }
  if (riskScore >= 80) {
    return "urgent";
  }
  if (riskScore >= 60) {
    return "watch";
  }
  if (riskScore >= 35) {
    return "stable";
  }
  return "healthy";
}

function formatRenewal(renewalDate: string | null): string {
  if (!renewalDate) {
    return "Not set";
  }

  const parsed = new Date(renewalDate);
  if (Number.isNaN(parsed.getTime())) {
    return renewalDate;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

function mapPolicy(row: PolicyRow, index: number): PolicyRecord {
  const tone = toneFromRisk(row.risk_score, row.status);

  return {
    id: row.policy_number ?? `POL-LIVE-${index + 1}`,
    holder: row.holder_name ?? "Unknown holder",
    coverage: row.coverage_summary ?? "Coverage summary not provided",
    premium: row.premium ?? 0,
    risk: row.status ?? "Active",
    tone,
    renewal: formatRenewal(row.renewal_date),
  };
}

function toneFromClaim(status: string | null, severity: string | null): ClaimRecord["tone"] {
  const value = `${status ?? ""} ${severity ?? ""}`.toLowerCase();
  if (value.includes("high") || value.includes("urgent")) {
    return "urgent";
  }
  if (value.includes("medium") || value.includes("review") || value.includes("monitor")) {
    return "watch";
  }
  if (value.includes("paid") || value.includes("closed") || value.includes("complete")) {
    return "healthy";
  }
  return "stable";
}

function getPolicyInfo(
  policy:
    | {
        policy_number: string | null;
        holder_name: string | null;
      }
    | {
        policy_number: string | null;
        holder_name: string | null;
      }[]
    | null
) {
  const value = Array.isArray(policy) ? policy[0] : policy;
  return {
    policyNumber: value?.policy_number ?? "Policy pending",
    holderName: value?.holder_name ?? "Unassigned account",
  };
}

function getFirstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapClaim(row: ClaimRow, index: number): ClaimRecord {
  const policyInfo = getPolicyInfo(row.policies);

  return {
    id: row.claim_number ?? `CLM-LIVE-${index + 1}`,
    account: policyInfo.holderName,
    summary: row.description ?? "Claim description not provided",
    reserve: row.reserve_amount ?? 0,
    stage: row.incident_date ? `Incident date ${row.incident_date}` : "Incident date not set",
    status: row.status ?? "Open",
    tone: toneFromClaim(row.status, row.severity),
    tags: [row.severity ?? "severity unknown", policyInfo.policyNumber],
  };
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not available";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isActionableClaimStatus(status: string | null) {
  const value = status?.toLowerCase() ?? "";
  return !value.includes("closed") && !value.includes("paid") && !value.includes("complete");
}

function containsAnyKeyword(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function buildTriageReasons(
  claim: ClaimTriageRow,
  documentCount: number | null,
  eventCount: number | null
) {
  const reasons: string[] = [];
  const description = (claim.description ?? "").toLowerCase();
  const severity = (claim.severity ?? "").toLowerCase();
  const status = (claim.status ?? "").toLowerCase();
  const reserve = claim.reserve_amount ?? 0;

  if (severity.includes("high") || status.includes("urgent")) {
    reasons.push("high severity exposure");
  }
  if (reserve >= 200000) {
    reasons.push("large reserve amount");
  } else if (reserve >= 100000) {
    reasons.push("reserve above fast-track band");
  }
  if (containsAnyKeyword(description, ["phi", "pii", "breach", "regulated", "notification"])) {
    reasons.push("regulated data exposure");
  }
  if (containsAnyKeyword(description, ["counsel", "legal", "attorney"])) {
    reasons.push("legal review indicators");
  }
  if (containsAnyKeyword(description, ["ransomware", "outage", "business interruption", "exfiltration"])) {
    reasons.push("business interruption risk");
  }
  if (documentCount === 0) {
    reasons.push("no uploaded evidence yet");
  } else if (documentCount === 1) {
    reasons.push("limited evidence on file");
  } else if (documentCount !== null && documentCount >= 3) {
    reasons.push("strong document package");
  }
  if (eventCount === 0) {
    reasons.push("no timeline updates logged");
  } else if (eventCount !== null && eventCount >= 2) {
    reasons.push("active handling history");
  }

  return reasons.slice(0, 3);
}

function triageScore(
  claim: ClaimTriageRow,
  documentCount: number | null,
  eventCount: number | null
) {
  const description = (claim.description ?? "").toLowerCase();
  const severity = (claim.severity ?? "").toLowerCase();
  const status = (claim.status ?? "").toLowerCase();
  const reserve = claim.reserve_amount ?? 0;
  let score = 0;

  if (severity.includes("high")) {
    score += 30;
  } else if (severity.includes("medium")) {
    score += 15;
  }

  if (status.includes("urgent")) {
    score += 30;
  } else if (status.includes("monitor") || status.includes("review")) {
    score += 18;
  } else if (status.includes("ready") || status.includes("approval")) {
    score -= 12;
  }

  if (reserve >= 200000) {
    score += 24;
  } else if (reserve >= 100000) {
    score += 16;
  } else if (reserve >= 50000) {
    score += 8;
  }

  if (containsAnyKeyword(description, ["phi", "pii", "breach", "regulated", "notification"])) {
    score += 16;
  }
  if (containsAnyKeyword(description, ["counsel", "legal", "attorney"])) {
    score += 10;
  }
  if (containsAnyKeyword(description, ["ransomware", "outage", "business interruption", "exfiltration"])) {
    score += 12;
  }

  if (documentCount === 0) {
    score += 16;
  } else if (documentCount === 1) {
    score += 8;
  } else if (documentCount !== null && documentCount >= 2) {
    score -= 6;
  }

  if (eventCount === 0) {
    score += 8;
  } else if (eventCount !== null && eventCount >= 2) {
    score -= 4;
  }

  return score;
}

function deriveTriageCard(claim: ClaimTriageRow, documentCount: number | null, eventCount: number | null) {
  const policyInfo = getPolicyInfo(claim.policies);
  const score = triageScore(claim, documentCount, eventCount);
  const reasons = buildTriageReasons(claim, documentCount, eventCount);
  const reserve = claim.reserve_amount ?? 0;

  let title = "Review claim for next action";
  let label = "Review";
  let tone: AiTriageCardRecord["tone"] = "stable";

  if (score >= 70) {
    title =
      documentCount === 0
        ? "Escalate incomplete high-risk package"
        : "Immediate adjuster escalation recommended";
    label = "Escalate";
    tone = "urgent";
  } else if (score >= 40) {
    title = "Monitor severity and coverage exposure";
    label = "Monitor";
    tone = "watch";
  } else {
    title = "Fast-track review candidate";
    label = "Approve path";
    tone = "healthy";
  }

  const evidenceSentence =
    documentCount === null
      ? "Evidence completeness could not be scored from related document records."
      : documentCount === 0
        ? "No supporting documents are on file yet."
        : documentCount === 1
          ? "Only one supporting document is on file so far."
          : `${documentCount} supporting documents are already linked to the claim.`;
  const timelineSentence =
    eventCount === null
      ? "Timeline activity is temporarily unavailable."
      : eventCount === 0
        ? "No claim events have been logged yet."
        : `${eventCount} operational ${eventCount === 1 ? "update is" : "updates are"} visible in the timeline.`;

  const summary =
    tone === "urgent"
      ? `${policyInfo.holderName} claim ${claim.claim_number ?? claim.id} shows elevated severity with ${currency.format(reserve)} reserved. ${evidenceSentence} ${timelineSentence} Recommend immediate adjuster review before reserve or coverage decisions move further.`
      : tone === "watch"
        ? `${policyInfo.holderName} claim ${claim.claim_number ?? claim.id} needs active monitoring based on current severity, reserve, and narrative indicators. ${evidenceSentence} ${timelineSentence} Recommend proactive outreach and another review cycle soon.`
        : `${policyInfo.holderName} claim ${claim.claim_number ?? claim.id} appears suitable for an expedited path based on current reserve and handling signals. ${evidenceSentence} ${timelineSentence} Keep the claim moving unless new exposure indicators appear.`;

  return {
    claimId: claim.claim_number ?? claim.id,
    title,
    label,
    tone,
    summary,
    reasons: reasons.length > 0 ? reasons : ["live claim signals available"],
  };
}

function emptyDashboardMetricRecords(): DashboardMetricRecord[] {
  return [
    {
      label: "Policies in force",
      value: "0",
      delta: "no accessible policies",
      tone: "stable",
    },
    {
      label: "Open claims",
      value: "0",
      delta: "queue clear",
      tone: "healthy",
    },
    {
      label: "Premium in force",
      value: currency.format(0),
      delta: "awaiting portfolio",
      tone: "stable",
    },
    {
      label: "AI triage readiness",
      value: "0%",
      delta: "no live claims scored",
      tone: "stable",
    },
  ];
}

function unavailableAiTriageRecords(): AiTriageCardRecord[] {
  return [];
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatTimeLabel(value: string | null) {
  if (!value) {
    return "Recent";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysUntil(value: string | null) {
  if (!value) {
    return null;
  }

  const target = new Date(value);
  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((target.getTime() - today.getTime()) / msPerDay);
}

function buildDashboardMetrics(
  policies: DashboardPolicyRow[],
  claims: ClaimTriageRow[],
  payments: DashboardPaymentRow[],
  documentCounts: Map<string, number>,
  eventCounts: Map<string, number>
): DashboardMetricRecord[] {
  const policiesInForce = policies.length;
  const renewingSoon = policies.filter((policy) => {
    const days = daysUntil(policy.renewal_date);
    return days !== null && days >= 0 && days <= 45;
  }).length;
  const openClaims = claims.filter((claim) => isActionableClaimStatus(claim.status)).length;
  const urgentClaims = claims.filter(
    (claim) =>
      (claim.status?.toLowerCase() ?? "").includes("urgent") ||
      (claim.severity?.toLowerCase() ?? "").includes("high")
  ).length;
  const premiumTotal = policies.reduce((sum, policy) => sum + (policy.premium ?? 0), 0);
  const paidPayments = payments.filter((payment) => {
    const status = payment.status?.toLowerCase() ?? "";
    return status.includes("paid") || status.includes("complete");
  }).length;
  const triageScopedClaims = claims.filter((claim) => isActionableClaimStatus(claim.status));
  const triageReadyClaims = triageScopedClaims.filter(
    (claim) => (documentCounts.get(claim.id) ?? 0) > 0 || (eventCounts.get(claim.id) ?? 0) > 0
  ).length;
  const triageCoverage =
    triageScopedClaims.length > 0
      ? Math.round((triageReadyClaims / triageScopedClaims.length) * 100)
      : 100;

  return [
    {
      label: "Policies in force",
      value: policiesInForce.toString(),
      delta:
        policiesInForce === 0
          ? "no accessible policies"
          : renewingSoon > 0
            ? `${renewingSoon} renew soon`
            : "renewals steady",
      tone: renewingSoon > 0 ? "watch" : "healthy",
    },
    {
      label: "Open claims",
      value: openClaims.toString(),
      delta:
        openClaims === 0
          ? "queue clear"
          : urgentClaims > 0
            ? `${urgentClaims} urgent`
            : "actively handled",
      tone: urgentClaims > 0 ? "urgent" : openClaims > 0 ? "watch" : "healthy",
    },
    {
      label: "Premium in force",
      value: formatCompactCurrency(premiumTotal),
      delta:
        paidPayments > 0
          ? `${paidPayments} paid updates`
          : policiesInForce > 0
            ? `${policiesInForce} active accounts`
            : "awaiting portfolio",
      tone: premiumTotal > 0 ? "stable" : "watch",
    },
    {
      label: "AI triage readiness",
      value: `${triageCoverage}%`,
      delta:
        triageScopedClaims.length > 0
          ? `${triageReadyClaims}/${triageScopedClaims.length} claims scored`
          : "ready for new claims",
      tone:
        triageCoverage >= 80
          ? "healthy"
          : triageCoverage >= 50
            ? "stable"
            : triageCoverage > 0
              ? "watch"
              : "urgent",
    },
  ];
}

function buildDashboardTimeline(
  claims: ClaimTriageRow[],
  events: DashboardEventRow[],
  documents: DashboardDocumentRow[]
): DashboardTimelineRecord[] {
  const timelineCandidates: { sortKey: number; record: DashboardTimelineRecord }[] = [];

  events.forEach((event) => {
    const claim = getFirstRelation(event.claims);
    const policy = getFirstRelation(claim?.policies ?? null);
    const createdAt = event.created_at ?? "";
    timelineCandidates.push({
      sortKey: new Date(createdAt).getTime() || 0,
      record: {
        time: formatTimeLabel(createdAt),
        title: `${event.event_type ?? "Claim update"} logged for ${claim?.claim_number ?? "active claim"}`,
        detail:
          event.notes ??
          `Operational update recorded for ${policy?.holder_name ?? "an assigned account"}.`,
        dot:
          (event.event_type?.toLowerCase() ?? "").includes("payment")
            ? "bg-emerald-500"
            : (event.event_type?.toLowerCase() ?? "").includes("review")
              ? "bg-amber-500"
              : "bg-sky-500",
      },
    });
  });

  documents.forEach((document) => {
    const claim = getFirstRelation(document.claims);
    const policy = getFirstRelation(document.policies);
    const createdAt = document.created_at ?? "";
    timelineCandidates.push({
      sortKey: new Date(createdAt).getTime() || 0,
      record: {
        time: formatTimeLabel(createdAt),
        title: `Document uploaded for ${claim?.claim_number ?? policy?.policy_number ?? "linked record"}`,
        detail: `${document.document_type}: ${document.file_name}`,
        dot: "bg-sky-500",
      },
    });
  });

  claims.forEach((claim) => {
    const policy = getFirstRelation(claim.policies);
    const createdAt = claim.created_at ?? "";
    timelineCandidates.push({
      sortKey: new Date(createdAt).getTime() || 0,
      record: {
        time: formatTimeLabel(createdAt),
        title: `Claim ${claim.claim_number ?? claim.id} entered the queue`,
        detail:
          claim.description ??
          `${policy?.holder_name ?? "Assigned account"} claim is now visible in the live queue.`,
        dot: toneFromClaim(claim.status, claim.severity) === "urgent" ? "bg-amber-500" : "bg-emerald-500",
      },
    });
  });

  return timelineCandidates
    .sort((left, right) => right.sortKey - left.sortKey)
    .slice(0, 3)
    .map((item) => item.record);
}

function buildDashboardBrokerAccounts(
  policies: DashboardPolicyRow[],
  claims: ClaimTriageRow[],
  profile: UserProfile | null
) {
  const openClaimsByPolicy = new Map<string, number>();

  claims.forEach((claim) => {
    if (!claim.policy_id || !isActionableClaimStatus(claim.status)) {
      return;
    }

    openClaimsByPolicy.set(claim.policy_id, (openClaimsByPolicy.get(claim.policy_id) ?? 0) + 1);
  });

  return policies
    .map((policy) => {
      const openClaims = openClaimsByPolicy.get(policy.id) ?? 0;
      const tone = toneFromPortfolio(policy, openClaims);

      return {
        name: policy.holder_name ?? "Unknown account",
        owner: `Book owner: ${profile?.full_name ?? profile?.email ?? "Broker workspace"}`,
        health: healthLabelFromTone(tone),
        tone,
        renewal: formatRenewal(policy.renewal_date),
        openClaims,
        premium: currency.format(policy.premium ?? 0),
      };
    })
    .sort((left, right) => {
      const toneWeight = { urgent: 3, watch: 2, stable: 1, healthy: 0 };
      return (
        toneWeight[right.tone] - toneWeight[left.tone] ||
        right.openClaims - left.openClaims
      );
    })
    .slice(0, 4);
}

function buildUnavailablePortalData(message: string): PortalDataResult {
  return {
    policy: null,
    items: [
      {
        title: "Portal setup required",
        detail: "This portal needs a live Supabase connection and at least one assigned policy before coverage data can appear.",
        state: "Blocked",
        tone: "watch",
      },
      {
        title: "Claims and documents unlock after assignment",
        detail: "Once a policy is linked and claims exist, the related records will render here automatically.",
        state: "Pending",
        tone: "stable",
      },
    ],
    mode: "fallback",
    message,
  };
}

function emptyDashboardTimelineRecords(message: string): DashboardTimelineRecord[] {
  return [
    {
      time: "No activity",
      title: "Operational timeline unavailable",
      detail: message,
      dot: "bg-stone-400",
    },
  ];
}

function toneFromPortfolio(policy: PolicyRow, openClaims: number): BrokerBookRecord["tone"] {
  if ((policy.risk_score ?? 0) >= 80 || openClaims >= 2) {
    return "urgent";
  }
  if ((policy.risk_score ?? 0) >= 60 || openClaims >= 1) {
    return "watch";
  }
  if ((policy.risk_score ?? 0) >= 35) {
    return "stable";
  }
  return "healthy";
}

function healthLabelFromTone(tone: BrokerBookRecord["tone"]) {
  switch (tone) {
    case "urgent":
      return "Intervention needed";
    case "watch":
      return "Watch closely";
    case "stable":
      return "Stable account";
    default:
      return "Healthy account";
  }
}

async function loadScopedIds(
  profile: UserProfile,
  client: Awaited<ReturnType<typeof createSupabaseServerClient>>
): Promise<ProfileScopedIds> {
  if (profile.role === "admin") {
    return {
      policyIds: null,
      claimIds: null,
    };
  }

  const { data: policyAssignments } = await client
    .from("policy_assignments")
    .select("policy_id")
    .eq("profile_id", profile.id);

  const policyIds = Array.from(
    new Set((policyAssignments ?? []).map((assignment) => assignment.policy_id).filter(Boolean))
  );

  const { data: claimAssignments } = await client
    .from("claim_assignments")
    .select("claim_id")
    .eq("profile_id", profile.id);

  const assignedClaimIds = (claimAssignments ?? [])
    .map((assignment) => assignment.claim_id)
    .filter(Boolean);

  const { data: reportedClaims } = await client
    .from("claims")
    .select("id")
    .eq("reported_by", profile.id)
    .limit(100);

  const reportedClaimIds = (reportedClaims ?? []).map((claim) => claim.id).filter(Boolean);

  return {
    policyIds,
    claimIds: Array.from(new Set([...assignedClaimIds, ...reportedClaimIds])),
  };
}

export async function loadPolicies(limit = 20): Promise<PoliciesDataResult> {
  if (!supabaseConfig.isConfigured) {
    return {
      records: [],
      mode: "fallback",
      message: "Supabase keys are missing. Policy data is unavailable until live configuration is added.",
    };
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .from("policies")
    .select(
      "id, policy_number, holder_name, coverage_summary, premium, renewal_date, risk_score, status"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) {
    return {
      records: [],
      mode: error ? "fallback" : "live",
      message: error
        ? "Supabase connected, but policy data is unavailable."
        : "No policies are assigned to this account yet.",
    };
  }

  return {
    records: data.map(mapPolicy),
    mode: "live",
    message: "Live policy data loaded from Supabase.",
  };
}

export async function loadClaims(limit = 20): Promise<ClaimsDataResult> {
  if (!supabaseConfig.isConfigured) {
    return {
      records: [],
      mode: "fallback",
      message: "Supabase keys are missing. Claim data is unavailable until live configuration is added.",
    };
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .from("claims")
    .select(
      "claim_number, status, severity, reserve_amount, description, incident_date, policies ( policy_number, holder_name )"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) {
    return {
      records: [],
      mode: error ? "fallback" : "live",
      message: error
        ? "Supabase connected, but claim data is unavailable."
        : "No claims are assigned to this account yet.",
    };
  }

  return {
    records: data.map(mapClaim),
    mode: "live",
    message: "Live claim data loaded from Supabase.",
  };
}

export async function loadAiTriage(limit = 3): Promise<AiTriageDataResult> {
  if (!supabaseConfig.isConfigured) {
    return {
      records: unavailableAiTriageRecords(),
      mode: "fallback",
      message: "Supabase keys are missing. AI triage is unavailable until live claims are configured.",
    };
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .from("claims")
    .select(
      "id, claim_number, policy_id, status, severity, reserve_amount, description, incident_date, created_at, policies ( policy_number, holder_name )"
    )
    .order("created_at", { ascending: false })
    .limit(Math.max(limit * 4, 8));

  if (error) {
    return {
      records: unavailableAiTriageRecords(),
      mode: "fallback",
      message: "Claim triage query failed. AI recommendations are unavailable right now.",
    };
  }

  const actionableClaims = ((data as ClaimTriageRow[] | null) ?? []).filter((claim) =>
    isActionableClaimStatus(claim.status)
  );
  const triageClaims = (actionableClaims.length > 0 ? actionableClaims : ((data as ClaimTriageRow[] | null) ?? []))
    .slice(0, Math.max(limit * 2, limit));

  if (triageClaims.length === 0) {
    return {
      records: [],
      mode: "live",
      message: "No accessible claims are available for AI triage yet.",
    };
  }

  const claimIds = triageClaims.map((claim) => claim.id);
  const [{ data: documentsData, error: documentsError }, { data: eventsData, error: eventsError }] =
    await Promise.all([
      client
        .from("documents")
        .select("claim_id")
        .in("claim_id", claimIds),
      client
        .from("claim_events")
        .select("claim_id")
        .in("claim_id", claimIds),
    ]);

  const documentCounts = new Map<string, number>();
  if (!documentsError) {
    documentsData?.forEach((document) => {
      if (!document.claim_id) {
        return;
      }
      documentCounts.set(document.claim_id, (documentCounts.get(document.claim_id) ?? 0) + 1);
    });
  }

  const eventCounts = new Map<string, number>();
  if (!eventsError) {
    eventsData?.forEach((event) => {
      if (!event.claim_id) {
        return;
      }
      eventCounts.set(event.claim_id, (eventCounts.get(event.claim_id) ?? 0) + 1);
    });
  }

  const records = triageClaims
    .map((claim) =>
      deriveTriageCard(
        claim,
        documentsError ? null : (documentCounts.get(claim.id) ?? 0),
        eventsError ? null : (eventCounts.get(claim.id) ?? 0)
      )
    )
    .sort((left, right) => {
      const toneWeight = { urgent: 3, watch: 2, stable: 1, healthy: 0 };
      return toneWeight[right.tone] - toneWeight[left.tone];
    })
    .slice(0, limit);

  return {
    records,
    mode: "live",
    message:
      documentsError || eventsError
        ? "AI triage is live from claim records, but related document or event signals are partially unavailable."
        : "AI triage is being derived from live claims, uploaded evidence, and claim-event history.",
  };
}

export async function loadDashboardSummary(
  profile: UserProfile | null
): Promise<DashboardSummaryResult> {
  if (!supabaseConfig.isConfigured) {
    return {
      metrics: emptyDashboardMetricRecords(),
      timeline: emptyDashboardTimelineRecords(
        "Connect Supabase and load live records to populate the dashboard timeline."
      ),
      brokerAccounts: [],
      mode: "fallback",
      message: "Supabase keys are missing. Dashboard data is unavailable until live configuration is added.",
    };
  }

  const client = await createSupabaseServerClient();
  const [
    { data: policiesData, error: policiesError },
    { data: claimsData, error: claimsError },
    { data: documentsData, error: documentsError },
    { data: eventsData, error: eventsError },
    { data: paymentsData, error: paymentsError },
  ] = await Promise.all([
    client
      .from("policies")
      .select("id, policy_number, holder_name, coverage_summary, premium, renewal_date, risk_score, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    client
      .from("claims")
      .select(
        "id, claim_number, policy_id, status, severity, reserve_amount, description, incident_date, created_at, policies ( policy_number, holder_name )"
      )
      .order("created_at", { ascending: false })
      .limit(50),
    client
      .from("documents")
      .select(
        "claim_id, file_name, document_type, created_at, claims ( claim_number ), policies ( holder_name, policy_number )"
      )
      .order("created_at", { ascending: false })
      .limit(20),
    client
      .from("claim_events")
      .select("event_type, notes, created_at, claims ( claim_number, policies ( holder_name ) )")
      .order("created_at", { ascending: false })
      .limit(20),
    client
      .from("payments")
      .select("amount, status")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (policiesError || claimsError) {
    return {
      metrics: emptyDashboardMetricRecords(),
      timeline: emptyDashboardTimelineRecords(
        "Dashboard queries failed before live activity could be loaded."
      ),
      brokerAccounts: [],
      mode: "fallback",
      message: "Dashboard summary queries failed. Live summary data is unavailable right now.",
    };
  }

  const policies = (policiesData as DashboardPolicyRow[] | null) ?? [];
  const claims = (claimsData as ClaimTriageRow[] | null) ?? [];
  const documents = (documentsData as DashboardDocumentRow[] | null) ?? [];
  const events = (eventsData as DashboardEventRow[] | null) ?? [];
  const payments = (paymentsData as DashboardPaymentRow[] | null) ?? [];

  const documentCounts = new Map<string, number>();
  documents.forEach((document) => {
    if (!document.claim_id) {
      return;
    }
    documentCounts.set(document.claim_id, (documentCounts.get(document.claim_id) ?? 0) + 1);
  });

  const eventCounts = new Map<string, number>();
  events.forEach((event) => {
    const claim = getFirstRelation(event.claims);
    const claimNumber = claim?.claim_number;
    if (!claimNumber) {
      return;
    }
    const matchingClaim = claims.find((row) => row.claim_number === claimNumber);
    if (!matchingClaim) {
      return;
    }
    eventCounts.set(matchingClaim.id, (eventCounts.get(matchingClaim.id) ?? 0) + 1);
  });

  const timeline = buildDashboardTimeline(claims.slice(0, 6), events, documents);
  const brokerAccounts = buildDashboardBrokerAccounts(policies, claims, profile);

  return {
    metrics: buildDashboardMetrics(
      policies,
      claims,
      paymentsError ? [] : payments,
      documentsError ? new Map<string, number>() : documentCounts,
      eventsError ? new Map<string, number>() : eventCounts
    ),
    timeline:
      timeline.length > 0
        ? timeline
        : emptyDashboardTimelineRecords("No recent live activity is available yet."),
    brokerAccounts,
    mode:
      documentsError || eventsError || paymentsError
        ? "fallback"
        : "live",
    message:
      documentsError || eventsError || paymentsError
        ? "Dashboard metrics are live from claims and policies, but some timeline or payment signals are unavailable."
        : "Dashboard summary is rendering live policy, claim, and operational activity data from Supabase.",
  };
}

export async function loadPolicyOptions(limit = 50): Promise<PolicyOption[]> {
  if (!supabaseConfig.isConfigured) {
    return [];
  }

  const client = await createSupabaseServerClient();
  const { data } = await client
    .from("policies")
    .select("id, policy_number, holder_name")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data?.length) {
    return [];
  }

  return data.map((policy) => ({
    id: policy.id,
    policy_number: policy.policy_number ?? "Policy unavailable",
    holder_name: policy.holder_name ?? "Unknown holder",
  }));
}

export async function loadClaimOptions(limit = 50): Promise<ClaimOption[]> {
  if (!supabaseConfig.isConfigured) {
    return [];
  }

  const client = await createSupabaseServerClient();
  const { data } = await client
    .from("claims")
    .select("id, claim_number, policy_id, policies ( holder_name )")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data?.length) {
    return [];
  }

  return data.map((claim) => {
    const policy = Array.isArray(claim.policies) ? claim.policies[0] : claim.policies;

    return {
      id: claim.id,
      claim_number: claim.claim_number ?? "Claim unavailable",
      holder_name: policy?.holder_name ?? "Unknown holder",
      policy_id: claim.policy_id ?? null,
    };
  });
}

export async function loadDocuments(limit = 20): Promise<DocumentsDataResult> {
  if (!supabaseConfig.isConfigured) {
    return {
      records: [],
      mode: "fallback",
      message: "Supabase keys are missing. Document upload is unavailable.",
    };
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .from("documents")
    .select(
      "id, file_name, document_type, created_at, claims ( claim_number ), policies ( holder_name, policy_number )"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      records: [],
      mode: "fallback",
      message: "Document list is unavailable until the latest SQL and storage policies are applied.",
    };
  }

  if (!data?.length) {
    return {
      records: [],
      mode: "live",
      message: "No documents have been uploaded for the accessible claims yet.",
    };
  }

  return {
    records: data.map((document) => {
      const claim = Array.isArray(document.claims) ? document.claims[0] : document.claims;
      const policy = Array.isArray(document.policies) ? document.policies[0] : document.policies;

      return {
        id: document.id,
        fileName: document.file_name,
        documentType: document.document_type,
        claimLabel:
          claim?.claim_number ??
          policy?.holder_name ??
          policy?.policy_number ??
          "Linked record",
        uploadedAt: new Date(document.created_at).toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }),
    mode: "live",
    message: "Recent claim documents loaded from Supabase.",
  };
}

export async function loadPortalClaimsData(
  profile: UserProfile | null,
  limit = 5
): Promise<ClaimsDataResult> {
  if (!supabaseConfig.isConfigured || !profile) {
    return {
      records: [],
      mode: "fallback",
      message: "Sign in with an assigned account to view portal claims.",
    };
  }

  const client = await createSupabaseServerClient();
  const scopedIds = await loadScopedIds(profile, client);

  if (profile.role !== "admin" && (!scopedIds.policyIds || scopedIds.policyIds.length === 0)) {
    return {
      records: [],
      mode: "live",
      message: "No policy assignments are linked to this portal user yet.",
    };
  }

  let query = client
    .from("claims")
    .select(
      "claim_number, status, severity, reserve_amount, description, incident_date, policies ( policy_number, holder_name )"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (profile.role !== "admin") {
    query = query.in("policy_id", scopedIds.policyIds ?? []);
  }

  const { data, error } = await query;

  if (error) {
    return {
      records: [],
      mode: "fallback",
      message: "Portal claims are unavailable until the latest assignment and claim policies are applied.",
    };
  }

  if (!data?.length) {
    return {
      records: [],
      mode: "live",
      message: "No claims are linked to the assigned portal policies yet.",
    };
  }

  return {
    records: data.map(mapClaim),
    mode: "live",
    message: "Portal claims are scoped to the assigned live policies.",
  };
}

export async function loadPortalDocumentsData(
  profile: UserProfile | null,
  limit = 5
): Promise<DocumentsDataResult> {
  if (!supabaseConfig.isConfigured || !profile) {
    return {
      records: [],
      mode: "fallback",
      message: "Sign in with an assigned account to view portal documents.",
    };
  }

  const client = await createSupabaseServerClient();
  const scopedIds = await loadScopedIds(profile, client);

  if (profile.role !== "admin" && (!scopedIds.policyIds || scopedIds.policyIds.length === 0)) {
    return {
      records: [],
      mode: "live",
      message: "No policy assignments are linked to this portal user yet.",
    };
  }

  let query = client
    .from("documents")
    .select(
      "id, file_name, document_type, created_at, claim_id, claims ( claim_number ), policies ( holder_name, policy_number )"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (profile.role !== "admin") {
    query = query.in("policy_id", scopedIds.policyIds ?? []);
  }

  const { data, error } = await query;

  if (error) {
    return {
      records: [],
      mode: "fallback",
      message: "Portal documents are unavailable until the latest document-access policies are applied.",
    };
  }

  if (!data?.length) {
    return {
      records: [],
      mode: "live",
      message: "No documents are linked to the assigned portal claims yet.",
    };
  }

  return {
    records: data.map((document) => {
      const claim = Array.isArray(document.claims) ? document.claims[0] : document.claims;
      const policy = Array.isArray(document.policies) ? document.policies[0] : document.policies;

      return {
        id: document.id,
        fileName: document.file_name,
        documentType: document.document_type,
        claimLabel:
          claim?.claim_number ??
          policy?.holder_name ??
          policy?.policy_number ??
          "Linked record",
        uploadedAt: formatDateTime(document.created_at),
      };
    }),
    mode: "live",
    message: "Portal documents are scoped to the assigned live policies.",
  };
}

export async function loadClaimDetail(claimNumber: string): Promise<ClaimDetailResult> {
  if (!supabaseConfig.isConfigured) {
    return {
      claim: null,
      events: [],
      documents: [],
      payments: [],
      mode: "fallback",
      message: "Live claim detail requires Supabase configuration.",
    };
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client
    .from("claims")
    .select(
      "id, claim_number, policy_id, status, severity, reserve_amount, description, incident_date, policies ( policy_number, holder_name, coverage_summary, premium, renewal_date, status )"
    )
    .eq("claim_number", claimNumber)
    .maybeSingle();

  if (error || !data) {
    return {
      claim: null,
      events: [],
      documents: [],
      payments: [],
      mode: error ? "fallback" : "live",
      message: error
        ? "Claim detail query failed. Live claim detail is unavailable right now."
        : "Claim not found or not accessible in Supabase.",
    };
  }

  const policy = Array.isArray(data.policies) ? data.policies[0] : data.policies;
  const [
    { data: eventsData, error: eventsError },
    { data: documentsData, error: documentsError },
    { data: paymentsData, error: paymentsError },
  ] =
    await Promise.all([
      client
        .from("claim_events")
        .select("id, event_type, notes, created_at")
        .eq("claim_id", data.id)
        .order("created_at", { ascending: false }),
      client
        .from("documents")
        .select("id, file_name, document_type, created_at")
        .eq("claim_id", data.id)
        .order("created_at", { ascending: false }),
      client
        .from("payments")
        .select("id, amount, payment_type, status, reference_number, created_at")
        .eq("claim_id", data.id)
        .order("created_at", { ascending: false }),
    ]);

  return {
    claim: {
      uuid: data.id,
      claimNumber: data.claim_number ?? claimNumber,
      status: data.status ?? "Open",
      severity: data.severity ?? "Severity unknown",
      reserveAmount: data.reserve_amount ?? 0,
      description: data.description ?? "Claim description not provided.",
      incidentDate: data.incident_date ?? "Incident date not set",
      holderName: policy?.holder_name ?? "Unassigned account",
      policyNumber: policy?.policy_number ?? "Policy pending",
      policyId: data.policy_id ?? null,
      policyCoverage: policy?.coverage_summary ?? "Coverage summary not provided.",
      policyStatus: policy?.status ?? "Active",
      policyRenewal: formatRenewal(policy?.renewal_date ?? null),
      policyPremium: policy?.premium ?? 0,
    },
    events:
      eventsError || !eventsData?.length
        ? []
        : eventsData.map((event) => ({
            id: event.id,
            eventType: event.event_type,
            notes: event.notes ?? "No notes provided.",
            createdAt: formatDateTime(event.created_at),
          })),
    documents:
      documentsError || !documentsData?.length
        ? []
        : documentsData.map((document) => ({
            id: document.id,
            fileName: document.file_name,
            documentType: document.document_type,
            claimLabel: data.claim_number ?? claimNumber,
            uploadedAt: formatDateTime(document.created_at),
          })),
    payments:
      paymentsError || !paymentsData?.length
        ? []
        : paymentsData.map((payment) => ({
            id: payment.id,
            amount: payment.amount ?? 0,
            paymentType: payment.payment_type ?? "Payment",
            status: payment.status ?? "Pending",
            referenceNumber: payment.reference_number ?? "Reference pending",
            createdAt: formatDateTime(payment.created_at),
          })),
    mode: "live",
    message:
      eventsError || documentsError || paymentsError
        ? "Claim loaded, but some related event, document, or payment records are unavailable until the latest SQL policies are applied."
        : "Claim detail loaded from Supabase.",
  };
}

export async function loadPortalData(profile: UserProfile | null): Promise<PortalDataResult> {
  if (!supabaseConfig.isConfigured || !profile) {
    return buildUnavailablePortalData(
      "Live portal data requires Supabase configuration and an authenticated assigned account."
    );
  }

  const client = await createSupabaseServerClient();
  const scopedIds = await loadScopedIds(profile, client);

  if (profile.role !== "admin" && (!scopedIds.policyIds || scopedIds.policyIds.length === 0)) {
    return {
      policy: null,
      items: [
        {
          title: "Account linking required",
          detail: "No policies are assigned to this user yet. An admin must create a policy assignment before coverage appears here.",
          state: "Pending",
          tone: "watch",
        },
        {
          title: "Claim tracking unlocks after assignment",
          detail: "Once a policy is linked, related claims and uploaded evidence will appear automatically in this portal.",
          state: "Blocked",
          tone: "stable",
        },
      ],
      mode: "live",
      message: "This portal account does not have any assigned policies yet.",
    };
  }

  let query = client
    .from("policies")
    .select(
      "id, policy_number, holder_name, coverage_summary, premium, renewal_date, risk_score, status"
    )
    .order("created_at", { ascending: false })
    .limit(1);

  if (profile.role !== "admin") {
    query = query.in("id", scopedIds.policyIds ?? []);
  }

  const { data, error } = await query;

  if (error) {
    return buildUnavailablePortalData(
      "Portal data could not be loaded from Supabase."
    );
  }

  if (!data?.length) {
    return {
      policy: null,
      items: [
        {
          title: "Account linking required",
          detail: "No policies are assigned to this user yet. An admin must link the account to a policy assignment before coverage appears here.",
          state: "Pending",
          tone: "watch",
        },
        {
          title: "Submit supporting documents",
          detail: "Document upload should be enabled after the account is linked to a policy and claim workflow.",
          state: "Blocked",
          tone: "stable",
        },
      ],
      mode: "live",
      message: "No assigned policy was found for this portal user.",
    };
  }

  const policy = mapPolicy(data[0], 0);
  let claimsResponse = client
    .from("claims")
    .select("id, status", { count: "exact" })
    .eq("policy_id", data[0].id);

  if (profile.role !== "admin" && scopedIds.claimIds && scopedIds.claimIds.length > 0) {
    claimsResponse = claimsResponse.in("id", scopedIds.claimIds);
  }

  const { count } = await claimsResponse;

  const openClaims = count ?? 0;

  return {
    policy,
    items: [
      {
        title: "Submit supporting documents",
        detail: `Claim evidence can be attached against ${policy.id}. Coverage data is now rendered from the live policy record.`,
        state: "Available",
        tone: "healthy",
      },
      {
        title: "Track claim status",
        detail:
          openClaims > 0
            ? `${openClaims} live claim ${openClaims === 1 ? "is" : "are"} linked to this policy and visible in the workspace.`
            : "No live claims are linked yet. New claims will appear here after first notice of loss submission.",
        state: openClaims > 0 ? "Live" : "Ready",
        tone: openClaims > 0 ? "watch" : "healthy",
      },
      {
        title: "Request payment update",
        detail:
          openClaims > 0
            ? "Payment entries logged against accessible claims will appear on the claim detail timeline and in the operations workspace."
            : "Payment updates will appear after the first assigned claim enters financial handling.",
        state: openClaims > 0 ? "Tracked" : "Ready",
        tone: openClaims > 0 ? "healthy" : "stable",
      },
    ],
    mode: "live",
    message: "Portal is rendering only the policies assigned to this live account.",
  };
}

export async function loadBrokerData(profile: UserProfile | null): Promise<BrokerDataResult> {
  if (!supabaseConfig.isConfigured) {
    return {
      accounts: [],
      mode: "fallback",
      message: "Supabase keys are missing. Broker data is unavailable until live configuration is added.",
    };
  }

  const client = await createSupabaseServerClient();
  const scopedIds = profile ? await loadScopedIds(profile, client) : { policyIds: null, claimIds: null };

  if (
    profile &&
    profile.role !== "admin" &&
    (!scopedIds.policyIds || scopedIds.policyIds.length === 0)
  ) {
    return {
      accounts: [],
      mode: "live",
      message: "No policy assignments are linked to this broker yet.",
    };
  }

  let policiesQuery = client
    .from("policies")
    .select(
      "id, policy_number, holder_name, coverage_summary, premium, renewal_date, risk_score, status"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  let claimsQuery = client
    .from("claims")
    .select("policy_id, status")
    .order("created_at", { ascending: false })
    .limit(50);

  if (profile && profile.role !== "admin") {
    policiesQuery = policiesQuery.in("id", scopedIds.policyIds ?? []);
    claimsQuery = claimsQuery.in("policy_id", scopedIds.policyIds ?? []);
  }

  const [{ data: policiesData, error: policiesError }, { data: claimsData, error: claimsError }] =
    await Promise.all([policiesQuery, claimsQuery]);

  if (policiesError || claimsError || !policiesData?.length) {
    return {
      accounts: [],
      mode: policiesError || claimsError ? "fallback" : "live",
      message:
        policiesError || claimsError
          ? "Live broker book is unavailable right now."
          : "No accounts are assigned to this broker yet.",
    };
  }

  const openClaimsByPolicy = new Map<string, number>();
  claimsData?.forEach((claim) => {
    if (!claim.policy_id) {
      return;
    }

    const status = claim.status?.toLowerCase() ?? "";
    const isOpen = !status.includes("closed") && !status.includes("paid") && !status.includes("complete");
    if (!isOpen) {
      return;
    }

    openClaimsByPolicy.set(claim.policy_id, (openClaimsByPolicy.get(claim.policy_id) ?? 0) + 1);
  });

  const accounts = policiesData.map((policy) => {
    const openClaims = openClaimsByPolicy.get(policy.id) ?? 0;
    const tone = toneFromPortfolio(policy, openClaims);

    return {
      name: policy.holder_name ?? "Unknown account",
      owner: `Book owner: ${profile?.full_name ?? profile?.email ?? "Broker workspace"}`,
      health: healthLabelFromTone(tone),
      tone,
      renewal: formatRenewal(policy.renewal_date),
      openClaims,
      premium: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(policy.premium ?? 0),
    };
  });

  return {
    accounts,
    mode: "live",
    message:
      profile?.role === "admin"
        ? "Broker workspace is rendering live account and open-claim data from Supabase."
        : "Broker workspace is rendering only the policies assigned to this broker.",
  };
}

export async function loadAdminAssignmentsData(): Promise<AdminAssignmentsDataResult> {
  const client = await createSupabaseServerClient();
  const [
    { data: profilesData },
    { data: policiesData },
    { data: claimsData },
    { data: policyAssignmentsData },
    { data: claimAssignmentsData },
  ] = await Promise.all([
    client
      .from("profiles")
      .select("id, full_name, email, role, organization_name")
      .order("created_at", { ascending: true }),
    client
      .from("policies")
      .select("id, policy_number, holder_name")
      .order("created_at", { ascending: false }),
    client
      .from("claims")
      .select("id, claim_number, policies ( policy_number, holder_name )")
      .order("created_at", { ascending: false }),
    client
      .from("policy_assignments")
      .select(
        "id, profile_id, assignment_role, provisioning_source, policy_id, profiles ( full_name, email, role ), policies ( policy_number, holder_name )"
      )
      .order("created_at", { ascending: false }),
    client
      .from("claim_assignments")
      .select(
        "id, profile_id, assignment_role, provisioning_source, claim_id, profiles ( full_name, email, role ), claims ( claim_number )"
      )
      .order("created_at", { ascending: false }),
  ]);

  return {
    profiles:
      profilesData?.map((profile) => ({
        id: profile.id,
        label:
          profile.full_name ??
          profile.email ??
          `${profile.role} user`,
        role: profile.role,
      })) ?? [],
    policies:
      policiesData?.map((policy) => ({
        id: policy.id,
        label: `${policy.policy_number ?? "Policy"} - ${policy.holder_name ?? "Unknown holder"}`,
      })) ?? [],
    claims:
      claimsData?.map((claim) => {
        const policy = Array.isArray(claim.policies) ? claim.policies[0] : claim.policies;
        return {
          id: claim.id,
          label: `${claim.claim_number ?? "Claim"} - ${policy?.holder_name ?? policy?.policy_number ?? "Unassigned account"}`,
        };
      }) ?? [],
    policyAssignments:
      policyAssignmentsData?.map((assignment) => {
        const profile = Array.isArray(assignment.profiles)
          ? assignment.profiles[0]
          : assignment.profiles;
        const policy = Array.isArray(assignment.policies)
          ? assignment.policies[0]
          : assignment.policies;

        return {
          id: assignment.id,
          profileId: assignment.profile_id,
          profileLabel:
            profile?.full_name ??
            profile?.email ??
            profile?.role ??
            "Unknown user",
          assignmentRole: assignment.assignment_role,
          policyId: assignment.policy_id,
          policyLabel: `${policy?.policy_number ?? "Policy"} - ${policy?.holder_name ?? "Unknown holder"}`,
          provisioningSource: assignment.provisioning_source,
        };
      }) ?? [],
    claimAssignments:
      claimAssignmentsData?.map((assignment) => {
        const profile = Array.isArray(assignment.profiles)
          ? assignment.profiles[0]
          : assignment.profiles;
        const claim = Array.isArray(assignment.claims)
          ? assignment.claims[0]
          : assignment.claims;

        return {
          id: assignment.id,
          profileId: assignment.profile_id,
          profileLabel:
            profile?.full_name ??
            profile?.email ??
            profile?.role ??
            "Unknown user",
          assignmentRole: assignment.assignment_role,
          claimId: assignment.claim_id,
          claimLabel: claim?.claim_number ?? "Unknown claim",
          provisioningSource: assignment.provisioning_source,
        };
      }) ?? [],
  };
}
