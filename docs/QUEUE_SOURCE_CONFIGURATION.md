# Queue Source Configuration

`/api/queues` uses a server-only queue source selected by `AI_DOS_QUEUE_SOURCE`.

## Modes

- `fixture` (default): reads deterministic sanitized files under `fixtures/queues/`; no credential is required.
- `github`: reads the authoritative Work and Research queue documents through the read-only GitHub Contents API.

## GitHub mode variables

- `AI_DOS_QUEUE_SOURCE=github`
- `AI_DOS_GITHUB_TOKEN`: required server-only token with read access to the configured repositories.
- `AI_DOS_WORK_QUEUE_REPOSITORY` (default `polo13999/ai-dos-work`)
- `AI_DOS_WORK_QUEUE_PATH` (default `WORK_TASK_LIST.md`)
- `AI_DOS_WORK_QUEUE_REF` (default `main`)
- `AI_DOS_RESEARCH_QUEUE_REPOSITORY` (default `polo13999/ai-dos-research`)
- `AI_DOS_RESEARCH_QUEUE_PATH` (default `RESEARCH_TASK_LIST.md`)
- `AI_DOS_RESEARCH_QUEUE_REF` (default `main`)

## Security boundary

All configuration is consumed only by server-side queue modules and the API route. Never prefix these variables with `NEXT_PUBLIC_`. The token is used only in the GitHub `Authorization` request header; it is not logged, serialized into queue responses, written to either queue repository, or committed to source control.

The adapter performs read-only repository-content requests. Office has no queue write, claim, dispatch, merge, deployment, Mission, Governance, or Architecture authority.

## Response behavior

The existing response contract remains unchanged:

- repository, path, resolved content revision and fetch time are returned as provenance;
- Work and Research are loaded independently;
- one-domain failure produces `SOURCE_ERROR` only for that domain and HTTP 200 when the other domain remains available;
- two-domain failure produces HTTP 503;
- responses remain `Cache-Control: no-store`;
- fixture mode remains deterministic for local and focused validation.
