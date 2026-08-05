# WORK-OFFICE-QUEUE-DASHBOARD-0001 Repository Orientation

## Purpose

Establish a repository-grounded starting point for adding a read-only Work and Research Queue dashboard to `polo13999/ai-dos-office` without modifying product code or configuring private-repository credentials.

## Repository profile

The repository is a private Next.js application package named `ai-dos-office`, version `0.9.3`.

Declared package profile:

- Next.js `15.4.1`;
- React and React DOM `19.1.0`;
- TypeScript `^5.8.0`;
- Node type definitions `^22.0.0`.

Declared commands are limited to:

- `npm run dev`;
- `npm run build`;
- `npm run start`.

No lint, unit-test, integration-test, or smoke-test command is declared in `package.json`. No GitHub SDK, Octokit package, database client, schema library, Markdown parser, or table parser is declared.

## Current application entry and UI structure

### Root entry

`app/page.tsx` is a minimal server component that renders:

```tsx
<CommandCenter />
```

`app/layout.tsx` defines the root metadata, imports `app/globals.css`, and wraps the application in a Traditional Chinese HTML document.

### Main command-center UI

`components/CommandCenter.tsx` is a large client component and appears to own the primary application shell.

Observed view model:

- `home`;
- `projects`;
- `war`;
- `missions`;
- `team`;
- `analytics`;
- `messages`;
- `office`.

Observed current data behavior:

- projects, blockers, missions, activity, Founder queue, CTO queue, metrics, and other dashboard content are defined as in-file constants;
- the application currently presents mock or hard-coded operational data;
- `CommandCenter` owns view switching through local React state;
- the `office` view renders `PixelOffice`;
- no repository-backed queue data is visible in the inspected code.

This means the requested queue dashboard introduces the first inspected server-derived operational read model into a currently client-heavy, mock-data command center.

### Pixel Office UI

`components/PixelOffice.tsx` is also a large client component.

Observed behaviors include:

- simulated agents;
- local timers and activity feed;
- randomized movement and status updates;
- meeting and observation modes;
- hard-coded task rows and employee data.

The inspected component does not currently consume authoritative Work or Research queue sources.

## Existing server and API evidence

No existing API route was established from the inspected files or code-search result.

Repository code search returned no indexed results for the combined route and test query. That result is not evidence that routes or tests do not exist; it only means the available search index did not return them.

The common `app/api/.../route.ts` paths have not yet been comprehensively enumerated. Therefore current server-route conventions, error format, caching behavior, environment-variable handling, and server-only utility placement remain unverified.

## Current data-access pattern

The inspected UI obtains operational content from local constants rather than server-side data access.

No established repository access abstraction was identified in the inspected files. No GitHub App, PAT, local-filesystem source, fetch wrapper, caching helper, or server-only adapter was found in the bounded orientation evidence.

Consequently, the Work specification's proposed `QueueSource` boundary would be new infrastructure rather than an extension of a verified existing data-access layer.

## Likely integration surfaces

The following are evidence-based candidate surfaces only. This orientation does not adopt one.

### 1. Internal server API boundary

The Work specification proposes an Office endpoint such as:

```text
GET /api/queues
```

The current Next.js App Router package can support a route under `app/api/queues/route.ts`, but no existing repository route pattern has yet been verified.

A server-only route is the appropriate security boundary in principle because private GitHub or filesystem credentials must not enter browser code. Final placement and response shape require a later implementation plan.

### 2. Server-only adapter and parser boundary

A new server-only module area is likely required for:

- source configuration;
- Work Queue retrieval;
- Research Queue retrieval;
- Markdown-table parsing;
- normalized item models;
- source revision and fetch-time metadata;
- parse warnings and visible error states;
- credential-safe logging and caching.

Possible locations such as `lib/queues/`, `server/queues/`, or another repository convention remain unverified and must not be chosen from this orientation alone.

### 3. Command Center UI placement

The current `CommandCenter` already contains:

- a `missions` view;
- Founder and CTO queue panels;
- a mission board;
- mock operational metrics.

Evidence therefore supports at least three plausible UI placements:

1. replace or augment the existing `missions` view with authoritative Work and Research queue panels;
2. add a dedicated `queues` view to the navigation;
3. surface a compact authoritative queue summary on `home`, linking to a detailed view.

The Work requires Work and Research to remain separately visible, with an optional combined view. A later plan must select the smallest change that preserves current visual language and does not confuse mock mission data with authoritative queue state.

## Required normalized data

The Work specification requires a stable display model containing at minimum:

- domain (`WORK` or `RESEARCH`);
- Queue Order where present;
- priority;
- item ID;
- title;
- status;
- next action;
- waiting item;
- claimed worker;
- resume condition;
- authoritative repository and path.

