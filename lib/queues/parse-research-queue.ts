import { optionalScalar, parseMarkdownTable, unwrapScalar } from "./parse-markdown-table";
import type { QueueItem, QueueParseResult } from "./types";

const RESEARCH_HEADERS = [
  "Priority",
  "Research ID",
  "Title",
  "Status",
  "Current Round",
  "Waiting",
  "Claimed By",
] as const;

const KNOWN_STATUSES = new Set([
  "READY",
  "CLAIMED",
  "RUNNING",
  "WAITING_CONFIRMATION",
  "BLOCKED",
  "DONE",
]);

export function parseResearchQueue(markdown: string): QueueParseResult {
  const table = parseMarkdownTable(markdown, RESEARCH_HEADERS);
  const warnings = [...table.warnings];
  const errors = [...table.errors];
  const items: QueueItem[] = [];

  for (const row of table.rows) {
    const itemId = unwrapScalar(row.values["Research ID"] ?? "");
    const title = unwrapScalar(row.values.Title ?? "");
    const priority = unwrapScalar(row.values.Priority ?? "");
    const status = unwrapScalar(row.values.Status ?? "");
    const currentRound = unwrapScalar(row.values["Current Round"] ?? "");

    if (!itemId || !title || !priority || !status || !currentRound) {
      warnings.push(`Source row ${row.sourceRow} was skipped because a required Research field is missing.`);
      continue;
    }
    if (!KNOWN_STATUSES.has(status)) {
      warnings.push(`Source row ${row.sourceRow} preserves unknown Research status "${status}".`);
    }
    if (!/^P[0-5]$/.test(priority)) {
      warnings.push(`Source row ${row.sourceRow} preserves unknown Research priority "${priority}".`);
    }

    items.push({
      domain: "RESEARCH",
      itemId,
      title,
      priority,
      status,
      queueOrder: null,
      currentRound,
      nextAction: null,
      waiting: optionalScalar(row.values.Waiting),
      claimedBy: optionalScalar(row.values["Claimed By"]),
      resumeCondition: null,
      authoritativeLocation: null,
      sourceRow: row.sourceRow,
    });
  }

  const status = errors.length
    ? "PARSE_ERROR"
    : items.length
      ? "OK"
      : table.status === "EMPTY"
        ? "EMPTY"
        : "PARSE_ERROR";

  return { domain: "RESEARCH", status, warnings, errors, items };
}
