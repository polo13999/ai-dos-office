import assert from "node:assert/strict";
import { FixtureQueueSource } from "../../lib/queues/fixture-source";
import { buildQueueDashboard, hasAvailableQueue } from "../../lib/queues/service";
import { GET } from "../../app/api/queues/route";

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

  const routeResponse = await GET();
  check(routeResponse.status === 200, "Fixture route should return HTTP 200.");
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
