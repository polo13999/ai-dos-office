import { parseResearchQueue } from "./parse-research-queue";
import { parseWorkQueue } from "./parse-work-queue";
import type { QueueSource } from "./source";
import type {
  QueueDashboardResponse,
  QueueDomain,
  QueueParseResult,
  QueueSnapshot,
  QueueSourceDocument,
} from "./types";

function toSnapshot(
  document: QueueSourceDocument,
  parsed: QueueParseResult,
): QueueSnapshot {
  return {
    domain: document.domain,
    repository: document.repository,
    path: document.path,
    revision: document.revision,
    fetchedAt: document.fetchedAt,
    lastSuccessfulFetch: document.fetchedAt,
    status: parsed.status,
    warnings: parsed.warnings,
    errors: parsed.errors,
    items: parsed.items,
  };
}

function sourceErrorSnapshot(domain: QueueDomain, message: string): QueueSnapshot {
  return {
    domain,
    repository: "unavailable",
    path: "unavailable",
    revision: null,
    fetchedAt: new Date().toISOString(),
    lastSuccessfulFetch: null,
    status: "SOURCE_ERROR",
    warnings: [],
    errors: [message],
    items: [],
  };
}

async function loadDomain(
  domain: QueueDomain,
  read: () => Promise<QueueSourceDocument>,
): Promise<QueueSnapshot> {
  try {
    const document = await read();
    const parsed = domain === "WORK"
      ? parseWorkQueue(document.content)
      : parseResearchQueue(document.content);
    return toSnapshot(document, parsed);
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : `${domain} queue source failed.`;
    return sourceErrorSnapshot(domain, message);
  }
}

export async function buildQueueDashboard(
  source: QueueSource,
): Promise<QueueDashboardResponse> {
  const [work, research] = await Promise.all([
    loadDomain("WORK", () => source.readWorkQueue()),
    loadDomain("RESEARCH", () => source.readResearchQueue()),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    work,
    research,
  };
}

export function hasAvailableQueue(response: QueueDashboardResponse) {
  return response.work.status !== "SOURCE_ERROR" ||
    response.research.status !== "SOURCE_ERROR";
}
