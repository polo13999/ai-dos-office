import assert from "node:assert/strict";
import test from "node:test";
import { classifyWorkCompletion } from "./classify-work-completion";

const base = { workId: "WORK-TEST-0001", title: "Test Work" };

test("unfinished Queue evidence returns UNFINISHED", () => {
  const result = classifyWorkCompletion({
    ...base,
    evidence: [{ kind: "UNFINISHED_QUEUE", reference: "queue", strength: "AUTHORITATIVE", status: "RUNNING" }],
  });
  assert.equal(result.state, "UNFINISHED");
  assert.equal(result.queueStatus, "RUNNING");
});

test("Queue absence alone returns UNKNOWN", () => {
  assert.equal(classifyWorkCompletion({ ...base, evidence: [] }).state, "UNKNOWN");
});

test("durable completion evidence returns COMPLETED", () => {
  const result = classifyWorkCompletion({
    ...base,
    evidence: [{ kind: "REMOVED_COMPLETED", reference: "removed", strength: "DURABLE_COMPLETION" }],
  });
  assert.equal(result.state, "COMPLETED");
});

test("unfinished plus completion evidence returns CONTRADICTORY", () => {
  const result = classifyWorkCompletion({
    ...base,
    evidence: [
      { kind: "UNFINISHED_QUEUE", reference: "queue", strength: "AUTHORITATIVE", status: "BLOCKED" },
      { kind: "FINAL_REVIEW", reference: "review", strength: "DURABLE_COMPLETION" },
    ],
  });
  assert.equal(result.state, "CONTRADICTORY");
});
