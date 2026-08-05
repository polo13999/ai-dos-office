export type QueueDomain = "WORK" | "RESEARCH";

export type QueueParseStatus = "OK" | "EMPTY" | "PARSE_ERROR";

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
