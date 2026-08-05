# WORK-OFFICE-QUEUE-DASHBOARD-0001 Implementation Plan

## Purpose

Define a bounded, credential-free implementation plan for a read-only AI-DOS Office dashboard that displays the authoritative Work Queue and Research Queue while preserving repository authority and preventing private-repository credentials from reaching browser code.

This plan does not modify product code, configure credentials, create a GitHub App, choose a permanent deployment source, mutate queues, or authorize claiming, reordering, approval, or Handoff actions through Office.

## Evidence basis

This plan is grounded in:

- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/README.md`;
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/ORIENTATION.md`;
- `polo13999/ai-dos-work/WORK_TASK_LIST.md`;
- `polo13999/ai-dos-research/RESEARCH_TASK_LIST.md`;
- `package.json`;
- `app/page.tsx`;
- `app/layout.tsx`;
- `components/CommandCenter.tsx`;
- `components/PixelOffice.tsx`;
- current Canonical Handoff.

Repository code search did not establish an existing `app/api` route or server-only data-access convention. That absence is treated as unverified repository structure, not proof that no such files exist.

## Authoritative queue schema findings

### Work Queue source schema

Authoritative source:

```text
polo13999/ai-dos-work/WORK_TASK_LIST.md
```

Current table columns:

1. `Queue Order`
2. `Priority`
3. `Work ID`
4. `Title`
5. `Status`
6. `Next Action`
7. `Waiting On`
8. `Claimed By`
9. `Resume Condition`
10. `Work Path`

Important source rules:

- only `READY` Work may be newly claimed;
- Queue Order is Founder-controlled and must not be reinterpreted;
- completed Work is removed from this operational list;
- Office is not authorized to mutate or schedule Work.

### Research Queue source schema

Authoritative source:

```text
polo13999/ai-dos-research/RESEARCH_TASK_LIST.md
```

Current table columns:

1. `Priority`
2. `Research ID`
3. `Title`
4. `Status`
5. `Current Round`
6. `Waiting`
7. `Claimed By`

Important source rules:

- only `READY` Research may be newly claimed;
- `UNKNOWN` round means reconciliation is required and must not be converted to `READY`;
- completed Research remains in the list as part of the complete index;
- Research currently has no Queue Order column;
- Office is not authorized to mutate Research scheduling or state.

## Schema-preservation rule

The implementation must not force Work and Research into an identical source schema.

It may expose a shared display envelope, but it must preserve domain-specific fields and absence explicitly:

- Work `queueOrder` is an integer or `null`; Research must not receive an invented Queue Order.
- Work `nextAction`, `resumeCondition`, and `workPath` remain Work-specific values.
- Research `currentRound` remains a Research-specific value.
- `Waiting On` and `Waiting` may map to a shared display field named `waiting`, while retaining the source column name in metadata.
- Missing, em-dash, or empty source values normalize to `null`; they must not be replaced by inferred text.
- Status and priority values are preserved exactly as written after removing Markdown code ticks and surrounding whitespace.

## Proposed server-side boundary

Use one server-only queue module boundary with four responsibilities:

```text
Source Adapter
    ↓ raw UTF-8 Markdown + source metadata
Parser
    ↓ source-specific rows
Normalizer
    ↓ stable read-only display model
Internal API
    ↓ browser-safe JSON
Office UI
```

No browser component may import source-adapter code or receive source credentials.

## Proposed source adapter interface

```ts
type QueueDomain = "WORK" | "RESEARCH";

type QueueSourceDocument = {
  domain: QueueDomain;
  repository: string;
  path: string;
  revision: string | null;
  fetchedAt: string;
  content: string;
};

type QueueSource = {
  readWorkQueue(): Promise<QueueSourceDocument>;
  readResearchQueue(): Promise<QueueSourceDocument>;
};
```

Required behavior:

- return raw Markdown and authoritative source identity;
- never return a secret, token, private key, filesystem credential, or authorization header;
- report inaccessible sources as typed errors;
- preserve source revision when available;
- allow source implementation to change without changing parser or UI.

Potential later implementations:

- `GitHubAppQueueSource` — preferred production source after GitHub App authority and configuration exist;
- `LocalFilesystemQueueSource` — acceptable trusted local-development source after configured local paths exist;
- `GitHubPatQueueSource` — temporary server-only fallback only when explicitly authorized;
- `FixtureQueueSource` — credential-free development and validation source.

This plan does not select the permanent source mode.

## Proposed normalized model

```ts
type QueueItem = {
  domain: "WORK" | "RESEARCH";
  itemId: string;
  title: string;
  priority: string;
  status: string;
  queueOrder: number | null;
  currentRound: string | null;
  nextAction: string | null;
  waiting: string | null;
  claimedBy: string | null;
  resumeCondition: string | null;
  authoritativeLocation: string | null;
  sourceRow: number;
};

type QueueSnapshot = {
  domain: "WORK" | "RESEARCH";
  repository: string;
  path: string;
  revision: string | null;
  fetchedAt: string;
  lastSuccessfulFetch: string | null;
  status: "OK" | "EMPTY" | "SOURCE_ERROR" | "PARSE_ERROR";
  warnings: string[];
  items: QueueItem[];
};

type QueueDashboardResponse = {
  generatedAt: string;
  work: QueueSnapshot;
  research: QueueSnapshot;
};
```

