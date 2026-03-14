export type PolicyRecord = {
  id: string;
  holder: string;
  coverage: string;
  premium: number;
  risk: string;
  tone: "healthy" | "stable" | "watch" | "urgent";
  renewal: string;
};

export type ClaimRecord = {
  id: string;
  account: string;
  summary: string;
  reserve: number;
  stage: string;
  status: string;
  tone: "healthy" | "stable" | "watch" | "urgent";
  tags: string[];
};

export const dashboardMetrics = [
  { label: "Policies in force", value: "148", delta: "+12 this week", tone: "healthy" },
  { label: "Open claims", value: "19", delta: "5 same-day", tone: "watch" },
  { label: "Premium collected", value: "$842K", delta: "96% paid", tone: "stable" },
  { label: "AI triage confidence", value: "91%", delta: "explainable", tone: "healthy" },
] as const;

export const policies: PolicyRecord[] = [
  {
    id: "POL-CY-1048",
    holder: "Northstar HealthTech",
    coverage: "Cyber Liability - $2M limit",
    premium: 145000,
    risk: "Monitored",
    tone: "watch",
    renewal: "Apr 08",
  },
  {
    id: "POL-CY-1072",
    holder: "Finwell Payroll",
    coverage: "Tech E&O - $1M limit",
    premium: 92000,
    risk: "Healthy",
    tone: "healthy",
    renewal: "May 14",
  },
  {
    id: "POL-CY-1089",
    holder: "Atlas Commerce Group",
    coverage: "Cyber Liability - $3M limit",
    premium: 210000,
    risk: "Escalated",
    tone: "urgent",
    renewal: "Mar 29",
  },
  {
    id: "POL-CY-1113",
    holder: "ByteForge Systems",
    coverage: "Media Liability - $750K limit",
    premium: 54000,
    risk: "Healthy",
    tone: "healthy",
    renewal: "Jun 03",
  },
  {
    id: "POL-CY-1131",
    holder: "SignalStack Labs",
    coverage: "Cyber Liability - $1.5M limit",
    premium: 128000,
    risk: "Stable",
    tone: "stable",
    renewal: "Apr 21",
  },
];

export const claimQueue: ClaimRecord[] = [
  {
    id: "CLM-2209",
    account: "Atlas Commerce Group",
    summary:
      "Ransomware incident reported through broker. Vendor invoices and outage timeline are attached, but incident report remains incomplete.",
    reserve: 118000,
    stage: "Awaiting coverage review",
    status: "Urgent",
    tone: "urgent",
    tags: ["missing incident report", "broker-submitted", "fraud score 0.12"],
  },
  {
    id: "CLM-2214",
    account: "Northstar HealthTech",
    summary:
      "Possible PHI exposure with outside counsel engaged. Regulatory notice cost could rise quickly across multiple states.",
    reserve: 245000,
    stage: "Adjuster assigned",
    status: "Monitor",
    tone: "watch",
    tags: ["legal review", "regulated data", "notification risk"],
  },
  {
    id: "CLM-2218",
    account: "ByteForge Systems",
    summary:
      "Business email compromise claim with bank evidence uploaded and identity checks already completed.",
    reserve: 64000,
    stage: "Ready for payment approval",
    status: "Ready",
    tone: "healthy",
    tags: ["complete evidence", "low anomaly score", "payment path"],
  },
];

export const aiTriageCards = [
  {
    claimId: "CLM-2209",
    title: "Incomplete first notice of loss package",
    label: "Escalate",
    tone: "urgent",
    summary:
      "The narrative references data exfiltration but lacks a forensic summary and signed incident timeline. Recommend adjuster review before reserve increase.",
    reasons: ["missing forensic report", "coverage ambiguity", "high outage cost"],
  },
  {
    claimId: "CLM-2214",
    title: "Potential severity spike within 24 hours",
    label: "Monitor",
    tone: "watch",
    summary:
      "Exposure indicators suggest legal and notification spend may rise quickly. Recommend proactive outreach and counsel coordination.",
    reasons: ["regulated data", "counsel retained", "multi-state exposure"],
  },
  {
    claimId: "CLM-2218",
    title: "Fast-track settlement candidate",
    label: "Approve path",
    tone: "healthy",
    summary:
      "Required artifacts are present, identity signals are consistent, and payout amount sits inside historical range for similar incidents.",
    reasons: ["documents complete", "low anomaly score", "within reserve band"],
  },
] as const;

export const dashboardTimeline = [
  {
    time: "09:15 AM",
    title: "Claim CLM-2218 moved to payment approval",
    detail:
      "Evidence package passed checklist review and identity verification completed without flags.",
    dot: "bg-emerald-500",
  },
  {
    time: "10:05 AM",
    title: "Renewal review scheduled for Atlas Commerce Group",
    detail:
      "Broker note added to revisit cyber limit due to recent incident frequency and growing transaction volume.",
    dot: "bg-amber-500",
  },
  {
    time: "11:10 AM",
    title: "Document request sent to Northstar HealthTech",
    detail: "Adjuster requested updated breach timeline and external counsel notice plan.",
    dot: "bg-sky-500",
  },
] as const;

export const brokerAccounts = [
  {
    name: "Atlas Commerce Group",
    owner: "Broker: Maya Patel",
    health: "Intervention needed",
    tone: "urgent",
    renewal: "Mar 29",
    openClaims: 2,
    premium: "$210K",
  },
  {
    name: "Northstar HealthTech",
    owner: "Broker: Daniel Reed",
    health: "Watch closely",
    tone: "watch",
    renewal: "Apr 08",
    openClaims: 1,
    premium: "$145K",
  },
  {
    name: "Finwell Payroll",
    owner: "Broker: Priya Shah",
    health: "Healthy account",
    tone: "healthy",
    renewal: "May 14",
    openClaims: 0,
    premium: "$92K",
  },
] as const;

export const portalItems = [
  {
    title: "Submit supporting documents",
    detail:
      "Upload incident reports, invoices, legal notices, and communication evidence into the claim record.",
    state: "Available",
    tone: "healthy",
  },
  {
    title: "Track claim status",
    detail:
      "View current workflow stage, assigned adjuster, and next required action without calling support.",
    state: "Available",
    tone: "healthy",
  },
  {
    title: "Request payment update",
    detail:
      "See whether claim reimbursement or premium payment is pending, approved, or completed.",
    state: "Planned",
    tone: "stable",
  },
];
