import type { QueueSource } from "./source";
import { QueueSourceError } from "./source";
import type { QueueDomain, QueueSourceDocument } from "./types";

export type GitHubQueueTarget = {
  repository: string;
  path: string;
  ref?: string;
};

export type GitHubQueueSourceOptions = {
  token: string;
  work?: Partial<GitHubQueueTarget>;
  research?: Partial<GitHubQueueTarget>;
  fetchImpl?: typeof fetch;
};

const DEFAULT_WORK: GitHubQueueTarget = {
  repository: "polo13999/ai-dos-work",
  path: "WORK_TASK_LIST.md",
  ref: "main",
};

const DEFAULT_RESEARCH: GitHubQueueTarget = {
  repository: "polo13999/ai-dos-research",
  path: "RESEARCH_TASK_LIST.md",
  ref: "main",
};

export class GitHubQueueSource implements QueueSource {
  private readonly fetchImpl: typeof fetch;
  private readonly work: GitHubQueueTarget;
  private readonly research: GitHubQueueTarget;

  constructor(private readonly options: GitHubQueueSourceOptions) {
    if (!options.token.trim()) {
      throw new QueueSourceError("SOURCE_INVALID", "GitHub queue source token is required.");
    }
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.work = { ...DEFAULT_WORK, ...options.work };
    this.research = { ...DEFAULT_RESEARCH, ...options.research };
  }

  readWorkQueue() {
    return this.read("WORK", this.work);
  }

  readResearchQueue() {
    return this.read("RESEARCH", this.research);
  }

  private async read(domain: QueueDomain, target: GitHubQueueTarget): Promise<QueueSourceDocument> {
    const encodedPath = target.path.split("/").map(encodeURIComponent).join("/");
    const url = new URL(`https://api.github.com/repos/${target.repository}/contents/${encodedPath}`);
    if (target.ref) url.searchParams.set("ref", target.ref);

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.options.token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      });
    } catch {
      throw new QueueSourceError("SOURCE_UNAVAILABLE", `${domain} GitHub queue source is unavailable.`);
    }

    if (!response.ok) {
      throw new QueueSourceError("SOURCE_UNAVAILABLE", `${domain} GitHub queue source returned HTTP ${response.status}.`);
    }

    const payload = await response.json() as { content?: string; encoding?: string; sha?: string };
    if (payload.encoding !== "base64" || !payload.content || !payload.sha) {
      throw new QueueSourceError("SOURCE_INVALID", `${domain} GitHub queue response is invalid.`);
    }

    return {
      domain,
      repository: target.repository,
      path: target.path,
      revision: payload.sha,
      fetchedAt: new Date().toISOString(),
      content: Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8"),
    };
  }
}
