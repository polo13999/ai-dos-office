import type { CompletionEvidence, WorkCompletionRecord } from "./types";

export function classifyWorkCompletion(input: {
  workId: string;
  title: string;
  evidence: CompletionEvidence[];
}): WorkCompletionRecord {
  const unfinished = input.evidence.filter((item) => item.kind === "UNFINISHED_QUEUE");
  const completed = input.evidence.filter((item) =>
    ["REMOVED_COMPLETED", "WORK_RESULT", "FINAL_REVIEW", "ARCHIVE"].includes(item.kind),
  );

  if (unfinished.length > 0 && completed.length > 0) {
    return {
      ...input,
      state: "CONTRADICTORY",
      queueStatus: unfinished[0]?.status ?? null,
      reasons: ["Unfinished Queue evidence conflicts with durable completion evidence."],
    };
  }

  if (unfinished.length > 0) {
    return {
      ...input,
      state: "UNFINISHED",
      queueStatus: unfinished[0]?.status ?? null,
      reasons: ["The Work is present in the authoritative unfinished Queue."],
    };
  }

  if (completed.length > 0) {
    return {
      ...input,
      state: "COMPLETED",
      queueStatus: null,
      reasons: ["Durable completion evidence exists; Queue absence was not used alone."],
    };
  }

  return {
    ...input,
    state: "UNKNOWN",
    queueStatus: null,
    reasons: ["Queue absence alone is insufficient to prove completion."],
  };
}
