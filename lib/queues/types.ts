export type QueueDomain = "WORK" | "RESEARCH";

export type QueueParseStatus = "OK" | "EMPTY" | "PARSE_ERROR";
export type QueueSnapshotStatus = QueueParseStatus | "SOURCE_ERROR";

export type QueueItem = {
  domain: QueueDomain;
  itemId: string;
  title: string;
  priority: string;
  status: string;
  queueOrder: number | null;
  currentRound: string | null;
  nextAction: string | null;
  waiting: string | null;
  claimedBy: string | null;
  resumeCondition: string | null;
  authoritativeLocation: string | null;
  sourceRow: number;
};

export type QueueParseResult = {
  domain: QueueDomain;
  status: QueueParseStatus;
  warnings: string[];
  errors: string[];
  items: QueueItem[];
};

export type QueueSourceDocument = {
  domain: QueueDomain;
  repository: string;
  path: string;
  revision: string | null;
  fetchedAt: string;
  content: string;
};

export type QueueSnapshot = {
  domain: QueueDomain;
  repository: string;
  path: string;
  revision: string | null;
  fetchedAt: string;
  lastSuccessfulFetch: string | null;
  status: QueueSnapshotStatus;
  warnings: string[];
  errors: string[];
  items: QueueItem[];
};

export type QueueDashboardResponse = {
  generatedAt: string;
  work: QueueSnapshot;
  research: QueueSnapshot;
};

export type MarkdownTableRow = {
  sourceRow: number;
  values: Record<string, string>;
};

export type MarkdownTableParseResult = {
  status: QueueParseStatus;
  headers: string[];
  rows: MarkdownTableRow[];
  warnings: string[];
  errors: string[];
};
