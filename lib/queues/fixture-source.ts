import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { QueueSource } from "./source";
import { QueueSourceError } from "./source";
import type { QueueDomain, QueueSourceDocument } from "./types";

const FIXTURE_REPOSITORY = "fixture://ai-dos-office";

export type FixtureQueueSourceOptions = {
  workFixture?: string;
  researchFixture?: string;
  failWork?: boolean;
  failResearch?: boolean;
};

export class FixtureQueueSource implements QueueSource {
  constructor(private readonly options: FixtureQueueSourceOptions = {}) {}

  readWorkQueue() {
    return this.readFixture(
      "WORK",
      this.options.workFixture ?? "work-valid.md",
      Boolean(this.options.failWork),
    );
  }

  readResearchQueue() {
    return this.readFixture(
      "RESEARCH",
      this.options.researchFixture ?? "research-valid.md",
      Boolean(this.options.failResearch),
    );
  }

  private async readFixture(
    domain: QueueDomain,
    fixtureName: string,
    shouldFail: boolean,
  ): Promise<QueueSourceDocument> {
    if (shouldFail) {
      throw new QueueSourceError(
        "SOURCE_UNAVAILABLE",
        `${domain} fixture source is unavailable.`,
      );
    }

    const relativePath = `fixtures/queues/${fixtureName}`;
    const absolutePath = join(process.cwd(), "fixtures", "queues", fixtureName);

    try {
      const content = await readFile(absolutePath, "utf8");
      return {
        domain,
        repository: FIXTURE_REPOSITORY,
        path: relativePath,
        revision: "sanitized-fixture-v1",
        fetchedAt: new Date().toISOString(),
        content,
      };
    } catch {
      throw new QueueSourceError(
        "SOURCE_UNAVAILABLE",
        `${domain} fixture could not be read.`,
      );
    }
  }
}
