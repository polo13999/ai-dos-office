# WORK-OFFICE-QUEUE-DASHBOARD-0001 Service and API Evidence

## Scope

This record covers the credential-free fixture-backed queue source, queue service, browser-safe response contracts, and internal read-only `/api/queues` endpoint.

No Office UI, real private-repository source, GitHub App, PAT, private key, environment credential, configured repository filesystem path, queue mutation, merge, promotion, or Mission change was added.

## Files persisted

- `lib/queues/types.ts`
- `lib/queues/source.ts`
- `lib/queues/fixture-source.ts`
- `lib/queues/service.ts`
- `app/api/queues/route.ts`
- `tests/queues/service-api-validation.ts`
- `tsconfig.queue-service-validation.json`

## Implemented behavior

- `QueueSource` exposes independent Work and Research reads.
- `FixtureQueueSource` reads only sanitized files under `fixtures/queues/`.
- Work and Research are parsed independently.
- Each domain returns `OK`, `EMPTY`, `SOURCE_ERROR`, or `PARSE_ERROR`.
- One-domain failure does not fabricate or erase the other domain.
- Browser response contains normalized items and source metadata, not raw Markdown.
- The route returns HTTP `200` when at least one source is available and uses `Cache-Control: no-store`.
- The service exposes an unavailable state when both sources fail; the route contract maps that state to HTTP `503`.

## Executable validation

Validation environment:

- Node.js `v22.16.0`
- TypeScript `5.8.3`

The service/API slice was reconstructed from GitHub-read-back contents in an isolated validation directory. A minimal `next/server` validation stub was used only to execute the `NextResponse.json` route contract outside a full Next.js checkout. No repository dependency was added for that stub.

Result:

```json
{
  "result": "PASS",
  "assertions": 21
}
```

Verified assertions cover:

1. normal Work snapshot is `OK`;
2. normal Research snapshot is `OK`;
3. both valid fixtures expose two items;
4. normal response is available;
5. Work source failure becomes `SOURCE_ERROR`;
6. failed Work source exposes no fabricated rows;
7. Research remains valid when Work fails;
8. one healthy source remains available;
9. two failed sources become unavailable;
10. malformed Research fixture becomes `PARSE_ERROR`;
11. Work remains valid during Research parse error;
12. empty Work fixture becomes `EMPTY`;
13. empty Work exposes no fabricated rows;
14. serialized response does not contain raw fixture Markdown headings;
15. serialized response does not contain an authorization field;
16. fixture source identity remains visible;
17. route returns HTTP `200` for healthy fixture sources;
18. route uses `Cache-Control: no-store`;
19. route Work snapshot is `OK`;
20. route Research snapshot is `OK`;
21. independent-domain behavior is preserved through the service boundary.

## Commands

From a repository checkout with declared dependencies installed:

```text
npx tsc -p tsconfig.queue-service-validation.json
node .queue-service-validation/tests/queues/service-api-validation.js
```

## Limitations

This evidence does not establish:

- a full `next build` result;
- browser UI rendering;
- real GitHub App, PAT, or filesystem source behavior;
- real private-repository freshness or revision handling;
- production deployment credential configuration;
- bundle inspection in a browser build;
- queue mutation or Handoff actions.

## Result

`FIXTURE_SERVICE_API_VALIDATION_PASS`

The credential-free service and API slice is ready for a separately authorized read-only Queue Dashboard UI that consumes `/api/queues`. A real private-repository source remains a later authority boundary.
