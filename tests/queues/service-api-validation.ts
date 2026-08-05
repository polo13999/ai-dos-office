import assert from "node:assert/strict";
import { FixtureQueueSource } from "../../lib/queues/fixture-source";
import { GitHubQueueSource } from "../../lib/queues/github-source";
import { createQueueSource } from "../../lib/queues/source-factory";
import { buildQueueDashboard, hasAvailableQueue } from "../../lib/queues/service";
import { GET } from "../../app/api/queues/route";

function githubResponse(content: string, sha = "test-sha", status = 200) {
  return new Response(
    status === 200
      ? JSON.stringify({ content: Buffer.from(content).toString("base64"), encoding: "base64", sha })
      : JSON.stringify({ message: "failure" }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}

async function run() {
  let assertions = 0;
  const check = (value: unknown, message: string) => {
    assert.ok(value, message);
    assertions += 1;
  };

  const normal = await buildQueueDashboard(new FixtureQueueSource());
  check(normal.work.status === "OK", "Work fixture should be OK.");
  check(normal.research.status === "OK", "Research fixture should be OK.");
  check(normal.work.items.length === 2, "Work should contain two items.");
  check(normal.research.items.length === 2, "Research should contain two items.");
  check(hasAvailableQueue(normal), "Normal response should be available.");

  const oneFailure = await buildQueueDashboard(new FixtureQueueSource({ failWork: true }));
  check(oneFailure.work.status === "SOURCE_ERROR", "Work should expose source failure.");
  check(oneFailure.work.items.length === 0, "Failed Work source must not fabricate rows.");
  check(oneFailure.research.status === "OK", "Research must survive Work failure.");
  check(hasAvailableQueue(oneFailure), "One healthy source should remain available.");

  const bothFailure = await buildQueueDashboard(
    new FixtureQueueSource({ failWork: true, failResearch: true }),
  );
  check(!hasAvailableQueue(bothFailure), "Two failed sources should be unavailable.");

  const parseError = await buildQueueDashboard(
    new FixtureQueueSource({ researchFixture: "malformed-research.md" }),
  );
  check(parseError.research.status === "PARSE_ERROR", "Malformed Research must expose parse error.");
  check(parseError.work.status === "OK", "Work must survive Research parse error.");

  const empty = await buildQueueDashboard(
    new FixtureQueueSource({ workFixture: "empty-work.md" }),
  );
  check(empty.work.status === "EMPTY", "Empty Work table must remain EMPTY.");
  check(empty.work.items.length === 0, "Empty Work must not fabricate rows.");

  const serialized = JSON.stringify(normal);
  check(!serialized.includes("# Sanitized"), "Raw Markdown must not be serialized.");
  check(!serialized.includes("authorization"), "Authorization material must not be serialized.");
  check(serialized.includes("fixture://ai-dos-office"), "Fixture source identity must be visible.");

  check(createQueueSource({}) instanceof FixtureQueueSource, "Fixture mode must remain the default.");
  assert.throws(
    () => createQueueSource({ AI_DOS_QUEUE_SOURCE: "github" }),
    /AI_DOS_GITHUB_TOKEN/,
  );
  assertions += 1;
  assert.throws(
    () => createQueueSource({ AI_DOS_QUEUE_SOURCE: "unknown" }),
    /Unsupported AI_DOS_QUEUE_SOURCE/,
  );
  assertions += 1;

  const validWork = await new FixtureQueueSource().readWorkQueue();
  const validResearch = await new FixtureQueueSource().readResearchQueue();
  const requested: string[] = [];
  const liveSource = new GitHubQueueSource({
    token: "test-token",
    fetchImpl: async (input) => {
      const url = String(input);
      requested.push(url);
      return url.includes("ai-dos-work")
        ? githubResponse(validWork.content, "work-revision")
        : githubResponse(validResearch.content, "research-revision");
    },
  });
  const live = await buildQueueDashboard(liveSource);
  check(live.work.status === "OK", "Live Work source should parse successfully.");
  check(live.research.status === "OK", "Live Research source should parse successfully.");
  check(live.work.repository === "polo13999/ai-dos-work", "Live Work provenance must be visible.");
  check(live.work.revision === "work-revision", "Live Work revision must be visible.");
  check(requested.every((url) => url.startsWith("https://api.github.com/repos/")), "Live source must use GitHub Contents API only.");

  const partialLive = await buildQueueDashboard(new GitHubQueueSource({
    token: "test-token",
    fetchImpl: async (input) => String(input).includes("ai-dos-work")
      ? githubResponse("", "", 503)
      : githubResponse(validResearch.content, "research-revision"),
  }));
  check(partialLive.work.status === "SOURCE_ERROR", "Live Work HTTP failure must be isolated.");
  check(partialLive.research.status === "OK", "Live Research must survive Work HTTP failure.");

  const routeResponse = await GET();
  check(routeResponse.status === 200, "Default fixture route should return HTTP 200.");
  check(routeResponse.headers.get("cache-control") === "no-store", "Route must disable caching.");
  const routeBody = await routeResponse.json();
  check(routeBody.work.status === "OK", "Route Work snapshot should be OK.");
  check(routeBody.research.status === "OK", "Route Research snapshot should be OK.");

  console.log(JSON.stringify({ result: "PASS", assertions }));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
