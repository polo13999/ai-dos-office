# WORK-OFFICE-QUEUE-DASHBOARD-0001 Queue Dashboard UI Evidence

## Scope

This record covers the credential-free, read-only Queue Dashboard UI and its bounded integration into the existing AI-DOS Office Command Center.

No real private-repository source, GitHub App, PAT, private key, environment credential, configured repository filesystem path, queue mutation, merge, promotion, or Mission change was added.

## Files persisted

- `components/QueueDashboard.tsx`
- `components/CommandCenter.tsx`

No `app/globals.css` change was required. The dashboard reuses the existing `pixel-panel`, `panel-kicker`, Command Center layout, and inline bounded layout styles.

## Implemented UI behavior

### Dedicated Queue view

`CommandCenter` now contains a dedicated `queues` view with:

- a navigation item labelled `工作佇列`;
- a Queue-specific title and description;
- a bounded render branch for `<QueueDashboard />`;
- preservation of all existing views and the separate Pixel Office route behavior.

The authoritative queue view is not mixed into the existing mock Mission board.

### API consumption

`QueueDashboard`:

- requests only `GET /api/queues`;
- uses browser `fetch` with `cache: "no-store"`;
- aborts the request when the component unmounts;
- accepts the service contract's HTTP `503` body so both per-domain failure states remain visible;
- treats other non-success responses as request failure;
- does not receive raw Markdown or any source credential.

### Source and freshness display

For both Work and Research snapshots, the UI displays:

- domain;
- repository;
- path;
- revision;
- fetched time;
- last successful fetch;
- status;
- warning count;
- parser/source errors;
- expandable warnings.

Visible statuses preserve the API contract:

- `OK`;
- `EMPTY`;
- `SOURCE_ERROR`;
- `PARSE_ERROR`.

### Queue item display

Each item preserves source values without reinterpretation:

- domain;
- priority;
- item ID;
- title;
- status;
- claimed worker;
- waiting value;
- source row.

Work-specific display:

- Queue Order;
- Next Action;
- Resume Condition;
- authoritative location.

Research-specific display:

- Current Round;
- no invented Queue Order or Work-only values.

### View filters

The UI supports:

- Work-only view;
- Research-only view;
- combined display view.

The combined view concatenates normalized items for display only. It does not change ordering authority or source state.

### Explicit UI states

The component contains explicit states for:

- loading;
- request failure;
- missing response;
- empty item list;
- source error;
- parse error;
- warnings;
- successful Work and Research snapshots.

## Read-only boundary

The Queue Dashboard contains no control for:

- editing queue rows;
- claiming Work or Research;
- changing priority;
- changing Queue Order;
- approval;
- resume;
- Handoff mutation;
- repository mutation.

The only buttons are local display-tab selectors: Work, Research, and combined view.

The component also states visibly that it is read-only and provides no claim, sorting, approval, resume, or Handoff operation.

## Contract defect found and fixed

Initial UI code attempted to read `snapshot.message`, but the persisted `QueueSnapshot` contract exposes errors through `errors: string[]`.

The UI was corrected to render `snapshot.errors` without changing or expanding the service/API contract.

Fix commit:

- `d312633279d70969766cc3bdd63d6d39c9fa1188`

## Validation mechanism

This round used repository-contained source inspection and GitHub read-back verification of:

- queue response types;
- `QueueDashboard.tsx`;
- `CommandCenter.tsx` integration;
- navigation and render branches;
- source/error/warning fields;
- absence of queue mutation controls.

The UI files were checked against the existing `QueueDashboardResponse`, `QueueSnapshot`, and `QueueItem` contracts. One contract mismatch was found and fixed as recorded above.

## Limitations

This evidence does not establish:

- a complete `next build` result;
- browser rendering in a running Office instance;
- responsive visual inspection;
- browser accessibility audit;
- end-to-end request execution through a running Next.js server;
- real private-repository source behavior;
- bundle inspection for future credential adapters.

## Result

`CREDENTIAL_FREE_QUEUE_UI_PERSISTED_STATIC_VALIDATION_PASS`

The read-only Queue Dashboard UI is repository-persisted and contract-aligned. The next safe bounded action is a full application build and running fixture-backed browser validation before selecting or implementing a real private-repository source adapter.