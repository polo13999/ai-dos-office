export type CapabilityStatus =
  | "AVAILABLE_FIXTURE"
  | "AVAILABLE_LIVE"
  | "STALE"
  | "UNAVAILABLE"
  | "UNSUPPORTED"
  | "PERMISSION_REQUIRED"
  | "SOURCE_ERROR"
  | "CONTRADICTORY";

export type EvidenceStrength =
  | "AUTHORITATIVE"
  | "DURABLE_COMPLETION"
  | "SUPPORTING"
  | "INSUFFICIENT";

export type WorkCompletionState =
  | "UNFINISHED"
  | "COMPLETED"
  | "UNKNOWN"
  | "CONTRADICTORY";

export type SourceDescriptor = {
  repository: string;
  path: string;
  revision: string | null;
  mode: "FIXTURE" | "LIVE";
  fetchedAt: string;
  freshness: string;
  permission: string;
  warnings: string[];
  errors: string[];
};

export type CompletionEvidence = {
  kind: "UNFINISHED_QUEUE" | "REMOVED_COMPLETED" | "WORK_RESULT" | "FINAL_REVIEW" | "ARCHIVE";
  reference: string;
  strength: EvidenceStrength;
  status?: string;
};

export type WorkCompletionRecord = {
  workId: string;
  title: string;
  state: WorkCompletionState;
  queueStatus: string | null;
  reasons: string[];
  evidence: CompletionEvidence[];
};

export type MissionSnapshot = {
  missionId: string;
  title: string;
  status: string;
  activeGen: string;
  owner: string;
  source: SourceDescriptor;
};

export type RepositorySnapshot = {
  repository: string;
  defaultBranch: string;
  recentCommit: string;
  source: SourceDescriptor;
};

export type PullRequestSnapshot = {
  number: number;
  title: string;
  state: "OPEN" | "CLOSED" | "MERGED";
  draft: boolean;
  head: string;
  base: string;
};

export type CapabilityRecord = {
  id: string;
  label: string;
  status: CapabilityStatus;
  summary: string;
  source: SourceDescriptor;
};

export type CapabilityDashboardResponse = {
  generatedAt: string;
  mode: "FIXTURE" | "LIVE";
  mission: MissionSnapshot;
  repository: RepositorySnapshot;
  pullRequests: PullRequestSnapshot[];
  workCompletion: WorkCompletionRecord[];
  capabilities: CapabilityRecord[];
};