Rules:

- the API must keep Work and Research as separate snapshots;
- an optional combined UI view may concatenate them only for display;
- a failure in one domain must not fabricate rows or erase the other domain's valid snapshot;
- source repository, path, revision, and freshness remain visible;
- raw Markdown should not be sent to the browser in the MVP response.

## Parsing rules

### Shared Markdown-table parsing

1. Locate the table by an exact required header signature for the selected domain.
2. Require the Markdown separator row directly after the header.
3. Split rows on unescaped pipe separators using one deterministic parser.
4. Trim surrounding whitespace.
5. Remove one surrounding pair of Markdown code ticks from scalar values.
6. Normalize `—` and empty strings to `null` only for optional fields.
7. Reject rows with a missing required ID, title, priority, or status.
8. Preserve unknown status or priority strings and emit a warning; do not reinterpret them.
9. Record source row number for traceability.
10. Do not parse prose outside the authoritative table as queue items.

### Work-specific parsing

- `Queue Order` must parse as a positive integer; malformed values produce a row error.
- `Work ID`, `Title`, `Priority`, and `Status` are required.
- `Next Action`, `Waiting On`, `Claimed By`, `Resume Condition`, and `Work Path` are optional display values.
- Work Path maps to `authoritativeLocation`.

### Research-specific parsing

- `Research ID`, `Title`, `Priority`, `Status`, and `Current Round` are required source fields.
- `Current Round` maps to `currentRound` and remains a string, including `UNKNOWN`.
- `Waiting` and `Claimed By` are optional display values.
- `queueOrder`, `nextAction`, `resumeCondition`, and `authoritativeLocation` remain `null` unless a later authoritative schema adds those columns.

### Failure behavior

- missing expected table: `PARSE_ERROR`;
- malformed header or separator: `PARSE_ERROR`;
- valid table with no rows: `EMPTY`;
- individual malformed rows: omit only the invalid row, record a warning, and return remaining valid rows when safe;
- source unavailable: `SOURCE_ERROR` with no fabricated items;
- parser must never silently fall back to embedded mock queue rows.

## Internal read-only API contract

Proposed endpoint:

```text
GET /api/queues
```

Proposed behavior:

- execute only on the server;
- use the configured `QueueSource`;
- read Work and Research independently;
- normalize both snapshots;
- return `Cache-Control: no-store` for the first bounded version unless a later explicit cache policy is approved;
- return HTTP `200` when at least one snapshot is available, with per-domain status fields;
- return HTTP `503` only when neither authoritative source can be read;
- never include credentials, authorization headers, server environment values, stack traces, or arbitrary filesystem paths in the response;
- include browser-safe error codes and concise messages only.

Example response shape:

```json
{
  "generatedAt": "2026-08-05T00:00:00.000Z",
  "work": {
    "domain": "WORK",
    "repository": "polo13999/ai-dos-work",
    "path": "WORK_TASK_LIST.md",
    "revision": "...",
    "fetchedAt": "...",
    "lastSuccessfulFetch": "...",
    "status": "OK",
    "warnings": [],
    "items": []
  },
  "research": {
    "domain": "RESEARCH",
    "repository": "polo13999/ai-dos-research",
    "path": "RESEARCH_TASK_LIST.md",
    "revision": "...",
    "fetchedAt": "...",
    "lastSuccessfulFetch": "...",
    "status": "OK",
    "warnings": [],
    "items": []
  }
}
```

The timestamp above is illustrative only; runtime values must be generated from the actual fetch.

## Freshness and error behavior

The dashboard must show for each source:

- repository and path;
- revision or an explicit `revision unavailable` state;
- fetch time;
- last successful fetch when available;
- `OK`, `EMPTY`, `SOURCE_ERROR`, or `PARSE_ERROR`;
- parse warnings count and expandable details.

Rules:

- do not label data `live` unless it was fetched successfully in the current request;
- do not preserve stale rows silently after a source failure;
- a later cache may preserve the last successful snapshot only when it is visibly marked stale and the cache policy is separately approved;
- the first implementation should prefer correctness and visible failure over hidden fallback.

## Proposed UI integration point

Use a dedicated `queues` view in `components/CommandCenter.tsx` rather than replacing existing mock `missions` content.

Rationale:

- authoritative Work and Research queues must not be confused with existing mock Mission data;
- a dedicated view permits separate Work and Research tabs plus an optional combined view;
- source freshness and parse errors need more space than the current compact panels provide;
- the navigation already uses a local `View` union and view-switching pattern, so one new view is a bounded extension;
- the Home screen may later receive a compact link or summary, but that is not required for the first executable slice.

Proposed UI behavior:

- navigation label: `工作佇列` or equivalent Traditional Chinese wording;
- tabs: `Work`, `Research`, optional `全部`;
- table or card rows preserve source values;
- Work rows display Queue Order;
- Research rows display Current Round;
- filters may use domain and status only in the first version;
- no edit, claim, reorder, approve, or resume control;
- source and freshness panel remains visible;
- loading, empty, source-error, and parse-error states are explicit.