A source snapshot must also carry:

- source repository;
- source path;
- source revision or SHA;
- fetched time;
- last successful fetch;
- parse warnings;
- fetch or parse failure state.

The current inspected UI has no equivalent typed model.

## Private repository boundary

The Work specification defines three source modes:

1. preferred production mode: GitHub App installation token, server side;
2. local development mode: configured local filesystem paths, server side;
3. temporary fallback: fine-grained PAT, server side only.

This orientation creates no credential, token, key, environment value, GitHub App, or filesystem path.

Required security invariants are:

- browser code receives normalized queue JSON only;
- no credential is included in client bundles, HTML, localStorage, or public environment variables;
- no credential is logged;
- repository content remains authoritative;
- the dashboard remains read-only;
- source access and parsing failures are displayed rather than replaced with fabricated rows.

## Test and validation status

The package currently declares no test or lint command.

No test setup, test directory, test configuration, or CI evidence was established in this bounded orientation.

The Work acceptance criteria require tests for:

- successful parsing;
- inaccessible source;
- malformed table;
- empty queue;
- credential non-exposure where practical.

A later plan must decide whether to add a minimal test runner or use another repository-approved validation approach. This orientation does not select a framework.

## Architectural constraints

1. The dashboard is a read model only.
2. `ai-dos-work` and `ai-dos-research` remain authoritative.
3. Office must not own priority, Queue Order, claim state, scheduling, or Handoff decisions.
4. Browser-side code must never hold private repository credentials.
5. Fetch and parse failures must be visible.
6. Work and Research rows must preserve source terminology and values without reinterpretation.
7. The UI must distinguish authoritative queue data from existing mock content.
8. No queue mutation, approval, reordering, or claiming is authorized.
9. No credential configuration is authorized during planning.
10. Existing visual and navigation behavior should be disturbed only by the smallest later authorized change.

## Current maturity assessment for this Work

The Office application has a mature visual shell and several complete-looking client views, but its inspected operational data is mock and locally defined.

The queue dashboard therefore requires new server-side data access, parsing, normalized modeling, freshness/error reporting, and client integration.

Current evidence supports:

- visual integration surface exists;
- Next.js App Router can host a server route;
- a missions/queue-related UI area already exists;
- private queue access can be isolated server side in principle.

Current evidence does not establish:

- existing API conventions;
- existing server-only module conventions;
- test infrastructure;
- credential management conventions;
- caching conventions;
- deployment environment;
- whether GitHub App or local filesystem mode should be implemented first;
- the exact Research Queue table schema;
- whether the Work Queue and Research Queue formats are stable enough for one parser.

## Unresolved implementation questions

1. What is the complete top-level and `app/api` structure?
2. Does the repository already use server-only environment variables or configuration helpers?
3. Which source mode should be the first executable MVP: local filesystem, GitHub App, or an adapter with a test fixture only?
4. What is the exact current `RESEARCH_TASK_LIST.md` schema?
5. Can one generic Markdown-table parser preserve both queue schemas without reinterpretation?
6. Should the internal endpoint return one combined snapshot or separate Work and Research snapshots?
7. Which freshness and cache policy is acceptable for operational display?
8. Where should visible source-access and parse errors appear in the current UI?
9. Should the detailed view extend `missions` or become a dedicated `queues` navigation item?
10. How will authoritative queue data be visually distinguished from existing mock mission and Founder queue data?
11. What minimum test infrastructure is acceptable for this repository?
12. What deployment environment will hold GitHub App credentials or local repository paths?
13. How will source SHA or local-file freshness be represented consistently?
14. What fields are optional or absent in Research compared with Work?
15. What server-side logging rules prevent accidental credential or raw private-content exposure?

## Evidence inspected

- `package.json`;
- `app/page.tsx`;
- `app/layout.tsx`;
- `components/CommandCenter.tsx`;
- `components/PixelOffice.tsx`;
- `work/WORK-OFFICE-QUEUE-DASHBOARD-0001/README.md`;
- current Canonical Handoff;
- authoritative `ai-dos-work/WORK_TASK_LIST.md` claim state.

## Orientation conclusion

The Office repository already has a strong command-center and mission-oriented visual surface, but the inspected implementation is client-heavy and mock-data-driven. The queue dashboard should be treated as a new server-derived, read-only operational slice with an explicit adapter, parser, internal API, source metadata, error states, and a narrowly integrated UI.

No adapter location, endpoint contract, source mode, cache strategy, parser implementation, test framework, or UI placement is adopted by this orientation. Those decisions belong to the next bounded implementation-planning step.
