import { FixtureQueueSource } from "./fixture-source";
import { GitHubQueueSource } from "./github-source";
import { QueueSourceError, type QueueSource } from "./source";

export type QueueSourceEnvironment = Record<string, string | undefined>;

export function createQueueSource(env: QueueSourceEnvironment = process.env): QueueSource {
  const mode = (env.AI_DOS_QUEUE_SOURCE ?? "fixture").trim().toLowerCase();

  if (mode === "fixture") {
    return new FixtureQueueSource();
  }

  if (mode !== "github") {
    throw new QueueSourceError(
      "SOURCE_INVALID",
      `Unsupported AI_DOS_QUEUE_SOURCE value: ${mode || "<empty>"}.`,
    );
  }

  const token = env.AI_DOS_GITHUB_TOKEN?.trim();
  if (!token) {
    throw new QueueSourceError(
      "SOURCE_INVALID",
      "AI_DOS_GITHUB_TOKEN is required when AI_DOS_QUEUE_SOURCE=github.",
    );
  }

  return new GitHubQueueSource({
    token,
    work: {
      repository: env.AI_DOS_WORK_QUEUE_REPOSITORY ?? "polo13999/ai-dos-work",
      path: env.AI_DOS_WORK_QUEUE_PATH ?? "WORK_TASK_LIST.md",
      ref: env.AI_DOS_WORK_QUEUE_REF ?? "main",
    },
    research: {
      repository: env.AI_DOS_RESEARCH_QUEUE_REPOSITORY ?? "polo13999/ai-dos-research",
      path: env.AI_DOS_RESEARCH_QUEUE_PATH ?? "RESEARCH_TASK_LIST.md",
      ref: env.AI_DOS_RESEARCH_QUEUE_REF ?? "main",
    },
  });
}
