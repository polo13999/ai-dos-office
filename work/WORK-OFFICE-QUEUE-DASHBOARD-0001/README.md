# WORK-OFFICE-QUEUE-DASHBOARD-0001 — Work and Research Queue Dashboard

## Objective

Add a bounded AI-DOS Office dashboard that displays the authoritative Work Queue and Research Queue without exposing private-repository credentials to the browser.

## Authoritative sources

- Work Queue: `polo13999/ai-dos-work` → `WORK_TASK_LIST.md`
- Research Queue: `polo13999/ai-dos-research` → `RESEARCH_TASK_LIST.md`

The dashboard is a read model only. It does not own queue state, priority, Queue Order, claim authority, Research status, or Handoff scheduling.

## Required MVP behavior

1. Read both queue files through a server-side adapter.
2. Parse and normalize each row into a stable display model.
3. Display at minimum:
   - domain (`WORK` or `RESEARCH`);
   - Queue Order when present;
   - priority;
   - item ID;
   - title;
   - status;
   - next action;
   - waiting item;
   - claimed worker;
   - resume condition;
   - authoritative repository and path.
4. Show Work and Research separately, with an optional combined view.
5. Show source freshness, last successful fetch, and fetch failure state.
6. Treat inaccessible, malformed, or stale queue data as visible errors; do not silently invent rows.
7. Keep the MVP read-only. Claiming, editing, reordering, approval, and Handoff mutation require later authorized Work.

## Private repository access design

### Preferred production design — GitHub App, server side

Use a GitHub App installed on the required private repositories. The AI-DOS Office server obtains a short-lived installation token and calls the GitHub Contents API for the two queue files.

Rules:

- GitHub credentials remain server-side only.
- The browser calls an internal Office endpoint such as `/api/queues` and receives normalized queue JSON.
- Grant the GitHub App only the minimum repository contents read permission required for the selected repositories.
- Never place a private key, installation token, personal access token, or connector credential in client-side code, browser storage, or public environment variables.
- Cache briefly and report source SHA or equivalent freshness metadata.

### Acceptable local-development design — local filesystem adapter

When all repositories are cloned on the same trusted machine, the Office server may read configured local paths for `WORK_TASK_LIST.md` and `RESEARCH_TASK_LIST.md`.

Rules:

- Paths are server-side configuration.
- The browser never receives arbitrary filesystem access.
- The UI must identify that the source is local and may be behind GitHub.

### Temporary development fallback — fine-grained PAT, server side only

A fine-grained Personal Access Token may be used temporarily in a server-only environment variable with read-only access limited to the required repositories.

This is not the preferred long-term design. It must never be committed or exposed to the browser.

## Recommended adapter boundary

Define one queue-source interface so deployment mode can change without changing the UI:

```text
QueueSource
  readWorkQueue() -> QueueSnapshot
  readResearchQueue() -> QueueSnapshot
```

Possible implementations:

- `GitHubAppQueueSource`
- `LocalFilesystemQueueSource`
- temporary `GitHubPatQueueSource`

The normalized `QueueSnapshot` should include source repository, source path, source revision, fetched time, parse warnings, and normalized items.

## Security boundary

- No direct browser-to-private-GitHub request with a secret.
- No credential logging.
- No queue mutation in this Work.
- No authority inference from UI display.
- Repository content remains the source of truth.

## Acceptance criteria

1. The Office UI can display both authoritative private queues through one server-side source adapter.
2. No GitHub or filesystem credential is included in client-side output or bundles.
3. Every displayed item is traceable to a source repository, path, and revision or freshness marker.
4. Work and Research rows preserve their authoritative status and fields without reinterpretation.
5. Source access failure and parse failure are visible and do not produce fabricated data.
6. The implementation remains read-only.
7. Tests cover successful parsing, inaccessible source, malformed table, empty queue, and credential non-exposure where practical.

## First bounded next action

Inspect the current `polo13999/ai-dos-office` architecture and create an implementation plan that identifies the server-side adapter location, internal API boundary, normalized queue model, and UI placement without yet adding credentials or queue mutation.

## Deliverables

Persist all Work artifacts under:

```text
work/WORK-OFFICE-QUEUE-DASHBOARD-0001/
```

Expected eventual artifacts include:

- implementation plan;
- source adapter and parser;
- internal read-only queue endpoint;
- Office queue dashboard UI;
- tests and evidence;
- successor Canonical Handoff.

## Handoff behavior

- Execute through the current Canonical Handoff, one bounded next action per iteration.
- If GitHub capability is unavailable, emit the canonical `GITHUB` Help Command.
- If this Work waits on a decision but other governed work may continue, use:

```text
ON_WAIT:
RETURN_TO_DISPATCHER
```

- Do not replace queue authority with Office state.