## Validation approach

The repository currently has no declared lint or test command. The implementation should introduce the smallest validation surface needed for deterministic parser and API behavior.

### Required parser fixtures

1. current valid Work Queue table;
2. current valid Research Queue table;
3. empty Work table;
4. empty Research table;
5. malformed header;
6. malformed separator;
7. malformed Work Queue Order;
8. row with missing required ID;
9. unknown status preserved with warning;
10. optional em-dash fields normalized to `null`.

### Required behavior checks

- successful Work parsing;
- successful Research parsing;
- schema differences preserved;
- inaccessible source becomes `SOURCE_ERROR`;
- malformed table becomes `PARSE_ERROR`;
- empty table becomes `EMPTY`;
- one-domain failure does not fabricate or erase the other domain;
- API response contains no configured secret value;
- UI contains no mutation actions;
- production build succeeds.

### Test-runner boundary

No test framework is selected by this plan. Before adding dependencies, the implementing worker must inspect repository policy and choose either:

- Node's built-in test runner with TypeScript-compatible execution already available;
- a minimal approved test dependency;
- or repository-approved deterministic validation scripts.

The choice must be recorded before dependency modification.

## File-level change boundary

### Planning artifacts already authorized

- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/README.md`
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/ORIENTATION.md`
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/IMPLEMENTATION-PLAN.md`
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/HANDOFF.md`

### Proposed product files for later explicitly authorized implementation

New server-only model and parser files:

- `lib/queues/types.ts`
- `lib/queues/parse-markdown-table.ts`
- `lib/queues/parse-work-queue.ts`
- `lib/queues/parse-research-queue.ts`
- `lib/queues/source.ts`
- `lib/queues/fixture-source.ts`
- `lib/queues/service.ts`

New internal endpoint:

- `app/api/queues/route.ts`

New UI component:

- `components/QueueDashboard.tsx`

Existing UI file with bounded modification:

- `components/CommandCenter.tsx`

Possible validation files, final names pending test-runner decision:

- `tests/queues/...`
- `fixtures/queues/...`
- package script changes only when explicitly authorized.

Files outside this boundary require a successor Handoff change or separate authority.

## Credential-free implementation sequence

### Step 1 — Contracts and deterministic parser

Create the normalized types, source-document interface, source-specific parsers, and sanitized Work/Research fixtures. No source credentials and no network access.

Exit evidence:

- both current schemas parse correctly;
- schema differences are preserved;
- malformed and empty fixtures produce defined outcomes.

### Step 2 — Fixture-backed service and API

Implement `FixtureQueueSource`, queue service, and `/api/queues` using only sanitized repository-derived fixtures.

Exit evidence:

- browser-safe API response;
- independent Work and Research statuses;
- no credential configuration;
- explicit source metadata marked as fixture/development evidence.

### Step 3 — Read-only Queue Dashboard UI

Add a dedicated `queues` view and render data from `/api/queues` with loading, empty, source-error, parse-error, warning, and freshness states.

Exit evidence:

- separate Work and Research views;
- Work Queue Order and Research Current Round displayed correctly;
- no mutation controls;
- existing Office views remain usable.

### Step 4 — Select and authorize a real private-repository source

Founder or authorized governance selects one source mode:

- GitHub App;
- local filesystem;
- temporary fine-grained PAT.

This step requires separate explicit authority and configuration evidence.

### Step 5 — Implement the authorized real source adapter

Replace only the source implementation, not parser, model, API contract, or UI.

Exit evidence:

- real source revisions and fetch timestamps;
- credential non-exposure;
- visible failure behavior;
- no queue mutation.

### Step 6 — Final validation and review

Run all approved checks, inspect browser output and bundles for credential leakage, verify authoritative values against source files, and persist evidence.

## Unresolved decisions

1. Which test runner or validation mechanism is authorized?
2. Is a dedicated `queues` view accepted as the first UI placement?
3. Should fixture-backed API and UI implementation proceed before choosing the private source adapter?
4. Which real source mode will be authorized for the first deployment?
5. What deployment environment will hold server-only configuration?
6. Is `no-store` acceptable for the first real-source version?
7. Should last-successful stale caching be added later?
8. Is source error text allowed to expose repository names and paths but not raw private content?
9. Which sanitized fixture rows are acceptable to commit in the private Office repository?
10. Does the repository permit adding a test dependency, or should built-in tooling be used?

## Recommended next bounded action

Implement only Step 1: create the credential-free queue contracts, parser modules, and sanitized Work/Research fixtures inside the proposed file boundary, then persist parser evidence. Do not create an API route, UI change, credential, or real source adapter in that same bounded action.

This sequence isolates schema correctness before server access and UI integration, minimizes risk, and provides deterministic evidence for the two different authoritative queue formats.

## Explicit boundary

This plan defines a proposed implementation sequence and file boundary. It does not authorize credentials, select the permanent source mode, claim that existing API/test conventions were found, or permit Office to mutate Work, Research, or Handoff state.