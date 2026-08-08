import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  CapabilityRecord,
  CompletionEvidence,
  MissionSnapshot,
  PullRequestSnapshot,
  RepositorySnapshot,
} from "./types";

type WorkFixture = {
  workId: string;
  title: string;
  evidence: CompletionEvidence[];
};

export class CapabilityFixtureSource {
  async readWorkCompletion(): Promise<WorkFixture[]> {
    return this.readJson<WorkFixture[]>("work-completion.json");
  }

  async readMission(): Promise<Omit<MissionSnapshot, "source"> & { source: Omit<MissionSnapshot["source"], "fetchedAt"> }> {
    return this.readJson("current-mission.json");
  }

  async readRepository(): Promise<Omit<RepositorySnapshot, "source"> & { source: Omit<RepositorySnapshot["source"], "fetchedAt"> }> {
    return this.readJson("repository.json");
  }

  async readPullRequests(): Promise<PullRequestSnapshot[]> {
    return this.readJson("pull-requests.json");
  }

  async readCapabilities(): Promise<Array<Omit<CapabilityRecord, "source"> & { source: Omit<CapabilityRecord["source"], "fetchedAt"> }>> {
    return this.readJson("availability.json");
  }

  private async readJson<T>(fileName: string): Promise<T> {
    const path = join(process.cwd(), "fixtures", "capabilities", fileName);
    const content = await readFile(path, "utf8");
    return JSON.parse(content) as T;
  }
}
