import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseResearchQueue } from "../../lib/queues/parse-research-queue";
import { parseWorkQueue } from "../../lib/queues/parse-work-queue";

const fixtureRoot = join(process.cwd(), "fixtures/queues");
const readFixture = (name: string) =>
  readFileSync(join(fixtureRoot, name), "utf8");

let assertions = 0;
const equal = (actual: unknown, expected: unknown) => {
  assert.equal(actual, expected);
  assertions += 1;
};
const ok = (value: unknown) => {
  assert.ok(value);
  assertions += 1;
};

const work = parseWorkQueue(readFixture("work-valid.md"));
equal(work.status, "OK");
equal(work.items.length, 2);
equal(work.items[0].queueOrder, 1);
equal(work.items[0].waiting, null);
equal(work.items[0].claimedBy, null);
equal(work.items[0].resumeCondition, null);

const research = parseResearchQueue(readFixture("research-valid.md"));
equal(research.status, "OK");
equal(research.items.length, 2);
equal(research.items[0].queueOrder, null);
equal(research.items[0].nextAction, null);
equal(research.items[0].currentRound, "ROUND-003");
equal(research.items[1].currentRound, "UNKNOWN");

const empty = parseWorkQueue(readFixture("empty-work.md"));
equal(empty.status, "EMPTY");
equal(empty.items.length, 0);

const malformed = parseResearchQueue(readFixture("malformed-research.md"));
equal(malformed.status, "PARSE_ERROR");
ok(/separator row is malformed/.test(malformed.errors[0]));

const edge = parseWorkQueue(readFixture("work-edge-cases.md"));
equal(edge.status, "OK");
equal(edge.items.length, 1);
equal(edge.items[0].itemId, "WORK-UNKNOWN-VALUES");
equal(edge.items[0].status, "CUSTOM_STATUS");
equal(edge.items[0].priority, "PX");
equal(edge.items[0].waiting, null);
ok(edge.warnings.some((warning) => warning.includes("Queue Order is not a positive integer")));
ok(edge.warnings.some((warning) => warning.includes("required Work field is missing")));
ok(edge.warnings.some((warning) => warning.includes("unknown Work status")));
ok(edge.warnings.some((warning) => warning.includes("unknown Work priority")));

console.log(
  JSON.stringify(
    {
      result: "PASS",
      assertions,
      workItems: work.items.length,
      researchItems: research.items.length,
      edgeItems: edge.items.length,
      warnings: edge.warnings.length,
    },
    null,
    2,
  ),
);
