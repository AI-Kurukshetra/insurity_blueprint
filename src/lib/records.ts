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
