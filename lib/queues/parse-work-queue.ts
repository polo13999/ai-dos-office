import { optionalScalar, parseMarkdownTable, unwrapScalar } from "./parse-markdown-table";
import type { QueueItem, QueueParseResult } from "./types";

const WORK_HEADERS = [
  "Queue Order",
  "Priority",
  "Work ID",
  "Title",
  "Status",
  "Next Action",
  "Waiting On",
  "Claimed By",
  "Resume Condition",
  "Work Path",
] as const;

const KNOWN_STATUSES = new Set([
  "READY",
  "CLAIMED",
  "RUNNING",
  "WAITING_CONFIRMATION",
  "WAITING_REVIEW",
  "BLOCKED",
]);

export function parseWorkQueue(markdown: string): QueueParseResult {
  const table = parseMarkdownTable(markdown, WORK_HEADERS);
  const warnings = [...table.warnings];
  const errors = [...table.errors];
  const items: QueueItem[] = [];

  for (const row of table.rows) {
    const itemId = unwrapScalar(row.values["Work ID"] ?? "");
    const title = unwrapScalar(row.values.Title ?? "");
    const priority = unwrapScalar(row.values.Priority ?? "");
    const status = unwrapScalar(row.values.Status ?? "");
    const queueOrderText = unwrapScalar(row.values["Queue Order"] ?? "");
    const queueOrder = Number(queueOrderText);

    if (!itemId || !title || !priority || !status) {
      warnings.push(`Source row ${row.sourceRow} was skipped because a required Work field is missing.`);
      continue;
    }
    if (!Number.isInteger(queueOrder) || queueOrder <= 0) {
      warnings.push(`Source row ${row.sourceRow} was skipped because Queue Order is not a positive integer.`);
      continue;
    }
    if (!KNOWN_STATUSES.has(status)) {
      warnings.push(`Source row ${row.sourceRow} preserves unknown Work status "${status}".`);
    }
    if (!/^P[0-5]$/.test(priority)) {
      warnings.push(`Source row ${row.sourceRow} preserves unknown Work priority "${priority}".`);
    }

    items.push({
      domain: "WORK",
      itemId,
      title,
      priority,
      status,
      queueOrder,
      currentRound: null,
      nextAction: optionalScalar(row.values["Next Action"]),
      waiting: optionalScalar(row.values["Waiting On"]),
      claimedBy: optionalScalar(row.values["Claimed By"]),
      resumeCondition: optionalScalar(row.values["Resume Condition"]),
      authoritativeLocation: optionalScalar(row.values["Work Path"]),
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

  return { domain: "WORK", status, warnings, errors, items };
}
