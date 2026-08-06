import { classifyWorkCompletion } from "./classify-work-completion";
import { CapabilityFixtureSource } from "./fixture-source";
import type { CapabilityDashboardResponse, SourceDescriptor } from "./types";

function withFetchedAt<T extends { source: Omit<SourceDescriptor, "fetchedAt"> }>(value: T, fetchedAt: string): T & { source: SourceDescriptor } {
  return { ...value, source: { ...value.source, fetchedAt } };
}

export async function buildCapabilityDashboard(
  source = new CapabilityFixtureSource(),
): Promise<CapabilityDashboardResponse> {
  const generatedAt = new Date().toISOString();
  const [workFixtures, missionFixture, repositoryFixture, pullRequests, capabilityFixtures] =
    await Promise.all([
      source.readWorkCompletion(),
      source.readMission(),
      source.readRepository(),
      source.readPullRequests(),
      source.readCapabilities(),
    ]);

  return {
    generatedAt,
    mode: "FIXTURE",
    mission: withFetchedAt(missionFixture, generatedAt),
    repository: withFetchedAt(repositoryFixture, generatedAt),
    pullRequests,
    workCompletion: workFixtures.map(classifyWorkCompletion),
    capabilities: capabilityFixtures.map((record) => withFetchedAt(record, generatedAt)),
  };
}
